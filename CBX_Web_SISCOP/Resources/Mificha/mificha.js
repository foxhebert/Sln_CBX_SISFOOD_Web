function configMiFichaInicial() {
    const intIdMenu = localStorage.getItem('idsubmenu') && !isNaN(localStorage.getItem('idsubmenu')) ? Number(localStorage.getItem('idsubmenu')) : 1
    const contenedorIdInicial = 'miFichaPersonal'
    const formatoFecha = 'DD/MM/YYYY'
    const rangeDateInicial = {
        startDate: moment().subtract(10, 'year'),
        endDate: moment(),
    }
    return {
        intIdMenu,
        contenedorIdInicial,
        formatoFecha,
        rangeDateInicial,
    }
}
function getDocumentElementById(id) {
    return document.getElementById(id)
}

function getAdicionalControlEditarPersonal() {
    const { intIdMenu, formatoFecha, rangeDateInicial } = configMiFichaInicial()

    axios
        .post('/Personal/ListarCombos', {
            intIdMenu: intIdMenu,
            strEntidad: 'TGTIPO_VIA',
            intIdFiltroGrupo: 0,
            strGrupo: '',
            strSubGrupo: '',
        })
        .then((resp) => {
            const dataTipVia = resp.data
            if (dataTipVia.length) {
                $('#TipVia').empty()
                $('#TipVia').attr('disabled', false)
                $('#TipVia').append('<option value="0">Via</option>')
                dataTipVia.forEach((element) => {
                    $('#TipVia').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
                })
            }
        })
        .catch((error) => {
            console.log(error)
        })

    axios
        .post('/Personal/ListarCombos', {
            intIdMenu: intIdMenu,
            strEntidad: 'TGPAIS',
            intIdFiltroGrupo: 0,
            strGrupo: 'EXISTE',
            strSubGrupo: '',
        })
        .then((resp) => {
            const dataCboPais = resp.data
            if (dataCboPais.length) {
                $('#CboPais').empty()
                $('#CboPais').attr('disabled', false)
                $('#CboPais').append('<option value="">Seleccione</option>')

                dataCboPais.forEach((element) => {
                    $('#CboPais').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
                })
            }
        })
        .catch((error) => {
            console.log(error)
        })
}
async function getPersonalPerfil(intIdPersonalId) {
    const { intIdMenu, formatoFecha, rangeDateInicial } = configMiFichaInicial()
    const { loaderHtml } = APPCONFIG
    const intIdPersonal = intIdPersonalId
    getAdicionalControlEditarPersonal()
    try {
        const dataUser = await axios.post('/Personal/GetPersonalData', { intIdMenu, intIdPersonal })
        const dataCorreos = await axios.post('/Personal/GetCorreosPersonal', { intIdMenu, intIdPersonal })
        const dataTelefonos = await axios.post('/Personal/GetTelefonosPersonal', { intIdMenu, intIdPersonal })

        if (dataUser.data.length) {
            document.querySelectorAll('.loading-item-p').forEach((el) => {
                el.classList.remove('skeleton-loader', 'h23x100', 'h22x79', 'dplayinitial', 'bg-loader')
            })
        }
        if (dataUser.data.length) {
            const user = dataUser.data[0]
            const INTIDTPEVAL = user.intIdUbigeo
            const INTIDSUPUBI = user.intIdUbigSup
            const INTIDSUPUBIREGION = user.intIdUbiSupReg
            const intIdProvinciaMostrar = user.intIdUbiReg
            const intIdRegionMostrar = user.intIdUbiPais
            const intIdJerOrgLista = user.intIdJerOrg
            const intIdUniOrgLista = user.intIdUniOrg

            $('#showModalEditar').click(function () {
                $('#myModalEditar').modal('show')
            })
            getDocumentElementById('imagePersonalPer').src = `/DirEmpleadosRuta/${user.imgFoto}`
            getDocumentElementById('imagePersonalPer').style.display = 'block'
            getDocumentElementById('loaderImagePersonal').style.display = 'none'
            getDocumentElementById('namePersonalPer').innerHTML = `${user.strApePaterno} ${user.strApeMaterno}, ${user.strNombres}`
            getDocumentElementById('codigoPersonalPer').innerHTML = `${user.strCoPersonal}-${user.strNumRegis}`
            getDocumentElementById('documentoPersdonal').innerHTML = `DNI 45635091`
            getDocumentElementById('admisionPersonalPer').innerHTML = `${user.dttFecAdmin}`
            getDocumentElementById('fotocheckPersonalPer').innerHTML = `${user.strFotocheck}`
            getDocumentElementById('empresaPersonalr').innerHTML = `TECFLEX S.A.C`
            getDocumentElementById('direccionPersonal').innerHTML = `<i class="fa fa-map-marker user-profile-icon"></i> Av. Faustino Sánchez Carrión 176, Magdalena, Cercado de Lima 15076`
            getDocumentElementById('cargoPersonalp').innerHTML = `<i class="fa fa-briefcase user-profile-icon"></i> Cargo Técnico`

            getDocumentElementById('fechaNacimientoPersonal').innerHTML = `<strong>Fecha de Nacimiento:</strong> 11/05/1987`
            getDocumentElementById('generoPersonalm').innerHTML = `<strong>Sexo:</strong> Femenino`
            getDocumentElementById('generoEstadolm').innerHTML = `<strong>Estado:</strong> Activo`
            $('#txtFechaNac').val(user.dttFecNacim)
            $('#CboPais').val(user.intIdUbiSupPais)
            $('#TipVia').val(user.intIdTipoVia)
            $('#TXTTIPVIA').val(user.strDireccion)

            $.post(
                '/Personal/ListarCombos',
                {
                    strEntidad: 'TGUBIGEO',
                    intIdFiltroGrupo: INTIDSUPUBI,
                    strGrupo: 'DIST',
                    strSubGrupo: '',
                },
                (response) => {
                    $('#CboDistrito').empty()
                    $('#CboDistrito').attr('disabled', false)
                    $('#CboDistrito').append('<option >Seleccione</option>')
                    response.forEach((element) => {
                        $('#CboDistrito').append('<option value="' + element.intidTipo + '" >' + element.strDeTipo + '</option>')
                        if (element.intidTipo == INTIDTPEVAL) {
                            $('#CboDistrito').val(element.intidTipo)
                        }
                    })
                }
            )

            $.post(
                '/Personal/ListarCombos',
                {
                    strEntidad: 'TGUBIGEO',
                    intIdFiltroGrupo: INTIDSUPUBIREGION,
                    strGrupo: 'REG',
                    strSubGrupo: '',
                },
                (response) => {
                    $('#CboProvincia').empty()
                    $('#CboProvincia').attr('disabled', false)
                    $('#CboProvincia').append('<option >Seleccione</option>')
                    response.forEach((element) => {
                        $('#CboProvincia').append('<option value="' + element.intidTipo + '" >' + element.strDeTipo + '</option>')
                        if (element.intidTipo == intIdProvinciaMostrar) {
                            $('#CboProvincia').val(element.intidTipo)
                        }
                    })
                }
            )

            $.post(
                '/Personal/ListarCombos',
                {
                    strEntidad: 'TGUBIGEO',
                    intIdFiltroGrupo: user.intIdUbiSupPais,
                    strGrupo: 'DEPART',
                    strSubGrupo: '',
                },
                (response) => {
                    $('#CboRegion').empty()
                    $('#CboRegion').attr('disabled', false)
                    $('#CboRegion').append('<option >Seleccione</option>')
                    response.forEach((element) => {
                        $('#CboRegion').append('<option value="' + element.intidTipo + '" >' + element.strDeTipo + '</option>')
                        if (element.intidTipo == intIdRegionMostrar) {
                            $('#CboRegion').val(element.intidTipo)
                        }
                    })
                }
            )
        }
        if (dataCorreos.data.length) {
            const dataCorreosArray = dataCorreos.data
            let dataCorreosInsert = ''
            $('#tituloCorreoPersonal').html(`<li><i class="glyphicon glyphicon-envelope"></i> Otros Emails:</li>`)
            $('#dataCorreoPersonal').empty()
            dataCorreosArray.forEach((item) => {
                if (item.bitFlPrincipal) {
                    getDocumentElementById('correoPrincipalPersonal').innerHTML = `<i class="fa fa-envelope user-profile-icon"></i> ${item.strCorreo}`
                } else {
                    $('#dataCorreoPersonal').append(`<li>${item.strCorreo}</li><br>`)
                }
            })

            // editar
            dataCorreosArray.forEach((element) => {
                if (element.bitFlPrincipal) {
                    $('#Email_Emple').val(element.strCorreo)
                } else {
                    dataCorreosInsert += element.strCorreo + ','
                }
            })
            if (dataCorreosInsert != '') {
                let cadenaEmail = dataCorreosInsert.slice(0, -1)
                $('#TagEmailContainer').html(`<input id="tagsEmail" type="text" class="tags form-control tagsEmailGet" value="${cadenaEmail}" /><div id="suggestions-container" style="position: relative; float: left; width: 250px; margin: 10px;"></div>`)
            } else {
                $('#TagEmailContainer').html(`<input id="tagsEmail" type="text" class="tags form-control tagsEmailGet" value="" /><div id="suggestions-container" style="position: relative; float: left; width: 250px; margin: 10px;"></div>`)
            }
        } else {
            $('#TagEmailContainer').html(`<input id="tagsEmail" type="text" class="tags form-control tagsEmailGet" value="" /><div id="suggestions-container" style="position: relative; float: left; width: 250px; margin: 10px;"></div>`)
        }
        if (dataTelefonos.data.length) {
            const dataTelefonosArray = dataTelefonos.data
            let dataTelefonosInsert = ''
            $('#tituloTelefonoPersonal').html(`<li><i class="glyphicon glyphicon-phone-alt"></i> Telefonos:</li>`)
            $('#dataTelefonoPersonal').empty()
            dataTelefonosArray.forEach((item) => {
                if (item.bitFlPrincipal) {
                    getDocumentElementById('telefonoPrincipalPersonal').innerHTML = `<i class="glyphicon glyphicon-phone-alt"></i> ${item.strNumero}`
                } else {
                    $('#dataTelefonoPersonal').append(`<li>${item.strNumero}</li><br>`)
                }
            })
            // editar

            dataTelefonosArray.forEach((element) => {
                if (element.bitFlPrincipal) {
                    $('#celularEmpleado').val(element.strNumero)
                } else {
                    dataTelefonosInsert += element.strNumero + ','
                }
            })
            if (dataTelefonosInsert != '') {
                let cadenaTekl = dataTelefonosInsert.slice(0, -1)
                $('#tagTelefonosContainer').html(`<input id="tagsTelefono" type="text" class="tags form-control tagsTelefonoGet" value="${cadenaTekl}"  /><div id="suggestions-container" style="position: relative; float: left; width: 250px; margin: 10px;"></div>`)
            } else {
                $('#tagTelefonosContainer').html(`<input id="tagsTelefono" type="text" class="tags form-control tagsTelefonoGet" value=""  /><div id="suggestions-container" style="position: relative; float: left; width: 250px; margin: 10px;"></div>`)
            }
        } else {
            $('#tagTelefonosContainer').html(`<input id="tagsTelefono" type="text" class="tags form-control tagsTelefonoGet" value=""  /><div id="suggestions-container" style="position: relative; float: left; width: 250px; margin: 10px;"></div>`)
        }

        var mailformatEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/

        $('#tagsEmail').tagsInput({
            width: 'auto',
            defaultText: 'Correos',
            placeholderColor: '#666666',
            pattern: mailformatEmail,
            interactive: true,
        })
        $('#tagsTelefono').tagsInput({
            width: 'auto',
            defaultText: 'Teléfonos',
            placeholderColor: '#666666',
            pattern: /^\d{9}$/,
            interactive: true,
        })
    } catch (error) {
        console.log(error)
    }
}

