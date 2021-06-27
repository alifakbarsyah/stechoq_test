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

    fn.AddMahasiswa = async (req, res, next) => {
        try{
            let nim = req.body.nim || ''
            let nama = req.body.nama || ''
            let tempat_lahir = req.body.tempat_lahir || ''
            let tanggal_lahir = req.body.tanggal_lahir || ''
            let tahun_masuk = req.body.tahun_masuk || ''
            let kode_program_studi = req.body.kode_program_studi || ''

             // required nim
             if(validator.isEmpty(nim)) {
                res.custom('mhsw002',0,'id')
            }

            //validate duplicate Nim
            let dupNim = await req.model('mahasiswa').getDupNim(nim)
            if(isEmpty(dupNim) == false) {
                res.custom('mhsw008',0,'id')
            }

            // required nama
            if(validator.isEmpty(nama)) {
                res.custom('mhsw001',0,'id')
            }

            // required tempat_lahir
            if(validator.isEmpty(tempat_lahir)) {
                res.custom('mhsw003',0,'id')
            }

            // required tanggal_lahir
            if(validator.isEmpty(tanggal_lahir)) {
                res.custom('mhsw004',0,'id')
            }

            // validate tanggal_lahir
            let tanggal_lahir_string = moment(tanggal_lahir, "YYYY-MM-DD", true).isValid();
            if(tanggal_lahir_string == false) {
                res.custom('mhsw006',0,'id')
            }

            // required tahun_masuk
            if(validator.isEmpty(tahun_masuk)) {
                res.custom('mhsw005',0,'id')
            }
            
            // validate tahun_masuk
            let tahun_masuk_string = moment(tahun_masuk, "YYYY", true).isValid();
            if(tahun_masuk_string == false) {
                res.custom('mhsw007',0,'id')
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

            let dataMahasiswa = {
                "Nim" : nim,
                "Nama" : nama,
                "TempatLahir" : tempat_lahir,
                "TanggalLahir" : tanggal_lahir,
                "TahunMasuk" : tahun_masuk,
                "KodeProgramStudi" : kode_program_studi,
                "CreatedDate" : now,
            }

            await req.model('mahasiswa').insertMahasiswa(dataMahasiswa)

            let response = getMessage('success')
            res.success(response)

        }catch(e) {next(e)}
    }

    fn.EditMahasiswa = async (req, res, next) => {
        try{
        let id_mahasiswa = parseInt(req.params.id) || 0
        let nim = req.body.nim || ''
        let nama = req.body.nama || ''
        let tempat_lahir = req.body.tempat_lahir || ''
        let tanggal_lahir = req.body.tanggal_lahir || ''
        let tahun_masuk = req.body.tahun_masuk || ''
        let kode_program_studi = req.body.kode_program_studi || ''

        // required id_mahasiswa
        if (id_mahasiswa <= 0) {
            res.custom('mhsw009',0,'id')
        }

         // required nim
         if(validator.isEmpty(nim)) {
            res.custom('mhsw002',0,'id')
        }

        //validate duplicate Nim
        let dupNim = await req.model('mahasiswa').getDupNim(nim)
        if(isEmpty(dupNim) == false) {
            res.custom('mhsw008',0,'id')
        }

        // required nama
        if(validator.isEmpty(nama)) {
            res.custom('mhsw001',0,'id')
        }

        // required tempat_lahir
        if(validator.isEmpty(tempat_lahir)) {
            res.custom('mhsw003',0,'id')
        }

        // required tanggal_lahir
        if(validator.isEmpty(tanggal_lahir)) {
            res.custom('mhsw004',0,'id')
        }

        // validate tanggal_lahir
        let tanggal_lahir_string = moment(tanggal_lahir, "YYYY-MM-DD", true).isValid();
        if(tanggal_lahir_string == false) {
            res.custom('mhsw006',0,'id')
        }

        // required tahun_masuk
        if(validator.isEmpty(tahun_masuk)) {
            res.custom('mhsw005',0,'id')
        }
        
        // validate tahun_masuk
        let tahun_masuk_string = moment(tahun_masuk, "YYYY", true).isValid();
        if(tahun_masuk_string == false) {
            res.custom('mhsw007',0,'id')
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

        let dataMahasiswa = {
            "Nim" : nim,
            "Nama" : nama,
            "TempatLahir" : tempat_lahir,
            "TanggalLahir" : tanggal_lahir,
            "TahunMasuk" : tahun_masuk,
            "KodeProgramStudi" : kode_program_studi,
            "UpdatedDate" : now,
        }

        await req.model('mahasiswa').updateMahasiswa(id_mahasiswa, dataMahasiswa)

        let response = getMessage('success')
        res.success(response)

        }catch(e) {next(e)}
    }

    fn.getPagingMahasiswa = async (req, res, next) => {
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
                    search_by = "mhs.id"
                } else if (search_by == "nim") {
                    search_by = "mhs.Nim"
                } else if (search_by == "nama") {
                    search_by = "mhs.Nama"
                } else if (search_by == "tempatLahir") {
                    search_by = "mhs.TempatLahir"
                } else if (search_by == "tanggalLahir") {
                    search_by = "mhs.TanggalLahir"
                } else if (search_by == "tahunMasuk") {
                    search_by = "mhs.TahunMasuk"
                } else if (search_by == "kodeProgramStudi") {
                    search_by = "mhs.KodeProgramStudi"
                } else if (search_by == "namaProgramStudi") {
                    search_by = "psd.Nama"
                } else if (search_by == "createdDate") {
                    search_by = "mhs.CreatedDate"
                } else {
                    res.custom('mhsw011',0,'id')
                }

                where += ' AND ' + search_by + ' LIKE ? '
                data.push("%" + search + "%")
            } else {
                if (search && search.charAt(0) == "{" ){
                    let search_obj = JSON.parse(search)
                    for (let key of Object.keys(search_obj)) {

                        let keys

                        if (key == "id") {
                            keys = "mhs.id"
                        } else if (key == "nim") {
                            keys = "mhs.Nim"
                        } else if (key == "nama") {
                            keys = "mhs.Nama"
                        } else if (key == "tempatLahir") {
                            keys = "mhs.TempatLahir"
                        } else if (key == "tanggalLahir") {
                            keys = "mhs.TanggalLahir"
                        } else if (key == "tahunMasuk") {
                            keys = "mhs.TahunMasuk"
                        } else if (key == "kodeProgramStudi") {
                            keys = "mhs.KodeProgramStudi"
                        } else if (key == "namaProgramStudi") {
                            keys = "psd.Nama"
                        } else if (key == "createdDate") {
                            keys = "mhs.CreatedDate"
                        } else {
                            res.custom('mhsw011',0,'id')
                        }

                        where += ' AND ' + keys + ' LIKE ? '
                        data.push("%" + search_obj[key] + "%")
                    }
                }
            }

            if (sort_what == "id") {
                sort_what = "mhs.id"
            } else if (sort_what == "nama") {
                sort_what = "mhs.Nama"
            } else if (sort_what == "tempatLahir") {
                sort_what = "mhs.TempatLahir"
            } else if (sort_what == "tanggalLahir") {
                sort_what = "mhs.TanggalLahir"
            } else if (sort_what == "tahunMasuk") {
                sort_what = "mhs.TahunMasuk"
            } else if (sort_what == "kodeProgramStudi") {
                sort_what = "mhs.KodeProgramStudi"
            } else if (sort_what == "namaProgramStudi") {
                sort_what = "psd.Nama"
            } else if (sort_what == "createdDate") {
                sort_what = "mhs.CreatedDate"
            } else {
                res.custom('mhsw012',0,'id')
            }

            if(page_no || no_per_page){
                result = await req.model('mahasiswa').getPagingMahasiswa(
                    where,
                    data,
                    sort_what,
                    sort_by,
                    page_no,
                    no_per_page
                )
            } else {
                result = await req.model('mahasiswa').getAllMahasiswa(
                    where,
                    data,
                    sort_what,
                    sort_by
                )
            }

            res.success(result)
        }catch(e) {next(e)}
    }

    fn.getPagingMahasiswaMataKuliah = async (req, res, next) => {
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
                    search_by = "mhs.id"
                } else if (search_by == "nim") {
                    search_by = "mhs.Nim"
                } else if (search_by == "nama") {
                    search_by = "mhs.Nama"
                } else if (search_by == "tempatLahir") {
                    search_by = "mhs.TempatLahir"
                } else if (search_by == "tanggalLahir") {
                    search_by = "mhs.TanggalLahir"
                } else if (search_by == "tahunMasuk") {
                    search_by = "mhs.TahunMasuk"
                } else if (search_by == "kodeProgramStudi") {
                    search_by = "mhs.KodeProgramStudi"
                } else if (search_by == "namaProgramStudi") {
                    search_by = "psd.Nama"
                } else if (search_by == "createdDate") {
                    search_by = "mhs.CreatedDate"
                } else {
                    res.custom('mhsw011',0,'id')
                }

                where += ' AND ' + search_by + ' LIKE ? '
                data.push("%" + search + "%")
            } else {
                if (search && search.charAt(0) == "{" ){
                    let search_obj = JSON.parse(search)
                    for (let key of Object.keys(search_obj)) {

                        let keys

                        if (key == "id") {
                            keys = "mhs.id"
                        } else if (key == "nim") {
                            keys = "mhs.Nim"
                        } else if (key == "nama") {
                            keys = "mhs.Nama"
                        } else if (key == "tempatLahir") {
                            keys = "mhs.TempatLahir"
                        } else if (key == "tanggalLahir") {
                            keys = "mhs.TanggalLahir"
                        } else if (key == "tahunMasuk") {
                            keys = "mhs.TahunMasuk"
                        } else if (key == "kodeProgramStudi") {
                            keys = "mhs.KodeProgramStudi"
                        } else if (key == "namaProgramStudi") {
                            keys = "psd.Nama"
                        } else if (key == "createdDate") {
                            keys = "mhs.CreatedDate"
                        } else {
                            res.custom('mhsw011',0,'id')
                        }

                        where += ' AND ' + keys + ' LIKE ? '
                        data.push("%" + search_obj[key] + "%")
                    }
                }
            }

            if (sort_what == "id") {
                sort_what = "mhs.id"
            } else if (sort_what == "nama") {
                sort_what = "mhs.Nama"
            } else if (sort_what == "tempatLahir") {
                sort_what = "mhs.TempatLahir"
            } else if (sort_what == "tanggalLahir") {
                sort_what = "mhs.TanggalLahir"
            } else if (sort_what == "tahunMasuk") {
                sort_what = "mhs.TahunMasuk"
            } else if (sort_what == "kodeProgramStudi") {
                sort_what = "mhs.KodeProgramStudi"
            } else if (sort_what == "namaProgramStudi") {
                sort_what = "psd.Nama"
            } else if (sort_what == "createdDate") {
                sort_what = "mhs.CreatedDate"
            } else {
                res.custom('mhsw012',0,'id')
            }

            if(page_no || no_per_page){
                let mahasiswaList = await req.model('mahasiswa').getPagingMahasiswaMataKuliah(
                    where,
                    data,
                    sort_what,
                    sort_by,
                    page_no,
                    no_per_page
                )
                let mahasiswaListtData = mahasiswaList.result
                for (let i = 0; i < mahasiswaListtData.length; i++) {
                    mahasiswaList.result[i].mataKuliah = []
                    let mataKuliah = await req.model('mata_kuliah').getMataKuliahNim( mahasiswaListtData[i].nim)
                    mahasiswaList.result[i].mataKuliah = mataKuliah
                }
                result = mahasiswaList
            } else {
                let mahasiswaList = await req.model('mahasiswa').getAllMahasiswaMataKuliah(
                    where,
                    data,
                    sort_what,
                    sort_by
                )
                let mahasiswaListtData = mahasiswaList.result
                for (let i = 0; i < mahasiswaListtData.length; i++) {
                    mahasiswaList.result[i].mataKuliah = []
                    let mataKuliah = await req.model('mata_kuliah').getMataKuliahNim(mahasiswaListtData[i].nim)
                    mahasiswaList.result[i].mataKuliah = mataKuliah
                }
                result = mahasiswaList
            }

            res.success(result)
        }catch(e) {next(e)}
    }

    fn.getMahasiswa = async (req, res, next) => {
        try {
            let id_mahasiswa = parseInt(req.params.id) || 0
            if (id_mahasiswa <= 0) {
                res.custom('mhsw009',0,'id')
            }

            let detailMahasiswa = await req.model('mahasiswa').getMahasiswaId(id_mahasiswa)
            // if Mahasiswa not found, throw error
            if(isEmpty(detailMahasiswa)) {
                res.custom('mhsw010',0,'id')
            }

            let result = detailMahasiswa

            res.success(result)
        } catch(e) {next(e)}
    }

    fn.DeleteMahasiswa = async (req, res, next) => {
        try {
            let id_mahasiswa = parseInt(req.params.id) || 0
            if (id_mahasiswa <= 0) {
                res.custom('mhsw009',0,'id')
            }

            let detailMahasiswa = await req.model('mahasiswa').getMahasiswaId(id_mahasiswa)
            // if Mahasiswa not found, throw error
            if(isEmpty(detailMahasiswa)) {
                res.custom('mhsw010',0,'id')
            }

            await req.model('mahasiswa').deleteMahasiswa(id_mahasiswa)

            let response = getMessage('success')
            res.success(response)
        } catch(e) {next(e)}
    }
    

    return fn
}

module.exports = obj