function join_table(name, table_id)
{
    console.log("joining table: " + table_id);
    getTableApiToken(name).then(function(result)
    {
        connectToTable(table_id,result);
    })
}
