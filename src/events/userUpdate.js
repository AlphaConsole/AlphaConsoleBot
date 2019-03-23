module.exports.run = (client, serverInfo, config, user) => {
  require("../helpers/checkUser").run(config.sql, user, (err, u) => {
    if (err) return console.error(err);

    config.sql.query("Update Members set Username = ? where DiscordID = ?", [
      user.username.replace(/[^0-9a-z\!\-\?\.\,\'\"\#\@\/ ]/gi, ""),
      user.id
    ]);
  });
};
