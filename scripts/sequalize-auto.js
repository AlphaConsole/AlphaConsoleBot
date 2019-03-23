const SequelizeAuto = require("sequelize-auto");
const config = require("../config");
const auto = new SequelizeAuto(
  config.database.database,
  config.database.user,
  config.database.pass,
  {
    host: config.database.host,
    dialect: "mysql",
    additional: {
      timestamps: false
    },
    directory: "src/Models"
  }
);

auto.run(function(err) {
  if (err) throw err;

  console.log(auto.tables); // table list
});
