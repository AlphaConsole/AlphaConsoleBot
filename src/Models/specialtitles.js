/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('SpecialTitles', {
		Title: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		Color: {
			type: DataTypes.STRING(20),
			allowNull: false
		},
		PermittedRoles: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		ID: {
			type: DataTypes.STRING(25),
			allowNull: false
		}
	}, {
		tableName: 'SpecialTitles',
		timestamps: false
	});
};
