const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const privateKey = fs.readFileSync(path.join(__dirname, '../certs/socket.key'), 'utf8');
const publicCertificate = fs.readFileSync(path.join(__dirname, '../certs/socket.crt'), 'utf8');
const credentials = {key: privateKey, cert: publicCertificate};
const httpsServer = https.createServer(credentials);

module.exports = {httpsServer};
