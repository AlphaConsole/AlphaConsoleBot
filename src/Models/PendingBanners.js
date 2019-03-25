/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('PendingBanners', {
		ID: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		RequesterDiscordID: {
			type: DataTypes.STRING(25),
			allowNull: false
		},
		ImageLink: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		Accepted: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: '0'
		},
		StaffID: {
			type: DataTypes.STRING(25),
			allowNull: true
		}
	}, {
		tableName: 'PendingBanners',
		timestamps: false
	});
};
