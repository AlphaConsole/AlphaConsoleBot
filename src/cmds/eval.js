const Discord = require("discord.js");

module.exports = {
  title: "eval",
  perms: "root",
  commands: ["!eval"],
  description: ["Runs code"],

  run: async (client, serverInfo, message) => {

        //nobody asked for this but eh why not

        if (message.author.id != 136607366408962048) return;

        const args = message.content.split(" ").slice(1);
        try {
            const code = args.join(" ");
            let evaled = eval(code);
      
            if (typeof evaled !== "string")
              evaled = require("util").inspect(evaled);
      
            message.channel.send(clean(evaled), {code:"xl"});
          } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
          }
        }

};


function clean(text) {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
  }

