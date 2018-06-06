/**
 * ! Ready event file
 * 
 * ? This is activated whenever the bot started & is ready to serve.
 * ? It'll fetch data from the database and save it in the config to prevent more db calls
 */
let fs = require('fs');

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

    /**
     * ! Help command setup
     * 
     * ? On bot start we'll fetch all the files from cmds.
     * ? Every single file includes a title & details. We'll be fetching those to make a fast a smooth help
     */

    fs.readdir('./src/cmds', (err, files) => {
        for (let i = 0; i < files.length; i++) {
            let info = require(`../cmds/${files[i]}`);
            if (!info.title || !info.details) continue;
            for (let ii = 0; ii < info.details.length; ii++) {
                config.commands.push({
                    title      : info.title,
                    perms      : info.details[ii].perms,
                    command    : info.details[ii].command,
                    description: info.details[ii].description
                })
            }
        }
    })
}