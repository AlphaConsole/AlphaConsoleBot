const config = require("../../config");

module.exports = TextChannel => {
  return class Channel extends TextChannel {
    constructor(guild, data) {
      super(guild, data);
      this.checkChannel();
    }

    checkChannel() {
      if (!config.channels) return;

      this.is = {};

      for (let channel in config.channels) {
        if (config.channels.hasOwnProperty(channel))
          this.is[channel] = config.channels[channel] === this.id;
      }
    }
  };
};
