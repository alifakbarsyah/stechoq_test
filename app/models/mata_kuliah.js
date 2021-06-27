'use strict'
let obj = (objDB, db, rootpath) => {
    const tbl = require(rootpath + '/config/tables.json')
    const cst = require(rootpath + '/config/const.json')
    const config = require(rootpath + "/config/config.json")
    const fn = {}
    let moment = require('moment')

    fn.getMataKuliahId = async (id) => {
        let sql =
            " SELECT mkl.id, mkl.KodeMataKuliah, mkl.Nama as NamaMataKuliah, mkl.Sks,  mkl.KodeProgramStudi,  psd.Nama as NamaProgramStudi, mkl.CreatedDate " +
            " FROM " + tbl.MataKuliah + " mkl " +
            " INNER JOIN " + tbl.ProgramStudi + " psd " +
            " ON mkl.KodeProgramStudi = psd.KodeProgramStudi " + " " +
            " WHERE mkl.id = ? " +
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

    fn.getKodeMataKuliah = async (kode_mata_kuliah) => {
        // prepare sql query
        let sql = "SELECT * FROM " + tbl.MataKuliah + " WHERE KodeMataKuliah = ? LIMIT 1"

        let [rows] = await db.query(sql, [kode_mata_kuliah])
        return rows
    }

    fn.getMataKuliahKodeProgramStudi = async (kode_program_studi) => {
        // prepare sql query
        let sql = "SELECT id, KodeMataKuliah, Nama as NamaMataKuliah, Sks FROM " + tbl.MataKuliah + " WHERE KodeProgramStudi = ?"

        let result = await db.query(sql, [kode_program_studi])
        return result
    }

    fn.getMataKuliahNim = async (nim) => {
        // prepare sql query
        let sql = "SELECT mkl.id, mkl.KodeMataKuliah, mkl.Nama as NamaMataKuliah, mkl.Sks " + 
        " FROM " + tbl.Mahasiswa + " mhs " +
        " INNER JOIN " + tbl.Krs + " krs " +
        " ON mhs.nim = krs.nim " + " " +
        " INNER JOIN " + tbl.MataKuliah + " mkl " +
        " ON krs.KodeMataKuliah = mkl.KodeMataKuliah " + " " +
        " WHERE mhs.nim = ?"
        let result = await db.query(sql, [nim])
        return result
    }

    fn.insertMataKuliah = async (data) => {
        let res = await objDB.insert(db, tbl.MataKuliah, data)
        return res.insertId
    }

    fn.updateMataKuliah = async (id, data) => {
        let where = {'cond': 'id = ?', 'bind': [id]}
        return await objDB.update(db, tbl.MataKuliah, where, data)
    }

    fn.deleteMataKuliah = async (id) => {
        let where = {"cond": "id = ?", "bind": [id]}
        return await objDB.delete(db, tbl.MataKuliah, where)
    }

    fn.getPagingMataKuliah = async (where = '', data = [], order_what = " mkl.id ", order_by = " ASC ", page_no = 0, no_per_page = 0) => {
        let paging = loadLib('sanitize').pagingNumber(page_no, no_per_page)
        let sql = " SELECT mkl.id, mkl.KodeMataKuliah, mkl.Nama as NamaMataKuliah, mkl.Sks,  mkl.KodeProgramStudi,  psd.Nama as NamaProgramStudi, mkl.CreatedDate " +
                  " FROM " + tbl.MataKuliah + " mkl " +
                  " INNER JOIN " + tbl.ProgramStudi + " psd " +
                  " ON mkl.KodeProgramStudi = psd.KodeProgramStudi " + " " +
                  " WHERE 1=1 " + where + " ORDER BY " + order_what + " " + order_by

        let result = await objDB.getPaging(db, sql, data, order_what, order_by, paging.page_no, paging.no_per_page)

        return result
    }

    fn.getAllMataKuliah= async (where = '', data = [], order_what = " mkl.id ", order_by = " ASC ", limit = 0) => {
        let sql = " SELECT mkl.id, mkl.KodeMataKuliah, mkl.Nama as NamaMataKuliah, mkl.Sks,  mkl.KodeProgramStudi,  psd.Nama as NamaProgramStudi, mkl.CreatedDate " +
                  " FROM " + tbl.MataKuliah + " mkl " +
                  " INNER JOIN " + tbl.ProgramStudi + " psd " +
                  " ON mkl.KodeProgramStudi = psd.KodeProgramStudi " + " " +
                  " WHERE 1=1 " + where + " ORDER BY " + order_what + " " + order_by

        let result = await objDB.getAll(db, sql, data, limit)
        return result
    }

    
    return fn
}

module.exports = obj
