using CBX_Web_SISCOP.wsOrganizacion;
using CBX_Web_SISCOP.wsSeguridad;//añadido 22.04.2021
using CBX_Web_SISCOP.wsPersona;//añadido 20.08.2021
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CBX_Web_SISCOP.Models;
using System.Drawing.Imaging;
using System.IO;
using System.Net;
using CBX_Web_SISCOP.wsPacking;

namespace CBX_Web_SISCOP.Controllers
{
    public class OrganizacionController : Controller
    {
        private OrganizacionSrvClient proxy;
        private OrganizacionSrvClient proxyOrg;
        private PersonalSrvClient proxyPer;
        private PackingSrvClient PackingTsp;
        public static int intIdMenuGlo { get; set; }

        //*-----------------------------------------------------------------------------------
        #region Validación Session y Conexión con WCF para usar en los ActionResult (vistas)
            
        public bool ValidarSession_view()
        {
            if (ValidarConexWCF())//Existe comunicacion con el Publicado WCF
            {
                if (Auth.isAuthenticated())
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }

        //añadido 22.04.2021 para validar Conexión con el Publicado del Servidor únicamente.
        private SeguridadSrvClient SeguWCF;
        public bool ValidarConexWCF()
        {
            string version = "";
            try
            {
                using (SeguWCF = new SeguridadSrvClient())
                {
                    version = SeguWCF.wsVersion();
                    return true; //Si conecta al Servicio
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "ConfiguracionController.cs: Exception");
                version = "Verificar Web Service";//añadido 22.04.2021
                return false; //No conecta al Servicio
            }
        }

        #endregion Validación Session y Conexión con WCF para usar en los ActionResult (vistas)
        //*-----------------------------------------------------------------------------------

        #region USO COMUN 
        public JsonResult ComboDependenciaFiltro()//añadido 02.09.2021
        {
            string strMsgUsuario = "";
            List<wsPersona.TGTipoEN> listDepen = new List<wsPersona.TGTipoEN>();

            try
            {
                using (proxyPer = new PersonalSrvClient())
                {
                    listDepen = proxyPer.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), "TGJERARQORG", 0, "DEPEN_MAESTROS", "", ref strMsgUsuario).ToList();
                    proxyPer.Close();
                }

                var json_ = Json(listDepen, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);

        }
        public JsonResult Upload()
        {
            string dir = null;
            if (Request.Files.Count > 0)
            {
                for (int i = 0; i < Request.Files.Count; i++)
                {
                    HttpPostedFileBase file = Request.Files[i]; //Uploaded file 

                    //Use the following properties to get file's name, size and MIMEType 
                    int fileSize = file.ContentLength;
                    string fileName = file.FileName;
                    string mimeType = file.ContentType;
                    System.IO.Stream fileContent = file.InputStream; //To save file, use SaveAs method 

                    var request = System.Web.HttpContext.Current.Request;

                    //request.Url.Scheme gives output as https/http 
                    //while request.Url.Authority give us Domain name
                    var baseUrl = request.Url.Scheme + "://" + request.Url.Authority;
                    //Random rd = new Random();
                    //int rand_num = rd.Next(100, 200);

                    //dir = Server.MapPath("~/") + "DirLogosRuta\\" + rand_num.ToString() + fileName;
                    dir = Server.MapPath("~/") + "DirLogosRuta\\" + fileName;
                    baseUrl = "/DirLogosRuta/" + fileName; //"/DirLogosRuta/" + rand_num.ToString() + fileName;
                    file.SaveAs(dir); //File will be saved in application root 
                    return Json(baseUrl);
                }
            }
            else
            {
                dir = "/DirLogosRuta/SinImagen.jpg";
            }

            return Json(dir);
        }
        public JsonResult ListarCaracteresMax(string strMaestro)
        {
            List<wsPacking.MaestroCaracteres> lista = new List<wsPacking.MaestroCaracteres>();

            try
            {
                using (PackingTsp = new PackingSrvClient())
                {
                    lista = PackingTsp.MaestroMaxCaracteres(strMaestro).ToList();
                }
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }
        public JsonResult CamposAdicionales(string strEntidad)
        {
            string strMsgUsuario = "";
            List<CamposAdicionales2> lista = new List<CamposAdicionales2>();

            try
            {
                using (proxyOrg = new OrganizacionSrvClient())
                {
                    lista = proxyOrg.ListarCamposAdicionales(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), strEntidad, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);

        }
        #endregion USO COMUN

        #region Unidad Organizacional

        public ActionResult UnidadOrganizacional(string intIdMenu, string strCodMenu)//originalmente solo tenia el parámetro intIdMenu
        {
            if (ValidarSession_view())//if (Auth.isAuthenticated())
            {
                intIdMenuGlo = Convert.ToInt32(intIdMenu);
                SeguridadController.strcoMenuGlo = strCodMenu;//añadido 06.05.2021 uso general
                return View();
            }

            //string strMsgUsuario = "";
            //List<JerarquiaOrg> lista_Unid_Sup = new List<JerarquiaOrg>();
            //using (proxyOrg = new OrganizacionSrvClient())
            //{
            //    lista_Unid_Sup = proxyOrg.ListarCampoJerarquía(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), ref strMsgUsuario).ToList();
            //    proxyOrg.Close();
            //}
            //ViewBag.CampJerar = new SelectList(lista_Unid_Sup, "IntIdJerOrg", "strNomJerOrg");

            return RedirectToAction("CerrarSesion", "LoginSiscop");
        }
        //[HttpPost]
        public ActionResult NuevaUnidadOrg()
        {
            string strMsgUsuario = "";
            List<JerarquiaOrg> lista_Unid_Sup = new List<JerarquiaOrg>();
            List<Paises> lista_paises = new List<Paises>();
            using (proxyOrg = new OrganizacionSrvClient())
            {
                lista_Unid_Sup = proxyOrg.ListarCampoJerarquía(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), ref strMsgUsuario).ToList();
                //lista_paises = proxyOrg.ListarPaises(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), ref strMsgUsuario).ToList();
                proxyOrg.Close();
            }
            ViewBag.CampoUS = new SelectList(lista_Unid_Sup, "IntIdJerOrg", "strNomJerOrg");
            // ViewBag.Paises = new SelectList(lista_paises, "IntIdPais", "strDesPais");
            object[] Datos = { ViewBag.CampoUS };//object[] Datos = { ViewBag.CampoUS, ViewBag.Paises };
            return PartialView("_partialNuevaUnidadOrg", Datos);
        }
        public ActionResult EditarUnidadOrg(int intIdUniOrg)
        {
            string strMsgUsuario = "";
            List<JerarquiaOrg> lista_Unid_Sup = new List<JerarquiaOrg>();
            List<Paises> lista_paises = new List<Paises>();
            List<UnidadOrg> UndOrgDet = new List<UnidadOrg>();
            using (proxyOrg = new OrganizacionSrvClient())
            {
                lista_Unid_Sup = proxyOrg.ListarCampoJerarquía(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), ref strMsgUsuario).ToList();
                lista_paises = proxyOrg.ListarPaises(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), ref strMsgUsuario).ToList();
                UndOrgDet = proxyOrg.ConsultarDetalleUndOrgCod(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), intIdUniOrg, ref strMsgUsuario).ToList();
                proxyOrg.Close();
            }
            ViewBag.CampJerar = new SelectList(lista_Unid_Sup, "IntIdJerOrg", "strNomJerOrg");
            ViewBag.Paises = new SelectList(lista_paises, "IntIdPais", "strDesPais");
            object[] Datos = { ViewBag.CampJerar, ViewBag.Paises, UndOrgDet };
            return PartialView("_PartialEditarUnidOrg", Datos);
        }
        //[HttpPost]
        public JsonResult GetCampJerar()
        {
            string strMsgUsuario = "";
            List<JerarquiaOrg> lista = new List<JerarquiaOrg>();

            try
            {
                using (proxyOrg = new OrganizacionSrvClient())
                {
                    lista = proxyOrg.ListarCampoJerarquía(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), ref strMsgUsuario).ToList();

                    proxyOrg.Close();
                }
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);

        }
        public ActionResult Dirfis()
        {
            string strMsgUsuario = "";
            List<wsOrganizacion.TGTipoEN> lista_DirFiscal = new List<wsOrganizacion.TGTipoEN>();
            try
            {
                using (proxyOrg = new OrganizacionSrvClient())
                {
                    lista_DirFiscal = proxyOrg.ListarDirecFiscal(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                return View(lista_DirFiscal);
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }
        //[HttpPost]
        public JsonResult getUnidSup(int IntIdJerOrg)
        {
            string strMsgUsuario = "";
            List<UnidadOrg> lista = new List<UnidadOrg>();
            try
            {
                using (proxyOrg = new OrganizacionSrvClient())
                {
                    lista = proxyOrg.ListarCampoUnidSup(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), IntIdJerOrg, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }
        public JsonResult getcboRepDep(int intcodPais)
        {
            string strMsgUsuario = "";
            List<Ubigeo> lista = new List<Ubigeo>();
            try
            {
                using (proxyOrg = new OrganizacionSrvClient())
                {
                    lista = proxyOrg.ListarUbigeo(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), intcodPais, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }
        public JsonResult getcboRepProvince(string stridPaisDep, string strCoDep)
        {
            string strMsgUsuario = "";
            List<Ubigeo> lista = new List<Ubigeo>();
            try
            {
                using (proxyOrg = new OrganizacionSrvClient())
                {
                    lista = proxyOrg.ListarProvincias(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), stridPaisDep, strCoDep, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }
        public JsonResult getcboRepDistrict(string strCoDep, string stridpaisProv)
        {
            string strMsgUsuario = "";
            List<Ubigeo> lista = new List<Ubigeo>();
            try
            {
                using (proxyOrg = new OrganizacionSrvClient())
                {
                    lista = proxyOrg.ListarDistrict(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), strCoDep, stridpaisProv, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }
        public JsonResult getLegal(string strfiltroLegal)
        {
            string strMsgUsuario = "";
            List<RepLegal> lista = new List<RepLegal>();
            try
            {
                using (proxyOrg = new OrganizacionSrvClient())
                {
                    lista = proxyOrg.ListarRepLegal(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), strfiltroLegal, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }
        public JsonResult getRes(string strfiltroPersonal)
        {
            string strMsgUsuario = "";
            if (strfiltroPersonal == null)
                strfiltroPersonal = "";
            List<wsOrganizacion.Personal> lista = new List<wsOrganizacion.Personal>();
            try
            {
                using (proxyOrg = new OrganizacionSrvClient())
                {
                    lista = proxyOrg.ListarResponsable(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), strfiltroPersonal, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }
        public JsonResult GetTablaUnidOrg(string strfilter, int intfiltrojer, int IntActivoFilter)
        {
            string strMsgUsuario = "";
            List<UnidadOrgData> lista = new List<UnidadOrgData>();
            try
            {
                using (proxyOrg = new OrganizacionSrvClient())
                {
                    lista = proxyOrg.ListarUnidadOrg(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), strfilter, intfiltrojer, IntActivoFilter, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }
        public JsonResult ObtenerOrganizacionPorsuPK(int intIdOrganizacion)
        {
            string strMsgUsuario = "";
            List<UnidadOrg> lista = new List<UnidadOrg>();
            try
            {
                using (proxyOrg = new OrganizacionSrvClient())
                {
                    lista = proxyOrg.ObtenerOrganizacionporsuPK(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), intIdOrganizacion, ref strMsgUsuario).ToList();
                }
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }
        public JsonResult InsertUpdateUnidadOrg(UnidadOrg UnidadOrg, int intTipoOperacion)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";
            try
            {
                bool insert = false;
                using (proxy = new OrganizacionSrvClient())
                {
                    insert = proxy.IUUnidadOrg(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), Auth.intIdUsuario(), intTipoOperacion, UnidadOrg, ref strMsgUsuario);
                    proxy.Close();
                }

                if (strMsgUsuario.Equals("") && insert)
                {
                    result.type = "success";
                    if (intTipoOperacion == 1)
                    {
                        result.message = "El registro se insertó satisfactoriamente.";
                    }
                    else
                    {
                        result.message = "El registro se actualizó satisfactoriamente.";
                    }
                }
                else
                {
                    result.type = "infoc";
                    result.message = strMsgUsuario;
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
                result.type = "error";//result.type = "errorGeneral"; //modificado 04/08/2021
                if (intTipoOperacion == 1)
                {
                    result.message = "Ocurrió un inconveniente al insertar la Unidad Organización";
                }
                else
                {
                    result.message = "Ocurrió un inconveniente al actualizar la Unidad Organización";
                }
            }
            return Json(result);
        }
        public JsonResult GetFiltroObliJer(string filtro)
        {
            string strMsgUsuario = "";
            List<JerCampDet> lista = new List<JerCampDet>();
            try
            {
                using (proxyOrg = new OrganizacionSrvClient())
                {
                    lista = proxyOrg.ListarFiltroCampJer(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), filtro, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }
        public JsonResult EliminarUnidad(int intIdUniOrg)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";
            try
            {
                bool delete = false;
                using (proxy = new OrganizacionSrvClient())
                {
                    delete = proxy.EliminmarUnidadOrg(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), 1, intIdUniOrg, ref strMsgUsuario);
                    proxy.Close();
                }

                if (strMsgUsuario.Equals("") && delete)
                {
                    result.type = "success";
                    result.message = "El registro fue eliminado correctamente";
                }
                else
                {
                    result.type = "error";
                    result.message = strMsgUsuario;
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al eliminar el registro";
            }
            return Json(result);
        }
        public JsonResult UbigeoInvertido(int intIdUbigeo)
        {
            string strMsgUsuario = "";
            List<Ubigeo> lista = new List<Ubigeo>();
            try
            {
                using (proxyOrg = new OrganizacionSrvClient())
                {
                    lista = proxyOrg.LlenarUbigeoInverso(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), intIdUbigeo, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }
        public JsonResult getUbigSup(int tipo, int ide)
        {
            string strMsgUsuario = "";
            List<Ubigeo> lista = new List<Ubigeo>();
            try
            {
                using (proxyOrg = new OrganizacionSrvClient())
                {
                    lista = proxyOrg.ObtenerUbigeosyListas(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), tipo, ide, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }
        public JsonResult CamposAdicionalesUO(string strEntidad, int intidJerOrg = 0)
        {
            string strMsgUsuario = "";
            List<CamposAdicionales2> lista = new List<CamposAdicionales2>();

            try
            {
                using (proxyOrg = new OrganizacionSrvClient())
                {
                    lista = proxyOrg.ListarCamposAdicionalesUO(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), strEntidad, intidJerOrg, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);

        }
        #endregion Unidad Organizacional

        #region Cargo
        public ActionResult Cargo(string intIdMenu, string strCodMenu)//originalmente solo tenia el parámetro intIdMenu
        {
            if (ValidarSession_view())//if (Auth.isAuthenticated())
            {
                intIdMenuGlo = Convert.ToInt32(intIdMenu);
                SeguridadController.strcoMenuGlo = strCodMenu;//añadido 06.05.2021 uso general
                return View();//return View(listaCargo);
            }
            return RedirectToAction("CerrarSesion", "LoginSiscop");
        }
        public ActionResult NuevoCargo()
        {
            string strMsgUsuario = "";
            List<wsPersona.TGTipoEN> listDepen = new List<wsPersona.TGTipoEN>();//añadida 20.08.2021

            using (proxyPer = new PersonalSrvClient())
            {
                listDepen = proxyPer.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), "TGJERARQORG", 0, "DEPEN_MAESTROS", "", ref strMsgUsuario).ToList();
                proxyPer.Close();
            }
            ViewBag.CampJerar = new SelectList(listDepen, "intidTipo", "strDeTipo");//añadido 23.08.2021
            object[] Datos = { ViewBag.CampJerar };
            return PartialView("_partialNuevoCargo", Datos);
        }
        public ActionResult EditarCargo(Cargo objCargo)
        {
            string strMsgUsuario = "";
            List<Cargo> list_car_det = new List<Cargo>();
            List<wsPersona.TGTipoEN> listDepen = new List<wsPersona.TGTipoEN>();//añadida 20.08.2021

            using (proxyPer = new PersonalSrvClient())
            {
                listDepen = proxyPer.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), "TGJERARQORG", 0, "DEPEN_MAESTROS", "", ref strMsgUsuario).ToList();
                proxyPer.Close();
            }
            ViewBag.CampJerar = new SelectList(listDepen, "intidTipo", "strDeTipo");//añadido 23.08.2021
            using (proxyOrg = new OrganizacionSrvClient())
            {
                list_car_det = proxyOrg.ConsultarDetalleCargoxCod(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), objCargo.intIdCargo, ref strMsgUsuario).ToList();
                proxyOrg.Close();
            }
            object[] Datos = { ViewBag.CampJerar, list_car_det };
            return PartialView("_partialEditarCargo", Datos);
        }
        public JsonResult getTablaFiltradaCargos(int IntActivoFilter, string strfilter, int intfiltrojer)
        {
            string strMsgUsuario = "";
            List<Cargo> lista = new List<Cargo>();
            try
            {
                using (proxyOrg = new OrganizacionSrvClient())
                {
                    lista = proxyOrg.ListarCargos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), IntActivoFilter, strfilter, intfiltrojer, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }
        public JsonResult InsertUpdateCargo(Cargo Cargo, int intTipoOperacion)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";
            try
            {
                bool insert = false;
                using (proxy = new OrganizacionSrvClient())
                {
                    insert = proxy.IUCargo(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), Auth.intIdUsuario(), intTipoOperacion, Cargo, ref strMsgUsuario);
                    proxy.Close();
                }

                if (strMsgUsuario.Equals("") && insert)
                {
                    result.type = "success";
                    if (intTipoOperacion == 1)
                    {
                        result.message = "El registro se insertó satisfactoriamente.";
                    }
                    else
                    {
                        result.message = "El registro se actualizó satisfactoriamente.";
                    }
                }
                else
                {
                    result.type = "infoc";
                    result.message = strMsgUsuario;
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
                result.type = "error";//result.type = "errorGeneral"; //modificado 04/08/2021
                if (intTipoOperacion == 1)
                {
                    result.message = "Ocurrió un inconveniente al insertar la Unidad Organización";
                }
                else
                {
                    result.message = "Ocurrió un inconveniente al actualizar la Unidad Organización";
                }
            }
            return Json(result);
        }
        public JsonResult EliminarCargo(int intIdCargo)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";
            try
            {
                bool delete = false;

                using (proxy = new OrganizacionSrvClient())
                {
                    delete = proxy.EliminarCargo(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), Auth.intIdUsuario(), intIdCargo, ref strMsgUsuario);
                    proxy.Close();
                }

                if (strMsgUsuario.Equals("") && delete)
                {
                    result.type = "success";
                    result.message = "El registro fue eliminado correctamente";
                }
                else
                {
                    result.type = "error";
                    result.message = strMsgUsuario;
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al eliminar el registro";
            }
            return Json(result);
        }
        public JsonResult getUnidxJerarquia(int IntIdJerOrg)
        {
            string strMsgUsuario = "";
            List<UnidadOrg> lista = new List<UnidadOrg>();
            try
            {
                using (proxyOrg = new OrganizacionSrvClient())
                {
                    lista = proxyOrg.ListarCampoUnidOrga(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), IntIdJerOrg, ref strMsgUsuario).ToList();
                    proxyOrg.Close();

                }
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);

        }

        #endregion Cargo

        #region Categoría
        public ActionResult Categoria(string intIdMenu, string strCodMenu)//originalmente solo tenia el parámetro intIdMenu
        {
            if (ValidarSession_view())//if (Auth.isAuthenticated())
            {
                intIdMenuGlo = Convert.ToInt32(intIdMenu);
                SeguridadController.strcoMenuGlo = strCodMenu;//añadido 06.05.2021 uso general
                return View();
            }

            using (proxyOrg = new OrganizacionSrvClient())
            {
                proxyOrg.Close();
            }
            return RedirectToAction("CerrarSesion", "LoginSiscop");

        }
        public ActionResult NuevaCategoria()
        {
            string strMsgUsuario = "";

            //añadido 23.08.2021
            //List<JerarquiaOrg> lista_Unid_Sup = new List<JerarquiaOrg>();
            List<wsPersona.TGTipoEN> listDepen = new List<wsPersona.TGTipoEN>();//añadida 20.08.2021

            using (proxyPer = new PersonalSrvClient())
            {
                listDepen = proxyPer.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), "TGJERARQORG", 0, "DEPEN_MAESTROS", "", ref strMsgUsuario).ToList();
                proxyPer.Close();
            }
            //using (proxyOrg = new OrganizacionSrvClient())
            //{
            //    lista_Unid_Sup = proxyOrg.ListarCampoJerarquía(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), ref strMsgUsuario).ToList();
            //    proxyOrg.Close();
            //}
            //ViewBag.CampJerar = new SelectList(lista_Unid_Sup, "IntIdJerOrg", "strNomJerOrg");//comentado 23.08.2021
            ViewBag.CampJerar = new SelectList(listDepen, "intidTipo", "strDeTipo");//añadido 23.08.2021
                                                                                    //---------------------------------------------------

            object[] Datos = { ViewBag.CampJerar };
            return PartialView("_partialNuevaCategoria", Datos);
        }
        public ActionResult EditarCategoria(Categoria objCategoria)
        {
            string strMsgUsuario = "";
            //añadido 23.08.2021
            //List<JerarquiaOrg> lista_Unid_Sup = new List<JerarquiaOrg>();
            List<wsPersona.TGTipoEN> listDepen = new List<wsPersona.TGTipoEN>();//añadida 20.08.2021

            using (proxyPer = new PersonalSrvClient())
            {
                listDepen = proxyPer.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), "TGJERARQORG", 0, "DEPEN_MAESTROS", "", ref strMsgUsuario).ToList();
                proxyPer.Close();
            }
            //ViewBag.CampJerar = new SelectList(lista_Unid_Sup, "IntIdJerOrg", "strNomJerOrg");//comentado 23.08.2021
            ViewBag.CampJerar = new SelectList(listDepen, "intidTipo", "strDeTipo");//añadido 23.08.2021
            //---------------------------------------------------

            List<Categoria> categoriaDet = new List<Categoria>();
            using (proxyOrg = new OrganizacionSrvClient())
            {
                //lista_Unid_Sup = proxyOrg.ListarCampoJerarquía(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), ref strMsgUsuario).ToList();//comentado 23.08.2021
                categoriaDet = proxyOrg.ConsultarDetalleCategoriaxCod(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), objCategoria.intIdCateg, ref strMsgUsuario).ToList();
                proxyOrg.Close();
            }

            object[] Datos = { ViewBag.CampJerar, categoriaDet };
            return PartialView("_partialEditarCategoria", Datos);
        }

        public JsonResult RegistrarNuevaCategoria(Categoria categoria)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                bool insert = false;

                using (proxy = new OrganizacionSrvClient())
                {
                    insert = proxy.IUCategoria(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), Auth.intIdUsuario(), 1, categoria, ref strMsgUsuario);
                    proxy.Close();
                }

                if (strMsgUsuario.Equals("") && insert)
                {
                    result.type = "success";
                    result.message = "El registro se insertó satisfactoriamente.";
                }
                else
                {
                    result.type = "infoc";
                    result.message = strMsgUsuario;
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al registrar la Categoria";
            }

            return Json(result);
        }

        public JsonResult ActualizarCategoria(Categoria objDatos)
        {

            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                bool insert = false;

                using (proxy = new OrganizacionSrvClient())
                {
                    insert = proxy.IUCategoria(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), Auth.intIdUsuario(), 2, objDatos, ref strMsgUsuario);
                    proxy.Close();
                }

                if (strMsgUsuario.Equals("") && insert)
                {
                    result.type = "success";
                    result.message = "El registro se actualizó  satisfactoriamente.";
                }
                else
                {
                    result.type = "infoc";
                    result.message = strMsgUsuario;
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al actualizar la Categoria";
            }

            return Json(result);
        }

        public JsonResult GetTablaFiltradaCategorias(int IntActivoFilter, string strfilter, int intfiltrojer)
        {
            string strMsgUsuario = "";
            List<Categoria> lista = new List<Categoria>();
            try
            {
                using (proxyOrg = new OrganizacionSrvClient())
                {
                    lista = proxyOrg.ListarCategorias(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), IntActivoFilter, strfilter, intfiltrojer, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                // return Json(ListarCategorias);
                //modificado el 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }

        public JsonResult EliminarCategoria(int intIdCategoria)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                bool delete = false;

                using (proxy = new OrganizacionSrvClient())
                {
                    delete = proxy.EliminarCategoria(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), 1, intIdCategoria, ref strMsgUsuario);
                    proxy.Close();
                }

                if (strMsgUsuario.Equals("") && delete)
                {
                    result.type = "success";
                    result.message = "El registro fue eliminado correctamente";
                }
                else
                {
                    result.type = "error";
                    result.message = strMsgUsuario;
                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al eliminar el registro";
            }

            return Json(result);
        }

        #endregion Categoría

        #region Tipo Personal
        public ActionResult TipoPersonal(string intIdMenu, string strCodMenu)//originalmente solo tenia el parámetro intIdMenu
        {
            if (ValidarSession_view())//if (Auth.isAuthenticated())
            {
                intIdMenuGlo = Convert.ToInt32(intIdMenu);
                SeguridadController.strcoMenuGlo = strCodMenu;//añadido 06.05.2021 uso general
                return View();
            }
            return RedirectToAction("CerrarSesion", "LoginSiscop");
        }
        public ActionResult NuevoTipoPersonal()
        {
            string strMsgUsuario = "";
            //añadido 23.08.2021
            //List<JerarquiaOrg> lista_Unid_Sup = new List<JerarquiaOrg>();
            List<wsPersona.TGTipoEN> listDepen = new List<wsPersona.TGTipoEN>();//añadida 20.08.2021

            using (proxyPer = new PersonalSrvClient())
            {
                listDepen = proxyPer.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), "TGJERARQORG", 0, "DEPEN_MAESTROS", "", ref strMsgUsuario).ToList();
                proxyPer.Close();
            }
            //using (proxyOrg = new OrganizacionSrvClient())
            //{
            //    lista_Unid_Sup = proxyOrg.ListarCampoJerarquía(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), ref strMsgUsuario).ToList();
            //    proxyOrg.Close();
            //}
            //ViewBag.CampJerar = new SelectList(lista_Unid_Sup, "IntIdJerOrg", "strNomJerOrg");//comentado 23.08.2021
            ViewBag.CampJerar = new SelectList(listDepen, "intidTipo", "strDeTipo");//añadido 23.08.2021
            //---------------------------------------------------
            object[] Datos = { ViewBag.CampJerar };
            return PartialView("_partialNuevoTipoPersonal", Datos);
        }
        public ActionResult EditarTipoPerso(TipoPerson ObjTipoper)
        {
            string strMsgUsuario = "";
            //añadido 23.08.2021
            //List<JerarquiaOrg> lista_Unid_Sup = new List<JerarquiaOrg>();
            List<wsPersona.TGTipoEN> listDepen = new List<wsPersona.TGTipoEN>();//añadida 20.08.2021

            using (proxyPer = new PersonalSrvClient())
            {
                listDepen = proxyPer.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), "TGJERARQORG", 0, "DEPEN_MAESTROS", "", ref strMsgUsuario).ToList();
                proxyPer.Close();
            }
            //ViewBag.CampJerar = new SelectList(lista_Unid_Sup, "IntIdJerOrg", "strNomJerOrg");//comentado 23.08.2021
            ViewBag.CampJerar = new SelectList(listDepen, "intidTipo", "strDeTipo");//añadido 23.08.2021
            //---------------------------------------------------

            List<TipoPerson> lista_tipoper = new List<TipoPerson>();

            using (proxyOrg = new OrganizacionSrvClient())
            {
                //lista_Unid_Sup = proxyOrg.ListarCampoJerarquía(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), ref strMsgUsuario).ToList();//comentado 23.08.2021
                lista_tipoper = proxyOrg.ConsultarDetalleTipoPerxCod(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), ObjTipoper.IntIdTiPers, ref strMsgUsuario).ToList();
                proxyOrg.Close();
            }
            object[] Datos = { ViewBag.CampJerar, lista_tipoper };
            return PartialView("_PartialEditarTipoPersonal", Datos);
        }

        public JsonResult GetTablaFiltradaTipoPerson(int IntActivoFilter, string strfilter, int intfiltrojer)
        {
            string strMsgUsuario = "";
            List<TipoPerson> lista = new List<TipoPerson>();
            try
            {
                using (proxyOrg = new OrganizacionSrvClient())
                {
                    lista = proxyOrg.ListarTipoPerson(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), IntActivoFilter, strfilter, intfiltrojer, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                //return Json(lista);
                //modificado el 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);

        }

        public JsonResult RegistrarNuevoTipoPerson(TipoPerson tipoPerson)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                bool insert = false;

                using (proxy = new OrganizacionSrvClient())
                {
                    insert = proxy.IUTipoPersonal(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), Auth.intIdUsuario(), 1, tipoPerson, ref strMsgUsuario);
                    proxy.Close();
                }

                if (strMsgUsuario.Equals("") && insert)
                {
                    result.type = "success";
                    result.message = "El registro se insertó satisfactoriamente.";
                }
                else
                {
                    result.type = "infoc";
                    result.message = strMsgUsuario;
                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al registrar el Tipo de Personal";
            }

            return Json(result);
        }
        public JsonResult ActualizarTipoPerso(TipoPerson objDatos)
        {

            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                bool insert = false;

                using (proxy = new OrganizacionSrvClient())
                {
                    insert = proxy.IUTipoPersonal(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), Auth.intIdUsuario(), 2, objDatos, ref strMsgUsuario);
                    proxy.Close();
                }

                if (strMsgUsuario.Equals("") && insert)
                {
                    result.type = "success";
                    result.message = "El registro se actualizó  satisfactoriamente.";
                }
                else
                {
                    result.type = "infoc";
                    result.message = strMsgUsuario;
                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al actualizar el Tipo Personal";
            }

            return Json(result);
        }

        public JsonResult EliminarTipoPerson(int intIdTipo)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                bool delete = false;

                using (proxy = new OrganizacionSrvClient())
                {
                    delete = proxy.EliminarTipo(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), 1, intIdTipo, ref strMsgUsuario);
                    proxy.Close();
                }

                if (strMsgUsuario.Equals("") && delete)
                {
                    result.type = "success";
                    result.message = "El registro fue eliminado correctamente";
                }
                else
                {
                    result.type = "error";
                    result.message = strMsgUsuario;
                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al eliminar el registro";
            }

            return Json(result);
        }

        #endregion Tipo Personal

        #region Grupo
        public ActionResult Grupo(string intIdMenu, string strCodMenu)//originalmente solo tenia el parámetro intIdMenu
        {
            if (ValidarSession_view())//if (Auth.isAuthenticated())
            {
                intIdMenuGlo = Convert.ToInt32(intIdMenu);
                SeguridadController.strcoMenuGlo = strCodMenu;//añadido 06.05.2021 uso general
                return View();
            }
            return RedirectToAction("CerrarSesion", "LoginSiscop");
        }
        public ActionResult NuevoGrupo()
        {
            string strMsgUsuario = "";
            //añadido 23.08.2021
            //List<JerarquiaOrg> lista_Unid_Sup = new List<JerarquiaOrg>();
            List<wsPersona.TGTipoEN> listDepen = new List<wsPersona.TGTipoEN>();//añadida 20.08.2021

            using (proxyPer = new PersonalSrvClient())
            {
                listDepen = proxyPer.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), "TGJERARQORG", 0, "DEPEN_MAESTROS", "", ref strMsgUsuario).ToList();
                proxyPer.Close();
            }
            //using (proxyOrg = new OrganizacionSrvClient())
            //{
            //    lista_Unid_Sup = proxyOrg.ListarCampoJerarquía(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), ref strMsgUsuario).ToList();
            //    proxyOrg.Close();
            //}
            //ViewBag.CampJerar = new SelectList(lista_Unid_Sup, "IntIdJerOrg", "strNomJerOrg");//comentado 23.08.2021
            ViewBag.CampJerar = new SelectList(listDepen, "intidTipo", "strDeTipo");//añadido 23.08.2021
            //---------------------------------------------------
            object[] Datos = { ViewBag.CampJerar };
            return PartialView("_partialNuevoGrupo", Datos);
        }
        public ActionResult EditarGrupo(Grupo ObjGrupo)
        {
            string strMsgUsuario = "";
            //añadido 23.08.2021
            //List<JerarquiaOrg> lista_Unid_Sup = new List<JerarquiaOrg>();
            List<wsPersona.TGTipoEN> listDepen = new List<wsPersona.TGTipoEN>();//añadida 20.08.2021

            using (proxyPer = new PersonalSrvClient())
            {
                listDepen = proxyPer.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), "TGJERARQORG", 0, "DEPEN_MAESTROS", "", ref strMsgUsuario).ToList();
                proxyPer.Close();
            }
            //ViewBag.CampJerar = new SelectList(lista_Unid_Sup, "IntIdJerOrg", "strNomJerOrg");//comentado 23.08.2021
            ViewBag.CampJerar = new SelectList(listDepen, "intidTipo", "strDeTipo");//añadido 23.08.2021
            //---------------------------------------------------
            List<Grupo> lista_grupo = new List<Grupo>();

            using (proxyOrg = new OrganizacionSrvClient())
            {
                //lista_Unid_Sup = proxyOrg.ListarCampoJerarquía(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), ref strMsgUsuario).ToList();//comentado 23.08.2021
                lista_grupo = proxyOrg.ConsultarDetalleGrupoxCod(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), ObjGrupo.intIdGrupo, ref strMsgUsuario).ToList();

                proxyOrg.Close();
            }
            object[] Datos = { ViewBag.CampJerar, lista_grupo };
            return PartialView("_PartialEditarGrupo", Datos);
        }

        public JsonResult GetTablaFiltradaGrupo(int IntActivoFilter, string strfilter, int intfiltrojer)
        {
            string strMsgUsuario = "";
            List<Grupo> lista = new List<Grupo>();
            try
            {
                using (proxyOrg = new OrganizacionSrvClient())
                {
                    lista = proxyOrg.ListarGrupos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), IntActivoFilter, strfilter, intfiltrojer, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                //return Json(ListarGrupos);
                //modificado el 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);

        }

        public JsonResult RegistrarNuevoGrupo(Grupo Grupo)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                bool insert = false;

                using (proxy = new OrganizacionSrvClient())
                {
                    insert = proxy.IUGrupo(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), Auth.intIdUsuario(), 1, Grupo, ref strMsgUsuario);
                    proxy.Close();
                }

                if (strMsgUsuario.Equals("") && insert)
                {
                    result.type = "success";
                    result.message = "El registro se insertó satisfactoriamente.";
                }
                else
                {
                    //if (strMsgUsuario.Contains("descripción"))
                    //{
                    //    result.type = "error";
                    //    result.message = strMsgUsuario;
                    //}
                    //else
                    //{
                    //    result.type = "info";
                    //    result.message = strMsgUsuario;
                    //}
                    result.type = "infoc";
                    result.message = strMsgUsuario;
                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al registrar el Grupo";
            }

            return Json(result);
        }

        public JsonResult EliminarGrupo(int intIdGrupo)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                bool delete = false;

                using (proxy = new OrganizacionSrvClient())
                {
                    delete = proxy.EliminarGrup(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), 1, intIdGrupo, ref strMsgUsuario);
                    proxy.Close();
                }

                if (strMsgUsuario.Equals("") && delete)
                {
                    result.type = "success";
                    result.message = "El registro fue eliminado correctamente";
                }
                else
                {
                    result.type = "error";
                    result.message = strMsgUsuario;
                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al eliminar el registro";
            }

            return Json(result);
        }

        public JsonResult ActualizarGrupo(Grupo objDatos)
        {

            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                bool insert = false;

                using (proxy = new OrganizacionSrvClient())
                {
                    insert = proxy.IUGrupo(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), Auth.intIdUsuario(), 2, objDatos, ref strMsgUsuario);
                    proxy.Close();
                }

                if (strMsgUsuario.Equals("") && insert)
                {
                    result.type = "success";
                    result.message = "El registro se actualizó  satisfactoriamente.";
                }
                else
                {
                    //if (strMsgUsuario.Contains("descripción"))
                    //{
                    //    result.type = "error";
                    //    result.message = strMsgUsuario;
                    //}
                    //else
                    //{
                    //    result.type = "info";
                    //    result.message = strMsgUsuario;
                    //}
                    result.type = "infoc";
                    result.message = strMsgUsuario;
                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al actualizar el Grupo";
            }

            return Json(result);
        }

        #endregion Grupo

        #region planilla
        public ActionResult Planilla(string intIdMenu, string strCodMenu)//originalmente solo tenia el parámetro intIdMenu
        {
            if (ValidarSession_view())//if (Auth.isAuthenticated())
            {
                intIdMenuGlo = Convert.ToInt32(intIdMenu);
                SeguridadController.strcoMenuGlo = strCodMenu;//añadido 06.05.2021 uso general
                return View();
            }
            return RedirectToAction("CerrarSesion", "LoginSiscop");
        }
        public ActionResult NuevaPlanilla()
        {
            string strMsgUsuario = "";
            //añadido 23.08.2021
            //List<JerarquiaOrg> lista_Unid_Sup = new List<JerarquiaOrg>();
            List<wsPersona.TGTipoEN> listDepen = new List<wsPersona.TGTipoEN>();//añadida 20.08.2021

            using (proxyPer = new PersonalSrvClient())
            {
                listDepen = proxyPer.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), "TGJERARQORG", 0, "DEPEN_MAESTROS", "", ref strMsgUsuario).ToList();
                proxyPer.Close();
            }
            //using (proxyOrg = new OrganizacionSrvClient())
            //{
            //    lista_Unid_Sup = proxyOrg.ListarCampoJerarquía(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), ref strMsgUsuario).ToList();
            //    proxyOrg.Close();
            //}
            //ViewBag.CampJerar = new SelectList(lista_Unid_Sup, "IntIdJerOrg", "strNomJerOrg");//comentado 23.08.2021
            ViewBag.CampJerar = new SelectList(listDepen, "intidTipo", "strDeTipo");//añadido 23.08.2021
            //---------------------------------------------------
            object[] Datos = { ViewBag.CampJerar };
            return PartialView("_partialNuevaPlanilla", Datos);
        }
        public ActionResult EditarPlanilla(Planilla ObjPlanilla)
        {
            string strMsgUsuario = "";
            //añadido 23.08.2021
            //List<JerarquiaOrg> lista_Unid_Sup = new List<JerarquiaOrg>();
            List<wsPersona.TGTipoEN> listDepen = new List<wsPersona.TGTipoEN>();//añadida 20.08.2021

            using (proxyPer = new PersonalSrvClient())
            {
                listDepen = proxyPer.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), "TGJERARQORG", 0, "DEPEN_MAESTROS", "", ref strMsgUsuario).ToList();
                proxyPer.Close();
            }
            //using (proxyOrg = new OrganizacionSrvClient())
            //{
            //    lista_Unid_Sup = proxyOrg.ListarCampoJerarquía(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), ref strMsgUsuario).ToList();
            //    proxyOrg.Close();
            //}
            //ViewBag.CampJerar = new SelectList(lista_Unid_Sup, "IntIdJerOrg", "strNomJerOrg");//comentado 23.08.2021
            ViewBag.CampJerar = new SelectList(listDepen, "intidTipo", "strDeTipo");//añadido 23.08.2021
            //---------------------------------------------------
            List<Planilla> lista_planilla = new List<Planilla>();

            using (proxyOrg = new OrganizacionSrvClient())
            {
                // lista_Unid_Sup = proxyOrg.ListarCampoJerarquía(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), ref strMsgUsuario).ToList();//comentado 23.08.2021
                lista_planilla = proxyOrg.ConsultarDetallePlanillaxCod(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), ObjPlanilla.intIdPlanilla, ref strMsgUsuario).ToList();
                proxyOrg.Close();
            }
            object[] Datos = { ViewBag.CampJerar, lista_planilla };
            return PartialView("_PartialEditarPlanilla", Datos);
        }

        public JsonResult GetTablaPlanilla(int IntActivoFilter, string strfilter, int intfiltrojer)
        {
            string strMsgUsuario = "";
            List<Planilla> lista = new List<Planilla>();
            try
            {
                using (proxyOrg = new OrganizacionSrvClient())
                {
                    lista = proxyOrg.ListarPlanilla(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), IntActivoFilter, strfilter, intfiltrojer, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                //return Json(ListarPlanilla);
                //modificado el 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);

        }

        public JsonResult RegistrarNuevaPlanilla(Planilla Planilla)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                bool insert = false;

                using (proxy = new OrganizacionSrvClient())
                {
                    insert = proxy.IUPlanilla(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), Auth.intIdUsuario(), 1, Planilla, ref strMsgUsuario);
                    proxy.Close();
                }

                if (strMsgUsuario.Equals("") && insert)
                {
                    result.type = "success";
                    result.message = "El registro se insertó satisfactoriamente.";
                }
                else
                {
                    result.type = "infoc";
                    result.message = strMsgUsuario;
                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al registrar la Planilla";
            }

            return Json(result);
        }

        public JsonResult EliminarPlanilla(int IdPlanilla)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                bool delete = false;

                using (proxy = new OrganizacionSrvClient())
                {
                    delete = proxy.EliminarPlanilla(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), 1, IdPlanilla, ref strMsgUsuario);
                    proxy.Close();
                }

                if (strMsgUsuario.Equals("") && delete)
                {
                    result.type = "success";
                    result.message = "El registro fue eliminado correctamente";
                }
                else
                {
                    result.type = "error";
                    result.message = strMsgUsuario;
                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al eliminar el registro";
            }

            return Json(result);
        }

        [HttpPost]
        public JsonResult ActualizarPlanilla(Planilla objDatos)
        {

            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                bool insert = false;

                using (proxy = new OrganizacionSrvClient())
                {
                    insert = proxy.IUPlanilla(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), Auth.intIdUsuario(), 2, objDatos, ref strMsgUsuario);
                    proxy.Close();
                }

                if (strMsgUsuario.Equals("") && insert)
                {
                    result.type = "success";
                    result.message = "El registro se actualizó  satisfactoriamente.";
                }
                else
                {
                    //if (strMsgUsuario.Contains("descripción"))
                    //{
                    //    result.type = "error";
                    //    result.message = strMsgUsuario;
                    //}
                    //else
                    //{
                    //    result.type = "info";
                    //    result.message = strMsgUsuario;
                    //}
                    result.type = "infoc";
                    result.message = strMsgUsuario;
                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al actualizar la Planilla";
            }

            return Json(result);
        }
        #endregion planilla

        #region Centro de Costo
        public ActionResult CentroCosto(string intIdMenu, string strCodMenu)//originalmente solo tenia el parámetro intIdMenu
        {
            if (ValidarSession_view())//if (Auth.isAuthenticated())
            {
                intIdMenuGlo = Convert.ToInt32(intIdMenu);
                SeguridadController.strcoMenuGlo = strCodMenu;//añadido 06.05.2021 uso general
                return View();
            }
            return RedirectToAction("CerrarSesion", "LoginSiscop");
        }
        public ActionResult NuevoCentroCosto()
        {
            string strMsgUsuario = "";
            //añadido 23.08.2021
            //List<JerarquiaOrg> lista_Unid_Sup = new List<JerarquiaOrg>();
            List<wsPersona.TGTipoEN> listDepen = new List<wsPersona.TGTipoEN>();//añadida 20.08.2021
            List<wsPersona.TGTipoEN> listTipCC = new List<wsPersona.TGTipoEN>();//añadida 21.09.2021

            using (proxyPer = new PersonalSrvClient())
            {
                listDepen = proxyPer.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), "TGJERARQORG", 0, "DEPEN_MAESTROS", "", ref strMsgUsuario).ToList();
                listTipCC = proxyPer.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), "TGTIPO", 0, "TCC", "TCC", ref strMsgUsuario).ToList();
                proxyPer.Close();
            }
            ViewBag.CampJerar = new SelectList(listDepen, "intidTipo", "strDeTipo");//añadido 23.08.2021
            ViewBag.CampTip = new SelectList(listTipCC, "intidTipo", "strDeTipo");
            object[] Datos = { ViewBag.CampJerar, ViewBag.CampTipo };
            return PartialView("_partialNuevoCentroCosto", Datos);
        }
        public ActionResult EditarCCosto(CCosto ObjCCosto)
        {
            string strMsgUsuario = "";
            List<wsPersona.TGTipoEN> listDepen = new List<wsPersona.TGTipoEN>();//añadida 20.08.2021
            List<wsPersona.TGTipoEN> listTipCC = new List<wsPersona.TGTipoEN>();//añadida 21.09.2021

            using (proxyPer = new PersonalSrvClient())
            {
                listDepen = proxyPer.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), "TGJERARQORG", 0, "DEPEN_MAESTROS", "", ref strMsgUsuario).ToList();
                listTipCC = proxyPer.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), "TGTIPO", 0, "TCC", "TCC", ref strMsgUsuario).ToList();
                proxyPer.Close();
            }
            ViewBag.CampJerar = new SelectList(listDepen, "intidTipo", "strDeTipo");//añadido 23.08.2021
            List<CCosto> listar_CCosto = new List<CCosto>();

            using (proxyOrg = new OrganizacionSrvClient())
            {
                listar_CCosto = proxyOrg.ConsultarDetalleCCostoxCod(3, 1, 4, ObjCCosto.IntIdCCosto, ref strMsgUsuario).ToList();
                proxyOrg.Close();
            }
            ViewBag.CampTip = new SelectList(listTipCC, "intidTipo", "strDeTipo");
            object[] Datos = { ViewBag.CampJerar, listar_CCosto };
            return PartialView("_partialEditarCentroCosto", Datos);
        }

        public JsonResult GetTablaCCosto(int IntActivoFilter, string strfilter, int intfiltrojer)
        {
            string strMsgUsuario = "";
            List<CCosto> lista = new List<CCosto>();
            try
            {
                using (proxyOrg = new OrganizacionSrvClient())
                {
                    lista = proxyOrg.ListarCCosto(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), IntActivoFilter, strfilter, intfiltrojer, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                //return Json(ListarCCosto);
                //modificado el 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);

        }

        public JsonResult RegistrarNuevoCCosto(CCosto CCosto)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                bool insert = false;

                using (proxy = new OrganizacionSrvClient())
                {
                    insert = proxy.IUCCosto(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), Auth.intIdUsuario(), 1, CCosto, ref strMsgUsuario);
                    proxy.Close();
                }

                if (strMsgUsuario.Equals("") && insert)
                {
                    result.type = "success";
                    result.message = "El registro se insertó satisfactoriamente.";
                }
                else
                {
                    //if (strMsgUsuario.Contains("descripción"))
                    //{
                    //    result.type = "error";
                    //    result.message = strMsgUsuario;
                    //}
                    //else
                    //{
                    //    result.type = "info";
                    //    result.message = strMsgUsuario;
                    //}
                    result.type = "infoc";
                    result.message = strMsgUsuario;
                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al registrar el Centro de Costo";
            }

            return Json(result);
        }

        public JsonResult EliminarCCosto(int IntIdCCosto)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                bool delete = false;

                using (proxy = new OrganizacionSrvClient())
                {
                    delete = proxy.EliminarCCosto(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), 1, IntIdCCosto, ref strMsgUsuario);
                    proxy.Close();
                }

                if (strMsgUsuario.Equals("") && delete)
                {
                    result.type = "success";
                    result.message = "El registro fue eliminado correctamente";
                }
                else
                {
                    result.type = "error";
                    result.message = strMsgUsuario;
                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al eliminar el registro";
            }

            return Json(result);
        }

        public JsonResult ActualizarCCosto(CCosto objDatos)
        {

            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                bool insert = false;

                using (proxy = new OrganizacionSrvClient())
                {
                    insert = proxy.IUCCosto(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), Auth.intIdUsuario(), 2, objDatos, ref strMsgUsuario);
                    proxy.Close();
                }

                if (strMsgUsuario.Equals("") && insert)
                {
                    result.type = "success";
                    result.message = "El registro se actualizó  satisfactoriamente.";
                }
                else
                {
                    //if (strMsgUsuario.Contains("descripción"))
                    //{
                    //    result.type = "error";
                    //    result.message = strMsgUsuario;
                    //}
                    //else
                    //{
                    //    result.type = "info";
                    //    result.message = strMsgUsuario;
                    //}
                    result.type = "infoc";
                    result.message = strMsgUsuario;
                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al actualizar el Centro de Costos";
            }

            return Json(result);
        }

        #endregion Centro de Costo

        #region Marcador

        public ActionResult Marcador(string intIdMenu, string strCodMenu)//originalmente solo tenia el parámetro intIdMenu
        {
            if (ValidarSession_view())//if (Auth.isAuthenticated())
            {
                intIdMenuGlo = Convert.ToInt32(intIdMenu);
                SeguridadController.strcoMenuGlo = strCodMenu;//añadido 06.05.2021 uso general
                return View();
            }
            return RedirectToAction("CerrarSesion", "LoginSiscop");
        }
        public ActionResult NuevoMarcador()
        {
            string strMsgUsuario = "";
            List<wsPersona.TGTipoEN> listDepen = new List<wsPersona.TGTipoEN>();//añadida 20.08.2021
            List<wsPersona.TGTipoEN> listFunc = new List<wsPersona.TGTipoEN>();//añadida 22.09.2021
            List<wsPersona.TGTipoEN> listLector = new List<wsPersona.TGTipoEN>();//añadida 22.09.2021
            List<wsPersona.TGTipoEN> listComu = new List<wsPersona.TGTipoEN>();//añadida 22.09.2021
            //añadido 20.08.2021
            using (proxyPer = new PersonalSrvClient())
            {
                listDepen = proxyPer.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), "TGPERSONAL", 0, "EMPRESA", "", ref strMsgUsuario).ToList();
                listFunc = proxyPer.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), "TGTIPO", 0, "MARC", "TFUNC", ref strMsgUsuario).ToList();
                listLector = proxyPer.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), "TGTIPO", 0, "MARC", "TMARCAD", ref strMsgUsuario).ToList();
                listComu = proxyPer.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), "TGTIPO", 0, "MARC", "TCOMU", ref strMsgUsuario).ToList();
                proxyPer.Close();
            }
            ViewBag.CampJerar = new SelectList(listDepen, "intidTipo", "strDeTipo");
            ViewBag.CampFunc = new SelectList(listFunc, "intidTipo", "strDeTipo");
            ViewBag.CampComu = new SelectList(listComu, "intidTipo", "strDeTipo");
            ViewBag.CampMarc = new SelectList(listLector, "intidTipo", "strDeTipo");
            object[] Datos = { ViewBag.CampJerar, ViewBag.CampFunc, ViewBag.CampComu };
            return PartialView("_partialNuevoMarcador", Datos);

        }
        public ActionResult EditarMarcador(wsOrganizacion.Marcador ObjMarcador)
        {
            string strMsgUsuario = "";
            List<wsOrganizacion.Marcador> lista_Marcador = new List<wsOrganizacion.Marcador>();
            List<wsPersona.TGTipoEN> listDepen = new List<wsPersona.TGTipoEN>();//añadida 20.08.2021
            List<wsPersona.TGTipoEN> listFunc = new List<wsPersona.TGTipoEN>();//añadida 22.09.2021
            List<wsPersona.TGTipoEN> listLector = new List<wsPersona.TGTipoEN>();//añadida 22.09.2021
            List<wsPersona.TGTipoEN> listComu = new List<wsPersona.TGTipoEN>();//añadida 22.09.2021
            //añadido 20.08.2021
            using (proxyPer = new PersonalSrvClient())
            {
                listDepen = proxyPer.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), "TGPERSONAL", 0, "EMPRESA", "U", ref strMsgUsuario).ToList();
                listFunc = proxyPer.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), "TGTIPO", 0, "MARC", "TFUNC", ref strMsgUsuario).ToList();
                listLector = proxyPer.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), "TGTIPO", 0, "MARC", "TMARCAD", ref strMsgUsuario).ToList();
                listComu = proxyPer.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), "TGTIPO", 0, "MARC", "TCOMU", ref strMsgUsuario).ToList();
                proxyPer.Close();
            }

            using (proxyOrg = new OrganizacionSrvClient())
            {
                lista_Marcador = proxyOrg.ConsultarDetalleMarcadorxCod(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), ObjMarcador.intIdMarcador, ref strMsgUsuario).ToList();
                proxyOrg.Close();
            }
            //MODIFICADO PARA TRAER SOLO EL LOCAL 20.08.2021
            ViewBag.CampJerar = new SelectList(listDepen, "intidTipo", "strDeTipo");
            ViewBag.CampFunc = new SelectList(listFunc, "intidTipo", "strDeTipo");
            ViewBag.CampComu = new SelectList(listComu, "intidTipo", "strDeTipo");
            ViewBag.CampMarc = new SelectList(listLector, "intidTipo", "strDeTipo");
            object[] Datos = { ViewBag.CampJerar, lista_Marcador, ViewBag.CampComu };
            return PartialView("_PartialEditarMarcador", Datos);
        }

        public JsonResult GetTablaMarcador(int IntActivoFilter, string strfilter)
        {
            string strMsgUsuario = "";
            List<wsOrganizacion.Marcador> lista = new List<wsOrganizacion.Marcador>();
            try
            {
                using (proxyOrg = new OrganizacionSrvClient())
                {
                    lista = proxyOrg.ListarMarcador(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), IntActivoFilter, strfilter, ref strMsgUsuario).ToList();

                    proxyOrg.Close();
                }
                //return Json(ListarMarcador);
                //modificado el 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);

        }

        public JsonResult RegistrarNuevoMarcador(wsOrganizacion.Marcador Marcador)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                bool insert = false;

                using (proxy = new OrganizacionSrvClient())
                {
                    insert = proxy.IUMarcador(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), Auth.intIdUsuario(), 1, Marcador, ref strMsgUsuario);
                    proxy.Close();
                }

                if (strMsgUsuario.Equals("") && insert)
                {
                    result.type = "success";
                    result.message = "El registro se insertó satisfactoriamente.";
                }
                else
                {
                    //if (strMsgUsuario.Contains("|"))
                    //{
                    //    result.type = "info";
                    //    result.message = strMsgUsuario;
                    //}
                    //else
                    //{

                    //    if (strMsgUsuario.Contains("tipo") || strMsgUsuario.Contains("mayor") || strMsgUsuario.Contains("IP") || strMsgUsuario.Contains("puerto"))
                    //    {
                    //        result.type = "alert";
                    //        result.message = strMsgUsuario;
                    //    }
                    //    else
                    //    {
                    //        result.type = "info";
                    //        result.message = strMsgUsuario;
                    //    }

                    //}
                    result.type = "infoc";
                    result.message = strMsgUsuario;
                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al registrar el Marcador";
            }

            return Json(result);
        }

        public JsonResult EliminarMarcador(int intIdMarcador)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                bool delete = false;

                using (proxy = new OrganizacionSrvClient())
                {
                    delete = proxy.EliminarMarcador(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), Auth.intIdUsuario(), intIdMarcador, ref strMsgUsuario);
                    proxy.Close();
                }

                if (strMsgUsuario.Equals("") && delete)
                {
                    result.type = "success";
                    result.message = "El registro fue eliminado correctamente";
                }
                else
                {
                    result.type = "error";
                    result.message = strMsgUsuario;
                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al eliminar el registro";
            }

            return Json(result);
        }
        public JsonResult ObtenerRegistroMarcador(int intIdMarcador)
        {
            string strMsgUsuario = "";
            List<wsOrganizacion.Marcador> lista_Marcador = new List<wsOrganizacion.Marcador>();

            try
            {
                using (proxyOrg = new OrganizacionSrvClient())
                {
                    lista_Marcador = proxyOrg.ConsultarDetalleMarcadorxCod(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), intIdMarcador, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                return Json(lista_Marcador);
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }
        public JsonResult ActualizarMarcador(wsOrganizacion.Marcador objDatos)
        {

            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                bool insert = false;

                using (proxy = new OrganizacionSrvClient())
                {
                    insert = proxy.IUMarcador(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), Auth.intIdUsuario(), 2, objDatos, ref strMsgUsuario);
                    proxy.Close();
                }

                if (strMsgUsuario.Equals("") && insert)
                {
                    result.type = "success";
                    result.message = "El registro se actualizó  satisfactoriamente.";
                }
                else
                {
                    result.type = "infoc";
                    result.message = strMsgUsuario;
                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "OrganizacionController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al actualizar el Marcador";
            }

            return Json(result);
        }

        #endregion Marcador

    }

} 
