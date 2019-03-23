/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('members', {
		ID: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		DiscordID: {
			type: DataTypes.STRING(25),
			allowNull: false,
			unique: true
		},
		Username: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		JoinedDate: {
			type: DataTypes.STRING(20),
			allowNull: true
		},
		MutedUntil: {
			type: DataTypes.STRING(20),
			allowNull: true
		},
		Warnings: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: '0'
		},
		TagWarnings: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: '0'
		},
		Suggestion: {
			type: DataTypes.STRING(25),
			allowNull: true
		},
		Showcase: {
			type: DataTypes.STRING(25),
			allowNull: true
		},
		tempBeta: {
			type: DataTypes.STRING(25),
			allowNull: true
		},
		Roles: {
			type: DataTypes.STRING(500),
			allowNull: true
		},
		Banned: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		}
	}, {
		tableName: 'members',
		timestamps: false
	});
};
