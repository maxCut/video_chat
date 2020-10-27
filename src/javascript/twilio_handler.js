const Video = Twilio.Video;
const Chat = Twilio.Chat;
var key = "";
var connected_channel = null;
var clientData;
var user_name;


window.addEventListener("beforeunload", function (e) {
  if(connected_channel)
  {
    connected_channel.leave();
  }  
  return;
});

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

  const flexbox = document.createElement('li');
  flexbox.classList += "flex-item"
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

  flexbox.appendChild(div);
  document.getElementById("participants").appendChild(flexbox);
}

function participantDisconnected(participant) {
  console.log('Participant "%s" disconnected', participant.identity);
}

function trackSubscribed(div, track) {
	console.log("track sub");
    div.appendChild(track.attach());
    var placeholder = document.getElementById("placeholder");
    placeholder.parentNode.removeChild(placeholder);
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

function setTableData(user_name,table_name)
{
  connected_channel.getMemberByIdentity(user_name).then(curUser=>{
    curUser.updateAttributes({"current_table":table_name});
  })
}

function getRoomMap()
{
  return connected_channel.getMembers().then(members => {

    var roomMap = {}
    for (var key in members) {
      var u_identity = members[key].state.identity;
      var selectedTable = members[key].state.attributes.current_table;
      if(selectedTable==null)
      {
        continue;
      }
      roomMap[selectedTable] = [u_identity].concat(roomMap[selectedTable]);      
    } 
    return roomMap

  })
}

function connectToRoom(room_name,token)
{
  Chat.Client.create(token).then(client => {
    client.getPublicChannelDescriptors().then(function(paginator)
    {
      console.log("here")
      for (i=0; i<paginator.items.length; i++) {
        var channelDescriptor = paginator.items[i];
        if(channelDescriptor.uniqueName==room_name)
        {
          console.log('Channel: ' + channelDescriptor.friendlyName);
          
          channelDescriptor.getChannel().then(function(channel)
          {
            connected_channel = channel;
            connected_channel.join()
            connected_channel.on('messageAdded',function(mesg){console.log(mesg)})
            connected_channel.on('memberInfoUpdated', function(member) {
              console.log(member.identity + 'updated their info.');
            });
          })

        }
      
      }
      if(connected_channel==null)
      {
        client.createChannel({
          uniqueName: room_name,
          friendlyName: room_name,
          isPrivate: false
        })
        .then(function(channel) {
          console.log('created channel:');
          console.log(channel);
          connected_channel = channel;
          connected_channel.join()
          channel.on('messageAdded',function(mesg){console.log(mesg)})
          connected_channel.on('memberInfoUpdated', function(member) {
            console.log(member.identity + 'updated their info.');
          });
        })
      }

    })
  })
}