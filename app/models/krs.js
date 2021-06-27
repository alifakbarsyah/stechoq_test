'use strict'
let obj = (objDB, db, rootpath) => {
    const tbl = require(rootpath + '/config/tables.json')
    const cst = require(rootpath + '/config/const.json')
    const config = require(rootpath + "/config/config.json")
    const fn = {}
    let moment = require('moment')

    fn.getKrsId = async (id) => {
        let sql =
            " SELECT krs.id, mhs.Nim, mhs.Nama as NamaMahasiswa, mhs.TahunMasuk, mhs.KodeProgramStudi, psd.Nama as NamaProgramStudi,  mkl.KodeMataKuliah, mkl.Nama as NamaMataKuliah, mkl.Sks, krs.CreatedDate " +
            " FROM " + tbl.Krs + " krs " +
            " INNER JOIN " + tbl.Mahasiswa + " mhs " +
            " ON krs.nim = mhs.nim " + " " +
            " INNER JOIN " + tbl.MataKuliah + " mkl " +
            " ON krs.KodeMataKuliah = mkl.KodeMataKuliah " + " " +
            " INNER JOIN " + tbl.ProgramStudi + " psd " +
            " ON mkl.KodeProgramStudi = psd.KodeProgramStudi " + " " +
            " WHERE krs.id = ? "

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

    fn.getKodeProgramStudiNim = async (nim) => {
        // prepare sql query
        let sql = "SELECT KodeProgramStudi FROM " + tbl.Mahasiswa + " WHERE Nim = ? LIMIT 1"

        let [rows] = await db.query(sql, [nim])
        return rows
    }

    fn.getKodeProgramStudiKodeMataKuliah = async (kode_mata_kuliah) => {
        // prepare sql query
        let sql = "SELECT KodeProgramStudi FROM " + tbl.MataKuliah + " WHERE KodeMataKuliah = ? LIMIT 1"

        let [rows] = await db.query(sql, [kode_mata_kuliah])
        return rows
    }

    fn.getDupKrs = async (nim,kode_mata_kuliah) => {
        // prepare sql query
        let sql = "SELECT * FROM " + tbl.Krs + " WHERE Nim = ? AND KodeMataKuliah = ? LIMIT 1"

        let [rows] = await db.query(sql, [nim,kode_mata_kuliah])
        return rows
    }

    fn.insertKrs = async (data) => {
        let res = await objDB.insert(db, tbl.Krs, data)
        return res.insertId
    }

    fn.updateKrs = async (id, data) => {
        let where = {'cond': 'id = ?', 'bind': [id]}
        return await objDB.update(db, tbl.Krs, where, data)
    }

    fn.deleteKrs = async (id) => {
        let where = {"cond": "id = ?", "bind": [id]}
        return await objDB.delete(db, tbl.Krs, where)
    }

    fn.getPagingKrs = async (where = '', data = [], order_what = " krs.id ", order_by = " ASC ", page_no = 0, no_per_page = 0) => {
        let paging = loadLib('sanitize').pagingNumber(page_no, no_per_page)
        let sql = " SELECT krs.id, mhs.Nim, mhs.Nama as NamaMahasiswa, mhs.TahunMasuk, mhs.KodeProgramStudi, psd.Nama as NamaProgramStudi,  mkl.KodeMataKuliah, mkl.Nama as NamaMataKuliah, mkl.Sks, krs.CreatedDate " +
                  " FROM " + tbl.Krs + " krs " +
                  " INNER JOIN " + tbl.Mahasiswa + " mhs " +
                  " ON krs.nim = mhs.nim " + " " +
                  " INNER JOIN " + tbl.MataKuliah + " mkl " +
                  " ON krs.KodeMataKuliah = mkl.KodeMataKuliah " + " " +
                  " INNER JOIN " + tbl.ProgramStudi + " psd " +
                  " ON mkl.KodeProgramStudi = psd.KodeProgramStudi " + " " +
                  " WHERE 1=1 " + where + " ORDER BY " + order_what + " " + order_by

        let result = await objDB.getPaging(db, sql, data, order_what, order_by, paging.page_no, paging.no_per_page)

        return result
    }

    fn.getAllKrs = async (where = '', data = [], order_what = " krs.id ", order_by = " ASC ", limit = 0) => {
        let sql = " SELECT krs.id, mhs.Nim, mhs.Nama as NamaMahasiswa, mhs.TahunMasuk, mhs.KodeProgramStudi, psd.Nama as NamaProgramStudi,  mkl.KodeMataKuliah, mkl.Nama as NamaMataKuliah, mkl.Sks, krs.CreatedDate " +
                  " FROM " + tbl.Krs + " krs " +
                  " INNER JOIN " + tbl.Mahasiswa + " mhs " +
                  " ON krs.nim = mhs.nim " + " " +
                  " INNER JOIN " + tbl.MataKuliah + " mkl " +
                  " ON krs.KodeMataKuliah = mkl.KodeMataKuliah " + " " +
                  " INNER JOIN " + tbl.ProgramStudi + " psd " +
                  " ON mkl.KodeProgramStudi = psd.KodeProgramStudi " + " " +
                  " WHERE 1=1 " + where + " ORDER BY " + order_what + " " + order_by

        let result = await objDB.getAll(db, sql, data, limit)
        return result
    }

    
    return fn
}

module.exports = obj
