'use strict'
let obj = (objDB, db, rootpath) => {
    const tbl = require(rootpath + '/config/tables.json')
    const cst = require(rootpath + '/config/const.json')
    const config = require(rootpath + "/config/config.json")
    const fn = {}
    let moment = require('moment')

    fn.getProgramStatusId = async (id) => {
        let sql =
            " SELECT * " +
            " FROM " + tbl.ProgramStudi + " " +
            " WHERE id = ? " +
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

    fn.getKodeProgramStudi = async (kode_program_studi) => {
        // prepare sql query
        let sql = "SELECT * FROM " + tbl.ProgramStudi + " WHERE KodeProgramStudi = ? LIMIT 1"

        let [rows] = await db.query(sql, [kode_program_studi])
        return rows
    }

    fn.getNamaProgramStudi = async (nama_program_studi) => {
        // prepare sql query
        let sql = "SELECT * FROM " + tbl.ProgramStudi + " WHERE Nama = ? LIMIT 1"

        let [rows] = await db.query(sql, [nama_program_studi])
        return rows
    }

    fn.insertProgramStudi = async (data) => {
        let res = await objDB.insert(db, tbl.ProgramStudi, data)
        return res.insertId
    }

    fn.updateProgramStudi = async (id, data) => {
        let where = {'cond': 'id = ?', 'bind': [id]}
        return await objDB.update(db, tbl.ProgramStudi, where, data)
    }

    fn.deleteProgramStudi = async (id) => {
        let where = {"cond": "id = ?", "bind": [id]}
        return await objDB.delete(db, tbl.ProgramStudi, where)
    }

    fn.getPagingProgramStudi = async (where = '', data = [], order_what = " id ", order_by = " ASC ", page_no = 0, no_per_page = 0) => {
        let paging = loadLib('sanitize').pagingNumber(page_no, no_per_page)
        let sql = " SELECT id, KodeProgramStudi, Nama as namaProgramStudi, CreatedDate " +
                  " FROM " + tbl.ProgramStudi + 
                  " WHERE 1=1 " + where + " ORDER BY " + order_what + " " + order_by

        let result = await objDB.getPaging(db, sql, data, order_what, order_by, paging.page_no, paging.no_per_page)

        return result
    }

    fn.getAllProgramStudi= async (where = '', data = [], order_what = " id ", order_by = " ASC ", limit = 0) => {
        let sql = " SELECT id, KodeProgramStudi, Nama as namaProgramStudi, CreatedDate " +
                  " FROM " + tbl.ProgramStudi + 
                  " WHERE 1=1 " + where + " ORDER BY " + order_what + " " + order_by

        let result = await objDB.getAll(db, sql, data, limit)
        return result
    }

    
    return fn
}

module.exports = obj
