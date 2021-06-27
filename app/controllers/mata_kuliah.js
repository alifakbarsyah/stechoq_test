"use strict"

const { isEmpty } = require('lodash')

let obj = (rootpath) => {
    const fn = {}
    const cst = require(rootpath + '/config/const.json')
    const config = require(rootpath + "/config/config.json")
    const moment = require('moment')
    const crypto = require('crypto')
    const validator = require('validator')
    const now = moment().format('YYYY-MM-DD HH:mm:ss')

    fn.AddMataKuliah = async (req, res, next) => {
        try{
            let kode_mata_kuliah = req.body.kode_mata_kuliah || ''
            let nama = req.body.nama || ''
            let sks = parseInt(req.body.sks) || 0
            let kode_program_studi = req.body.kode_program_studi || ''

             // required kode_mata_kuliah
             if(validator.isEmpty(kode_mata_kuliah)) {
                res.custom('mtkl001',0,'id')
            }

            //validate duplicate kode_mata_kuliah
            let dupMataKuliah = await req.model('mata_kuliah').getKodeMataKuliah(kode_mata_kuliah)
            if(isEmpty(dupMataKuliah) == false) {
                res.custom('mtkl002',0,'id')
            }

            // required nama
            if(validator.isEmpty(nama)) {
                res.custom('mtkl003',0,'id')
            }

            // required sks
            if(sks <= 0) {
                res.custom('mtkl004',0,'id')
            }

            // required kode_program_studi
            if(validator.isEmpty(kode_program_studi)) {
                res.custom('pstd001',0,'id')
            }

            // validate if kode_program_studi exists
            let valKodeProgramStudi = await req.model('program_studi').getKodeProgramStudi(kode_program_studi)
            if(isEmpty(valKodeProgramStudi)){
                res.custom('pstd007',0,'id')
            }

            let dataMataKuliah = {
                "KodeMataKuliah" : kode_mata_kuliah,
                "Nama" : nama,
                "Sks" : sks,
                "KodeProgramStudi" : kode_program_studi,
                "CreatedDate" : now,
            }

            await req.model('mata_kuliah').insertMataKuliah(dataMataKuliah)

            let response = getMessage('success')
            res.success(response)

        }catch(e) {next(e)}
    }

    fn.EditMataKuliah = async (req, res, next) => {
        try{
        let id_mata_kuliah = parseInt(req.params.id) || 0
        let nama = req.body.nama || ''
        let sks = parseInt(req.body.sks) || 0
        let kode_program_studi = req.body.kode_program_studi || ''
            
        // required id_mata_kuliah
        if (id_mata_kuliah <= 0) {
            res.custom('mtkl005',0,'id')
        }

        // required nama
        if(validator.isEmpty(nama)) {
            res.custom('mtkl003',0,'id')
        }

        // required sks
        if(sks <= 0) {
            res.custom('mtkl004',0,'id')
        }

        // required kode_program_studi
        if(validator.isEmpty(kode_program_studi)) {
            res.custom('pstd001',0,'id')
        }

        // validate if kode_program_studi exists
        let valKodeProgramStudi = await req.model('program_studi').getKodeProgramStudi(kode_program_studi)
        if(isEmpty(valKodeProgramStudi)){
            res.custom('pstd007',0,'id')
        }

        let dataMataKuliah = {
            "Nama" : nama,
            "Sks" : sks,
            "KodeProgramStudi" : kode_program_studi,
            "UpdatedDate" : now,
        }

        await req.model('mata_kuliah').updateMataKuliah(id_mata_kuliah, dataMataKuliah)

        let response = getMessage('success')
        res.success(response)

        }catch(e) {next(e)}
    }

    fn.getPagingMataKuliah = async (req, res, next) => {
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
                    search_by = "mkl.id"
                } else if (search_by == "kodeMataKuliah") {
                    search_by = "mkl.KodeMataKuliah"
                } else if (search_by == "namaMataKuliah") {
                    search_by = "mkl.Nama"
                } else if (search_by == "kodeProgramStudi") {
                    search_by = "mkl.KodeProgramStudi"
                } else if (search_by == "namaProgramStudi") {
                    search_by = "psd.Nama"
                } else if (search_by == "createdDate") {
                    search_by = "mkl.CreatedDate"
                } else {
                    res.custom('mtkl007',0,'id')
                }

                where += ' AND ' + search_by + ' LIKE ? '
                data.push("%" + search + "%")
            } else {
                if (search && search.charAt(0) == "{" ){
                    let search_obj = JSON.parse(search)
                    for (let key of Object.keys(search_obj)) {

                        let keys

                        if (key == "id") {
                            keys = "mkl.id"
                        } else if (key == "kodeMataKuliah") {
                            keys = "mkl.kodeMataKuliah"
                        } else if (key == "namaMataKuliah") {
                            keys = "mkl.Nama"
                        } else if (key == "kodeProgramStudi") {
                            keys = "mkl.KodeProgramStudi"
                        } else if (key == "namaProgramStudi") {
                            keys = "psd.Nama"
                        } else if (key == "createdDate") {
                            keys = "mkl.CreatedDate"
                        } else {
                            res.custom('mtkl007',0,'id')
                        }

                        where += ' AND ' + keys + ' LIKE ? '
                        data.push("%" + search_obj[key] + "%")
                    }
                }
            }

            if (sort_what == "id") {
                sort_what = "mkl.id"
            } else if (sort_what == "kodeMataKuliah") {
                sort_what = "mkl.KodeMataKuliah"
            } else if (sort_what == "namaMataKuliah") {
                sort_what = "mkl.Nama"
            } else if (sort_what == "kodeProgramStudi") {
                sort_what = "mkl.KodeProgramStudi"
            } else if (sort_what == "namaProgramStudi") {
                sort_what = "psd.Nama"
            } else if (sort_what == "createdDate") {
                sort_what = "mkl.CreatedDate"
            } else {
                res.custom('mtkl008',0,'id')
            }

            if(page_no || no_per_page){
                result = await req.model('mata_kuliah').getPagingMataKuliah(
                    where,
                    data,
                    sort_what,
                    sort_by,
                    page_no,
                    no_per_page
                )
            } else {
                result = await req.model('mata_kuliah').getAllMataKuliah(
                    where,
                    data,
                    sort_what,
                    sort_by
                )
            }

            res.success(result)
        }catch(e) {next(e)}
    }

    fn.getMataKuliah = async (req, res, next) => {
        try {
            let id_mata_kuliah = parseInt(req.params.id) || 0
            if (id_mata_kuliah <= 0) {
                res.custom('mtkl005',0,'id')
            }

            let detailMataKuliah = await req.model('mata_kuliah').getMataKuliahId(id_mata_kuliah)
            // if mata kuliah not found, throw error
            if(isEmpty(detailMataKuliah)) {
                res.custom('mtkl006',0,'id')
            }

            let result = detailMataKuliah

            res.success(result)
        } catch(e) {next(e)}
    }

    fn.DeleteMataKuliah = async (req, res, next) => {
        try {
            let id_mata_kuliah = parseInt(req.params.id) || 0
            if (id_mata_kuliah <= 0) {
                res.custom('mtkl005',0,'id')
            }

            let detailMataKuliah = await req.model('mata_kuliah').getMataKuliahId(id_mata_kuliah)
            // if mata kuliah not found, throw error
            if(isEmpty(detailMataKuliah)) {
                res.custom('mtkl006',0,'id')
            }

            await req.model('mata_kuliah').deleteMataKuliah(id_mata_kuliah)

            let response = getMessage('success')
            res.success(response)
        } catch(e) {next(e)}
    }
    

    return fn
}

module.exports = obj