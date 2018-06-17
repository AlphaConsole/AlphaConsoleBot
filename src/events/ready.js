/**
 * ! Ready event file
 * 
 * ? This is activated whenever the bot started & is ready to serve.
 * ? It'll fetch data from the database and save it in the config to prevent more db calls
 */
let fs = require('fs');

module.exports.run = (client, serverInfo, config, checkStatus) => {
    console.log("AlphaConsole Bot logged in and ready.");

    /**
     * ! Config variables setup
     * 
     * ? We'll grab all details from database and save them in variables.
     * ? This way we can use the variables to check stuff, and we don't need to query
     * ? the database over & over again.
     */

    config.sql.query("SELECT * FROM Config", (error, result) => {
        if (error) return console.error(error);

        for (let i = 0; i < result.length; i++) {
            if (config[result[i].Config]) {
                if (result[i].Config === "autoResponds") 
                    config[result[i].Config][result[i].Value1] = result[i].Value2
                else 
                    config[result[i].Config].push(result[i].Value1)
                
            }
        }
    })
    

    /**
     * ! Help command setup
     * 
     * ? On bot start we'll fetch all the files from cmds.
     * ? Every single file includes a title & details. We'll be fetching those to make a fast a smooth help
     */

    fs.readdir('./src/cmds', (err, files) => {
        for (let i = 0; i < files.length; i++) {
            let info = require(`../cmds/${files[i]}`);
            if (!info.title || !info.details) continue;
            for (let ii = 0; ii < info.details.length; ii++) {
                config.commands.push({
                    title      : info.title,
                    perms      : info.details[ii].perms,
                    command    : info.details[ii].command,
                    description: info.details[ii].description
                })
            }
        }
    })

    /**
     * ! Channel messages fetching
     * 
     * ? Channels like showcase & suggestions requires fetching because reactions won't work
     * ? if the messages aren't fetched. So by fetching them at least the last 100 messages will work
     * 
     * ? We also delay this by 30 seconds. Since yea, AC is a big Discord and it takes time for all channels to be fetched.
     */
    
    setTimeout(() => {
        checkStatus();
        client.guilds.get(serverInfo.guildId).channels.get(serverInfo.channels.showcase).messages.fetch();
        client.guilds.get(serverInfo.guildId).channels.get(serverInfo.channels.suggestion).messages.fetch();
        client.guilds.get(serverInfo.guildId).channels.get(serverInfo.channels.ingameReports).messages.fetch();
    }, 30000);
}