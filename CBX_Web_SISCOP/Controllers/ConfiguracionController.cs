using CBX_Web_SISCOP.Models;
using CBX_Web_SISCOP.wsConfiguracion;
using CBX_Web_SISCOP.wsSistema;
using CBX_Web_SISCOP.wsSeguridad;//añadido 22.04.2021
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace CBX_Web_SISCOP.Controllers
{
    public class ConfiguracionController : Controller
    {
        // GET: Configuration   
        private ConfiguracionSrvClient proxy;
        //private SistemaSrvClient proxySystem;
        private SistemaSrvClient proxySis;
        public static int intIdMenuGlo { get; set; }


        //******-------------------------------------------------------------------------------------------------
        #region ValidarSession y Conexión
        //Validación para los eventos
        public JsonResult ValidarSession()
        {
            if (ValidarConexWCF())//Existe comunicacion con el Publicado WCF
            {
                if (!Auth.isAuthenticated())
                {
                    return Json(true);
                }
                return Json(false);

            }
            else
            {
                return Json(true);
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
        #endregion ValidarSession y Conexión
        //******-------------------------------------------------------------------------------------------------


        #region Jerarquía Organizacional

        public ActionResult JerarquiaOrganizacional(string intIdMenu, string strCodMenu)//originalmente solo tenia el parámetro intIdMenu
        {
            if (ValidarSession_view())//if (Auth.isAuthenticated())
            {
                intIdMenuGlo = Convert.ToInt32(intIdMenu);
                SeguridadController.strcoMenuGlo = strCodMenu;//añadido 06.05.2021 uso general
                return View();
            }
            return RedirectToAction("CerrarSesion", "LoginSiscop");
        }

        public JsonResult GetTablaFiltradaJerarquiaOrganizacional(int IntActivoFilter, string strfilter)
        {
            string strMsgUsuario = "";
            List<JerarquiaOrg> lista = new List<JerarquiaOrg>();
            try
            {
                using (proxy = new ConfiguracionSrvClient())
                {
                    lista = proxy.ListarJerarquiaOrg(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(),strfilter, IntActivoFilter, ref strMsgUsuario).ToList();
                    proxy.Close();
                }
                //return Json(lista);
                //modificado 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "ConfiguracionController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);

        }

        [HttpPost]
        public ActionResult NuevaJerarquia()
        {
            try
            {
                CustomResponse result = new CustomResponse();
                string strMsgUsuario = "";
                List<CamposAdicionales> listCA = new List<CamposAdicionales>();
                List<int> listNivelJO = new List<int>();
                using (proxy = new ConfiguracionSrvClient())
                {
                    listCA = proxy.ListarCamposAdicionales(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), 1, ref strMsgUsuario).ToList();
                    listNivelJO = proxy.ListarNivelJerarquico(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), ref strMsgUsuario).ToList();
                    proxy.Close();
                }

                if (strMsgUsuario.Equals(""))
                {
                    var dictionary = new ConfiguracionModel().getNivelMáximoJerarquia(listNivelJO);
                    ViewBag.NIVEL_JER = new SelectList(dictionary, "Key", "Value");

                    object[] datos = { ViewBag.NIVEL_JER, listCA };

                    return PartialView("_partialNuevaJerarquia", datos);
                }
                else
                {
                    result.type = "info";
                    result.message = strMsgUsuario;
                    return Json(result);
                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "ConfiguracionController.cs");
                throw;
            }

        }

        [HttpPost]
        public JsonResult GetCheckxSwitch()
        {

            string strMsgUsuario = "";
            List<CamposAdicionales> lista = new List<CamposAdicionales>();
            try
            {
                using (proxy = new ConfiguracionSrvClient())
                {
                    lista = proxy.ListarCamposAdicionales(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), 1, ref strMsgUsuario).ToList();

                }
                //return Json(listCA);
                //modificado 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "ConfiguracionController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);

        }

        [HttpPost]
        public JsonResult GetNumJeraquia()
        {
            string strMsgUsuario = "";
            int numero;
            try
            {
                using (proxy = new ConfiguracionSrvClient())
                {
                    numero = proxy.GetNumJeraquia(ref strMsgUsuario);

                }
                return Json(numero);

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "ConfiguracionController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);

        }

        [HttpPost]//añadido 15.04.2021
        public JsonResult IUJeraquia(JerarquiaOrg jerarquiaOrg, List<DetalleJerarquiaOrg> detalleJer, int intTipoOperacion)

        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                bool insert = false;
                if (detalleJer == null)
                    detalleJer = new List<DetalleJerarquiaOrg>();

                using (proxy = new ConfiguracionSrvClient())
                {
                    insert = proxy.IUJerarquiaOrg(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), Auth.intIdUsuario(), intTipoOperacion, jerarquiaOrg, detalleJer.ToArray(), ref strMsgUsuario);
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
                    if (strMsgUsuario.Contains("nombre"))
                    {
                        result.type = "error";
                        result.message = strMsgUsuario;
                    }
                    else
                    {
                        result.type = "info";
                        result.message = strMsgUsuario;
                    }

                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "ConfiguracionController.cs");
                result.type = "error";
                if (intTipoOperacion == 1)
                {
                    result.message = "Ocurrió un inconveniente al insertar la Jerarquía";
                }
                else
                {
                    result.message = "Ocurrió un inconveniente al actualizar la Jerarquía";
                }
            }
            return Json(result);
        }

        [HttpPost]
        public JsonResult GetJerarquiaSuperior(int intNivelJer)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";
            try
            {
                List<JerarquiaOrg> listJerPadre = new List<JerarquiaOrg>();

                using (proxy = new ConfiguracionSrvClient())
                {
                    listJerPadre = proxy.ListarJerarquíaSuperior_xNivel(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), intNivelJer, ref strMsgUsuario).ToList();
                    proxy.Close();
                }

                if (strMsgUsuario.Equals(""))
                {
                    result.type = "success";
                    result.message = "";
                }
                else
                {
                    result.type = "error";
                    result.message = strMsgUsuario;
                }
                if (listJerPadre.Count > 0)
                    result.objeto = listJerPadre;

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "ConfiguracionController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al consultar la Jerarquía Superior";
            }

            //return Json(result);
            //modificado 27.05.2021
            var json_ = Json(result, JsonRequestBehavior.AllowGet);
            json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
            return json_;
        }

        //Editar Jeraquía
        [HttpPost]
        public ActionResult DatosJerarquia(JerarquiaOrg jerarquiaOrg)
        {
            DetalleJerarquiaOrg detOrg = new DetalleJerarquiaOrg();
            try
            {
                string strMsgUsuario = "";
                List<CamposAdicionales> listCampAD = new List<CamposAdicionales>();
                List<int> listaNivelJO = new List<int>();
                List<DetalleJerarquiaOrg> listDetJer = new List<DetalleJerarquiaOrg>();
                var listJerPadre = new List<JerarquiaOrg>();
                using (proxy = new ConfiguracionSrvClient())
                {
                    listCampAD = proxy.ListarCamposAdicionales(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), 1, ref strMsgUsuario).ToList();
                    listaNivelJO = proxy.ListarNivelJerarquico(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), ref strMsgUsuario).ToList();
                    if (jerarquiaOrg != null)
                    {
                        listJerPadre = proxy.ListarJerarquíaSuperior_xNivel(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), Convert.ToInt32(jerarquiaOrg.intNivelJer), ref strMsgUsuario).ToList();
                        listDetJer = proxy.ConsultarDetalleJerarquia_xCod(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), jerarquiaOrg.strCoIntJO, ref strMsgUsuario).ToList();
                    }
                    proxy.Close();
                }

                var dictionary = new ConfiguracionModel().getNivelMáximoJerarquia(listaNivelJO, Convert.ToInt32(jerarquiaOrg.intNivelJer));
                ViewBag.NIVEL_JER = new SelectList(dictionary, "Key", "Value", jerarquiaOrg.intNivelJer);

                if (listJerPadre.Count > 0)
                    ViewBag.JER_PADRE = new SelectList(listJerPadre, "strCoIntJO", "strNomJerOrg", jerarquiaOrg.strCoJerPadre);

                object[] dataSend = { jerarquiaOrg, ViewBag.NIVEL_JER, listCampAD, listDetJer, ViewBag.JER_PADRE , detOrg };

                return PartialView("_partialEditarJerarquia", dataSend);
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "ConfiguracionController.cs");
                throw;
            }
        }

        [HttpPost]
        public JsonResult EliminarJeraquia(int IntIdJerOrg)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                bool delete = false;

                using (proxy = new ConfiguracionSrvClient())
                {
                    //delete = proxy.EliminmarJerarquiaOrg(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), 1, IntIdJerOrg, ref strMsgUsuario);
                    delete = proxy.EliminarJerarquiaOrg(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), 1, IntIdJerOrg, ref strMsgUsuario);
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
                Log.AlmacenarLogError(ex, "ConfiguracionController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al eliminar el registro";
            }

            return Json(result);
        }

        #endregion Jerarquía Organizacional

        #region Campos Adicionales

        public ActionResult CamposAdicionales(string intIdMenu, string strCodMenu)//originalmente solo tenia el parámetro intIdMenu
        {

            if (ValidarSession_view())//if (Auth.isAuthenticated())
            {
                intIdMenuGlo = Convert.ToInt32(intIdMenu);
                SeguridadController.strcoMenuGlo = strCodMenu;//añadido 06.05.2021 uso general
                return View();
            }

            return RedirectToAction("CerrarSesion", "LoginSiscop");

        }

        public ActionResult NuevoCamposAdicionales()
        {
            string strMsgUsuario = "";
            List<Entidade> lista_Enti = new List<Entidade>();


            using (proxy = new ConfiguracionSrvClient())
            {
                lista_Enti = proxy.ListaraEntidades(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), ref strMsgUsuario).ToList();
                proxy.Close();
            }
            ViewBag.CampEnd = new SelectList(lista_Enti, "intIdEntid", "strNomEntid");
            object[] Datos = { ViewBag.CampEnd};

            return PartialView("_PartialNuevoCampoAdicional",Datos);
        }

        public JsonResult GetCampEntidades()
        {
            string strMsgUsuario = "";
            List<Entidade> lista = new List<Entidade>();

            try
            {
                using (proxy = new ConfiguracionSrvClient())
                {
                    lista = proxy.ListaraEntidades(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), ref strMsgUsuario).ToList();
                    proxy.Close();
                }
                //return Json(lista_Enti);
                //modificado 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "ConfiguracionController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);

        }

        #endregion Campos Adicionales

        #region Configuracion

        public ActionResult Configuracion(string intIdMenu, string strCodMenu)//originalmente solo tenia el parámetro intIdMenu
        {
            if (ValidarSession_view())//if (Auth.isAuthenticated())
            {
                intIdMenuGlo = Convert.ToInt32(intIdMenu);
                SeguridadController.strcoMenuGlo = strCodMenu;//añadido 06.05.2021 uso general
                return View();
            }

            return RedirectToAction("CerrarSesion", "LoginSiscop");
        }

        public JsonResult GetTablaConfiguracion(wsConfiguracion.Session_Movi objSesion, string strCoConfi)
        { 
            string strMsgUsuario = "";
            List<wsConfiguracion.TSConfi> lista = new List<wsConfiguracion.TSConfi>();
            try
            {
                using (proxy = new ConfiguracionSrvClient())
                {
                    lista = proxy.ListarConfig(objSesion, strCoConfi, ref strMsgUsuario).ToList();
                    proxy.Close();
                }
                //return Json(lista);
                //modificado 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "ConfiguracionController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);

        }

        [HttpPost]
        public JsonResult ActualizarConfiguracion(wsConfiguracion.Session_Movi objSesion, List<wsConfiguracion.TSConfi> detalleConfig)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                bool update = false;
                if (detalleConfig == null)
                    detalleConfig = new List<wsConfiguracion.TSConfi>();

                using (proxy = new ConfiguracionSrvClient())
                {
                    update = proxy.ActualizarConfig(objSesion, detalleConfig.ToArray(), ref strMsgUsuario);
                    proxy.Close();
                }

                if (strMsgUsuario.Equals("") && update)
                {
                    result.type = "success";
                    result.message = "Las configuraciones se actualizaron correctamente";
                }
                else
                {
                    result.type = "info";
                    result.message = strMsgUsuario;
                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "ConfiguracionController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al actualizar configuraciones";
            }

            return Json(result);
        }
        //añadido 06.07.2021
        public JsonResult GetTSConfi(wsPersona.Session_Movi objSession, string strCoConfi)
        {
            string strMsgUsuario = "";
            wsSistema.TSConfi objConfi = new wsSistema.TSConfi();

            try
            {
                using (proxySis = new SistemaSrvClient())
                {
                    objConfi = proxySis.ConsultarTSConfi_xCod(objSession.intIdSesion, 0, objSession.intIdSoft, strCoConfi, ref strMsgUsuario);
                    proxySis.Close();
                }
                return Json(objConfi);
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "ConfiguracionController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);

        }
        #endregion Configuracion

    }
}
