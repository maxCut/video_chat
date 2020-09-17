function join_room(name, room)
{
    console.log("joining room");
    getApiToken.then(function(result)
    {
        connectToRoom(room,result);
    })


}