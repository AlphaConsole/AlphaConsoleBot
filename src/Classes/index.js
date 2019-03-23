const Discord = require("discord.js");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);

Discord.Structures.extend("TextChannel", require("./TextChannel"));
Discord.Structures.extend("GuildMember", require("./GuildMember"));

module.exports = loadDiscordClasses();

async function loadDiscordClasses() {
  return new Promise(async resolve => {
    const classes = await readdir("./src/Classes/");
    classes.forEach(f => {
      if (!f.endsWith(".js") || f === "index.js") return;

      try {
        const className = f.split(".")[0];
        Discord.Structures.extend(className, require(`./${className}`));
      } catch (e) {
        console.log(`Unable to load class ${f}: ${e}`);
      }
    });
    resolve(Discord);
  });
}
