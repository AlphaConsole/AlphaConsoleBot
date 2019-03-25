/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('TitlesLog', {
		ID: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		DiscordID: {
			type: DataTypes.STRING(25),
			allowNull: false
		},
		Title: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		Blacklisted: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0'
		},
		Date: {
			type: DataTypes.BIGINT,
			allowNull: false
		}
	}, {
		tableName: 'TitlesLog',
		timestamps: false
	});
};
