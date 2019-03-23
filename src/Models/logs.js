/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('logs', {
		ID: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Action: {
			type: DataTypes.STRING(50),
			allowNull: false
		},
		Member: {
			type: DataTypes.STRING(25),
			allowNull: false
		},
		Moderator: {
			type: DataTypes.STRING(25),
			allowNull: false
		},
		Value: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		Reason: {
			type: DataTypes.STRING(500),
			allowNull: true
		},
		Time: {
			type: DataTypes.STRING(20),
			allowNull: true
		},
		ChannelID: {
			type: DataTypes.STRING(25),
			allowNull: true
		},
		MessageID: {
			type: DataTypes.STRING(25),
			allowNull: true
		}
	}, {
		tableName: 'logs',
		timestamps: false
	});
};
