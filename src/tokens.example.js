module.exports = {
    token: '', // Discord Bot Token

    // Database connection information
    dbHost: '',
    dbUser: '',
    dbPass: '',
    dbName: '',

    // API Calls towards our Title backend system
    Password   : "",
    CheckdbURL : "",
    RatingURL  : "",
    SetTitleURL: "",
    SetBetaURL : "",

    // Steam API
    SteamAPIURL: "",
    SteamAPIKey: ""
}


/**
 * ! Database tables.
 * 
 * ? In case you are copying this bot for functionalities
 * ? you'll need some tables, maybe not all of them but some of them.
 * ? If you do this be sure your database info at module.exports is linked.
 */

/*

*  Commands
CREATE TABLE `Commands` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Command` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `Response` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

* Config
CREATE TABLE `Config` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Config` varchar(45) NOT NULL,
  `Value1` mediumtext NOT NULL CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `Value2` mediumtext,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

* Logs
CREATE TABLE `Logs` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Action` varchar(50) NOT NULL,
  `Member` varchar(25) NOT NULL,
  `Moderator` varchar(25) NOT NULL,
  `Value` int(11) DEFAULT NULL,
  `Reason` varchar(500) DEFAULT NULL CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `Time` varchar(20) DEFAULT NULL,
  `ChannelID` varchar(25) DEFAULT NULL,
  `MessageID` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

* Members
CREATE TABLE `Members` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `DiscordID` varchar(25) NOT NULL,
  `Username` varchar(100) DEFAULT NULL CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `JoinedDate` varchar(20) DEFAULT NULL,
  `MutedUntil` varchar(20) DEFAULT NULL,
  `Warnings` int(11) DEFAULT '0',
  `TagWarnings` int(11) DEFAULT '0',
  `Suggestion` varchar(25) DEFAULT NULL,
  `Showcase` varchar(25) DEFAULT NULL,
  `Roles` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `DiscordID` (`DiscordID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

* Misc
CREATE TABLE `Misc` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `message` text,
  `value` text,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

* partners
CREATE TABLE `partners` (
  `id` varchar(25) NOT NULL,
  `type` varchar(100) DEFAULT NULL,
  `partner_name` varchar(100) DEFAULT NULL,
  `message_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `header_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `enabled` int(11) DEFAULT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

* partner_types
CREATE TABLE `partner_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(100) NOT NULL,
  `json_data` longtext NOT NULL  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

* Statuses
CREATE TABLE `Statuses` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `StatusType` varchar(20) DEFAULT NULL,
  `StatusText` varchar(200) DEFAULT NULL CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `Active` int(11) DEFAULT '0',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

* TitleReports
CREATE TABLE `TitleReports` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `DiscordID` varchar(25) DEFAULT NULL,
  `SteamID` varchar(25) DEFAULT NULL,
  `Title` varchar(100) DEFAULT NULL,
  `Color` varchar(20) DEFAULT NULL,
  `MessageID` varchar(25) DEFAULT NULL,
  `Fixed` int(11) DEFAULT '0',
  `Permitted` int(11) DEFAULT '0',
  `Reporter` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

*/