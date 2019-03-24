const config = require("../../config");

module.exports = GuildMember => {
  return class Member extends GuildMember {
    constructor(client, data, guild) {
      super(client, data, guild);
      this.checkRoles();
    }

    checkRoles() {
      if (!config.roles) return;

      this.is = {};

      for (let role in config.roles) {
        if (config.roles.hasOwnProperty(role))
          this.is[role] = this.roles.has(config.roles[role]);
      }
    }

    async fetchInfo() {
      const client = this.client;

      return (this.info = await client.models.Members.findOne({
        where: {
          DiscordID: this.id
        },
        include: [
          { model: client.models.Logs, as: "cases" },
          { model: client.models.Players, as: "steams" },
          { model: client.models.Titles, as: "titleInfo" }
        ]
      }));
    }
  };
};
