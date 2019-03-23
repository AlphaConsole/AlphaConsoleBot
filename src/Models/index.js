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
    }
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
    resolve(modelList);
  });
}
