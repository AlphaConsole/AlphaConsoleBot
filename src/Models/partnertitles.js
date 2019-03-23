/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('partnertitles', {
		identifier: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Guild: {
			type: DataTypes.STRING(25),
			allowNull: false
		},
		Title: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		Color: {
			type: DataTypes.STRING(20),
			allowNull: false
		},
		GlowColor: {
			type: DataTypes.STRING(25),
			allowNull: false
		},
		PermittedRoles: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		ID: {
			type: DataTypes.STRING(200),
			allowNull: false
		}
	}, {
		tableName: 'partnertitles',
		timestamps: false
	});
};
