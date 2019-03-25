/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Banners', {
		ID: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Author: {
			type: DataTypes.STRING(30),
			allowNull: false
		},
		Name: {
			type: DataTypes.STRING(20),
			allowNull: false
		},
		Path: {
			type: DataTypes.STRING(50),
			allowNull: false
		}
	}, {
		tableName: 'Banners',
		timestamps: false
	});
};
