module.exports.run = (client, serverInfo, config, member) => {

    require('../checks/checkUser').run(config.sql, member.user, (err, user) => {
        if (err) return console.error(err);

        let roles = "";
        member.roles.array().forEach(role => {
            if (role.name != "@everyone") roles += " " + role.id;
        });

        config.sql.query("Update Members set Roles = ? where DiscordID = ?", [ roles.trim(), member.id ]);
    })

}