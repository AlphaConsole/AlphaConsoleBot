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
  };
};
