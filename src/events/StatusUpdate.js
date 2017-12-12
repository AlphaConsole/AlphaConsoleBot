module.exports.run = async(client, serverInfo, sql) => {
 
    sql.all("select * from Statuses").then(rows => {

        if (rows[rows.length - 1].Active == 1) {
            sql.run(`update Statuses set Active = 0 where ID = ${rows[rows.length - 1].ID}`).then(() => {
                sql.run(`update Statuses set Active = 1 where ID = ${rows[0].ID}`)
                client.user.setActivity(rows[0].StatusText, {type: rows[0].StatusType, url: "https://www.twitch.tv/alphaconsole"});
            })
        } else {
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].Active == 1) {
                    sql.run(`update Statuses set Active = 0 where ID = ${rows[i].ID}`).then(() => {
                        sql.run(`update Statuses set Active = 1 where ID = ${rows[i + 1].ID}`)
                        client.user.setActivity(rows[i + 1].StatusText, {type: rows[i + 1].StatusType, url: "https://www.twitch.tv/alphaconsole"});
                    })
        
                }
            }
        }
        

    })

}