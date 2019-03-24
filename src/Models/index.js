const Sequelize = require("sequelize");
const config = require("../../config");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const client = require("../index");

if (!config.database) return (module.exports = null);

const sequelize = new Sequelize(
  config.database.database,
  config.database.user,
  config.database.pass,
  {
    host: config.database.host,
    dialect: "mysql",
    define: {
      timestamps: false
    },
    logging: false
  }
);

module.exports = loadModels();

async function loadModels() {
  return new Promise(async resolve => {
    let modelList = {};
    const models = await readdir("./src/Models/");
    models.forEach(f => {
      if (!f.endsWith(".js") || f === "index.js") return;

      try {
        const modelName = f.split(".")[0];
        modelList[modelName] = require(`./${modelName}`)(
          sequelize,
          Sequelize.DataTypes
        );
      } catch (e) {
        client.logError(`Unable to load model ${f}: ${e}`);
      }
    });

    /**
     * ? Table relations
     */

    //* Logs table
    modelList.Logs.belongsTo(modelList.Members, {
      foreignKey: "Member",
      targetKey: "DiscordID",
      as: "user"
    });
    modelList.Logs.belongsTo(modelList.Members, {
      foreignKey: "Moderator",
      targetKey: "DiscordID",
      as: "staff"
    });

    //* Members table
    modelList.Members.hasMany(modelList.Logs, {
      foreignKey: "Member",
      sourceKey: "DiscordID",
      as: "cases"
    });
    modelList.Members.hasMany(modelList.Players, {
      foreignKey: "DiscordID",
      sourceKey: "DiscordID",
      as: "steams"
    });
    modelList.Members.hasOne(modelList.Titles, {
      foreignKey: "DiscordID",
      sourceKey: "DiscordID",
      as: "titleInfo"
    });
    modelList.Members.hasMany(modelList.TitlesLog, {
      foreignKey: "DiscordID",
      sourceKey: "DiscordID",
      as: "titlesLog"
    });

    resolve(modelList);
  });
}
