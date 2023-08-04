const WebSocket = require('ws');
const amqp = require('amqplib');
const jwt = require('jsonwebtoken');
const {getKeycloakKey} = require("./keycloak-key");
const https = require('https');
const fs = require('fs');
const path = require('path');

const privateKey = fs.readFileSync(path.join(__dirname, 'certs/socket.key'), 'utf8');
const publicCertificate = fs.readFileSync(path.join(__dirname, 'certs/socket.crt'), 'utf8');
const credentials = { key: privateKey, cert: publicCertificate };
const port = 3000; // or any other desired port number
const httpsServer = https.createServer(credentials);
const wss = new WebSocket.Server({ server: httpsServer });
httpsServer.listen(port, () => {
  console.log(`WebSocket server running on port ${port}`);
});

wss.on('connection', (socket, req) => {

  const url = new URL(`https://localhost${req.url}`);
  const token = url.searchParams.get('token');

  if (!token) throw new Error('Token is missing');
  jwt.verify(token, getKeycloakKey, null, function (err, decoded) {
    if (err) {
      throw new Error("token not valid")
    }
    console.log("socket-server.js > token is valid");
    socket.on('message', (message) => {   //SENDING MESSAGE

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
  channel.sendToQueue(queueName, Buffer.from(message));
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
