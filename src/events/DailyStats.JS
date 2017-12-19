module.exports = {
    title: "DailyStats",
    description: "Saves the daily stats and saves them to the permanent table",
    
    run: async(client, serverInfo, sql) => {

 
        sql.all("select * from CurrentStats").then(rows => {

            for (let i = 0; i < rows.length; i++) {
                if (rows[i].Time == undefined || rows[i].Time == null || rows[i].Time < 100) {
                    TheTime = new Date().getTime();
                } else {
                    TheTime = rows[i].Time;
                }

                sql.run(`Insert into DailyStats(Type, Value, Time) VALUES('${rows[i].Type}', '${rows[i].Value}', '${TheTime}')`)
                sql.run(`Update Currentstats set Value = 0, Time = 0 where ID = '${rows[i].ID}'`);
            }

        })
    }
}