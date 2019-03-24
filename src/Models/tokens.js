/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Tokens', {
		ID: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Token: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true
		},
		DiscordID: {
			type: DataTypes.STRING(25),
			allowNull: false
		},
		Type: {
			type: DataTypes.ENUM('ui','api'),
			allowNull: false
		},
		Valid_until: {
			type: DataTypes.DATE,
			allowNull: true
		}
	}, {
		tableName: 'Tokens',
		timestamps: false
	});
};
