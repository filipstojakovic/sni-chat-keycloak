const jwksClient = require("jwks-rsa");
require('dotenv').config();

const client = jwksClient({
  jwksUri: process.env.JWKS_URI,
});

function getKeycloakKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

module.exports = {getKeycloakKey};
