/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('titles', {
		DiscordID: {
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
			allowNull: true
		},
		GlowColor: {
			type: DataTypes.STRING(60),
			allowNull: true
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
		tableName: 'titles',
		timestamps: false
	});
};
