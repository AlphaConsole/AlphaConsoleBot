AlphaConsole Discord Bot
===================


This is the official Discord bot for the [AlphaConsole Discord Server](https://discordapp.com/invite/alphaconsole). 
This bot serves the over 100k members we currently have in our Discord (2nd largest  worldwide).

----------


What is AlphaConsole?
-------------
AlphaConsole is the largest 3rd party mod for the popular PC game Rocket League with over 100k users.

You can check out our site [here.](http://www.alphaconsole.net)

Unfortunately due to the nature of the program, most of AlphaConsole cannot be open source excluding the Discord bot in this repo.


----------
### So what is this bot?

This bot is a re-write of our old C# Discord bot. It serves our server in many different ways. 

##### For our users:

 - Allows them to set a custom title in game
 
   ![](https://cdn.discordapp.com/attachments/328236864534216704/381109222563250176/EveryTitleColor.gif)
 - Responds automatically to commonly asked questions

##### For the AlphaConsole Staff
The bot helps the AlphaConsole staff with lots of different things. 
Some examples would be user database lookups, auto spam/swear word protection, custom  commands, warning, timed mutes, bans, kicks & way more than I want to list.

For a breakdown of all commands you can go to `src\cmds` 
For a breakdown of event calls you can go to `src\events`

### Contributing 

If you are interested in contributing to this project it will require some setup. 

#### Tokens
You will need to create a `tokens.js` file in `src/` file that looks like [this](https://gist.github.com/HaydenMeloche/88ff8b1687a13633d2c0de87c0caea73) and fill in a Discord API key which can be generated from [here.](https://discordapp.com/developers/applications/me)

Due to security reasons the rest of `tokens.js` must be blank otherwise people could mess with our database (meaning you can't use some of the bots functionality like `!set title`).

#### ServerInfo

`serverInfo.js` contains all the channel ids. This may or may not need to be updated depending on what you are working on.

#### Database

This bot writes a lot into a SQLite database. A blank default one can be downloaded from here


### Questions?

Feel free to message me on Discord, my ID is

<img src="https://i.imgur.com/wloHJJi.png" width="20%">

----------

![enter image description here](https://pbs.twimg.com/profile_banners/882574441494065152/1510692080/1500x500)
