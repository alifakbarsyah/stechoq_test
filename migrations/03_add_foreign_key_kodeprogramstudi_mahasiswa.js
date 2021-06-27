'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return Promise.resolve([
            queryInterface.sequelize.query("ALTER TABLE Mahasiswa ADD CONSTRAINT kodeprogramstudi_mahasiswa FOREIGN KEY (KodeProgramStudi) REFERENCES ProgramStudi(KodeProgramStudi) ON DELETE RESTRICT ON UPDATE RESTRICT;"),
        ])
    },

    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return Promise.resolve([
            queryInterface.sequelize.query("ALTER TABLE Mahasiswa DROP FOREIGN KEY kodeprogramstudi_mahasiswa;")
        ]);
    }
}