async function updatePersonalPerfil(intIdPersonal) {
    const titleToast = 'Editar Perfil'
    if (getValueControl('#txtFechaNac').length < 4) {
        messageResponseMix({ type: 'info', message: 'Complete los campos obligatorios' }, titleToast)
        focusControl('#txtFechaNac')
        return false
    } else if (getValueControl('#CboPais') == '') {
        messageResponseMix({ type: 'info', message: 'Complete los campos obligatorios' }, titleToast)
        $('#CboPais').focus()
        return false
    } else if (getValueControl('#CboRegion') == '') {
        messageResponseMix({ type: 'info', message: 'Complete los campos obligatorios' }, titleToast)
        $('#CboRegion').focus()
        return false
    } else if (getValueControl('#CboProvincia') == '') {
        messageResponseMix({ type: 'info', message: 'Complete los campos obligatorios' }, titleToast)
        $('#CboProvincia').focus()
        return false
    } else if (getValueControl('#CboDistrito') == '') {
        messageResponseMix({ type: 'info', message: 'Complete los campos obligatorios' }, titleToast)
        $('#CboDistrito').focus()
        return false
    } else if (getValueControl('#Email_Emple').length < 4 && !ValidateEmail(getValueControl('#Email_Emple'))) {
        messageResponseMix({ type: 'info', message: 'Complete los campos obligatorios' }, titleToast)
        focusControl('#Email_Emple')
        return false
    } else if (getValueControl('#celularEmpleado').length < 6) {
        messageResponseMix({ type: 'info', message: 'Complete los campos obligatorios' }, titleToast)
        focusControl('#celularEmpleado')
        return false
    }

    alert('error al intentar actualizar')
    console.log(intIdPersonal)
}

