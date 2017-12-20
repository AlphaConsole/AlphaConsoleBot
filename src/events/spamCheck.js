const Discord = require('discord.js');

module.exports = {
    title: "Spam Check",
    description: "Checks for spam",
    
    run: async(client, serverInfo, message, authors, messagelog, warned, banned) => {
        const warnBuffer = 3;
        const maxBuffer = 5;
        const interval = 1000;
        const maxDuplicatesWarning = 4;
        const maxDuplicatesBan = 10;


        // Anti-Spam
        var now = Math.floor(Date.now());
        authors.push({
        "time": now,
        "author": message.author.id
        });
        messagelog.push({
        "message": message.content,
        "author": message.author.id
        });

        // Check how many times the same message has been sent.
        var messageMatch = 0;
        for (var i = 0; i < messagelog.length; i++) {
            if (messagelog[i].message == message.content && (messagelog[i].author == message.author.id) && (message.author.id !== client.user.id)) {
                messageMatch++;
            }
        }

        // Check matched count
        if (messageMatch == maxDuplicatesWarning && !warned.includes(message.author.id)) {
          message.reply('warned');
        }
        if (messageMatch == maxDuplicatesBan && !banned.includes(message.author.id)) {
          message.reply('banned');
        }

        matched = 0;

        for (var i = 0; i < authors.length; i++) {
          if (authors[i].time > now - interval) {
            matched++;
            if (matched == warnBuffer && !warned.includes(message.author.id)) {
                message.reply('warned');
            }
            else if (matched == maxBuffer) {
              if (!banned.includes(message.author.id)) {
                message.reply('banned');
              }
            }
          }
          else if (authors[i].time < now - interval) {
            authors.splice(i);
            warned.splice(warned.indexOf(authors[i]));
            banned.splice(warned.indexOf(authors[i]));
          }
          if (messagelog.length >= 200) {
            messagelog.shift();
          }
        }

    }
};

