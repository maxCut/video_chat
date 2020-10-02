function join_table(name, table_id)
{
    console.log("joining room");
    getApiToken(name).then(function(result)
    {
        connectToRoom(table_id,result);
    })
}
