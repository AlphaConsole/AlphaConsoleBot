const mysql = require('mysql');
const keys = require("../tokens");
const pool = mysql.createPool({
    host    : keys.dbHost,
    port    : 3306,
    user    : keys.dbUser,
    password: keys.dbPass,
    database: keys.dbName
});

// ? Database function to ensure we always have a connection but without having to repeat ourself in the code.
let sql = {};
sql.query = function(query, params, callback) {
  pool.getConnection(function(err, connection) {
    if(err) { 
      console.log(err); 
      if (callback) callback(true, null, null); 
      return; 
    }
    
    connection.query(query, params, function(err, results, fields) {
      connection.release(); // always put connection back in pool after last query
      if(err) { 
        console.log(err); 
        if (callback) callback(true, null, null); 
        return; 
      }
      if (callback) callback(false, results, fields);
    });
  });
};

module.exports = sql;