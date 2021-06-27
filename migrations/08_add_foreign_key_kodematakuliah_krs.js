'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return Promise.resolve([
            queryInterface.sequelize.query("ALTER TABLE Krs ADD CONSTRAINT kodematakuliah_krs FOREIGN KEY (KodeMataKuliah) REFERENCES MataKuliah(KodeMataKuliah) ON DELETE RESTRICT ON UPDATE RESTRICT;"),
        ])
    },

    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return Promise.resolve([
            queryInterface.sequelize.query("ALTER TABLE Krs DROP FOREIGN KEY kodematakuliah_krs;")
        ]);
    }
}
