
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
    setInterval(update_tables,2000);
}

var selectedTable = ""


function new_table(table_name)
{
    console.log("making a new table");
    loadTable(user_name,room_name+"-"+table_name)
}

//Handles updating who is at which table
function update_tables(newTablePair)
{
    getRoomMap().then(roomMap=>
        {
            var tableList = document.createElement("ul");
            tableList.id = "tables"
            for(table in roomMap)
            {
                if(table==null)
                {
                    continue;
                }
                var tableWrapper = document.createElement("button"); 
                tableWrapper.className = "flex-item tableWrapper"
                var tableTitle = document.createElement("h1");
                tableTitle.innerHTML = table;
                tableWrapper.appendChild(tableTitle);
                tableWrapper.onclick = function(){loadTable(user_name,table);};
                tableWrapper.id = table;
                for(user in roomMap[table])
                {
                    if(roomMap[table][user]==null)
                    {
                        continue;
                    }
                    var userElement = document.createElement("p");
                    userElement.innerHTML=roomMap[table][user];
                    tableWrapper.appendChild(userElement)
                }
                tableList.appendChild(tableWrapper);
            }
            document.getElementById("tables").replaceWith(tableList);
        })
}


function loadTable(name, table)
{
    console.log("here")
    $("#table_view").load("/table.html"); 
    join_table(name,table);
    setTableData(name,table)
}

$("#new_table_form").submit(function(e) {
    e.preventDefault();
    onSubmit();
});

function onSubmit()
{
    var name =document.getElementById("new_table_name").value
    console.log("creating table: " + name)
    new_table(name)
}