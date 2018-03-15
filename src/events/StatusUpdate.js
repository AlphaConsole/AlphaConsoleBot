module.exports = {
  title: "StatusUpdate",
  description: "Updates the bot status every 30 mins",

  run: async (client, serverInfo, sql) => {
    sql.all("select * from Statuses").then(rows => {
      if (rows.length == 0) {
        client.user.setActivity(
          `with ${client.guilds.get(serverInfo.guildId).memberCount} members`,
          { url: "https://www.twitch.tv/alphaconsole" }
        );
      } else {
        if (rows.length == 1) return;
        if (rows[rows.length - 1].Active == 1) {
          sql
            .run(
              `update Statuses set Active = 0 where ID = ${
                rows[rows.length - 1].ID
              }`
            )
            .then(() => {
              sql.run(
                `update Statuses set Active = 1 where ID = ${rows[0].ID}`
              );

              client.user.setActivity(
                rows[0].StatusText.replace(
                  "counter",
                  client.guilds.get(serverInfo.guildId).memberCount
                ),
                {
                  type: rows[0].StatusType,
                  url: "https://www.twitch.tv/alphaconsole"
                }
              );
            });
        } else {
          for (let i = 0; i < rows.length; i++) {
            if (rows[i].Active == 1) {
              sql
                .run(`update Statuses set Active = 0 where ID = ${rows[i].ID}`)
                .then(() => {
                  sql.run(
                    `update Statuses set Active = 1 where ID = ${
                      rows[i + 1].ID
                    }`
                  );

                  client.user.setActivity(
                    rows[i + 1].StatusText.replace(
                      "counter",
                      client.guilds.get(serverInfo.guildId).memberCount
                    ),
                    {
                      type: rows[i + 1].StatusType,
                      url: "https://www.twitch.tv/alphaconsole"
                    }
                  );
                });
            }
          }
        }
      }
    });
  }
};
