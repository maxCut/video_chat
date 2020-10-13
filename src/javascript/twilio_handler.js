const Video = Twilio.Video;
const Chat = Twilio.Chat;
var key = "";
var connected_channel;

function getTableApiToken(user_name)
{
return new Promise(function(resolve, reject) {
  setTimeout(() => reject(new Error("Whoops!")), 1000);
  $.get('/table_key_request?identity='+user_name,function(data,status)
  {
      resolve(data);
  });
})
}   


function getRoomApiToken(user_name)
{
return new Promise(function(resolve, reject) {
  setTimeout(() => reject(new Error("Whoops!")), 1000);
  $.get('/room_key_request?identity='+user_name,function(data,status)
  {
      resolve(data);
  });
})
}   
function participantConnected(participant,room) {
	



	/*
  // Add a container for the Participant's media.
  const container = $(`<div class="participant" data-identity="${identity}" id="${sid}">
    <audio autoplay ${participant === room.localParticipant ? 'muted' : ''} style="opacity: 0"></audio>
    <video autoplay muted playsinline style="opacity: 0"></video>
  </div>`);
  */


  console.log('Participant "%s" connected', participant.identity);

  const div = document.createElement('div');
  div.id = participant.sid;
  div.innerText = participant.identity;

  participant.on('trackSubscribed', track => trackSubscribed(div, track));
  participant.on('trackUnsubscribed', trackUnsubscribed);

  participant.tracks.forEach(publication => {
    if (publication.isSubscribed) {
      trackSubscribed(div, publication.track);
    }
  });

  document.getElementById("participants").appendChild(div);
}

function participantDisconnected(participant) {
  console.log('Participant "%s" disconnected', participant.identity);
  document.getElementById(participant.sid).remove();
}

function trackSubscribed(div, track) {
	console.log("track sub");
    div.appendChild(track.attach());
  }
  
  function trackUnsubscribed(track) {
    track.detach().forEach(element => element.remove());
  }

  
function connectToTable(table_name, token)
{
  console.log("attempting to join " + table_name)
        if(token!=="")
        {
          var connection_options = {name: table_name, _useTwilioConnection: true}
            Video.connect(token, connection_options).then(room => {
                console.log('Connected to Room "%s"', room.name);
                console.log(room);
              
		room.participants.forEach(participantConnected);
		room.on('participantConnected', participant => {participantConnected(participant,room)})
              
                room.on('participantDisconnected', participantDisconnected);
                room.once('disconnected', error => room.participants.forEach(participantDisconnected));
              });
        }
}
function sendMessage(msg)
{
  connected_channel.sendMessage(msg);
}

function connectToRoom(room_name,token)
{
  Chat.Client.create(token).then(client => {
    client.createChannel({
      uniqueName: room_name,
      friendlyName: room_name,
    })
    .then(function(channel) {
      console.log('created channel:');
      console.log(channel);
      connected_channel = channel;
      channel.on('messageAdded',function(mesg){console.log(mesg)})
    });
  })
}