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

    fn.AddKrs = async (req, res, next) => {
        try{
            let nim = req.body.nim || ''
            let kode_mata_kuliah = req.body.kode_mata_kuliah || ''

            // required nim
            if(validator.isEmpty(nim)) {
                res.custom('krs001',0,'id')
            }

            // required kode_mata_kuliah
            if(validator.isEmpty(kode_mata_kuliah)) {
                res.custom('krs002',0,'id')
            }

            //validate duplicate krs
            let dupkrs = await req.model('krs').getDupKrs(nim,kode_mata_kuliah)
            if(isEmpty(dupkrs) == false) {
                res.custom('krs005',0,'id')
            }

            let kodeProgramStudibyNim = await req.model('krs').getKodeProgramStudiNim(nim)
            let kodeProgramStudibyKodeMataKuliah = await req.model('krs').getKodeProgramStudiKodeMataKuliah(kode_mata_kuliah)

            if(isEmpty(kodeProgramStudibyNim)) {
                res.custom('krs003',0,'id')
            }

            if(isEmpty(kodeProgramStudibyKodeMataKuliah)) {
                res.custom('krs004',0,'id')
            }

            if(kodeProgramStudibyNim.KodeProgramStudi != kodeProgramStudibyKodeMataKuliah.KodeProgramStudi) {
                res.custom('krs006',0,'id')
            }

            let dataKrs = {
                "Nim" : nim,
                "KodeMataKuliah" : kode_mata_kuliah,
                "CreatedDate" : now,
            }

            await req.model('krs').insertKrs(dataKrs)

            let response = getMessage('success')
            res.success(response)

        }catch(e) {next(e)}
    }

    fn.EditKrs = async (req, res, next) => {
        try{
            let id_krs = parseInt(req.params.id) || 0
            let nim = req.body.nim || ''
            let kode_mata_kuliah = req.body.kode_mata_kuliah || ''

            // required id_mata_kuliah
            if (id_krs <= 0) {
                res.custom('krs007',0,'id')
            }

            // required nim
            if(validator.isEmpty(nim)) {
                res.custom('krs001',0,'id')
            }

            // required kode_mata_kuliah
            if(validator.isEmpty(kode_mata_kuliah)) {
                res.custom('krs002',0,'id')
            }

            //validate duplicate krs
            let dupkrs = await req.model('krs').getDupKrs(nim,kode_mata_kuliah)
            if(isEmpty(dupkrs) == false) {
                res.custom('krs005',0,'id')
            }

            let kodeProgramStudibyNim = await req.model('krs').getKodeProgramStudiNim(nim)
            let kodeProgramStudibyKodeMataKuliah = await req.model('krs').getKodeProgramStudiKodeMataKuliah(kode_mata_kuliah)

            if(isEmpty(kodeProgramStudibyNim)) {
                res.custom('krs003',0,'id')
            }

            if(isEmpty(kodeProgramStudibyKodeMataKuliah)) {
                res.custom('krs004',0,'id')
            }

            if(kodeProgramStudibyNim.KodeProgramStudi != kodeProgramStudibyKodeMataKuliah.KodeProgramStudi) {
                res.custom('krs006',0,'id')
            }

            let dataKrs = {
                "Nim" : nim,
                "KodeMataKuliah" : kode_mata_kuliah,
                "UpdatedDate" : now,
            }

            await req.model('krs').updateKrs(id_krs, dataKrs)

            let response = getMessage('success')
            res.success(response)

        }catch(e) {next(e)}
    }

    fn.getPagingKrs = async (req, res, next) => {
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
                    search_by = "krs.id"
                } else if (search_by == "nim") {
                    search_by = "mhs.Nim"
                } else if (search_by == "namaMahasiswa") {
                    search_by = "mhs.Nama"
                } else if (search_by == "tahunMasuk") {
                    search_by = "mhs.TahunMasuk"
                } else if (search_by == "kodeProgramStudi") {
                    search_by = "mhs.KodeProgramStudi"
                } else if (search_by == "namaProgramStudi") {
                    search_by = "psd.Nama"
                } else if (search_by == "kodeMataKuliah") {
                    search_by = "mkl.KodeMataKuliah"
                } else if (search_by == "namaMataKuliah") {
                    search_by = "mkl.Nama"
                } else if (search_by == "createdDate") {
                    search_by = "krs.CreatedDate"
                } else {
                    res.custom('krs009',0,'id')
                }

                where += ' AND ' + search_by + ' LIKE ? '
                data.push("%" + search + "%")
            } else {
                if (search && search.charAt(0) == "{" ){
                    let search_obj = JSON.parse(search)
                    for (let key of Object.keys(search_obj)) {

                        let keys

                        if (key == "id") {
                            keys = "krs.id"
                        } else if (key == "nim") {
                            keys = "mhs.Nim"
                        } else if (key == "namaMahasiswa") {
                            keys = "mhs.Nama"
                        } else if (key == "tahunMasuk") {
                            keys = "mhs.TahunMasuk"
                        } else if (key == "kodeProgramStudi") {
                            keys = "mhs.KodeProgramStudi"
                        } else if (key == "namaProgramStudi") {
                            keys = "psd.Nama"
                        } else if (key == "kodeMataKuliah") {
                            keys = "mkl.KodeMataKuliah"
                        } else if (key == "namaMataKuliah") {
                            keys = "mkl.Nama"
                        } else if (key == "createdDate") {
                            keys = "krs.CreatedDate"
                        } else {
                            res.custom('krs009',0,'id')
                        }

                        where += ' AND ' + keys + ' LIKE ? '
                        data.push("%" + search_obj[key] + "%")
                    }
                }
            }

            if (sort_what == "id") {
                sort_what = "krs.id"
            } else if (sort_what == "nim") {
                sort_what = "mhs.Nim"
            } else if (sort_what == "namaMahasiswa") {
                sort_what = "mhs.Nama"
            } else if (sort_what == "tahunMasuk") {
                sort_what = "mhs.TahunMasuk"
            } else if (sort_what == "kodeProgramStudi") {
                sort_what = "mhs.KodeProgramStudi"
            } else if (sort_what == "namaProgramStudi") {
                sort_what = "psd.Nama"
            } else if (sort_what == "kodeMataKuliah") {
                sort_what = "mkl.KodeMataKuliah"
            } else if (sort_what == "namaMataKuliah") {
                sort_what = "mkl.Nama"
            } else if (sort_what == "createdDate") {
                sort_what = "krs.CreatedDate"
            } else {
                res.custom('krs010',0,'id')
            }

            if(page_no || no_per_page){
                result = await req.model('krs').getPagingKrs(
                    where,
                    data,
                    sort_what,
                    sort_by,
                    page_no,
                    no_per_page
                )
            } else {
                result = await req.model('krs').getAllKrs(
                    where,
                    data,
                    sort_what,
                    sort_by
                )
            }

            res.success(result)
        }catch(e) {next(e)}
    }

    fn.getKrs = async (req, res, next) => {
        try {
            let id_krs = parseInt(req.params.id) || 0
            if (id_krs <= 0) {
                res.custom('krs007',0,'id')
            }

            let detailKrs = await req.model('krs').getKrsId(id_krs)
            // if krs not found, throw error
            if(isEmpty(detailKrs)) {
                res.custom('krs008',0,'id')
            }

            let result = detailKrs

            res.success(result)
        } catch(e) {next(e)}
    }

    fn.DeleteKrs = async (req, res, next) => {
        try {
            let id_krs = parseInt(req.params.id) || 0
            if (id_krs <= 0) {
                res.custom('krs007',0,req.objUser.lang)
            }

            let detailKrs = await req.model('krs').getKrsId(id_krs)
            // if krs not found, throw error
            if(isEmpty(detailKrs)) {
                res.custom('krs008',0,'id')
            }

            await req.model('krs').deleteKrs(id_krs)

            let response = getMessage('success')
            res.success(response)
        } catch(e) {next(e)}
    }
    

    return fn
}

module.exports = obj