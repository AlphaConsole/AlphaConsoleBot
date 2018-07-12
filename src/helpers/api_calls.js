const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');

module.exports.run = (client, serverInfo, config, checkStatus) => {
    const { sql, keys } = config;
    let app = express();

    app.use(bodyParser.urlencoded({ extended: true }))

    app.get('/config', (req, res) => {
        if (!(req.query.key && req.query.key === keys.Password)) {
            res.status(401);
            return res.json({ error: true, message: "Not authorized" })
        }

        console.log("Updating config values")

        let temp = {};

        config.sql.query("SELECT * FROM Config", (error, result) => {
            if (error) return console.error(error);
    
            for (let i = 0; i < result.length; i++) {
                if (config[result[i].Config]) {
                    if (!temp[result[i].Config]) {
                        temp[result[i].Config] = true;
                        config[result[i].Config] = [];
                        console.log(result[i].Config + " cleared")
                    }

                    if (result[i].Config === "autoResponds") 
                        config[result[i].Config][result[i].Value1] = result[i].Value2
                    else 
                        config[result[i].Config].push(result[i].Value1.toLowerCase())
                    
                }
            }
        })

        res.status(200);
        return res.json({ error: false, message: "Config of bot has been updated!" })
    })

    app.listen(1337);
}