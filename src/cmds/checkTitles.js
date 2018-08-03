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
                    if (data.titles.length === 0) message.channel.send("No titles found.")
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
                var incorrectInput = false;
                var steamID = args[0];
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
                } else {
                    if (steamID.match(/^[a-z0-9]+$/i) === null) incorrectInput = true;
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
        } catch (error) {
            console.log(error)
        }
    }
};