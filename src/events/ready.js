/**
 * ! Ready event file
 * 
 * ? This is activated whenever the bot started & is ready to serve.
 * ? It'll fetch data from the database and save it in the config to prevent more db calls
 */

module.exports.run = (client, serverInfo, config) => {
    console.log("AlphaConsole Bot logged in and ready.");

    /**
     * ! Table checks and creation
     * 
     * ? Checking if the required tables exist.
     * ? If not automatically create them
     * 
     * ? If they do exist. Use them if necessary.
     */

    //* Config table
    config.sql.query("SHOW TABLES LIKE 'Config'", [], (err, res) => {
        if (err) return console.log(err);

        if (res.length === 0) {
            console.log("MESSAGE || Table 'Config' not found. Creating one now...");
            config.sql.query('CREATE TABLE `pollieah_ac`.`Config` (' + 
                '`ID` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,' + 
                '`Config` VARCHAR(45) NOT NULL,' + 
                '`Value1` MEDIUMTEXT NOT NULL,' + 
                '`Value2` MEDIUMTEXT NULL)');
            console.log("MESSAGE || Table 'Config' created.");
        } else {
            config.sql.query("SELECT * FROM Config", (error, result) => {
                for (let i = 0; i < result.length; i++) {
                    if (config[result[i].Config]) {
                        if (result[i].Config === "autoResponds") 
                            config[result[i].Config][result[i].Value1] = result[i].Value2
                        else 
                            config[result[i].Config].push(result[i].Value1)
                        
                    }
                }
            })
        }
    })
}