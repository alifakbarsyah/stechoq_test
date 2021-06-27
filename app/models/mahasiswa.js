'use strict'
let obj = (objDB, db, rootpath) => {
    const tbl = require(rootpath + '/config/tables.json')
    const cst = require(rootpath + '/config/const.json')
    const config = require(rootpath + "/config/config.json")
    const fn = {}
    let moment = require('moment')

    fn.getMahasiswaId = async (id) => {
        let sql =
            " SELECT mhs.id, mhs.Nim, mhs.Nama, mhs.TempatLahir, mhs.TanggalLahir, mhs.TahunMasuk, mhs.KodeProgramStudi, psd.Nama as NamaProgramStudi, mhs.CreatedDate " +
            " FROM " + tbl.Mahasiswa + " mhs " +
            " INNER JOIN " + tbl.ProgramStudi + " psd " +
            " ON mhs.KodeProgramStudi = psd.KodeProgramStudi " + " " +
            " WHERE mhs.id = ? " +
            " LIMIT 1"

        let [rows] = await db.query(sql, [id])
        if(!isEmpty(rows)){
            return {
                'result': await camelizeKeys(rows)
            }
        } else {
            return {
                'result': {}
            }
        }
    }

    fn.getDupNim = async (nim) => {
        // prepare sql query
        let sql = "SELECT * FROM " + tbl.Mahasiswa + " WHERE Nim = ? LIMIT 1"

        let [rows] = await db.query(sql, [nim])
        return rows
    }

    fn.insertMahasiswa = async (data) => {
        let res = await objDB.insert(db, tbl.Mahasiswa, data)
        return res.insertId
    }

    fn.updateMahasiswa = async (id, data) => {
        let where = {'cond': 'id = ?', 'bind': [id]}
        return await objDB.update(db, tbl.Mahasiswa, where, data)
    }

    fn.deleteMahasiswa = async (id) => {
        let where = {"cond": "id = ?", "bind": [id]}
        return await objDB.delete(db, tbl.Mahasiswa, where)
    }

    fn.getPagingMahasiswa = async (where = '', data = [], order_what = " mhs.id ", order_by = " ASC ", page_no = 0, no_per_page = 0) => {
        let paging = loadLib('sanitize').pagingNumber(page_no, no_per_page)
        let sql = " SELECT mhs.id, mhs.Nim, mhs.Nama, mhs.TempatLahir, mhs.TanggalLahir, mhs.TahunMasuk, mhs.KodeProgramStudi, psd.Nama as NamaProgramStudi, mhs.CreatedDate " +
                  " FROM " + tbl.Mahasiswa + " mhs " +
                  " INNER JOIN " + tbl.ProgramStudi + " psd " +
                  " ON mhs.KodeProgramStudi = psd.KodeProgramStudi " + " " +
                  " WHERE 1=1 " + where + " ORDER BY " + order_what + " " + order_by

        let result = await objDB.getPaging(db, sql, data, order_what, order_by, paging.page_no, paging.no_per_page)

        return result
    }

    fn.getAllMahasiswa= async (where = '', data = [], order_what = " mhs.id ", order_by = " ASC ", limit = 0) => {
        let sql = " SELECT mhs.id, mhs.Nim, mhs.Nama, mhs.TempatLahir, mhs.TanggalLahir, mhs.TahunMasuk, mhs.KodeProgramStudi, psd.Nama as NamaProgramStudi, mhs.CreatedDate " +
                  " FROM " + tbl.Mahasiswa + " mhs " +
                  " INNER JOIN " + tbl.ProgramStudi + " psd " +
                  " ON mhs.KodeProgramStudi = psd.KodeProgramStudi " + " " +
                  " WHERE 1=1 " + where + " ORDER BY " + order_what + " " + order_by

        let result = await objDB.getAll(db, sql, data, limit)
        return result
    }

    fn.getPagingMahasiswaMataKuliah = async (where = '', data = [], order_what = " mhs.id ", order_by = " ASC ", page_no = 0, no_per_page = 0) => {
        let paging = loadLib('sanitize').pagingNumber(page_no, no_per_page)
        let sql = " SELECT mhs.id, mhs.Nim, mhs.Nama, mhs.TempatLahir, mhs.TanggalLahir, mhs.TahunMasuk, mhs.KodeProgramStudi, " +
                  " psd.Nama as NamaProgramStudi, SUM(CASE WHEN krs.KodeMataKuliah = mkl.KodeMataKuliah THEN mkl.Sks END) as JumlahSks ,mhs.CreatedDate " +
                  " FROM " + tbl.Mahasiswa + " mhs " +
                  " INNER JOIN " + tbl.ProgramStudi + " psd " +
                  " ON mhs.KodeProgramStudi = psd.KodeProgramStudi " + " " +
                  " INNER JOIN " + tbl.Krs + " krs " +
                  " ON mhs.Nim = krs.Nim " + " " +
                  " INNER JOIN " + tbl.MataKuliah + " mkl " +
                  " ON krs.KodeMataKuliah = mkl.KodeMataKuliah " + " " +
                  " WHERE 1=1 " + where + 
                  " GROUP BY  mhs.id, mhs.Nim, mhs.Nama, mhs.TempatLahir, mhs.TanggalLahir, mhs.TahunMasuk, mhs.KodeProgramStudi, psd.Nama,mhs.CreatedDate " +
                  " ORDER BY " + order_what + " " + order_by

        let result = await objDB.getPaging(db, sql, data, order_what, order_by, paging.page_no, paging.no_per_page)

        return result
    }
    

    fn.getAllMahasiswaMataKuliah= async (where = '', data = [], order_what = " mhs.id ", order_by = " ASC ", limit = 0) => {
        let sql = " SELECT mhs.id, mhs.Nim, mhs.Nama, mhs.TempatLahir, mhs.TanggalLahir, mhs.TahunMasuk, mhs.KodeProgramStudi, " +
                  " psd.Nama as NamaProgramStudi, SUM(CASE WHEN krs.KodeMataKuliah = mkl.KodeMataKuliah THEN mkl.Sks END) as JumlahSks ,mhs.CreatedDate " +
                  " FROM " + tbl.Mahasiswa + " mhs " +
                  " INNER JOIN " + tbl.ProgramStudi + " psd " +
                  " ON mhs.KodeProgramStudi = psd.KodeProgramStudi " + " " +
                  " INNER JOIN " + tbl.Krs + " krs " +
                  " ON mhs.Nim = krs.Nim " + " " +
                  " INNER JOIN " + tbl.MataKuliah + " mkl " +
                  " ON krs.KodeMataKuliah = mkl.KodeMataKuliah " + " " +
                  " WHERE 1=1 " + where + 
                  " GROUP BY  mhs.id, mhs.Nim, mhs.Nama, mhs.TempatLahir, mhs.TanggalLahir, mhs.TahunMasuk, mhs.KodeProgramStudi, psd.Nama,mhs.CreatedDate " +
                  " ORDER BY " + order_what + " " + order_by

        let result = await objDB.getAll(db, sql, data, limit)
        return result
    }
    
    return fn
}

module.exports = obj
