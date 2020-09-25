function join_room(name, room)
{
    console.log("joining room");
    getApiToken(name).then(function(result)
    {
        connectToRoom(room,result);
    })
}
