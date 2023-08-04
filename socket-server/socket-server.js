const WebSocket = require('ws');
const amqp = require('amqplib');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
require('dotenv').config();

const client = jwksClient({
  jwksUri: process.env.JWKS_URI
});

function getKeycloakKey(header, callback){
  client.getSigningKey(header.kid, function(err, key) {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

const wss = new WebSocket.Server({port: 3000});
console.log('WebSocket server listening on port 3000');

wss.on('connection', (socket, req) => {

  const url = new URL(`https://localhost${req.url}`); // Use your actual server URL here
  const token = url.searchParams.get('token');

  if (!token) throw new Error('Token is missing');
  jwt.verify(token, getKeycloakKey, null, function(err, decoded) {
    console.log("socket-server.js > (): "+ "is valid");
    if(err){
      throw new Error("token not valid")
    }
    socket.on('message', (message) => {

      // You can modify the message or add additional fields if needed
      // Send the message to RabbitMQ for further processing and broadcasting
      sendToRabbitMQ(message).catch(console.error);
    });
  });

});

async function sendToRabbitMQ(message) {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queueName = 'test2';

  await channel.assertQueue(queueName);
  console.log('sending something');
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
}

async function receiveFromRabbitMQ() {
  const connection = await amqp.connect('amqp://localhost'); // Replace with your RabbitMQ connection URL
  const channel = await connection.createChannel();

  const queueName = 'client';

  await channel.assertQueue(queueName);
  channel.consume(queueName, (message) => {
      console.log('dobijam nesto:');

      const content = message.content.toString();
      wss.clients.forEach((client) => {
        client.send(content);
      });
    },
    {noAck: true},
  );
}

receiveFromRabbitMQ().catch(console.error);
