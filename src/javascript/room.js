var user_name = ""
var room_name = ""
function join_room(name, room)
{
    console.log("joining room: " + room);
    getRoomApiToken(name).then(function(result)
    {
        connectToRoom(room,result);
        user_name = name
        room_name = room

        console.log("in room: " + room_name);
    })
}

var selectedTable = ""

var tableMap = {}
var tableIndex = 0

function new_table()
{
    console.log("making a new table");
    tableIndex++;
    selectedTable = tableIndex
    loadTable(user_name,room_name+":"+tableIndex)
}

function update_tables_request(newTableMap)
{
    
}


function loadTable(name, room)
{
    $("#table_view").load("/table.html"); 
    join_table(name,room);
}
