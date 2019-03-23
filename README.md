# Discord.JS Boilerplate / Starter kit
This boilerplate tries to focus on Object Oriented Programming (OOP).
It extends the current classes that Discord.JS uses to whatever extend you please and
uses models to manage & handle the properties and methods for the database.  
  
All classes, models, events & commands are auto-loaded. So you only need to create 
the file in the correct directory with the correct name and start using it
straight away. More details can be found down below.

## Features
- Object Oriented Programming (OOP)
- Discord.JS master branch
- Clean logging with Chalk logging.
- Sequalize for database connection & model defining (MySQL already build in)
- Use of the Structure extends of Discord.JS's master branch
- Auto-load everything! (Classes, Models, Commands & Events)

## Installation
Clone the repository
```
git clone https://github.com/ThePjpollie/discord.js-boilerplate
```

Install dependencies
```
npm install
```

Copy the configuration file and edit it as you please  
The content of the config file will be explained down below
```
cp config.example.json config.json
```

Start the bot with nodemon (auto-reload)
```
npm start
```

Start the bot as production (without auto-reload)
```
npm run production
```

## Folder structure
```
Discord.JS-Boilerplate
├───scripts
│   └───sequalize-auto.js
├───src
│   ├───Classes
│   │   └───index.js
│   ├───Commands
│   ├───Events
│   ├───Models
│   │   └───index.js
│   ├───index.js
│   └───validation.js
├───.gitignore
├───config.json
├───package.json
└───package-lock.json
```

### Scripts
This folder includes all scripts that aren't directly used when the bot is live.  
This currently only includes `sequalize-auto.js` which copies your database
structure into models. These models will be found in `src/Models` and will be
autoloaded directly. You'll be able to access them through the client class with
`client.models.{filename}` (If model file is users.js it'll be `client.models.users`).  
This will be a sequalize model that you can extend, change and use. Commands and Events
include the client object without any new modification so you can use them straight away.

### Source (src)
This is the core folder where everything for the bot itself is related.

#### Classes
This includes all classes that you'll extend from discord.js. Make sure the filename
is the name of the class you want to extend (ex. `GuildMember.js` or `Guild.js` etc..).
That file should return a function, the parameter is the class itself.
So just make a new class and extends the class you just defined. The parameters of
the construct and super are the ones of discord.js and needs to be copied of from
[here](https://github.com/discordjs/discord.js/tree/master/src/structures)
(Select the class file and check the construct parameters there).  
  
This functionality is currently on the master branch of Discord.JS and documentation
of this can be found [here (Structures)](https://discord.js.org/#/docs/main/master/class/Structures)

#### Commands
This includes all the commands defined by the bot. A file should export an object
that includes a commands array and a run function. In the commands array you define
all commands that'll activate this file, so this could be more than 1 command per file.
Check out the `ping.js` command as example / reference

#### Events
This includes all the events of the Discord Bot. The file name represents the
event itself. So `message.js` will be fired on the message event etc...  
The file should just return a function. The first parameter is the `client` class, 
the rest are the parameters that the event returns. Check the 
[docs](https://discord.js.org/#/docs/main/master/class/Client) to check those.

#### Models
This includes all the models which are / should be connected to the database.
If you already have a database structure please refer to [scripts](#scripts)
to copy the models over. Otherwise the file should be a function with parameters
`(sequalize, datatypes)`, those needed to create a Sequalize model.

#### index.js
This is the core file that gets loaded when you start the bot. If you don't
need to modify anything there should be no need to change this file. This will
auto-load everyhing automatically.

#### validation.js
Not sure about this file yet. This file itself does nothing besides logging
information. For example if you don't have some configs set it'll let you know
in the console, this way you'll be aware.

### config.json
| Value             | Details                                      |
|:-------------     |:----------------------------------------------|
| name              | The name of the application, this is used in a couple places |
| botToken          | Self-explenatory, the token of your Discord Bot |
| prefix            | The prefix that your bot will use. For example `!` to have commands like `!help`
| prefixSeperated   | In case your prefix is not connected to your command. For example `!help` does not have its prefix seperated so this value would be `false`. If your commands are something like `bot? help` then your prefix is assumingly `bot?` and your prefixSeperated will be `true` |
| channels          | This is an object of channels, these channels get added to the TextChannel.is object. So imagine you have an object property `"general": "xxxxx"`. If you do a command in that channel then `message.channel.is.general` will be true, otherwise false. You are able to add as many as you would like. |
| roles             | Same idea as channels. This **only** works on GuildMember, not User object. So if you have `"admin": "xxxx"` and you do a command then `message.member.is.admin` will be true if he has that defined role. Otherwise it'll be false. |
| logChannel        | This will log every action such as bot start, logs you define with `client.log` or unhandeled errors in that specified channel.
| database          | These credentials are used to connect to the database. This is an object that takes `host`, `user`, `pass` & `database`.


## Contributions
Any help or ideas are welcome. Do you want to add a feature or fix something, 
clone this repo and make a pull request!  
  
Did you find a bug or would like to request a feature? Make an issue and I'll 
try my best keeping this up-to-date with new features and discord.js udpates.
