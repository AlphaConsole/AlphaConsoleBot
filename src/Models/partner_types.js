/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('partner_types', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		type: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		json_data: {
			type: DataTypes.TEXT,
			allowNull: false
		}
	}, {
		tableName: 'partner_types',
		timestamps: false
	});
};
