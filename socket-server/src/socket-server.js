require('dotenv').config();
const WebSocket = require('ws');
const amqp = require('amqplib');
const jwt = require('jsonwebtoken');
const {getKeycloakKey} = require("./keycloak-key");
const {httpsServer} = require('./init');
const port = process.env.PORT;

const wss = new WebSocket.Server({server: httpsServer});
var rabbitChannel = null;

httpsServer.listen(port, async () => {
  console.log(`WebSocket server running on port ${port}`);
  const rabbitConnection = await amqp.connect('amqp://localhost');
  rabbitChannel = await rabbitConnection.createChannel();
});

wss.on('connection', (socket, req) => {

  const keys = JSON.parse(process.env.ROUTE_KEYS);
  console.log("socket-server.js > keys(): " + keys);

  const url = new URL(`${req.headers.host}${req.url}`);
  const tokenStr = url.searchParams.get('token');

  if (!tokenStr) throw new Error('Token is missing');
  jwt.verify(tokenStr, getKeycloakKey, null, function (err, decodedJwt) {
    if (err) {
      throw new Error("token not valid")
    }
    const username = decodedJwt.preferred_username;
    Object.assign(socket, {username: username}); // assign username to socket

    receiveFromRabbitMQ(username).catch(console.error);

    socket.on('message', (message) => {   //SENDING MESSAGE
      console.log("socket-server.js > sendToRabbitMQ(): " + message);
      // You can modify the message or add additional fields if needed
      // Send the message to RabbitMQ for further processing and broadcasting
      sendToRabbitMQ(message).catch(console.error);
    });
  });
});

// ---------------- SEND MESSAGE ----------------
async function sendToRabbitMQ(message) {
  const queueName = 'queue8080';
  console.log("socket-server.js > sendToRabbitMQ(): "+ "trying");
  await rabbitChannel.assertQueue(queueName);
  console.log('sending something to queue: ' + queueName);
  rabbitChannel.sendToQueue(queueName, Buffer.from(message));
}

// ---------------- RECEIVE MESSAGE ----------------
async function receiveFromRabbitMQ(queueName) {

  await rabbitChannel.assertQueue(queueName);
  rabbitChannel.consume(queueName, (message) => {
      const content = message.content.toString();
      console.log(`socket-server.js > receiveFromRabbitMQ(): queue: ${queueName}:\n content: ` + content);

      wss.clients.forEach((client) => {
        if (client.username === queueName) {
          client.send(content);
        }
      });
    }, {noAck: true},
  );
}
