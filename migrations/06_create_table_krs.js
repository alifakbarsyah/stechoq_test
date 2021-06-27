'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return queryInterface.createTable('Krs',
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                Nim: {
                    type: Sequelize.INTEGER(100),
                    allowNull: true
                },
                KodeMataKuliah: {
                    type: Sequelize.STRING(100),
                    allowNull: true,
                },
                CreatedDate: {
                    type: Sequelize.DATE,
                    allowNull: true
                },
                UpdatedDate: {
                    type: Sequelize.DATE,
                    allowNull: true
                }
            }, {
                freezeTableName: true,
                engine: 'InnoDB',
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci'
            })
            .then(function () {
                return [
                    queryInterface.addIndex('Krs', ['id'])
                ]
            });
    },

    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return queryInterface.dropTable('Krs');
    }
}