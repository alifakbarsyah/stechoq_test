'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return Promise.resolve([
            queryInterface.sequelize.query("ALTER TABLE Matakuliah ADD CONSTRAINT kodeprogramstudi_matakuliah FOREIGN KEY (KodeProgramStudi) REFERENCES ProgramStudi(KodeProgramStudi) ON DELETE RESTRICT ON UPDATE RESTRICT;"),
        ])
    },

    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return Promise.resolve([
            queryInterface.sequelize.query("ALTER TABLE Matakuliah DROP FOREIGN KEY kodeprogramstudi_matakuliah;")
        ]);
    }
}