$(document).ready(function () {
    const { intIdMenu, contenedorIdInicial, formatoFecha, rangeDateInicial } = configMiFichaInicial()
    if ($(`#${contenedorIdInicial}`).length) {
        const intIdPersonal = 11450
        getPersonalPerfil(intIdPersonal)
        $('#guardarPerfilUsuario').click(function () {
            updatePersonalPerfil(intIdPersonal)
        })
        $('#FechaNac').datetimepicker({
            viewMode: 'days',
            format: formatoFecha,
        })
        $('#CboPais').on('change', function () {
            let Valxpais = $('#CboPais').val()
            if (Valxpais == '') {
                Valxpais = 0
            }
            $.post(
                '/Personal/ListarCombos',
                {
                    intIdMenu: intIdMenu,
                    strEntidad: 'TGUBIGEO',
                    intIdFiltroGrupo: Valxpais,
                    strGrupo: 'DEPART',
                    strSubGrupo: '',
                },
                (response) => {
                    $('#CboRegion').empty()
                    $('#CboRegion').append('<option value="">Seleccione</option>')
                    $('#CboProvincia').empty()
                    $('#CboProvincia').append('<option value="">Seleccione</option>')
                    $('#CboDistrito').empty()
                    $('#CboDistrito').append('<option value="">Seleccione</option>')
                    response.forEach((element) => {
                        $('#CboRegion').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
                    })
                }
            )
        })

        $('#CboRegion').on('change', function () {
            const Valxpais = $('#CboRegion').val()
            if (Valxpais == '') {
                Valxpais = 0
            }
            $.post(
                '/Personal/ListarCombos',
                {
                    intIdMenu: intIdMenu,
                    strEntidad: 'TGUBIGEO',
                    intIdFiltroGrupo: Valxpais,
                    strGrupo: 'REG',
                    strSubGrupo: '',
                },
                (response) => {
                    $('#CboProvincia').empty()
                    $('#CboProvincia').append('<option value="">Seleccione</option>')
                    $('#CboDistrito').empty()
                    $('#CboDistrito').append('<option value="">Seleccione</option>')

                    response.forEach((element) => {
                        $('#CboProvincia').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
                    })
                }
            )
        })

        $('#CboProvincia').on('change', function () {
            const Valxpais = $('#CboProvincia').val()
            if (Valxpais == '') {
                Valxpais = 0
            }
            $.post(
                '/Personal/ListarCombos',
                {
                    intIdMenu: intIdMenu,
                    strEntidad: 'TGUBIGEO',
                    intIdFiltroGrupo: Valxpais,
                    strGrupo: 'DIST',
                    strSubGrupo: '',
                },
                (response) => {
                    $('#CboDistrito').empty()
                    $('#CboDistrito').append('<option value="">Seleccione</option>')
                    response.forEach((element) => {
                        $('#CboDistrito').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
                    })
                }
            )
        })
    }
})
