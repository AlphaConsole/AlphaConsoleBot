/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Commands', {
		ID: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Command: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		Response: {
			type: DataTypes.TEXT,
			allowNull: true
		}
	}, {
		tableName: 'Commands',
		timestamps: false
	});
};
