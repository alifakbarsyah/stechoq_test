"use strict"

const { Console } = require('console')
const { isEmpty } = require('lodash')

let obj = (rootpath) => {
    const fn = {}
    const cst = require(rootpath + '/config/const.json')
    const config = require(rootpath + "/config/config.json")
    const moment = require('moment')
    const crypto = require('crypto')
    const validator = require('validator')
    const now = moment().format('YYYY-MM-DD HH:mm:ss')

    fn.AddProgramStudi = async (req, res, next) => {
        try{
            let kode_program_studi = req.body.kode_program_studi || ''
            let nama_program_studi = req.body.nama_program_studi || ''

            // required kode_program_studi
            if(validator.isEmpty(kode_program_studi)) {
                res.custom('pstd001',0,'id')
            }

            // required nama_program_studi
            if(validator.isEmpty(nama_program_studi)) {
                res.custom('pstd002',0,'id')
            }

            // validate if kode_program_studi exists
            let dupKodeProgramStudi = await req.model('program_studi').getKodeProgramStudi(kode_program_studi)
            if (dupKodeProgramStudi) {
                res.custom('pstd006',0,'id')
            }

            // validate if nama_program_studi exists
            let dupNamaProgramStudi = await req.model('program_studi').getNamaProgramStudi(nama_program_studi)
            if (dupNamaProgramStudi) {
                res.custom('pstd003',0,'id')
            }

            let dataProgramStudi = {
                "KodeProgramStudi" : kode_program_studi,
                "Nama" : nama_program_studi,
                "CreatedDate" : now,
            }

            await req.model('program_studi').insertProgramStudi(dataProgramStudi)

            let response = getMessage('success')
            res.success(response)

        }catch(e) {next(e)}
    }

    fn.EditProgramStudi = async (req, res, next) => {
        try{
            let id_program_studi = parseInt(req.params.id) || 0
            let nama_program_studi = req.body.nama_program_studi || ''
            
            // required id_program_studi
            if (id_program_studi <= 0) {
                res.custom('pstd005',0,'id')
            }

            // required nama_program_studi
            if(validator.isEmpty(nama_program_studi)) {
                res.custom('pstd002',0,'id')
            }

            let detailProgramStudi = await req.model('program_studi').getProgramStatusId(id_program_studi)
            // if program studi not found, throw error
            if(isEmpty(detailProgramStudi)) {
                res.custom('pstd005',0,'id')
            }

            // validate if nama_program_studi exists
            let dupNamaProgramStudi = await req.model('program_studi').getNamaProgramStudi(nama_program_studi)
            if (dupNamaProgramStudi) {
                res.custom('pstd003',0,'id')
            }

            let dataProgramStudi = {
                "Nama" : nama_program_studi,
                "UpdatedDate" : now,
            }

            await req.model('program_studi').updateProgramStudi(id_program_studi, dataProgramStudi)

            let response = getMessage('success')
            res.success(response)

        }catch(e) {next(e)}
    }

    fn.getPagingProgramStudi = async (req, res, next) => {
        try{
            let data = []
            let search_by = req.query.searchBy 
            let search = req.query.search
            let sort_by = req.query.sortDirection || 'DESC'
            let sort_what = req.query.sortBy || 'createdDate'
            let page_no = req.query.pageNo
            let no_per_page = req.query.pageSize
            let where = ''
            let result

            //construct "where"
            if (search_by){

                if (search_by == "id") {
                    search_by = "id"
                } else if (search_by == "kodeProgramStudi") {
                    search_by = "KodeProgramStudi"
                } else if (search_by == "namaProgramStudi") {
                    search_by = "Nama"
                } else if (search_by == "createdDate") {
                    search_by = "CreatedDate"
                } else {
                    res.custom('pstd008',0,'id')
                }

                where += ' AND ' + search_by + ' LIKE ? '
                data.push("%" + search + "%")
            } else {
                if (search && search.charAt(0) == "{" ){
                    let search_obj = JSON.parse(search)
                    for (let key of Object.keys(search_obj)) {

                        let keys

                        if (key == "id") {
                            keys = "id"
                        } else if (key == "kodeProgramStudi") {
                            keys = "KodeProgramStudi"
                        } else if (key == "namaProgramStudi") {
                            keys = "Nama"
                        } else if (key == "createdDate") {
                            keys = "CreatedDate"
                        } else {
                            res.custom('pstd008',0,'id')
                        }

                        where += ' AND ' + keys + ' LIKE ? '
                        data.push("%" + search_obj[key] + "%")
                    }
                }
            }

            if (sort_what == "id") {
                sort_what = "id"
            } else if (sort_what == "kodeProgramStudi") {
                sort_what = "KodeProgramStudi"
            } else if (sort_what == "namaProgramStudi") {
                sort_what = "Nama"
            } else if (sort_what == "createdDate") {
                sort_what = "CreatedDate"
            } else {
                res.custom('pstd009',0,'id')
            }

            if(page_no || no_per_page){
                result = await req.model('program_studi').getPagingProgramStudi(
                    where,
                    data,
                    sort_what,
                    sort_by,
                    page_no,
                    no_per_page
                )
            } else {
                result = await req.model('program_studi').getAllProgramStudi(
                    where,
                    data,
                    sort_what,
                    sort_by
                )
            }

            res.success(result)
        }catch(e) {next(e)}
    }

    fn.getPagingListMatakuliah = async (req, res, next) => {
        try{
            let data = []
            let search_by = req.query.searchBy 
            let search = req.query.search
            let sort_by = req.query.sortDirection || 'DESC'
            let sort_what = req.query.sortBy || 'createdDate'
            let page_no = req.query.pageNo
            let no_per_page = req.query.pageSize
            let where = ''
            let result

            //construct "where"
            if (search_by){

                if (search_by == "id") {
                    search_by = "id"
                } else if (search_by == "kodeProgramStudi") {
                    search_by = "KodeProgramStudi"
                } else if (search_by == "namaProgramStudi") {
                    search_by = "Nama"
                } else if (search_by == "createdDate") {
                    search_by = "CreatedDate"
                } else {
                    res.custom('pstd008',0,'id')
                }

                where += ' AND ' + search_by + ' LIKE ? '
                data.push("%" + search + "%")
            } else {
                if (search && search.charAt(0) == "{" ){
                    let search_obj = JSON.parse(search)
                    for (let key of Object.keys(search_obj)) {

                        let keys

                        if (key == "id") {
                            keys = "id"
                        } else if (key == "kodeProgramStudi") {
                            keys = "KodeProgramStudi"
                        } else if (key == "namaProgramStudi") {
                            keys = "Nama"
                        } else if (key == "createdDate") {
                            keys = "CreatedDate"
                        } else {
                            res.custom('pstd008',0,'id')
                        }

                        where += ' AND ' + keys + ' LIKE ? '
                        data.push("%" + search_obj[key] + "%")
                    }
                }
            }

            if (sort_what == "id") {
                sort_what = "id"
            } else if (sort_what == "kodeProgramStudi") {
                sort_what = "KodeProgramStudi"
            } else if (sort_what == "namaProgramStudi") {
                sort_what = "Nama"
            } else if (sort_what == "createdDate") {
                sort_what = "CreatedDate"
            } else {
                res.custom('pstd009',0,'id')
            }

            if(page_no || no_per_page){
                let programStudiList = await req.model('program_studi').getPagingProgramStudi(
                    where,
                    data,
                    sort_what,
                    sort_by,
                    page_no,
                    no_per_page
                )
                let programStudiListData = programStudiList.result
                for (let i = 0; i < programStudiListData.length; i++) {
                    programStudiList.result[i].mataKuliah = []
                    let mataKuliah = await req.model('mata_kuliah').getMataKuliahKodeProgramStudi(programStudiListData[i].kodeProgramStudi)
                    programStudiList.result[i].mataKuliah = mataKuliah
                }
                result = programStudiList
            } else {
                let programStudiList = await req.model('program_studi').getAllProgramStudi(
                    where,
                    data,
                    sort_what,
                    sort_by
                )
                let programStudiListData = programStudiList.result
                for (let i = 0; i < programStudiListData.length; i++) {
                    programStudiList.result[i].mataKuliah = []
                    let mataKuliah = await req.model('mata_kuliah').getMataKuliahKodeProgramStudi(programStudiListData[i].kodeProgramStudi)
                    programStudiList.result[i].mataKuliah = mataKuliah
                }
                result = programStudiList
            }

            res.success(result)
        }catch(e) {next(e)}
    }

    fn.getProgramStudi = async (req, res, next) => {
        try {
            let id_program_studi = parseInt(req.params.id) || 0
            if (id_program_studi <= 0) {
                res.custom('pstd004',0,'id')
            }

            let detailProgramStudi = await req.model('program_studi').getProgramStatusId(id_program_studi)
            // if program studi not found, throw error
            if(isEmpty(detailProgramStudi)) {
                res.custom('pstd005',0,'id')
            }

            let result = detailProgramStudi

            res.success(result)
        } catch(e) {next(e)}
    }

    fn.DeleteProgramStudi = async (req, res, next) => {
        try {
            let id_program_studi = parseInt(req.params.id) || 0
            if (id_program_studi <= 0) {
                res.custom('pstd004',0,req.objUser.lang)
            }

            let detailProgramStudi = await req.model('program_studi').getProgramStatusId(id_program_studi)
            // if program studi not found, throw error
            if(isEmpty(detailProgramStudi)) {
                res.custom('pstd005',0,'id')
            }

            await req.model('program_studi').deleteProgramStudi(id_program_studi)

            let response = getMessage('success')
            res.success(response)
        } catch(e) {next(e)}
    }
    

    return fn
}

module.exports = obj