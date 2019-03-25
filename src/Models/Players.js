/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Players', {
		DiscordID: {
			type: DataTypes.STRING(25),
			allowNull: true
		},
		SteamID: {
			type: DataTypes.STRING(25),
			allowNull: false,
			primaryKey: true
		},
		Title: {
			type: DataTypes.STRING(125),
			allowNull: true
		},
		Color: {
			type: DataTypes.STRING(60),
			allowNull: false,
			defaultValue: '1'
		},
		GlowColor: {
			type: DataTypes.STRING(60),
			allowNull: true
		},
		LastSeen: {
			type: DataTypes.BIGINT,
			allowNull: true
		},
		BetaUntil: {
			type: DataTypes.BIGINT,
			allowNull: true
		},
		GoodReports: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: '0'
		},
		BadReports: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: '0'
		},
		Banner: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		BannerAccepted: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0'
		}
	}, {
		tableName: 'Players',
		timestamps: false
	});
};
