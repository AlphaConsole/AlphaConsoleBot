/**
 * ! Update command
 * 
 * ? Kinda obvious, too lazy to write anything smart anyway
 * ? We also have command description for a reason. So I actually don't know why I added this here. Welp...
 */
const Discord = require('discord.js');
var shell = require("shelljs");

module.exports = {
    title: "Update",
    details: [{
        perms: "Admin",
        command: "!Update",
        description: "Updates the bot"
    }],

    run: ({
        client,
        serverInfo,
        message,
        args,
        sql,
        config,
        sendEmbed
    }) => {

        if (message.author.id === "136607366408962048" || message.author.id === "131926391909253120" || message.author.id === "145904453487165440" || message.author.id === "168759625875718145") {
            // <---   If you would like to change role perms. Change [BontControl] to your role name
            // client.guilds.resolve(serverInfo.guildId).channels.resolve(serverInfo.setTitleChannel).overwritePermissions(message.guild.id, {
            //     SEND_MESSAGES: false
            // });
            // client.guilds.resolve(serverInfo.guildId).channels.resolve(serverInfo.showcaseChannel).overwritePermissions(message.guild.id, {
            //     SEND_MESSAGES: false
            // });
            // client.guilds.resolve(serverInfo.guildId).channels.resolve(serverInfo.suggestionsChannel).overwritePermissions(message.guild.id, {
            //     SEND_MESSAGES: false
            // });
            // client.guilds.resolve(serverInfo.guildId).channels.resolve(serverInfo.setSpecialTitle).overwritePermissions(message.guild.id, {
            //     SEND_MESSAGES: false
            // });
            //message.channel.send('Channels locked. Executing shell commands...')

            //Shell commands
            message.reply("Beginning update").then(() => {
                shell.exec("git checkout .");
                shell.exec("git pull origin master");
                shell.exec("pm2 restart AlphaConsole");
            })
        }
    }
};
