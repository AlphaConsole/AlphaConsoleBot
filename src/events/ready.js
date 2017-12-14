const Discord = require('discord.js');
var fs = require( 'fs' );


module.exports = {
    title: "ready",
    description: "Activated whenever the bot starts",
    
    run: async(client, serverInfo, sql, AllowedLinksSet, AutoResponds, Commands, Events) => {
        console.log('AlphaConsole Bot logged in and ready.');
        sql.get(`select * from Statuses where Active = 1`).then(row => {
            if (row) {
                client.user.setActivity(row.StatusText, {type: row.StatusType, url: "https://www.twitch.tv/alphaconsole"});
            }
        })

        sql.all("Select * from DisabledLinks").then(rows => {
            rows.forEach(row => {
                AllowedLinksSet.add(row.ChannelID)
            });
        })

        sql.all("Select * from AutoResponds").then(rows => {
            rows.forEach(row => {
                AutoResponds.set(row.Word, row.Response);
            });
        })

        client.guilds.get(serverInfo.guildId).channels.get(serverInfo.suggestionsChannel).messages.fetch();
        client.guilds.get(serverInfo.guildId).channels.get(serverInfo.showcaseChannel).messages.fetch();

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
    }
}