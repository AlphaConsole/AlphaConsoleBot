module.exports.run = (client, serverInfo, config, oldMember, newMember) => {

    if (newMember.voiceChannel) {
        if (newMember.voiceChannel.parentID == serverInfo.DynamicCat) {
            if (newMember.voiceChannel.members.cache.length == 1) {
                Extra = 0;
                client.guilds.resolve(serverInfo.guildId).channels.forEach(channel => {
                    if (channel.parentID == serverInfo.DynamicCat) {
                        if (channel.members.cache.length == 0) {
                            if (Extra == 1) {
                                channel.delete();
                            } else {
                                Extra = 1;
                            }
                        }
                    }
                });
                if (Extra == 0) newMember.guild.channels.create("🎮 Game Channel", { type: "voice", parent: serverInfo.DynamicCat });
            }
        }
    }

    if (oldMember.voiceChannel) {
        if (oldMember.voiceChannel.parentID == serverInfo.DynamicCat) {
            if (oldMember.voiceChannel.members.cache.length == 0) {
                Extra = 0;
                client.guilds.resolve(serverInfo.guildId).channels.forEach(channel => {
                    if (channel.parentID == serverInfo.DynamicCat) {
                        if (channel.members.cache.length == 0) {
                            if (Extra == 1) {
                                if (channel) {
                                    channel.delete();
                                }
                            } else {
                                Extra = 1;
                            }
                        }
                    }
                });
                if (Extra == 0) oldMember.guild.channels.create("🎮 Game Channel", { type: "voice", parent: serverInfo.DynamicCat });
            }
        }
    }

}