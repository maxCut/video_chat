const express = require('express')
const path = require('path');
const app = express()
const port = process.env.PORT || 8080;

const { User } = require("twilio-chat");
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const ChatGrant = AccessToken.ChatGrant;

// Used when generating any kind of tokens
const twilioAccountSid = 'AC103588916d08b9990e1cc0c54b7c4390';
const twilioApiKey = 'SK6ee93af114d26ad34adbaf3ea4df910b';
const twilioApiSecret = 'o9mGQyv8pgX6nbNWeB5DIHE8WhJJfwCG';
const serviceSid = 'IS44d90fe6773b46ab8fb07ae515f6d72e';

app.use(express.static(__dirname + '/src/javascript'));
app.use(express.static(__dirname + '/src/html'));
app.use(express.static(__dirname + '/src/styles'));
app.use(express.static(__dirname + '/src'));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/src/index.html'));
});

app.get('/room_key_request', function(req,res){

  const { identity } = req.query;
  
  
const chatGrant = new ChatGrant({
  serviceSid: serviceSid,
});

// Create an access token which we will sign and return to the client,
// containing the grant we just created
const token = new AccessToken(
  twilioAccountSid,
  twilioApiKey,
  twilioApiSecret
);

    token.identity = identity;
  token.addGrant(chatGrant);
    res.send(token.toJwt());
});

app.get('/table_key_request', function(req,res){


const { identity } = req.query;


// Create Video Grant
const videoGrant = new VideoGrant();

// Create an access token which we will sign and return to the client,
// containing the grant we just created
const token = new AccessToken(
  twilioAccountSid,
  twilioApiKey,
  twilioApiSecret
);

  token.identity = identity;
token.addGrant(videoGrant);
  res.send(token.toJwt());
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})
