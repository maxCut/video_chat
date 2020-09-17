$("#room_form").submit(function(e) {
    e.preventDefault();
    onSubmit();
});

function onSubmit()
{
    var name =document.getElementById("name").value
    var room =document.getElementById("room").value
    console.log(room)
    console.log(name)
    loadRoom(name,room)
}