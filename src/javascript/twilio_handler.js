const Video = Twilio.Video;
var key = "";

let getApiToken = new Promise(function(resolve, reject) {
  setTimeout(() => reject(new Error("Whoops!")), 1000);
  $.get('/key_request',function(data,status)
  {
      resolve(data);
  });
});
    
function participantConnected(participant) {
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

  document.body.appendChild(div);
}

function participantDisconnected(participant) {
  console.log('Participant "%s" disconnected', participant.identity);
  document.getElementById(participant.sid).remove();
}

function trackSubscribed(div, track) {
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
            Video.connect(token, { name: room_name }).then(room => {
                console.log('Connected to Room "%s"', room.name);
                console.log(room);
              
                room.participants.forEach(participantConnected);
                room.on('participantConnected', participantConnected);
              
                room.on('participantDisconnected', participantDisconnected);
                room.once('disconnected', error => room.participants.forEach(participantDisconnected));
              });
        }
}
