'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return Promise.resolve([
            queryInterface.sequelize.query("ALTER TABLE Krs ADD CONSTRAINT nim_krs FOREIGN KEY (Nim) REFERENCES Mahasiswa(Nim) ON DELETE RESTRICT ON UPDATE RESTRICT;"),
        ])
    },

    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return Promise.resolve([
            queryInterface.sequelize.query("ALTER TABLE Krs DROP FOREIGN KEY nim_krs;")
        ]);
    }
}
