/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('statuses', {
		ID: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		StatusType: {
			type: DataTypes.STRING(20),
			allowNull: true
		},
		StatusText: {
			type: DataTypes.STRING(200),
			allowNull: true
		},
		Active: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: '0'
		}
	}, {
		tableName: 'statuses',
		timestamps: false
	});
};
