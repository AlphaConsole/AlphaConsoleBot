/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('misc', {
		ID: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		value: {
			type: DataTypes.TEXT,
			allowNull: true
		}
	}, {
		tableName: 'misc',
		timestamps: false
	});
};
