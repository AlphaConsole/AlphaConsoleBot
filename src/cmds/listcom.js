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
        if (!message.member.isStaff) return;
        
        sql.query("Select * from Commands", [], (err, rows) => {
            if (err) return console.error(err);

            let allCommands = "";
            rows.forEach(row => {
            allCommands += "- !" + row.Command + "\n";
            });

            sendEmbed(message.channel, "All custom commands", allCommands);
        })
    }
}