const config = require("../../config");

module.exports = User => {
  return class UserModified extends User {
    constructor(client, data) {
      super(client, data)
    }

    loadMember() {
      return new Promise((resolve, reject) => {
        this.client.guilds
          .get(config.guildId)
          .members.fetch(this.id)
          .then(member => resolve(member))
          .catch(() => {})
      })
    }
  }
}