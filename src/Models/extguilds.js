/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('extguilds', {
		ID: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		GuildID: {
			type: DataTypes.STRING(25),
			allowNull: false,
			unique: true
		},
		GuildOwnerID: {
			type: DataTypes.STRING(25),
			allowNull: false
		},
		ChannelID: {
			type: DataTypes.STRING(25),
			allowNull: true
		},
		Notes: {
			type: DataTypes.TEXT,
			allowNull: true
		}
	}, {
		tableName: 'extguilds',
		timestamps: false
	});
};
