const Discord = require('discord.js');
var fs = require( 'fs' );


module.exports = {
    title: "ready",
    description: "Activated whenever the bot starts",
    
    run: async(client, serverInfo, sql, AllowedLinksSet, AutoResponds, Commands, Events, SwearWordsSet, blackListedWords) => {
        sql.get(`select * from Statuses where Active = 1`).then(row => {
            if (row) {
                if (row.StatusText.toLowerCase() == "counter") {
                    client.user.setActivity(`with ${client.guilds.get(serverInfo.guildId).memberCount} members`, {url: "https://www.twitch.tv/alphaconsole"});
                } else {
                    client.user.setActivity(row.StatusText, {type: row.StatusType, url: "https://www.twitch.tv/alphaconsole"});
                }
            }
        })

        sql.all("Select * from DisabledLinks").then(rows => {
            rows.forEach(row => {
                AllowedLinksSet.add(row.ChannelID)
            });
        })

        sql.all("Select * from SwearWords").then(rows => {
            rows.forEach(row => {
                SwearWordsSet.add(row.Word)
            });
        })

        sql.all("Select * from AutoResponds").then(rows => {
            rows.forEach(row => {
                AutoResponds.set(row.Word, row.Response);
            });
        })

        sql.all("Select * from Blacklist").then(rows => {
            rows.forEach(row => {
                blackListedWords.push(row.Word);
            });
        })
        
        // client.guilds.get(serverInfo.guildId).channels.get(serverInfo.setTitleChannel).overwritePermissions(message.guild.id, {
        //     SEND_MESSAGES: true
        // });
        // client.guilds.get(serverInfo.guildId).channels.get(serverInfo.showcaseChannel).overwritePermissions(message.guild.id, {
        //     SEND_MESSAGES: true
        // });
        // client.guilds.get(serverInfo.guildId).channels.get(serverInfo.suggestionsChannel).overwritePermissions(message.guild.id, {
        //     SEND_MESSAGES: true
        // });
        // client.guilds.get(serverInfo.guildId).channels.get(serverInfo.setSpecialTitleChannel).overwritePermissions(message.guild.id, {
        //     SEND_MESSAGES: true
        // });

        
        client.guilds.get(serverInfo.guildId).channels.get(serverInfo.suggestionsChannel).messages.fetch();
        client.guilds.get(serverInfo.guildId).channels.get(serverInfo.showcaseChannel).messages.fetch();
        client.guilds.get(serverInfo.guildId).channels.get(serverInfo.giveawaychannel).messages.fetch();

        serverInfo.logo = client.guilds.get(serverInfo.guildId).iconURL({format:"png"});

        fs.readdir('./src/cmds/', function( err, files ) {
            if( err ) {
                console.log("Could not list the directory.", err );
            } else {
                files.forEach( function( file, index ) {
                    if (file.endsWith('.js')) {
                        if (require(`../cmds/${file}`).title) {
                            Commands[require(`../cmds/${file}`).title] = {
                                title: require(`../cmds/${file}`).title,
                                perms: require(`../cmds/${file}`).perms,
                                commands: require(`../cmds/${file}`).commands,
                                desc: require(`../cmds/${file}`).description
                            }
                        }
                    }
                });
            }
        });

        fs.readdir('./src/events/', function( err, files ) {
            if( err ) {
                console.log("Could not list the directory.", err );
            } else {
                files.forEach( function( file, index ) {
                    if (file.endsWith('.js')) {
                        if (require(`../events/${file}`).title) {
                            Events[require(`../events/${file}`).title] = {
                                title: require(`../events/${file}`).title,
                                desc: require(`../events/${file}`).description
                            }
                        }
                    }
                });
            }
        });
        
        if(!client.guilds.get(serverInfo.guildId).available) {
            client.users.get("136607366408962048").send("**AlphaConsole** guild is disabled according to the API!")
            client.users.get("149223090134450177").send("**AlphaConsole** guild is disabled according to the API!")
        }

        console.log('AlphaConsole Bot logged in and ready.');
        client.guilds.get(serverInfo.guildId).channels.get(serverInfo.basementChannel).send(":robot: Bot logged in and ready :robot:");        
        
    }
}