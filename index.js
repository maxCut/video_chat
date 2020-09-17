const express = require('express')
const path = require('path');
const app = express()
const port = 3000

const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

// Used when generating any kind of tokens
const twilioAccountSid = 'AC103588916d08b9990e1cc0c54b7c4390';
const twilioApiKey = 'SK6ee93af114d26ad34adbaf3ea4df910b';
const twilioApiSecret = 'o9mGQyv8pgX6nbNWeB5DIHE8WhJJfwCG';

app.use(express.static(__dirname + '/src/javascript'));
app.use(express.static(__dirname + '/src/html'));
app.use(express.static(__dirname + '/src/styles'));
app.use(express.static(__dirname + '/src'));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/src/index.html'));
});

app.get('/key_request', function(req,res){



  const identity = 'user';

// Create Video Grant
const videoGrant = new VideoGrant();

// Create an access token which we will sign and return to the client,
// containing the grant we just created
const token = new AccessToken(
  twilioAccountSid,
  twilioApiKey,
  twilioApiSecret,
  {identity: identity}
);
token.addGrant(videoGrant);
  res.send(token.toJwt());
});

app.listen(port, () => {
  console.log(`istening at http://localhost:${port}`)
})
