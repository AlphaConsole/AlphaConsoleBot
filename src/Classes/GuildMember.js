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
      await this.checkUserExistence();

      return (this.info = await this.client.models.Members.findOne({
        where: {
          DiscordID: this.id
        },
        include: [
          { model: this.client.models.Logs, as: "cases" },
          { model: this.client.models.Players, as: "steams" },
          { model: this.client.models.Titles, as: "titleInfo" },
          { model: this.client.models.TitlesLog, as: "titlesLog" }
        ]
      }));
    }

    checkUserExistence() {
      return new Promise((resolve, reject) => {
        this.client.models.Members.findOne({
          where: {
            DiscordID: this.id
          }
        }).then(user => {
          if (user) return resolve(user);

          this.client.models.Members.create({
            DiscordID: this.id,
            Username: this.username.replace(
              /[^0-9a-z\!\-\?\.\,\'\"\#\@\/ ]/gi,
              ""
            ),
            JoinedDate: new Date().getTime()
          }).then(user => resolve(user));
        });
      });
    }

    async saveRoles() {
      await this.checkRoles();
      await this.checkUserExistence();

      const roles = this.roles
        .array()
        .filter(r => r.name !== "@everyone")
        .map(r => r.id)
        .join(" ");

      this.client.models.Members.update(
        {
          Roles: roles
        },
        {
          where: {
            DiscordID: this.id
          }
        }
      );
    }
  };
};
