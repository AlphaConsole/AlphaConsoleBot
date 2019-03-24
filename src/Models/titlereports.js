/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('TitleReports', {
		ID: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		DiscordID: {
			type: DataTypes.STRING(25),
			allowNull: true
		},
		SteamID: {
			type: DataTypes.STRING(25),
			allowNull: true
		},
		Title: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		Color: {
			type: DataTypes.STRING(25),
			allowNull: true
		},
		MessageID: {
			type: DataTypes.STRING(25),
			allowNull: true
		},
		Fixed: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: '0'
		},
		Permitted: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: '0'
		},
		Reporter: {
			type: DataTypes.STRING(25),
			allowNull: true
		},
		Reason: {
			type: DataTypes.TEXT,
			allowNull: true
		}
	}, {
		tableName: 'TitleReports',
		timestamps: false
	});
};
