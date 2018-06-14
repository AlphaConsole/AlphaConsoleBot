module.exports.run = (client, serverInfo, config, member) => {

    member.send("Welcome to the AlphaConsole Discord server! We are the largest Rocket League related server in the world!\n**Before you start, please make sure to:**\n\n- Download the latest version of AlphaConsole in #download.\n\n- Read all information in #faq.\n\n- Read #troubleshooting if you are having issues.\n\nIf you still have questions, feel free to contact one of our Staff members in #help.");

    require('../helpers/checkUser').run(config.sql, member.user, (err, user) => {
        if (err) return console.error(err);

        if (user.Roles && user.Roles !== "") {
            let roleIDs = user.Roles.split(/[ ]+/);

            for (let i = 0; i < roleIDs.length; i++)
                member.addRole(roleIDs[i]).catch(err => console.log(err));
        }
    })

}