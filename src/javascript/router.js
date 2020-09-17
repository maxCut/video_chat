function loadHome()
{
    $("#page").load("/home.html"); 
}

function loadRoom(name, room)
{
    $("#page").load("/room.html"); 
    join_room(name,room);
}