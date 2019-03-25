const config = require("../../config");

module.exports = Guild => {
  return class GuildModified extends Guild {
    constructor(client, data) {
      super(client, data);

      this.mainServer = this.id === config.guildId;
    }
  };
};
