/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Config', {
		ID: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Config: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		Value1: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		Value2: {
			type: DataTypes.TEXT,
			allowNull: true
		}
	}, {
		tableName: 'Config',
		timestamps: false
	});
};
