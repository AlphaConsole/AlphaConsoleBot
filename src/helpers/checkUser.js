/**
 *
 * @param {SQL Object} sql
 * @param {User Collection} user
 * @param {Function(err, user)} callback
 */

module.exports.run = (sql, user, callback) => {
  sql.query(
    `Select * from Members where DiscordID = ?;`,
    [user.id],
    (err, res) => {
      if (err) return callback(err, null);

      if (res.length === 0) {
        sql.query(
          `Insert Into Members(DiscordID, Username, JoinedDate) VALUES(?, ?, ?)`,
          [
            user.id,
            user.username.replace(/[^0-9a-z\!\-\?\.\,\'\"\#\@\/ ]/gi, ""),
            new Date().getTime()
          ],
          error => {
            if (error) {
              if (error.code === "ER_DUP_ENTRY")
                return callback(`Error: ${error}`, null);
              else return callback(`Error: ${error.code}`, null);
            }

            sql.query(
              `Select * from Members where DiscordID = ?;`,
              [user.id],
              (errr, ress) => {
                if (errr) return callback(errr, null);

                return callback(null, ress);
              }
            );
          }
        );
      } else {
        return callback(null, res[0]);
      }
    }
  );
};
