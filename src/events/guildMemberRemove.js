module.exports.run = (client, serverInfo, config, member) => {
    if (member.guild.id !== serverInfo.guildId) return;

    require('../helpers/checkUser').run(config.sql, member.user, (err, user) => {
        if (err) return console.error(err);

        let roles = "";
        member.roles.cache.forEach(role => {
            if (role.name != "@everyone") roles += " " + role.id;
        });

        config.sql.query("Update Members set Roles = ? where DiscordID = ?", [ roles.trim(), member.id ]);
    })

}