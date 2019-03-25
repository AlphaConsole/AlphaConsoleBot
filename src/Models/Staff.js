/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Staff', {
		ID: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Username: {
			type: DataTypes.STRING(50),
			allowNull: false
		},
		DiscordID: {
			type: DataTypes.STRING(25),
			allowNull: false
		},
		Access_info: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		Role: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		Avatar: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		Name: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		Age: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		Country: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		Steam: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		Twitch: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		Youtube: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		Twitter: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		DiscordTag: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		LastSeen: {
			type: DataTypes.BIGINT,
			allowNull: false
		}
	}, {
		tableName: 'Staff',
		timestamps: false
	});
};
