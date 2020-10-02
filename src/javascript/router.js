function loadHome()
{
    $("#page").load("/home.html"); 
}

function loadRoom(name, room)
{
    $("#page").load("/room.html"); 
    join_room(name,room);
}

function loadTable(name, room)
{
    $("#page").load("/table.html"); 
    join_room(name,room);
}
