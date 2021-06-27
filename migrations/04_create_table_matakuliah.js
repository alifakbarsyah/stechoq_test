'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return queryInterface.createTable('MataKuliah',
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                KodeMataKuliah: {
                    type: Sequelize.STRING(100),
                    allowNull: true
                },
                Nama: {
                    type: Sequelize.STRING(255),
                    allowNull: true
                },
                Sks: {
                    type: Sequelize.INTEGER(5),
                    allowNull: true
                },
                KodeProgramStudi: {
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
                    queryInterface.addIndex('MataKuliah', ['id']),
                    queryInterface.addIndex('MataKuliah', ['KodeMataKuliah'])
                ]
            });
    },

    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return queryInterface.dropTable('MataKuliah');
    }
}