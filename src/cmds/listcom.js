/**
 * ! List commands command
 * 
 * ? Displays all custom commands
 */

module.exports = {
    title: "ListCommands",
    details: [
        {
            perms      : "Staff",
            command    : "!listcom",
            description: "Shows all custom commands"
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {
        if (!message.member.isCH) return;
        
        sql.query("Select * from Commands", [], (err, rows) => {
            if (err) {
                let errorCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
                console.error(`Error code ${errorCode} by ${message.author.tag}`, err);
                return sendEmbed(message.author, "🚫 An error occurred. Please contact Pollie#0001. Error code: `" + errorCode + "`");
            }

            let allCommands = "";
            rows.forEach(row => {
            allCommands += "- !" + row.Command + "\n";
            });

            sendEmbed(message.channel, "All custom commands", allCommands);
        })
    }
}