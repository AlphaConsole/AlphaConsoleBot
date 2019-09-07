/**
 * ! Titles command
 */
const Discord = require("discord.js");

const presets = {
  "1": {
    name: "Gray",
    color: "FFFFFF",
    glow: "000000"
  },
  "2": {
    name: "Glowing Green",
    color: "00FFAA",
    glow: "00FFFF"
  },
  "3": {
    name: "Non-glowing Green",
    color: "00FFAA",
    glow: "000000"
  },
  "4": {
    name: "Non-glowing Yellow",
    color: "FFEB5C",
    glow: "000000"
  },
  "5": {
    name: "Glowing Yellow",
    color: "FFEB5C",
    glow: "FFA300"
  },
  "6": {
    name: "Purple",
    color: "DBD2FF",
    glow: "8C50FF"
  },
  "7": {
    name: "RLCS Blue",
    color: "AEF7FF",
    glow: "43AFFF"
  }
};

module.exports = {
  title: "Titles",
  details: [
    {
      perms: "Everyone",
      command: "!set Title <Title Text>",
      description: "Use this to set your in game title"
    },
    {
      perms: "Everyone",
      command: "!set Color <Hex code>",
      description: "Use this to set your in game title color"
    },
    {
      perms: "Everyone",
      command: "!set glow <Hex code>",
      description: "Use this to set your in game title glow color"
    },
    {
      perms: "Everyone",
      command: "!set alltitle <Color Hex> <Glow Hex> <Title Text>",
      description: "Use this to set all of your title options at once"
    }
  ],

  run: ({
    client,
    serverInfo,
    message,
    args,
    sql,
    config,
    sendEmbed,
    member
  }) => {
    if (
      args[0].toLowerCase() === "!set" &&
      message.channel.id !== serverInfo.channels.setTitle &&
      message.channel.id !== serverInfo.channels.setSpecialTitle &&
      message.channel.id !== serverInfo.channels.setBanner
    ) {
      if (
        args[1].toLowerCase() === "title" ||
        args[1].toLowerCase() === "color" ||
        args[1].toLowerCase() === "colour" ||
        args[1].toLowerCase() === "glow" ||
        args[1].toLowerCase() === "alltitle"
      )
        sendEmbed(
          message.author,
          "Use the `!set` command in the #set-title channel."
        );

      return message.delete().catch(e => {});
    }

    switch (args[1].toLowerCase()) {
      case "title":
        args[0].toLowerCase() == "!set" ? setTitle() : overrideTitle();
        break;

      case "color":
      case "colour":
        args[0].toLowerCase() == "!set" ? setColor() : overrideColor();
        break;

      case "glow":
        args[0].toLowerCase() == "!set" ? setGlow() : overrideGlow();
        break;

      case "alltitle":
        setAllTitle();
        break;

      case "special":
        setSpecialTitle();
        break;

      case "banner":
        args[0].toLowerCase() == "!set"
          ? require("./requestBanner").run({
              client,
              serverInfo,
              message,
              args,
              sql,
              config,
              sendEmbed
            })
          : require("./requestBanner").run(
              {
                client,
                serverInfo,
                message,
                args,
                sql,
                config,
                sendEmbed
              },
              true
            );
        break;

      default:
        break;
    }

    /**
     * ! Set alltitle
     */
    function setAllTitle() {
      if (args.length < 5) {
        return sendEmbed(
          message.author,
          "Usage: !set alltitle <Color Hex> <Glow Hex> <Title Text>"
        );
      }

      // command, subcommand, color hex, glow hex, ...title
      let [, , color, glow] = args;
      let userTitle = createTitle(args, 4);
      setUsersTitle(message.author.id, userTitle)
        .then(title =>
          setUsersColor(
            message.author.id,
            color.replace(/ /g, "").toUpperCase(),
            false
          )
            .then(color =>
              setUsersColor(
                message.author.id,
                glow.replace(/ /g, "").toUpperCase(),
                true
              )
                .then(glow =>
                  sendEmbed(
                    message.author,
                    "Title updated",
                    `Your title has been set to **\`${title}\`**, color **\`${color}\`**, glow **\`${glow}\`**!`
                  )
                )
                .catch(e => sendEmbed(message.author, "An error occurred", e))
            )
            .catch(e => sendEmbed(message.author, "An error occurred", e))
        )
        .catch(e => sendEmbed(message.author, "An error occurred", e));
    }

    /**
     * ! Set title
     */
    function setTitle() {
      if (args.length < 3)
        return sendEmbed(
          message.author,
          "You must have forgotten the title itself ;)"
        );

      let userTitle = createTitle(args, 2);
      setUsersTitle(message.author.id, userTitle)
        .then(title =>
          sendEmbed(
            message.author,
            "Title updated",
            `Your title has been set to **\`${title}\`**!`
          )
        )
        .catch(e => sendEmbed(message.author, "An error occurred", e));
    }

    function overrideTitle() {
      if (
        !(message.member && message.member.isModerator) &&
        !(member && member.isModerator)
      )
        return;
      if (args.length < 4)
        return sendEmbed(
          message.author,
          "You must have forgotten the the user or the title"
        );
      message.delete().catch(e => {});

      let id = message.mentions.users.first()
        ? message.mentions.users.first().id
        : args[2];
      let title = createTitle(args, 3);

      sql.query(
        "SELECT * FROM TitleReports WHERE (DiscordID = ?) AND Title = ?",
        [id, title],
        (err, rows) => {
          if (!rows[0]) {
            sql.query(
              "SELECT * FROM Titles where DiscordID = ?",
              [id],
              (err, res) => {
                if (!res[0]) {
                  sql.query("INSERT INTO Titles(DiscordID) VALUES(?, ?)", [id]);
                }

                sql.query(
                  "INSERT INTO TitleReports(DiscordID, Title, Color, Fixed, Permitted, Reporter) VALUES (?, ?, ?, ?, ?, ?)",
                  [id, title, "?", "1", "1", message.author.id]
                );
              }
            );
          }
        }
      );

      setUsersTitle(id, title, message.author.id)
        .then(msg => sendEmbed(message.author, "Title updated", msg))
        .catch(e =>
          sendEmbed(message.author, "An error occurred updating title", e)
        );
    }

    /**
     * ! Set color
     */
    function setColor() {
      if (args.length < 3)
        return sendEmbed(
          message.author,
          "You must have forgotten the color itself ;)"
        );

      let userColor = createTitle(args, 2)
        .replace(/ /g, "")
        .toUpperCase();
      setUsersColor(message.author.id, userColor, false)
        .then(title =>
          sendEmbed(
            message.author,
            "Title color updated",
            `Your title color has been set to **\`${title}\`**!`
          )
        )
        .catch(e => sendEmbed(message.author, "An error occurred", e));
    }

    function overrideColor() {
      if (
        !(message.member && message.member.isModerator) &&
        !(member && member.isModerator)
      )
        return;
      if (args.length < 4)
        return sendEmbed(
          message.author,
          "You must have forgotten the the user or the color"
        );
      message.delete().catch(e => {});

      let id = message.mentions.users.first()
        ? message.mentions.users.first().id
        : args[2];
      let color = createTitle(args, 3)
        .replace(/ /g, "")
        .toUpperCase();

      setUsersColor(id, color, false, message.author.id)
        .then(msg => sendEmbed(message.author, "Title color updated", msg))
        .catch(e =>
          sendEmbed(message.author, "An error occurred updating title", e)
        );
    }

    /**
     * ! Set glow
     */
    function setGlow() {
      if (args.length < 3)
        return sendEmbed(
          message.author,
          "You must have forgotten the glow itself ;)"
        );

      let userColor = createTitle(args, 2)
        .replace(/ /g, "")
        .toUpperCase();
      setUsersColor(message.author.id, userColor, true)
        .then(title =>
          sendEmbed(
            message.author,
            "Title glow updated",
            `Your glow color has been set to **\`${title}\`**!`
          )
        )
        .catch(e => sendEmbed(message.author, "An error occurred", e));
    }

    function overrideGlow() {
      if (
        !(message.member && message.member.isModerator) &&
        !(member && member.isModerator)
      )
        return;
      message.delete().catch(e => {});

      let id = message.mentions.users.first()
        ? message.mentions.users.first().id
        : args[2];
      let color = createTitle(args, 3)
        .replace(/ /g, "")
        .toUpperCase();

      setUsersColor(id, color, true, message.author.id)
        .then(msg => sendEmbed(message.author, "Title glow updated", msg))
        .catch(e =>
          sendEmbed(message.author, "An error occurred updating title", e)
        );
    }

    /**
     * ! Set special
     */
    function setSpecialTitle() {
      if (
        message.channel.id !== serverInfo.channels.setSpecialTitle ||
        args.length < 3
      )
        return;

      sql.query(
        "select * from SpecialTitles where ID = ?",
        [args[2]],
        (err, res) => {
          if (err) {
            let errorCode =
              Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
            console.error(
              `Error code ${errorCode} by ${message.author.tag}`,
              err
            );
            return sendEmbed(
              message.author,
              "🚫 An error occurred. Please contact Pollie#0001. Error code: `" +
                errorCode +
                "`"
            );
          }

          if (res.length === 0)
            return sendEmbed(
              message.author,
              "Error setting special title",
              "No special title found with provided id."
            );

          let preset = res[0];
          let roles = JSON.parse(preset.PermittedRoles);

          if (userInOneOfRoles(message.member, roles)) {
            sql.query(
              `Select * from Titles where DiscordID = ?`,
              [message.author.id],
              async (err, res) => {
                if (err)
                  return sendEmbed(
                    message.author,
                    "An error occurred updating title",
                    err.message
                  );

                if (!res[0]) {
                  await sql.query("INSERT INTO Titles(DiscordID) VALUES(?)", [
                    id
                  ]);
                }

                sql.query(
                  "Update Titles set Title = ? where DiscordID = ?",
                  [preset.Title, message.author.id],
                  err => {
                    if (err) return sendEmbed(message.author, err.message);

                    setUsersColor(message.author.id, preset.Color, false)
                      .then(() =>
                        sendEmbed(
                          message.author,
                          "Your special title has been set!",
                          `Title: ${preset.Title}\nColor: ${preset.Color}`
                        )
                      )
                      .catch(e =>
                        sendEmbed(
                          message.author,
                          "An error occurred updating title",
                          e
                        )
                      );
                  }
                );
              }
            );
          } else
            sendEmbed(
              message.author,
              "Error setting special title",
              "You are not allowed to use this preset."
            );
        }
      );
    }

    /**
     * Function to set the user its new title.
     * @param {string} id - Discord ID of the user
     * @param {string} title - Full title of the user including '::'
     * @param {string} [overridingUser] - The ID of the user overriding it.
     */
    function setUsersTitle(id, title, overridingUser) {
      return new Promise((resolve, reject) => {
        title = title.replace(/[^0-9a-z\!\-\?\.\,\'\"\#\@\/ ]/gi, "");
        if (title.length === 0)
          return reject(
            "After filtering out non-valid characters your title is not valid anymore."
          );

        let titles = title.split(/[::]+/);
        if (titles.length > 5)
          return reject(
            "AlphaConsole does not support more than 5 rotations in your custom title. Please try again."
          );

        if (title.includes("\n"))
          return reject(
            "Your title cannot be multiple lines. It must be in 1 line."
          );

        //Blacklist checker, only if not being overrided
        if (!overridingUser && !message.member.isAdmin) {
          sql.query(
            "Select * from TitleReports where DiscordID = ? AND Title = ? AND Permitted = 1",
            [id.trim(), title],
            (err, res) => {
              if (err) return reject(err.message);
              if (res[0]) return finish();

              let exemptWords = [];
              if (message.member.isModerator)
                exemptWords = ["alphaconsole", "mod", "moderator", "staff"];
              else if (message.member.isSupport)
                exemptWords = ["alphaconsole", "support", "staff"];
              else if (message.member.isCH)
                exemptWords = ["alphaconsole", "community helper"];
              else if (message.member.roles.has(serverInfo.roles.legacy))
                exemptWords = ["alphaconsole", "legacy"];

              console.log();
              sql.query(
                "Select * from Config where Config = 'blacklistedWords'",
                [],
                (err, rows) => {
                  if (err) return console.log(err);
                  const thisBlacklist = rows
                    .map(r => r.Value1)
                    .filter(r => !exemptWords.includes(r.toLowerCase()));

                  let blacklistedTitles = titles.filter(t =>
                    thisBlacklist.find(b =>
                      t.toLowerCase().includes(b.toLowerCase())
                    )
                  );
                  if (blacklistedTitles.length > 0) {
                    saveTitleToLog(id, title, true, sql);
                    return reject(
                      "Your custom title was not set because it contained a blacklisted phrase. \n" +
                        "AlphaConsole does not allow faking of real titles. If you continue to try and bypass the blacklist system, it could result in loss of access to our custom titles."
                    );
                  }

                  finish();
                }
              );
            }
          );
        } else finish();

        function finish() {
          sql.query(
            `Select * from Titles where DiscordID = ?`,
            [id.trim()],
            async (err, res) => {
              if (err) return reject(err.message);

              const user = res[0];
              if (!user) {
                await sql.query("INSERT INTO Titles(DiscordID) VALUES(?)", [
                  id
                ]);
              }
              sql.query(
                "Update Titles set Title = ? where DiscordID = ?",
                [title.trim(), id.trim()],
                err => {
                  if (err) return reject(err.message);
                  if (!overridingUser)
                    saveTitleToLog(id.trim(), title.trim(), false, sql);
                  else {
                    const embedlog = new Discord.MessageEmbed()
                      .setColor([255, 255, 0])
                      .setAuthor(
                        "Custom title override",
                        client.user.displayAvatarURL()
                      )
                      .addField("Old Title", user ? user.Title : "None..")
                      .addField("New Title", title.trim())
                      .addField(
                        "Title of",
                        `**<@${id.trim()}>** (${id.trim()})`
                      )
                      .addField("Edited by", `<@${overridingUser}>`)
                      .setTimestamp();
                    client.guilds
                      .get(serverInfo.guildId)
                      .channels.get(serverInfo.channels.aclog)
                      .send(embedlog);
                    return resolve(
                      `Updated title of <@${id.trim()}> to \`${title.trim()}\`!`
                    );
                  }

                  sql.query(
                    "SELECT * FROM Players WHERE DiscordID = ?",
                    [id.trim()],
                    (err, rows) => {
                      if (!err && rows.length === 0)
                        sendEmbed(
                          message.author,
                          "No steam account linked yet",
                          `Be sure to link your steam at <http://www.alphaconsole.net/auth/index.php> otherwise you won't see it ingame!`
                        );
                    }
                  );

                  resolve(title.trim());
                }
              );
            }
          );
        }
      });
    }

    /**
     * Function to set the user its new color.
     * @param {string} id - Discord ID of the user
     * @param {string} color - Full color of the user including '::'
     * @param {boolean} glow - "True" if the color is for Glow field
     * @param {string} [overridingUser] - The ID of the user overriding it.
     */
    function setUsersColor(id, color, glow, overridingUser) {
      return new Promise((resolve, reject) => {
        let colors = color.split(/[::]+/);
        if (colors.length > 5)
          return reject(
            "AlphaConsole does not support more than 5 rotations in your custom title color. Please try again."
          );

        if (colors.includes("\n"))
          return reject(
            "Your color value cannot be multiple lines. It must be in 1 line."
          );

        if (presets[color.trim()]) {
          return sql.query(
            `Select * from Titles where DiscordID = ?`,
            [id.trim()],
            async (err, res) => {
              if (err) return reject(err.message);
              const user = res[0];

              if (!res[0]) {
                await sql.query("INSERT INTO Titles(DiscordID) VALUES(?)", [
                  id
                ]);
              }

              sql.query(
                `Update Titles set Color = ?, GlowColor = ? where DiscordID = ?`,
                [
                  presets[color.trim()].color,
                  presets[color.trim()].glow,
                  id.trim()
                ],
                err => {
                  if (err) return reject(err.message);
                  if (overridingUser) {
                    const embedlog = new Discord.MessageEmbed()
                      .setColor([255, 255, 0])
                      .setAuthor(
                        "Custom title override",
                        client.user.displayAvatarURL()
                      )
                      .addField("Old Color", user ? user.Title : "None..")
                      .addField("New Color", title.trim())
                      .addField(
                        "Title of",
                        `**<@${id.trim()}>** (${id.trim()})`
                      )
                      .addField("Edited by", `<@${overridingUser}>`)
                      .setTimestamp();
                    client.guilds
                      .get(serverInfo.guildId)
                      .channels.get(serverInfo.channels.aclog)
                      .send(embedlog);
                    return resolve(
                      `Updated title color of <@${id.trim()}> to \`${color.trim()}\`!`
                    );
                  }
                  resolve(presets[color.trim()].name);
                }
              );
            }
          );
        }

        //Check if color(s) are all valid.
        const hex = /\b[0-9A-F]{6}\b/gi;
        safeColor = colors
          .filter(c => c.match(hex) && c.match(hex).length === 1)
          .map(c => c.match(hex)[0])
          .join("::");
        if (safeColor.length < 5)
          return reject(
            "One of your colors is not in a hex format.\nYou need to fill in a hex value (Ex. `FFFFFF` or `FFFFFF::AAAAAA`)\nYou can find these values here: https://htmlcolorcodes.com/"
          );

        sql.query(
          `Select * from Titles where DiscordID = ?`,
          [id.trim()],
          async (err, res) => {
            if (err) return reject(err.message);
            const user = res[0];

            if (!res[0]) {
              await sql.query("INSERT INTO Titles(DiscordID) VALUES(?)", [id]);
            }

            sql.query(
              `Update Titles set ${
                glow ? "GlowColor" : "Color"
              } = ? where DiscordID = ?`,
              [safeColor.trim(), id.trim()],
              err => {
                if (err) return reject(err.message);
                if (overridingUser) {
                  const embedlog = new Discord.MessageEmbed()
                    .setColor([255, 255, 0])
                    .setAuthor(
                      "Custom title override",
                      client.user.displayAvatarURL()
                    )
                    .addField("Old Color", user ? user.Title : "None..")
                    .addField("New Color", safeColor.trim())
                    .addField("Title of", `**<@${id.trim()}>** (${id.trim()})`)
                    .addField("Edited by", `<@${overridingUser}>`)
                    .setTimestamp();
                  client.guilds
                    .get(serverInfo.guildId)
                    .channels.get(serverInfo.channels.aclog)
                    .send(embedlog);
                  return resolve(
                    `Updated title color of <@${id.trim()}> to \`${safeColor.trim()}\`!`
                  );
                }
                resolve(safeColor.trim());
              }
            );
          }
        );
      });
    }
  }
};

/**
 * ? Helpers
 */
function createTitle(args, ind) {
  let title = "";
  for (let i = ind; i < args.length; i++) title += args[i] + " ";

  return title.trim();
}

function saveTitleToLog(discordid, title, blacklisted, sql) {
  sql.query(
    "Insert into TitlesLog(DiscordID, Title, Blacklisted, Date) VALUES(?, ?, ?, ?)",
    [discordid, title, blacklisted ? 1 : 0, new Date().getTime()]
  );
}

function userInOneOfRoles(member, roles) {
  let inRole = false;
  if (member.isAdmin) return true;

  for (let i = 0; i < roles.length; i++) {
    if (member.roles.has(roles[i])) inRole = true;
  }

  return inRole;
}
