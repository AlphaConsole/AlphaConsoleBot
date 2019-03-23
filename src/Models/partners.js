/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('partners', {
		identifier: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		id: {
			type: DataTypes.STRING(25),
			allowNull: false
		},
		type: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		partner_name: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		message_data: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		header_data: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		enabled: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		}
	}, {
		tableName: 'partners',
		timestamps: false
	});
};
