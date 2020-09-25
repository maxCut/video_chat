const Video = Twilio.Video;
var key = "";

function getApiToken(user_name)
{
return new Promise(function(resolve, reject) {
  setTimeout(() => reject(new Error("Whoops!")), 1000);
  $.get('/key_request?identity='+user_name,function(data,status)
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

  
function connectToRoom(room_name, token)
{
  console.log("attempting to join " + room_name)
        if(token!=="")
        {
          var connection_options = {name: room_name, _useTwilioConnection: true}
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
