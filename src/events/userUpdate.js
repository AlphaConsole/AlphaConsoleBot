module.exports.run = (client, serverInfo, config, user) => {

    require('../checks/checkUser').run(config.sql, user, (err, u) => {
        if (err) return console.error(err);

        config.sql.query("Update Members set Username = ? where DiscordID = ?", [ user.username, user.id ]);
    })

}