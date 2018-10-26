const request = require('request');
const Discord = require('discord.js');

module.exports = {
    title: "checktitles",
    details: [
        {
            perms      : "Support",
            command    : "!checktitle <steam id | steam link | steam vanity url>>",
            description: "Checks the official Rocket League titles of this steam account"
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed, member }) => {

        if (!message.member.isSupport) return;
        const { keys } = config;
        const apiToken = keys.RL_API_Token;

        function sendTitles(steamid) {
            request(`https://api.rocketleague.com/api/v1/steam/playertitles/${steamid}?format=json`,
            { headers: {
                Authorization: `Token ${apiToken}`
            }}, (req, res, body) => {
                let data = JSON.parse(body);

                if (data) {
                    if (data.detail) message.channel.send(data.detail)
                    else if (data.titles.length === 0) message.channel.send("No titles found.")
                    else message.channel.send(data.titles.map(t => `- ${t}`).join("\n"));
                } else
                    message.channel.send("No data returned from API call.")
            })
        }

        args.shift();

        try {
        
            if (args.length != 1) {
                sendEmbed(message.author, "Your input is incorrect. Valid inputs are: Steam link, SteamID64 or Steam Custom URL.");
                return;
            } else {
                let id = message.mentions.users.first() ? message.mentions.users.first().id : args[0];

                if (id.length === 18) {
                    var url = config.keys.CheckdbURL + "?DiscordID=" + id;
                    request({ method: "GET", url: url }, function (err, response, body) {
                        if (err) {
                            let errorCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
                            console.error(`Error code ${errorCode} by ${message.author.tag}`, err);
                            return sendEmbed(message.author, "🚫 An error occurred. Please contact Pollie#0001. Error code: `" + errorCode + "`");
                        }

                        let result = "";

                        if (body) {
                            if (body.toLowerCase().includes("not signed up for db")) {
                                sendEmbed(message.channel, "An error occured", `It appears you have not signed up for our title service. Please click this link and makes sure you are logging in with the correct account.\n\nhttp://www.alphaconsole.net/auth/index.php`)
                                
                            } else if (body.toLowerCase().includes("no title set")) {
                                sendEmbed(message.channel, "An error occured", `No title set. Go to #set-title and set a title!`);
                                    
                            } else {
                                var info = body.split(" ");
                                var steamID = info[info.length - 2];
                                sendTitles(steamID);
                            }
                        } else {
                            sendEmbed(message.channel, "An error occured", "There was an error. Please try again. If this problem continues please contact an admin.")
                        }
                    });
                } else {
                    //Steam ID
                    var steamID = id;
                    var shouldQuerySteamAPI = false;
                    if (steamID.includes("steamcommunity.com")) {
                        var splited = steamID.split("/").filter(v => v != '');
                        var commIndex = splited.indexOf("steamcommunity.com");
                        if (splited.length > commIndex + 2) {
                            var field = splited[commIndex + 1];
                            if (!(field == "id" || field == "profiles")) {
                                sendEmbed(message.author, "Your input is incorrect. Valid inputs are: Steam link, SteamID64 or Steam Custom URL.");
                                return;
                                return;
                            } else {
                                steamID = splited[commIndex + 2];
                            }
                        } else {
                            sendEmbed(message.author, "Your input is incorrect. Valid inputs are: Steam link, SteamID64 or Steam Custom URL.");
                            return;
                        }
                    }
                    if (!steamID.match(/^7\d{16}$/)) shouldQuerySteamAPI = true;
                    if (shouldQuerySteamAPI) {
                        var url = keys.SteamAPIURL;
                        url += '?key=' + keys.SteamAPIKey + '&vanityurl=' + steamID;
                        request({
                                method: "GET",
                                url: url
                            },
                            function (err, response, body) {
                                if (err) {
                                    let errorCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
                                    console.error(`Error code ${errorCode} by ${message.author.tag}`, err);
                                    return sendEmbed(message.author, "🚫 An error occurred. Please contact Pollie#0001. Error code: `" + errorCode + "`");
                                } else {
                                    if (body) {
                                        var jsonObject = JSON.parse(body);
                                        if (jsonObject != null && jsonObject.response && jsonObject.response.success) {
                                            if (jsonObject.response.success == 1) {
                                                steamID = jsonObject.response.steamid;
                                                sendTitles(steamID);
                                            } else {
                                                sendEmbed(message.author, "Your input is incorrect. Valid inputs are: Steam link, SteamID64 or Steam Custom URL.");
                                                return;
                                            }
                                        } else {
                                            sendEmbed(message.author, "An error occured. Please try again later.");
                                            return;
                                        }

                                    } else {
                                        sendEmbed(message.author, "An error occured. Please try again later.");
                                        return;
                                    }
                                }
                            }
                        );
                    } else {
                        sendTitles(steamID);
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
};