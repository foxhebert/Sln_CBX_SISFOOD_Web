using CBX_Web_SISCOP.wsPersona;
using CBX_Web_SISCOP.wsSistema;
using CBX_Web_SISCOP.wsSeguridad;//añadido 22.04.2021
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CBX_Web_SISCOP.Models;
//using CBX_Web_SISCOP.wsPacking;
using System.IO;
using System.Net;
using Newtonsoft.Json;
using System.Web.Configuration;
using System.Configuration;
using iTextSharp.text;
using iTextSharp.text.pdf;
using iTextSharp.text.html.simpleparser;
using System.Text;
//PARA EL METODO USADO EN WEBSOCKET
using CBX_Web_SISCOP.Hubs;
using System.Data;
using System.Data.SqlClient;
//CusHub
using Microsoft.AspNet.SignalR;
using Newtonsoft.Json.Linq;

namespace CBX_Web_SISCOP.Controllers
{
    public class PersonalController : Controller
    {
        private PersonalSrvClient proxy;
        private PersonalSrvClient proxyOrg;
        private SistemaSrvClient proxySis;
        //private PackingSrvClient PackingTsp;
        public static int intIdMenuGlo { get; set; }
        
        public static string nombreExcel { get; set; }
        public static int idProceso { get; set; }
        public static string rutaPapeleta = ConfigurationManager.AppSettings["rutaPapeletas"];

        public int getIdUsuario()
        {
            int intIdUsuario = 0;
            try
            {
                intIdUsuario = Convert.ToInt32(Session["intIdUsuarioSesion"].ToString());
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
            }
            return intIdUsuario;
        }


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


        public JsonResult ListarCamposAdicionales(int intIdMenu, string strNoEntidad)
        {
            string strMsgUsuario = "";
            List<CamposAdicionalesGlobal> lista = new List<CamposAdicionalesGlobal>();

            try
            {
                using (proxyOrg = new PersonalSrvClient())
                {
                    lista = proxyOrg.ListarCamposAdicionales(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), strNoEntidad, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                return Json(lista);
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }
        public JsonResult ListarCaracteresMax(string strMaestro)
        {
            List<wsPersona.MaestroCaracteres> detConcepto = new List<wsPersona.MaestroCaracteres>();

            try
            {
                using (proxyOrg = new PersonalSrvClient())
                {
                    detConcepto = proxyOrg.MaestroMaxCaracteres(strMaestro).ToList();
                }
                return Json(detConcepto);
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }
        public JsonResult Upload()
        {
            string dir = null;

            for (int i = 0; i < Request.Files.Count; i++)
            {
                HttpPostedFileBase file = Request.Files[i]; //Cargar Imagen


                int fileSize = file.ContentLength;
                string fileName = file.FileName;
                string mimeType = file.ContentType;
                System.IO.Stream fileContent = file.InputStream;

                var request = System.Web.HttpContext.Current.Request;

                var baseUrl = request.Url.Scheme + "://" + request.Url.Authority;


                dir = Server.MapPath("~/") + "DirEmpleadosRuta\\" + fileName;
                baseUrl = "/DirEmpleadosRuta/" + fileName;
                file.SaveAs(dir);
                return Json(baseUrl);



            }
            return Json(dir);
        }
        public JsonResult ListarCombos(string strEntidad, int intIdFiltroGrupo, string strGrupo, string strSubGrupo)
        {
            string strMsgUsuario = "";
            List<TGTipoEN> lista_combo = new List<TGTipoEN>();

            try
            {
                using (proxyOrg = new PersonalSrvClient())
                {
                    lista_combo = proxyOrg.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), strEntidad, intIdFiltroGrupo, strGrupo, strSubGrupo, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                return Json(lista_combo);

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }
        public JsonResult ListarComboGlobal(int intIdMenu, string strEntidad, int intIdFiltroGrupo, string strGrupo, string strSubGrupo)
        {
            string strMsgUsuario = "";
            List<CombosGlobal> detConcepto = new List<CombosGlobal>();

            try
            {
                using (proxyOrg = new PersonalSrvClient())
                {
                    detConcepto = proxyOrg.ListarComboGeneral(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), strEntidad, intIdFiltroGrupo, strGrupo, strSubGrupo, ref strMsgUsuario).ToList();
                }
                return Json(detConcepto);
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }
        public JsonResult ListarComboJerar(string strEntidad, int intIdFiltroGrupo, string strGrupo, string strSubGrupo)
        {
            string strMsgUsuario = "";
            List<TGTipoEN> lista_UM = new List<TGTipoEN>();
            try
            {
                using (proxyOrg = new PersonalSrvClient())
                {
                    lista_UM = proxyOrg.ListarComboJerar(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), strEntidad, intIdFiltroGrupo, strGrupo, strSubGrupo, ref strMsgUsuario).ToList();

                    proxyOrg.Close();
                }
                return Json(lista_UM);
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);

        }
        public JsonResult ListarCombosPersonal(int intIdMenu, string strEntidad, int intIdFiltroGrupo, string strGrupo, string strSubGrupo)
        {
            string strMsgUsuario = "";
            List<TGTipoEN> lista_Tipo = new List<TGTipoEN>();

            try
            {
                using (proxyOrg = new PersonalSrvClient())
                {
                    lista_Tipo = proxyOrg.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), strEntidad, intIdFiltroGrupo, strGrupo, strSubGrupo, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                return Json(lista_Tipo);
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }


        #region Personal
        // GET: Personal
        public ActionResult Empleado(string intIdMenu, string strCodMenu)//originalmente solo tenia el parámetro intIdMenu
        {
            if (ValidarSession_view())//if (Auth.isAuthenticated())
            {
                intIdMenuGlo = Convert.ToInt32(intIdMenu);
                SeguridadController.strcoMenuGlo = strCodMenu;//añadido 06.05.2021 uso general
                return View();
            }

            return RedirectToAction("CerrarSesion", "LoginSiscop");
        }
        public ActionResult NuevoEmpleado()
        {
            return PartialView("_partialNuevoEmpleado");
        }
        public ActionResult EditarEmpleado()
        {
            return PartialView("_partialEditarEmpleado");
        }

        public ActionResult GetTablaPersonal(int IntActivoFilter, int intIdUniOrg, string strfilter, string dttfiltrofch1, string dttfiltrofch2, int BitFecha)//se añadido , int BitFecha)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                List<PersonalData> lista = new List<PersonalData>();
                PersonalSrvClient proxyOrg;
                using (proxyOrg = new PersonalSrvClient())
                {
                    //modificado 22.07.2021
                    lista = proxyOrg.ListarPersonal(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), IntActivoFilter, intIdUniOrg, strfilter, dttfiltrofch1, dttfiltrofch2, BitFecha, ref strMsgUsuario).ToList();
                    //lista = proxyOrg.ListarPersonal(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), IntActivoFilter, intIdUniOrg, strfilter, dttfiltrofch1, dttfiltrofch2, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }

                //var jsonResult = Json(lista, JsonRequestBehavior.AllowGet);
                //jsonResult.MaxJsonLength = int.MaxValue;
                //return jsonResult;
                //modificado el 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonaController.cs");
            }
            result.type = "errorInt";
            result.message = "Ocurrió un inconveniente al listar";

            return Json(result);
        }

        public ActionResult GetMarcadoresPersonal(int intIdMenu, int intIdPersonal)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                List<TGPERMARCDET> lista = new List<TGPERMARCDET>();
                PersonalSrvClient proxyOrg;
                using (proxyOrg = new PersonalSrvClient())
                {
                    lista = proxyOrg.ListarMarcadoresPersonal(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), intIdPersonal, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                //var jsonResult = Json(Lista, JsonRequestBehavior.AllowGet);
                //jsonResult.MaxJsonLength = int.MaxValue;
                //return jsonResult;
                //modificado el 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
            }

            result.type = "errorInt";
            result.message = "Ocurrió un inconveniente al listar";
            return Json(result);
        }

        public ActionResult GetCorreosPersonal(int intIdMenu, int intIdPersonal)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                List<TGPERCORRDET> lista = new List<TGPERCORRDET>();
                PersonalSrvClient proxyOrg;
                using (proxyOrg = new PersonalSrvClient())
                {
                    lista = proxyOrg.ListarCorreosPersonal(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), intIdPersonal, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                //var jsonResult = Json(Listar, JsonRequestBehavior.AllowGet);
                //jsonResult.MaxJsonLength = int.MaxValue;
                //return jsonResult;
                //modificado el 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
            }

            result.type = "errorInt";
            result.message = "Ocurrió un inconveniente al listar";
            return Json(result);
        }

        public ActionResult GetTelefonosPersonal(int intIdMenu, int intIdPersonal)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                List<TGPERTELEFDET> lista = new List<TGPERTELEFDET>();
                PersonalSrvClient proxyOrg;
                using (proxyOrg = new PersonalSrvClient())
                {
                    lista = proxyOrg.ListarTelefonosPersonal(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), intIdPersonal, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                //var jsonResult = Json(Listar, JsonRequestBehavior.AllowGet);
                //jsonResult.MaxJsonLength = int.MaxValue;
                //return jsonResult;
                //modificado el 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
            }

            result.type = "errorInt";
            result.message = "Ocurrió un inconveniente al listar";
            return Json(result);
        }

        public ActionResult GetCoordenadasPersonal(int intIdPersonal)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                List<TGPERCOOR> lista = new List<TGPERCOOR>();
                PersonalSrvClient proxyOrg;
                using (proxyOrg = new PersonalSrvClient())
                {
                    lista = proxyOrg.listarCoordenadas(intIdPersonal, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                //var jsonResult = Json(Listar, JsonRequestBehavior.AllowGet);
                //jsonResult.MaxJsonLength = int.MaxValue;
                //return jsonResult;
                //modificado 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
            }

            result.type = "errorInt";
            result.message = "Ocurrió un inconveniente al listar";
            return Json(result);
        }

        public ActionResult GetResponsablesPersonal(int intIdMenu, int intIdPersonal)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                List<TGPERRESPDET> lista = new List<TGPERRESPDET>();
                PersonalSrvClient proxyOrg;
                using (proxyOrg = new PersonalSrvClient())
                {
                    lista = proxyOrg.ListarResponsabilidadPersonal(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), intIdPersonal, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                //var jsonResult = Json(Listar, JsonRequestBehavior.AllowGet);
                //jsonResult.MaxJsonLength = int.MaxValue;
                //return jsonResult;
                //modificado 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
            }

            result.type = "errorInt";
            result.message = "Ocurrió un inconveniente al listar";
            return Json(result);
        }

        public JsonResult ObtenerRegistroEmpleado(int intIdPersonal)
        {
            string strMsgUsuario = "";
            List<Personal> detConcepto = new List<Personal>();

            try
            {
                using (proxyOrg = new PersonalSrvClient())
                {
                    detConcepto = proxyOrg.ObtenerEmpleadoPorsuPK(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), intIdPersonal, ref strMsgUsuario).ToList();
                }
                return Json(detConcepto);
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }

        public JsonResult ValidarDocIdentidad(int intIdTipDoc, string strNumDoc)
        {

            string strMsgUsuario = "";
            int validaRegistro = 3;
            string strMensajeError = "";
            object dataResponse = null;

            CustomResponse result = new CustomResponse();
            List<ValidarIdentidad_ENT> litado = new List<ValidarIdentidad_ENT>();

            try
            {

                using (proxy = new PersonalSrvClient())
                {
                    litado = proxy.ValidarDocIdentidad(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), intIdTipDoc, strNumDoc, ref strMsgUsuario).ToList();
                }

                if (litado.Count() > 0)
                {
                    strMensajeError = litado[0].strObservacion;
                    validaRegistro = litado[0].intExiste;
                    dataResponse = litado[0];
                }

                if (strMsgUsuario.Equals("") && validaRegistro == 2)
                {
                    return Json(litado);
                }
                else if (strMsgUsuario.Equals("") && validaRegistro == 1)
                {
                    return Json(litado);
                }
                else if (strMsgUsuario.Equals("") && validaRegistro == 0)
                {
                    result.type = "success";
                    result.message = strMensajeError;
                    result.objeto = dataResponse;
                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
                result.type = "errorInt";
                result.message = "Ocurrió un inconveniente al registrar la Regla de Negocio";
            }

            return Json(result);
        }

        //5.88 añadido 26.05.2021
        public JsonResult ListarComboGeneral_FiltroPerson(int intIdMenu, string strEntidad, int intIdFiltroGrupo, int intIdFiltroPerson, string strGrupo, string strSubGrupo)
        {
            string strMsgUsuario = "";
            List<CombosGlobal> detConcepto = new List<CombosGlobal>();

            try
            {
                using (proxyOrg = new PersonalSrvClient())
                {
                    detConcepto = proxyOrg.ListarComboGeneral_FiltroPerson(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), strEntidad, intIdFiltroGrupo, intIdFiltroPerson, strGrupo, strSubGrupo, ref strMsgUsuario).ToList();
                }
                return Json(detConcepto);
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }

        public JsonResult EliminarEmpleado(int intIdMenu, int intIdPersonal)
        {

            CustomResponse result = new CustomResponse();

            string strMsgUsuario = "";
            try
            {
                int intIdUsuario = 1;
                bool boolEstado = false;


                using (proxy = new PersonalSrvClient())
                {
                    boolEstado = proxy.EliminarEmpleado(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), intIdUsuario, intIdPersonal, ref strMsgUsuario);
                    proxy.Close();
                }

                if (strMsgUsuario.Equals("") && boolEstado)
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
                Log.AlmacenarLogError(ex, "PersonalController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al eliminar el registro";
            }

            return Json(result);
        }

        public JsonResult RegistrarNuevoEmpleado(int intIdMenu, 
            
            Personal ObjPersonal, 
            
            List<TGPERCORRDET> listaDetallesPersonalCorreos, 
            
            List<TGPERTELEFDET> listaDetallesPersonalTelefonos, //No esta enviando el id

            List<TGPERRESPDET> listaDetallesPersonalResponsabilidad, //
            
            List<TGPERMARCDET> listaDetallesPersonalMarcadores, 
            
            List<TGPERCOOR> listaCoor,

            bool activaUsuario, bool desactivaUsuario, bool activarAdmin, int intTipoOperacion, MarcaDni ObjMarcaConDni) //ObjMarcaConDni añadido para COMEDOR
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            int intIdUsuario = 1;
            int intIdUsuarModif = 0;

            if (listaDetallesPersonalCorreos == null)
                listaDetallesPersonalCorreos = new List<TGPERCORRDET>();
            if (listaDetallesPersonalTelefonos == null)
                listaDetallesPersonalTelefonos = new List<TGPERTELEFDET>();
            if (listaDetallesPersonalResponsabilidad == null)
                listaDetallesPersonalResponsabilidad = new List<TGPERRESPDET>();
            if (listaDetallesPersonalMarcadores == null)
                listaDetallesPersonalMarcadores = new List<TGPERMARCDET>();
            if (listaCoor == null)
            {
                listaCoor = new List<TGPERCOOR>();
            }
            try
            {
                bool insert = false;

                using (proxyOrg = new PersonalSrvClient())
                {
                    //RegistrarOActualizarEmpleado método personalizado para SISFOOD por el objeto ObjMarcaConDni
                    insert = proxyOrg.RegistrarOActualizarEmpleado(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), ObjPersonal, ObjMarcaConDni, listaDetallesPersonalCorreos.ToArray(), listaDetallesPersonalTelefonos.ToArray(),
                        listaDetallesPersonalResponsabilidad.ToArray(), listaDetallesPersonalMarcadores.ToArray(), listaCoor.ToArray(), intIdUsuario, intIdUsuarModif, activaUsuario, desactivaUsuario, activarAdmin, intTipoOperacion, ref strMsgUsuario);
                    proxyOrg.Close();
                }

                if (insert)
                {
                    if (intTipoOperacion == 1)
                    {
                        result.type = "success";
                        result.message = "El registro se insertó satisfactoriamente.";
                    }
                    else
                    {
                        result.type = "success";
                        result.message = "El registro se actualizó correctamente.";
                    }
                    result.extramsg = strMsgUsuario;
                }
                else
                {
                    if (strMsgUsuario.Contains("admisión") && strMsgUsuario.Contains("cese"))
                    {
                        result.type = "infoc";
                        result.message = strMsgUsuario;
                    }
                    else
                    {
                        result.type = "error";
                        result.message = strMsgUsuario;
                    }
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
                result.type = "errorInt";
                if (intTipoOperacion == 1)
                {
                    result.message = "Ocurrió un inconveniente al insertar el Empleado";
                }
                else
                {
                    result.message = "Ocurrió un inconveniente al actualizar el Empleado";
                }
            }

            return Json(result);
        }

        public JsonResult ReenviarCorreo(int intIdPersonal)
        {
            wsPersona.Session_Movi objSession = new wsPersona.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            string strMsgUsuario = "";
            Dictionary<string,string> obj = new Dictionary<string,string>();

            try
            {
                using (proxyOrg = new PersonalSrvClient())
                {
                    obj = proxyOrg.ReenviarCorreo(objSession, intIdPersonal, ref strMsgUsuario);
                    proxyOrg.Close();
                }
                return Json(obj);
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }

        public JsonResult ActivarUsuario(int intIdPersonal)
        {
            wsPersona.Session_Movi objSession = new wsPersona.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            string strMsgUsuario = "";
            string mensaje = "";

            try
            {
                using (proxyOrg = new PersonalSrvClient())
                {
                    mensaje = proxyOrg.ActivarUsuario(objSession, intIdPersonal, ref strMsgUsuario);
                    proxyOrg.Close();
                }
                return Json(mensaje);
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }

        //TRAER LOS TRES CAMPOS PARA MARCA CON DNI - Añadido HG 22.03.21   - SOLO COMEDOR
        public JsonResult ObtenerRegistroEmpleadoMarcaDni(int intIdPersonal)
        {
            string strMsgUsuario = "";
            List<MarcaDni> lista = new List<MarcaDni>();

            try
            {
                using (proxyOrg = new PersonalSrvClient())
                {
                    lista = proxyOrg.ObtenerEmpleadoConMarcaDNI(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), intIdPersonal, ref strMsgUsuario).ToList();
                }
                //return Json(detConcepto);
                //modificado 27.05.2021
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

        #endregion Personal

        #region MiFicha

        public ActionResult MiFicha(string intIdMenu, string strCodMenu)//originalmente solo tenia el parámetro intIdMenu
        {
            if (ValidarSession_view())//if (Auth.isAuthenticated())
            {
                intIdMenuGlo = Convert.ToInt32(intIdMenu);
                SeguridadController.strcoMenuGlo = strCodMenu;//añadido 06.05.2021 uso general
                return View();
            }
            return RedirectToAction("CerrarSesion", "LoginSiscop");
        }

        public ActionResult GetPersonalData(int intIdMenu, int intIdPersonal)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                List<Personal> Listar = new List<Personal>();
                PersonalSrvClient proxyOrg;
                using (proxyOrg = new PersonalSrvClient())
                {
                    Listar = proxyOrg.ObtenerEmpleadoPorsuPK(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), intIdPersonal, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                var jsonResult = Json(Listar, JsonRequestBehavior.AllowGet);
                jsonResult.MaxJsonLength = int.MaxValue;
                return jsonResult;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonaController.cs");
            }

            result.type = "errorInt";
            result.message = "Ocurrió un inconveniente al listar";
            return Json(result);
        }
        public string HTMLString()
        {
            StringBuilder htmltext = new StringBuilder();
            htmltext.Append("<div class='col-md-5 col-sm-5 col-xs-12' style='color:red;'>");
            htmltext.Append("<div class='col-md-6 col-sm-6 col-xs-12 profile_left'>");
            htmltext.Append("<div class='profile_img'>");
            htmltext.Append("<div id='crop-avatar'>");
            //htmltext.Append("<img class='img-rounded img-logo-empleado' id='imagePersonalPer' style='display: block;' src='/DirEmpleadosRuta/descarga(1).jpg' alt='Avatar' title='Change the avatar'>");
            htmltext.Append("<div id='loaderImagePersonal' class='skeleton-loader img-rounded img-logo-empleado' style='display: none;'></div>");
            htmltext.Append("</div>");
            htmltext.Append("</div>");
            htmltext.Append("<h3 id='namePersonalPer'>QUINTANA FIGUEROA, JOSE LUIS</h3>");
            htmltext.Append("<ul class='list-unstyled user_data'>");
            htmltext.Append("<li id='direccionPersonal'><i class='fa fa-map-marker user-profile-icon'></i> CAL JULIO CARILLO 186  URB TAOBADITA <br> 150101 - Lima, Lima, Lima</li>");
            htmltext.Append("<li id='cargoPersonalp'><i class='fa fa-briefcase user-profile-icon'></i> JEFE DE TECNOLOGÍA DE SOFTWARE</li>");
            htmltext.Append("<li class='m-top-xs' id='correoPrincipalPersonal'><i class='fa fa-envelope user-profile-icon'></i> aaaa@aaa.com</li>");
            htmltext.Append("<li class='m-top-xs' id='telefonoPrincipalPersonal'><i class='glyphicon glyphicon-phone-alt'></i> 959595959</li>");
            htmltext.Append("</ul>");
            htmltext.Append("</div>");
            htmltext.Append("<div class='col-md-6 col-sm-6 col-xs-12'>");
            htmltext.Append("<table id='personal_information' class='tabledaaprofilw'>");
            htmltext.Append("<tbody><tr>");
            htmltext.Append("<td id='profile_etiqueta' class='loading-item-p col-md-5'>Código: </td>");
            htmltext.Append("<td id='codigoPersonalPer'>00000006       -000</td>");
            htmltext.Append("</tr>");
            htmltext.Append("<tr>");
            htmltext.Append("<td id='profile_etiqueta' class='loading-item-p col-md-5'>Doc. Indet: </td>");
            htmltext.Append("<td id='documentoPersdonal'>DNI 77777778</td>");
            htmltext.Append("</tr>");
            htmltext.Append("<tr>");
            htmltext.Append("<td id='profile_etiqueta' class='loading-item-p col-md-5'>Admisión: </td>");
            htmltext.Append("<td id='admisionPersonalPer'>01/01/2013</td>");
            htmltext.Append("</tr>");
            htmltext.Append("<tr>");
            htmltext.Append("<td id='profile_etiqueta' class='loading-item-p col-md-5'>Empresa: </td>");
            htmltext.Append("<td id='empresaPersonalr'>SOLUCIONES TECNOLOGICAS</td>");
            htmltext.Append("</tr>");
            htmltext.Append("<tr>");
            htmltext.Append("<td id='profile_etiqueta' class='loading-item-p col-md-5'>Fotocheck: </td>");
            htmltext.Append("<td id='fotocheckPersonalPer'>40044215</td>");
            htmltext.Append("</tr>");
            htmltext.Append("</tbody></table>");
            htmltext.Append("</div>");
            htmltext.Append("</div>");

            return htmltext.ToString();
        }
        public void exportPDF()
        {
            string htmlcontent = HTMLString();
            Document doc = new Document(PageSize.A4, 10f, 10f, 10f, 0f);
            PdfWriter.GetInstance(doc, Response.OutputStream);
            doc.Open();


            List<IElement> htmlarraylist = HTMLWorker.ParseToList(new StringReader(htmlcontent), null);

            for (int k = 0; k < htmlarraylist.Count; k++)

            {
                doc.Add(htmlarraylist[k]);
            }


            doc.Add(new Paragraph("Parrafo 2"));
            doc.Close();
            Response.ContentType = "application/pdf";
            Response.AddHeader("content-disposition", "attachment;filename=hola.pdf");
            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.Write(doc);
        }

        public JsonResult ObtenerAsistenciaXFecha(int intIdPersonal, string fechaInicio, string fechaFin)
        {

            string strMsgUsuario = "";
            List<TSPTAASISTENCIA> lista = new List<TSPTAASISTENCIA>();

            try
            {
                using (proxy = new PersonalSrvClient())
                {
                    lista = proxy.ObtenerAsistenciaXFecha(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), intIdPersonal, fechaInicio, fechaFin, ref strMsgUsuario).ToList();
                    proxy.Close();
                }
                // return Json(detAsistencia);
                //modificado el 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "AsistenciaController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);

        }
        public JsonResult ActualizarPerfilEmpleado(int intIdMenu, Personal ObjPersonal, List<TGPERCORRDET> listaDetallesPersonalCorreos, List<TGPERTELEFDET> listaDetallesPersonalTelefonos)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            int intIdUsuario = 1;
            int intIdUsuarModif = 0;

            if (listaDetallesPersonalCorreos == null)
                listaDetallesPersonalCorreos = new List<TGPERCORRDET>();
            if (listaDetallesPersonalTelefonos == null)
                listaDetallesPersonalTelefonos = new List<TGPERTELEFDET>();

            try
            {
                bool insert = false;

                using (proxyOrg = new PersonalSrvClient())
                {
                    insert = proxyOrg.ActualizarEmpleado(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), ObjPersonal, listaDetallesPersonalCorreos.ToArray(), listaDetallesPersonalTelefonos.ToArray(), intIdUsuario, intIdUsuarModif, ref strMsgUsuario);
                    proxyOrg.Close();
                }

                if (strMsgUsuario.Equals("") && insert)
                {
                    result.type = "success";
                    result.message = "El registro se actualizó correctamente.";
                }
                else
                {
                    if (strMsgUsuario.Contains("admisión") && strMsgUsuario.Contains("cese"))
                    {
                        result.type = "infoc";
                        result.message = strMsgUsuario;
                    }
                    else
                    {
                        result.type = "error";
                        result.message = strMsgUsuario;
                    }
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
                result.type = "errorInt";
                result.message = "Ocurrió un inconveniente al actualizar los datos";
            }
            return Json(result);
        }

        public JsonResult ListaAsusencias(int intIdPersonal, string fechaInicio, string fechaFin)
        {
            string strMsgUsuario = "";
            List<TGPER_CON_DET> lista = new List<TGPER_CON_DET>();
            try
            {
                using (proxyOrg = new PersonalSrvClient())
                {
                    lista = proxyOrg.ListaAsusencias(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), intIdPersonal, fechaInicio, fechaFin, ref strMsgUsuario).ToList();

                    proxyOrg.Close();
                }
                //return Json(lista_AS);
                //modificado 27.05.2021
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
        public JsonResult ListaPersonalAsistencia(int intIdPersonal, string fechaInicio, string fechaFin)
        {
            string strMsgUsuario = "";
            List<TGPER_CON_DET> lista = new List<TGPER_CON_DET>();

            try
            {
                using (proxyOrg = new PersonalSrvClient())
                {
                    lista = proxyOrg.ListaAsistencias(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), intIdPersonal, fechaInicio, fechaFin, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                //return Json(lista_AS);
                //modificado 27.05.2021
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
        public JsonResult ListaPersonalResponsabilidad(int intIdPersonal, string fechaInicio, string fechaFin)
        {
            string strMsgUsuario = "";
            List<TGPER_RESP> lista = new List<TGPER_RESP>();

            try
            {
                using (proxyOrg = new PersonalSrvClient())
                {
                    lista = proxyOrg.ListaPersonalResponsabilidad(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), intIdPersonal, fechaInicio, fechaFin, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                //return Json(lista_RE);
                //modificado 27.05.2021
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


        #endregion MiFicha

        #region Cambio Documento de Identidad

        public ActionResult CambioDI(string intIdMenu, string strCodMenu)//originalmente solo tenia el parámetro intIdMenu
        {
            if (ValidarSession_view())//if (Auth.isAuthenticated())
            {
                intIdMenuGlo = Convert.ToInt32(intIdMenu);
                SeguridadController.strcoMenuGlo = strCodMenu;//añadido 06.05.2021 uso general
                return View();
            }

            return RedirectToAction("CerrarSesion", "LoginSiscop");
        }

        public JsonResult ValidarDocCambioIdentidad(int intIdTipDoc, string strNumDoc)
        {

            wsPersona.Session_Movi objSession = new wsPersona.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            string strMsjUsuario = "";
            string strMsjDB = "";
            int intResult = 1;

            CustomResponse result = new CustomResponse();
            ValidarIdentidad_DI obj = new ValidarIdentidad_DI();

            try
            {

                using (proxy = new PersonalSrvClient())
                {
                    obj = proxy.ValidarDocCambioIdentidad(objSession, intIdTipDoc, strNumDoc, ref intResult, ref strMsjDB, ref strMsjUsuario);
                }

                if (intResult == 1)
                {
                    result.type = "success";
                    result.message = strMsjUsuario;
                    result.objeto = obj;
                }
                if (intResult == 2)
                {
                    result.type = "info";
                    result.message = strMsjUsuario;
                }
                else
                {
                    result.type = "warning";
                    result.message = strMsjDB;
                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
                result.type = "errorInt";
                result.message = "Ocurrió un inconveniente al registrar la Regla de Negocio";
            }

            return Json(result);
        }

        public JsonResult ActualizarCambioDI(PersonalCDI personalCDI)
        {
            wsPersona.Session_Movi objSession = new wsPersona.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            CustomResponse result = new CustomResponse();
            string strMsjUsuario = "";
            string strMsjDB = "";
            int intResult = 1;

            int id = 0;
            try
            {
                using (proxy = new PersonalSrvClient())
                {
                    id = proxy.ActualizarCambioDI(objSession, personalCDI, ref intResult, ref strMsjDB, ref strMsjUsuario);
                }

                if (intResult == 1)
                {
                    result.type = "success";
                    result.message = "El documento de identidad fue cambiado correctamente";
                }
                //else if (intResult == 2 || intResult == 3)
                //{
                //    result.type = "infoc";
                //    result.message = strMsjUsuario;
                //}
                else if (intResult == 2)
                {
                    result.type = "infoc";
                    result.message = strMsjUsuario;
                }
                else
                {
                    result.type = "error";
                    result.message = strMsjUsuario;
                }

                //if (intResult == 1)
                //{
                //    result.type = "success";
                //    result.message = strMsjUsuario;
                //}
                //else if (intResult == 2 || intResult == 3){
                //    result.type = "info";
                //    result.message = strMsjUsuario;
                //}
                //else
                //{
                //    result.type = "error";
                //    result.message = strMsjUsuario;
                //}
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al cambiar el documento de identidad";
            }

            return Json(result);
        }

        public JsonResult ListarCambioDI(string buscarId, int empresaId, string filtrojer_ini, string filtrojer_fin)
        {
            wsPersona.Session_Movi objSession = new wsPersona.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            string strMsjUsuario = "";
            string strMsjDB = "";
            int intResult = 1;

            IList<CambioDI> lista = new List<CambioDI>();

            try
            {
                using (proxy = new PersonalSrvClient())
                {
                    lista = proxy.ListarCambioDI(objSession, buscarId, empresaId, filtrojer_ini, filtrojer_fin, ref intResult, ref strMsjDB, ref strMsjUsuario);
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonaController.cs");
            }

            //return Json(ListObj);
            //modificado 27.05.2021
            var json_ = Json(lista, JsonRequestBehavior.AllowGet);
            json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
            return json_;
        }

        public ActionResult NuevoCambioDI()
        {
            return PartialView("_partialNuevoCambioDI");
        }

        #endregion Cambio Documento de Identidad

        #region Asig. Horarios

        public ActionResult AsigHorarios(string intIdMenu, string strCodMenu)//originalmente solo tenia el parámetro intIdMenu
        {
            if (ValidarSession_view())//if (Auth.isAuthenticated())
            {
                intIdMenuGlo = Convert.ToInt32(intIdMenu);
                SeguridadController.strcoMenuGlo = strCodMenu;//añadido 06.05.2021 uso general
                return View();
            }

            return RedirectToAction("CerrarSesion", "LoginSiscop");
        }

        public JsonResult GetTablaAsigHorario(int IntActivoFilter, string strfilter, int IntIdEmp, string dttfiltrofch1, string dttfiltrofch2)
        {
            string strMsgUsuario = "";

            wsPersona.Session_Movi objSession = new wsPersona.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            List<AsigHorarioData> lista = new List<AsigHorarioData>();
            PersonalSrvClient proxyOrg;

            try
            {
                using (proxyOrg = new PersonalSrvClient())
                {
                    lista = proxyOrg.ListarAsigHor(objSession, IntActivoFilter, strfilter, IntIdEmp, dttfiltrofch1, dttfiltrofch2, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                //return Json(ListarPersonal);
                //modificado 27.05.2021
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

        ////Creado_04.11.2020_Miércoles //GetTablaAsigHorario
        public JsonResult GetTablaAsigHorario_Ausentismo(int IntActivoFilter, string strfilter, int IntIdEmp, string dttfiltrofch1, string dttfiltrofch2)
        {
            string strMsgUsuario = "";

            wsPersona.Session_Movi objSession = new wsPersona.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            List<AsigHorarioData> lista = new List<AsigHorarioData>();
            PersonalSrvClient proxyOrg;
            try
            {
                using (proxyOrg = new PersonalSrvClient())
                {
                    lista = proxyOrg.ListarAsigHor(objSession, IntActivoFilter, strfilter, IntIdEmp, dttfiltrofch1, dttfiltrofch2, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                //return Json(ListarPersonal);
                //modificado 27.05.2021
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

        public JsonResult GetTablaAsigHorarioDet(int intIdPerHor, string filtrojer_ini, string filtrojer_fin)
        {
            wsPersona.Session_Movi objSession = new wsPersona.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            string strMsgUsuario = "";

            List<AsigHorario> lista = new List<AsigHorario>();
            PersonalSrvClient proxyOrg;
            try
            {
                using (proxyOrg = new PersonalSrvClient())
                {
                    lista = proxyOrg.ListarAsigHorDet(objSession, intIdPerHor, filtrojer_ini, filtrojer_fin, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                //return Json(ListarPersonal);
                //modificado 27.05.2021
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

        public JsonResult EliminarAsigHor(int intIdPerHor)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            wsPersona.Session_Movi objSession = new wsPersona.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            try
            {
                bool delete = false;

                using (proxy = new PersonalSrvClient())
                {
                    delete = proxy.EliminarAsigHor(objSession, intIdPerHor, ref strMsgUsuario);
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
            catch (Exception)
            {
                result.type = "error";
                result.message = "Ocurrió un inconveniente al eliminar el registro";
            }

            return Json(result);
        }

        public JsonResult IUAsigHor(int intIdPerHor, int intIdHorario, DateTime dttFecAsig)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            wsPersona.Session_Movi objSession = new wsPersona.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            try
            {
                int insert = 0;

                using (proxy = new PersonalSrvClient())
                {
                    insert = proxy.IUAsigHor(objSession, intIdPerHor, intIdHorario, dttFecAsig, ref strMsgUsuario);
                    proxy.Close();
                }

                if (strMsgUsuario.Equals(""))
                {
                    result.type = "success";
                    result.message = "El registro se actualizó satisfactoriamente.";
                }
                else
                {
                    result.type = "infoc";//modificado 06/08/2021
                    result.message = strMsgUsuario;
                }
            }
            catch (Exception)
            {
                result.type = "errorInt";
                result.message = "Ocurrió un inconveniente al actualizar la asignación de Horario";
            }

            return Json(result);
        }

        public JsonResult IUREGAsigHor(List<TT_TGPERS_HORARIO_DET> listaDetalleHorAsigEmp, int intIdHorario, DateTime dttFecAsig)
        {

            wsPersona.Session_Movi objSession = new wsPersona.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            CustomResponse result = new CustomResponse();
            string strMsjUsuario = "";
            string strMsjDB = "";
            int intResult = 1;

            IList<EmpleadoObs> ListarDetPersonal = new List<EmpleadoObs>();

            try
            {
                using (proxyOrg = new PersonalSrvClient())
                {
                    ListarDetPersonal = proxyOrg.IUREGAsigHor(objSession, listaDetalleHorAsigEmp.ToArray(), intIdHorario, dttFecAsig, ref intResult, ref strMsjDB, ref strMsjUsuario);
                    proxyOrg.Close();
                }
                if (intResult == 1)
                {
                    result.type = "success";
                    result.message = "Las asignaciones se insertaron correctamente.";
                    result.objeto = ListarDetPersonal;
                }
                else
                {
                    result.type = "infoc";
                    result.objeto = ListarDetPersonal;
                    result.message = strMsjUsuario;
                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
                result.type = "errorInt";
                result.message = "Ocurrió un inconveniente al insertar la Papeleta de salida";
            }
            //return Json(result);
            //modificado 27.05.2021
            var json_ = Json(result, JsonRequestBehavior.AllowGet);
            json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
            return json_;
        }

        public JsonResult IUREGAsigHorPost(string intIdProceso)
        {

            wsPersona.Session_Movi objSession = new wsPersona.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            CustomResponse result = new CustomResponse();
            string strMsjUsuario = "";
            string strMsjDB = "";
            int intResult = 1;

            IList<int> ListarDetPersonal = new List<int>();

            try
            {
                using (proxyOrg = new PersonalSrvClient())
                {
                    ListarDetPersonal = proxyOrg.IUREGAsigHorPost(objSession, intIdProceso, ref intResult, ref strMsjDB, ref strMsjUsuario);
                    proxyOrg.Close();
                }
                if (intResult == 1)
                {
                    result.type = "success";
                    result.message = "Las asignaciones se insertaron correctamente..";
                    result.objeto = ListarDetPersonal;
                }
                else
                {
                    result.type = "infoc";
                    result.objeto = ListarDetPersonal;
                    result.message = strMsjUsuario;
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
                result.type = "errorInt";
                result.message = "Ocurrió un inconveniente al insertar la Asignación de horario";
            }
            //return Json(result);
            //modificado 27.05.2021
            var json_ = Json(result, JsonRequestBehavior.AllowGet);
            json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
            return json_;
        }

        #endregion

        #region Importación Masiva

        public ActionResult ImportacionMasiva(string intIdMenu, string strCodMenu)//originalmente solo tenia el parámetro intIdMenu
        {
            if (ValidarSession_view())//if (Auth.isAuthenticated())
            {
                intIdMenuGlo = Convert.ToInt32(intIdMenu);
                SeguridadController.strcoMenuGlo = strCodMenu;//añadido 06.05.2021 uso general
                return View();
            }

            return RedirectToAction("CerrarSesion", "LoginSiscop");
        }

        public static string rutaDirectorioExcel { get; set; }

        public ActionResult uploadFilesEmpleado()
        {
            Random random = new Random();
            foreach (string item in Request.Files)
            {
              
                wsPersona.Session_Movi objSession = new wsPersona.Session_Movi(); //Añadido HGM 04.11.2021
                int  intIdSesion = Auth.intIdSesion();  //Añadido HGM 04.11.2021

                int num = random.Next(10000);
                HttpPostedFileBase file = Request.Files[item] as HttpPostedFileBase;
                string fileName = intIdSesion.ToString() + num.ToString() + file.FileName;   //Modificado HGM 04.11.2021
                string UploadPath = ConfigurationManager.AppSettings["rutaEmpleadoMasivo"]; ;

                if (file.ContentLength == 0)
                    continue;
                if (file.ContentLength > 0)
                {
                    string path = Path.Combine(HttpContext.Request.MapPath(UploadPath), fileName);
                    string extension = Path.GetExtension(file.FileName);

                    rutaDirectorioExcel = Path.Combine(HttpContext.Request.MapPath(UploadPath));

                    file.SaveAs(path);

                    nombreExcel = fileName;
                    idProceso = num;
           
                    // Add parts to the list.
                    listIE.Add(new ImportExcel() { strRandomId = num,  strNomExcel = fileName });   //Añadido HGM 04.11.2021

                }
            }
            return Json(nombreExcel);

        }

        public ActionResult ImportMasivoEmpleado(int idComboPlantilla, int cboFormato, bool checkActualizar)
          {
            wsPersona.Session_Movi objSession = new wsPersona.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";
            try
            {
                List<EmpleadoMasivo> listEmpleado = new List<EmpleadoMasivo>();

                using (proxy = new PersonalSrvClient())
                {
                    listEmpleado = proxy.ImportMasivoEmpleado(objSession, nombreExcel, idProceso, idComboPlantilla, cboFormato, checkActualizar, rutaDirectorioExcel, ref strMsgUsuario).ToList();
                    proxy.Close();
                }

                if (strMsgUsuario == "")
                {
                    result.type = "success";
                    result.message = "Los empleados fueron importados correctamente";
                    result.objeto = listEmpleado;
                }
                else
                {
                    result.type = "infoc";
                    result.message = strMsgUsuario;
                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al importar los empleados";
            }

            //return Json(result);
            //modificado 27.05.2021
            var json_ = Json(result, JsonRequestBehavior.AllowGet);
            json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
            return json_;
        }

        public ActionResult GuardarMasivoEmpleado()
        {
            wsPersona.Session_Movi objSession = new wsPersona.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";
            try
            {
                List<EmpleadoMasivo> listEmpleado = new List<EmpleadoMasivo>();

                using (proxy = new PersonalSrvClient())
                {
                    listEmpleado = proxy.GuardarMasivoEmpleado(objSession, idProceso, nombreExcel, rutaDirectorioExcel, ref strMsgUsuario).ToList();
                    proxy.Close();
                }

                if (strMsgUsuario == "")
                {
                    result.type = "success";
                    result.message = "Los empleados fueron guardados de forma correcta";
                    result.objeto = listEmpleado;
                }
                else
                {
                    result.type = "infoc";
                    result.message = strMsgUsuario;
                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al guardar los empleados";
            }

            //return Json(result);
            //modificado 27.05.2021
            var json_ = Json(result, JsonRequestBehavior.AllowGet);
            json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
            return json_;
        }

        #endregion

        #region Papeleta

        public ActionResult PapeletaSalida(string intIdMenu, string strCodMenu)//originalmente solo tenia el parámetro intIdMenu
        {
            if (ValidarSession_view())//if (Auth.isAuthenticated())
            {
                intIdMenuGlo = Convert.ToInt32(intIdMenu);
                SeguridadController.strcoMenuGlo = strCodMenu;//añadido 06.05.2021 uso general
                return View();
            }

            return RedirectToAction("CerrarSesion", "LoginSiscop");
        }

        public ActionResult NuevaPapeletaSal()
        {
            object[] Data = { };
            return PartialView("_partialNuevaPapeletaSal", Data);
        }


        public ActionResult deleteFile()
        {
            return Json("");
        }

        public ActionResult ComprobarDocumentos(int intIdPapeleta, List<string> listPapeletas)
        {
            wsPersona.Session_Movi objSession = new wsPersona.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            IList<string> listEliminados = new List<string>();
            string strMsjUsuario = "";
            string strMsjDB = "";
            int intResult = 1;

            try
            {
                using (proxyOrg = new PersonalSrvClient())
                {
                    if (listPapeletas == null)
                    {
                        listPapeletas = new List<string>();
                    }
                    listEliminados = proxyOrg.ComprobarDocumentos(objSession, intIdPapeleta, listPapeletas.ToArray(), ref intResult, ref strMsjDB, ref strMsjUsuario);//modificado 13.09.2021
                }

                foreach (string item in listEliminados)
                {
                    string filePath = Server.MapPath("~" + item);
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }

                }
                return Json(listEliminados);
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);

        }

        public ActionResult uploadFilesEdit()
        {

            int intIdPapeleta = JsonConvert.DeserializeObject<int>(Request.Form["intIdPapeleta"]);

            System.Random random = new System.Random();
            List<string> listNomDoc = new List<string>();
            string strMsjUsuario = "";
            string strMsjDB = "";
            int intResult = 1;

            foreach (string item in Request.Files)
            {
                int num = random.Next(10000);

                HttpPostedFileBase file = Request.Files[item] as HttpPostedFileBase;
                string fileName = num.ToString() + file.FileName;
                string UploadPath = rutaPapeleta;

                if (file.ContentLength == 0)
                    continue;
                if (file.ContentLength > 0)
                {
                    string path = Path.Combine(HttpContext.Request.MapPath(UploadPath), fileName);
                    string extension = Path.GetExtension(file.FileName);

                    file.SaveAs(path);

                    var pathTotal = UploadPath.Substring(1) + fileName;

                    PersonalSrvClient proxyOrg;
                    using (proxyOrg = new PersonalSrvClient())
                    {
                        proxyOrg.RegistrarDocumentosEdit(fileName, UploadPath, intIdPapeleta, ref intResult, ref strMsjDB, ref strMsjUsuario);
                        //                        proxyOrg.RegistrarDocumentosEdit(pathTotal, intIdPapeleta, ref intResult, ref strMsjDB, ref strMsjUsuario);
                        proxyOrg.Close();
                    }

                }
            }

            return Json(listNomDoc);
        }

        public ActionResult uploadFiles()
        {

            IList<int> listPapeletas = JsonConvert.DeserializeObject<int[]>(Request.Form["dato"]);

            System.Random random = new System.Random();
            List<string> listNomDoc = new List<string>();
            string strMsjUsuario = "";
            string strMsjDB = "";
            int intResult = 1;


            foreach (string item in Request.Files)
            {
                int num = random.Next(10000);
                int insert = 0;

                HttpPostedFileBase file = Request.Files[item] as HttpPostedFileBase;
                string fileName = num.ToString() + file.FileName;
                string UploadPath = rutaPapeleta;

                if (file.ContentLength == 0)
                    continue;
                if (file.ContentLength > 0)
                {
                    string path = Path.Combine(HttpContext.Request.MapPath(UploadPath), fileName);
                    string extension = Path.GetExtension(file.FileName);

                    file.SaveAs(path);

                    var pathTotal = UploadPath.Substring(1) + fileName;
                    listNomDoc.Add(pathTotal);

                    PersonalSrvClient proxyOrg;
                    using (proxyOrg = new PersonalSrvClient())
                    {
                        insert = proxyOrg.RegistrarDocumentos(fileName, UploadPath, listPapeletas.ToArray(), ref intResult, ref strMsjDB, ref strMsjUsuario);//modificado 13.09.2021
                        //insert = proxyOrg.RegistrarDocumentos(pathTotal, listPapeletas.ToArray(), ref intResult, ref strMsjDB, ref strMsjUsuario);
                        proxyOrg.Close();
                    }

                }
            }

            return Json(listNomDoc);
        }

        public JsonResult GetTablaAusentismoDet(int intIdPerHor, string filtrojer_ini, string filtrojer_fin)
        {
            wsPersona.Session_Movi objSession = new wsPersona.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            string strMsgUsuario = "";

            List<Ausentismos> lista = new List<Ausentismos>();
            PersonalSrvClient proxyOrg;

            try
            {
                using (proxyOrg = new PersonalSrvClient())
                {
                    lista = proxyOrg.ListarAusentismoDet(objSession, intIdPerHor, filtrojer_ini, filtrojer_fin, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                //return Json(ListarPersonal);
                //modificado el 27.05.2021
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

        public JsonResult EliminarAusentismo(int intIdPerCom)
        {

            wsPersona.Session_Movi objSession = new wsPersona.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";
            try
            {
                IList<string> listRutaDoc = new List<string>();

                using (proxy = new PersonalSrvClient())
                {
                    listRutaDoc = proxy.EliminarAusentismo(objSession, intIdPerCom, ref strMsgUsuario);
                    proxy.Close();
                }

                if (listRutaDoc.Count == 0)
                {
                    result.type = "success";
                    result.message = "El registro fue eliminado correctamente";
                }
                else
                {
                    foreach (string ruta in listRutaDoc)
                    {
                        string fullPath = Request.MapPath("~/" + ruta);
                        if (System.IO.File.Exists(fullPath))
                        {
                            System.IO.File.Delete(fullPath);
                        }
                    }
                    result.type = "success";
                    result.message = "El registro fue eliminado correctamente";
                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al eliminar el registro";
            }

            return Json(result);
        }

        public JsonResult ObtenerAusentismoPorsuPK(int intId)
        {
            wsPersona.Session_Movi objSession = new wsPersona.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            string strMsgUsuario = "";

            try
            {
                int intResult = 1;
                string strMsgDB = "";
                //string strMsgUsuario = "";
                Ausentismo obj = new Ausentismo();
                using (proxyOrg = new PersonalSrvClient())
                {
                    obj = proxyOrg.ObtenerAusentismoPorPK(objSession, intId, ref intResult, ref strMsgDB, ref strMsgUsuario);
                }
                return Json(obj);

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }

        public JsonResult UAusentismos(Ausentismo objDatos, bool flgDESM, string dttFechaIni, string dttFechaFin)
        {
            wsPersona.Session_Movi objSession = new wsPersona.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            CustomResponse result = new CustomResponse();
            string strMsjUsuario = "";
            string strMsjDB = "";
            int intResult = 1;

            try
            {
                int insert = 0;

                using (proxy = new PersonalSrvClient())
                {
                    insert = proxy.UAusentismos(objSession, objDatos, flgDESM, ref intResult, ref strMsjDB, ref strMsjUsuario);
                    proxy.Close();
                }

                if (intResult == 1)
                {
                    result.type = "success";
                    result.message = "El registro se actualizó satisfactoriamente.";
                }
                else
                {
                    result.type = "infoc";
                    result.message = strMsjUsuario;
                }
            }



            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
                result.type = "errorInt";
                result.message = "Ocurrió un inconveniente al actualizar el Ausentismo";
            }
            return Json(result);
        }

        public JsonResult IAusentismos(string intIdProceso)
        {
            wsPersona.Session_Movi objSession = new wsPersona.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            CustomResponse result = new CustomResponse();
            string strMsjUsuario = "";
            string strMsjDB = "";
            int intResult = 1;

            IList<int> listPapeletas = new List<int>();

            try
            {
                using (proxy = new PersonalSrvClient())
                {
                    listPapeletas = proxy.IAusentismos(objSession, intIdProceso, ref intResult, ref strMsjDB, ref strMsjUsuario);
                    proxy.Close();
                }

                if (intResult == 1)
                {
                    result.type = "success";
                    result.message = "El registro se insertó satisfactoriamente.";
                    result.objeto = listPapeletas;
                }
                else //añadido 06/08/2021
                {
                    result.type = "infoc";
                    result.objeto = listPapeletas;
                    result.message = strMsjUsuario;
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
                result.type = "errorInt";
                result.message = "Ocurrió un inconveniente al insertar la Papeleta de salida";
            }
            //return Json(result);
            //modificado el 27.05.2021
            var json_ = Json(result, JsonRequestBehavior.AllowGet);
            json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
            return json_;
        }

        public JsonResult PreIAusentismos(Ausentismo objDatos, List<int> listPersonal, bool flgDESM, string dttFechaIni, string dttFechaFin)
        {

            wsPersona.Session_Movi objSession = new wsPersona.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            CustomResponse result = new CustomResponse();
            string strMsjUsuario = "";
            string strMsjDB = "";
            int intResult = 1;

            IList<EmpleadoObs> listPersonalObs = new List<EmpleadoObs>();

            try
            {
                using (proxy = new PersonalSrvClient())
                {
                    listPersonalObs = proxy.PreIAusentismos(objSession, objDatos, listPersonal.ToArray(), flgDESM, dttFechaIni, dttFechaFin, ref intResult, ref strMsjDB, ref strMsjUsuario);
                    proxy.Close();
                }

                if (intResult == 1)
                {
                    result.type = "success";
                    result.message = "El registro se insertó satisfactoriamente.";
                    result.objeto = listPersonalObs;
                }
                else
                {
                    result.type = "infoc";
                    result.objeto = listPersonalObs;
                    result.message = strMsjUsuario;
                }
            }

            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
                result.type = "errorInt";
                result.message = "Ocurrió un inconveniente al insertar la Papeleta de salida";
            }
            //return Json(result);
            //modificado el 27.05.2021
            var json_ = Json(result, JsonRequestBehavior.AllowGet);
            json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
            return json_;
        }

        public JsonResult GetHabGeo()
        {
            string strMsgUsuario = "";
            bool estado;
            try
            {
                using (proxy = new PersonalSrvClient())
                {
                    estado = proxy.GetHabGeo(ref strMsgUsuario);

                }
                return Json(estado);

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);

        }

        #endregion

        //añadido 27.03.2021
        public JsonResult IMG(string img_, string directorio)
        {
            string DirWebConfig = ""; string rutaCompleta = "";

            if (directorio == "Empleado")
            {
                DirWebConfig = System.Configuration.ConfigurationManager.AppSettings["rutaFotoEmpleado"];
                //ruta = "/DirEmpleadosRuta/";//"~/DirEmpleadosRuta/";
            }

            if (directorio == "UnidOrg")
            {
                DirWebConfig = System.Configuration.ConfigurationManager.AppSettings["rutaImgUO"];
                //ruta = "/DirLogosRuta/";
            }
            var filePath = Server.MapPath(DirWebConfig + img_);

            if (System.IO.File.Exists(filePath))
            {
                rutaCompleta = DirWebConfig + img_;
            }
            else
            {
                rutaCompleta = DirWebConfig + "descarga(1).jpg";
            }


            return Json(rutaCompleta);
        }



        /* ========================================================================================
         *  A PARTIR DE ESTA LINEA SE AÑADEN MÉTODOS DESDE EL SISFOOD hg.08.02.21_14:38PM
         * ========================================================================================*/
        #region SERVICIO

        //Sin Auth. Consumido por mantenimiento Empresa y varios otros //13.1. hg_09.02.2021_desde_sisfood 
        public JsonResult ListarCombosPersonal_(string strEntidad, int intIdFiltroGrupo, string strGrupo, string strSubGrupo)

        {
            string strMsgUsuario = "";
            List<TGTipoEN> lista = new List<TGTipoEN>();
            try
            {

                using (proxyOrg = new PersonalSrvClient())
                {
                    lista = proxyOrg.ListarCombos(3, 1, 4, strEntidad, intIdFiltroGrupo, strGrupo, strSubGrupo, ref strMsgUsuario).ToList();

                    proxyOrg.Close();
                }
                //return Json(lista_Tipo);
                //modificado 27.05.2021
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

        #endregion SERVICIO

        #region TOMA_DE_CONSUMO

        public ActionResult Consumo(string intIdMenu, string strCodMenu)//modificado 22.04.2021
             //public ActionResult Consumo(string intIdMenu)//modificado 22.04.2021
        {
            if (ValidarSession_view())//if (Auth.isAuthenticated())//if (Auth.isAuthenticated())
            {
                getTiempoCierreConsumo();
                getTiempoCierreConsumoAfter();
                intIdMenuGlo = Convert.ToInt32(intIdMenu);
                SeguridadController.strcoMenuGlo = strCodMenu;//añadido 06.05.2021 uso general
                return View();
            }
            return RedirectToAction("CerrarSesion", "LoginSiscop");
        }
        //sELECCIONAR MARCADOR 
        public JsonResult SeleccionarMarcadorToma(Marcador objDatos, int intTipoOperacion)
        {

            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                bool insert = false;

                using (proxy = new PersonalSrvClient())
                {
                    insert = proxy.UTomaMarcador(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), Auth.intIdUsuario(), intTipoOperacion, objDatos, ref strMsgUsuario);
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

        //Traer los datos del empleado segun el ID que marcó(desde la tabla tgpersonal y taasistencia)
        public JsonResult ObtenerEmpleadoTomaConsumo(wsPersona.Session_Movi objSession, int IntIdAsistencia)
        {
            string strMsgUsuario = "";
            List<wsPersona.Consumo> lista = new List<wsPersona.Consumo>();
            objSession.intIdMenu = intIdMenuGlo;//reasignando valor 06.05.2021 prueba
            try { 
                using (proxy = new PersonalSrvClient())
                {
                    lista = proxy.ObtenerRegistroConsumo(objSession, IntIdAsistencia, ref strMsgUsuario).ToList();
                }
                //return Json(detConcepto);
                //modificado 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral}, HttpStatusCode.MethodNotAllowed);
        }

        //HG_01.12.2020_01:54:58
        public JsonResult RegistrarTomaConsumo(wsPersona.Session_Movi objSession, int intTipoOperacion, wsPersona.Consumo ObjConsumo, string tipo, bool bitTodosTS)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";
            int intValida = 0;

            try
            {
                bool insert = false;

                using (proxy = new PersonalSrvClient())
                {
                    insert = proxy.RegistrarConsumo(objSession, intTipoOperacion, ObjConsumo, bitTodosTS, ref strMsgUsuario, ref intValida);
                    //insert = proxy.RegistrarConsumo(objSession, intTipoOperacion, ObjConsumo, ref strMsgUsuario, ref intValida);
                    proxy.Close();
                }

                if (strMsgUsuario.Equals("") && insert)
                {
                    result.type = "success";
                    if (tipo == "C")
                    {
                        result.message = "El Complemento agregado fue registrado satisfactoriamente.|" + intValida.ToString();//concatenado con un |
                    }
                    else
                    {
                        result.message = "El Servicio seleccionado fue registrado satisfactoriamente.|" + intValida.ToString();//concatenado con un |
                    }
                    
                }
                else
                {
                    result.message = strMsgUsuario +'|'+ intValida.ToString();

                    if (strMsgUsuario.Contains("para este Periodo")) // TSP_TCCONSUMO_V00  (PERIODICO) 
                    {
                        result.type = "error";
//                        result.message = strMsgUsuario + intValida.ToString();
                    }

                    if (strMsgUsuario.Contains("día de hoy")) // TSP_TCCONSUMO_V00   (DIARIO)
                    {
                        result.type = "error";
                       // result.message = strMsgUsuario + intValida.ToString(); // Tipo de Servicio  
                    }

                    if (strMsgUsuario.Contains("Tipo de Servicio")) // TSP_TCCONSUMO_V00   (TIPO DE SERVICIO)
                    {
                        result.type = "error";
                        //result.message = strMsgUsuario + intValida.ToString(); //  
                    }
                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs | RegistrarTomaConsumo");
                result.type = "errorInt";
                result.message = "Ocurrió un inconveniente al registrar el Consumo";
            }

            return Json(result);
        }

        public JsonResult EliminarAnularServicioRegistrado(wsPersona.Session_Movi objSession, int intIdAsistencia, int intIdServicio, string tipo) //EliminarTomaConsumo
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";
            int intValida = 0;

            try
            {
                bool delete = false;

                using (proxy = new PersonalSrvClient())
                {
                    delete = proxy.AnularServicioRegistrado(objSession, intIdAsistencia, intIdServicio, ref strMsgUsuario, ref intValida);//EliminarAnularServicioRegistrado
                    proxy.Close();
                }

                if (strMsgUsuario.Equals("") && delete)
                {
                    result.type = "success";
                    if (tipo == "C")
                    {
                        result.message = "El Complemento agregado fue anulado.|" + intValida.ToString();//concatenado con un |
                    }
                    else
                    {
                        result.message = "El servicio seleccionado fue anulado.|" + intValida.ToString();//concatenado con un |
                    }

                }
                else
                {
                    result.type = "error";
                    //result.message = strMsgUsuario;
                    result.message = strMsgUsuario + '|' + intValida.ToString();
                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs | EliminarAnularServicioRegistrado");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al anular el registro";
            }

            return Json(result);
        }

        //OBTENER EL PK DEL ULTIMO REGISTRO DE LA TABLA TCCONSUMO
        public JsonResult GetIdConsumoParaEliminar(wsPersona.Session_Movi objSession)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            List<wsPersona.Consumo> lista = new List<wsPersona.Consumo>();
            PersonalSrvClient proxyOrg;
            try
            {
                using (proxyOrg = new PersonalSrvClient())
                {
                    lista = proxyOrg.ListarConsumo(objSession, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs | GetIdConsumoParaEliminar");
                result.type = "errorInt";
                result.message = "Ocurrió un inconveniente al traer datos";
            }
            //return Json(ListarConsumo);
            //modificado 27.05.2021
            var json_ = Json(lista, JsonRequestBehavior.AllowGet);
            json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
            return json_;
        }

        //OBTENER LA LISTA DE SERVICIOS DISPONIBLES DE LA TABLA TGREGLANEG_SERV_DET
        public JsonResult GetTablaReglaNegocioServicio(wsPersona.Session_Movi objSession, int intIdAsistencia)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            List<TGREGLANEG_SERV_DET> lista = new List<TGREGLANEG_SERV_DET>();
            PersonalSrvClient proxyOrg;

            try
            {
                using (proxyOrg = new PersonalSrvClient())
                {
                    lista = proxyOrg.ListarReglaNegocioServicio(objSession, intIdAsistencia, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }

                //bool isEmpty = !ListarConsumo.Any();

                if (strMsgUsuario.Equals(""))
                {
                    result.type = "success";
                    result.message = "Ud. Tiene los Siguientes Servicios disponibles.";
                }else
                {
                    result.type = "error";
                    result.message = strMsgUsuario;
                }

                //return Json(ListarConsumo);
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs | GetTablaReglaNegocioServicio");
                result.type = "errorInt";
                result.message = "Ocurrió un inconveniente al traer datos";
            }

            //
            bool isEmpty = !lista.Any();

            if (isEmpty)
            {
                return Json(result);//RETORNA UN RESULT
            }
            else
            {
                //return Json(ListarConsumo); //RETORNA UNA LISTA
                                            //modificado 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }

        }

        //OBTENER LA LISTA DE SERVICIOS COMPLEMENTARIOS
        public JsonResult GetTablaComplementarios(wsPersona.Session_Movi objSession, int intIdAsistencia)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            List<TGREGLANEG_SERV_DET> lista = new List<TGREGLANEG_SERV_DET>();
            PersonalSrvClient proxyOrg;

            try
            {
                using (proxyOrg = new PersonalSrvClient())
                {
                    lista = proxyOrg.ListarServicioComplementario(objSession, intIdAsistencia, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
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
            }
            catch (Exception)
            {
                result.type = "errorInt";
                result.message = "Ocurrió un inconveniente al traer datos";
            }

            bool isEmpty = !lista.Any();

            if (isEmpty)
            {
                return Json(result);//RETORNA UN RESULT
            }
            else
            {
                //return Json(ListarComplementos); //RETORNA UNA LISTA
                                                 //modificado 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
        }


        /* ========================================================================================
         *  MÉTODO USADO PARA EL WEBSOCKET
         * ========================================================================================*/
        public JsonResult GetAsistenciaTomaConsumo()
        {
            try
            {
                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["CustomerConnection"].ConnectionString))
                {
                    connection.Open();
                    //Ejecutándose mediante sp, pero aún sin parámetros
                    using (SqlCommand command = new SqlCommand(@"TSP_WEBSOCKET_MARCACION_ASISTENCIA", connection))
                    {
                        command.Notification = null;
                        SqlDependency dependency = new SqlDependency(command);
                        dependency.OnChange += new OnChangeEventHandler(dependency_OnChange);

                        if (connection.State == ConnectionState.Closed)
                            connection.Open();

                        SqlDataReader reader = command.ExecuteReader();

                        var listCus = reader.Cast<IDataRecord>()
                                .Select(x => new
                                {
                                    ultimoIntIdAsistencia = (int)x["intIdAsistencia"],
                                    codigoMarcador = (int)x["CodMarcador"],

                                }).ToList();
                        ////añadido 12.10.2021 para Imprimir Ticket si la configuración es 4: Generar desde Marca de Reloj Sin Seleccionar Servicio
                        //if (listCus[0].codigoMarcador == 0)
                        //{
                        //    wsPersona.Session_Movi objSesio = new wsPersona.Session_Movi();
                        //    objSesio.intIdSesion = Auth.intIdSesion();
                        //    objSesio.intIdSoft = Auth.intIdSoft();
                        //    objSesio.intIdMenu = intIdMenuGlo;
                        //    objSesio.intIdUsuario = Auth.intIdUsuario();

                            

                        //    JsonResult RptaConfi = GetTSConfi(objSesio, "HAB_IMPR_TICKET_COMEDOR");
                        //    string json = JsonConvert.SerializeObject(RptaConfi.Data);
                        //    TSConfi objConfi = new TSConfi();
                        //    objConfi = JsonConvert.DeserializeObject<TSConfi>(json);
                        //    if (objConfi.strValorConfi== "4")
                        //    {
                        //        /// tipo >> 0: cuando envias varios IdAsist / 1: cuando envias varios idConsumos/ 2: cuando envias un IdAsist con al menos un idconsumo
                        //        var idAsistencia = listCus[0].ultimoIntIdAsistencia;
                        //        var tipo = 2;
                        //        wsSistema.Session_Movi objSesio1 = new wsSistema.Session_Movi();
                        //        objSesio1.intIdSesion = Auth.intIdSesion();
                        //        objSesio1.intIdSoft = Auth.intIdSoft();
                        //        objSesio1.intIdMenu = intIdMenuGlo;
                        //        objSesio1.intIdUsuario = Auth.intIdUsuario();

                        //        List<wsSistema.Consumo>  listaConsumoSelects = new List<wsSistema.Consumo>();
                        //        Log.AlmacenarLogMensaje("Entró a la impresión directa desde reloj y no a la toma - PRE: " + idAsistencia.ToString() );
                        //        JsonResult Imprimir = Imp_Consumos(objSesio1, idAsistencia, tipo, listaConsumoSelects);
                        //        Log.AlmacenarLogMensaje("Entró a la impresión directa desde reloj y no a la toma - POST: " + idAsistencia.ToString());
                        //    }
                        //}

                        return Json(new { listCus = listCus }, JsonRequestBehavior.AllowGet);
                    }
                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs | GetAsistenciaTomaConsumo");
                //result.type = "Error Desconocido";
                //result.message = "Ocurrió un inconveniente al registrar el Servicio";
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }

        //entra por defecto siempre a esta dependencia
        private void dependency_OnChange(object sender, SqlNotificationEventArgs e)
        {
            CusHub.Show();

        }

        //Tiempo de Espera configurable desde el Web.config
        public string getTiempoCierreConsumo()
        {
            string TiempoCierreConsumo = WebConfigurationManager.AppSettings["TiempoCierreConsumo"].ToString();
            Session["TiempoCierreConsumo"] = TiempoCierreConsumo;
            return TiempoCierreConsumo;
        }

        //Segundo Tiempo de Espera configurable desde el Web.config
        public string getTiempoCierreConsumoAfter()
        {
            string TiempoCierreConsumoAfter = WebConfigurationManager.AppSettings["TiempoCierreConsumoAfter"].ToString();
            Session["TiempoCierreConsumoAfter"] = TiempoCierreConsumoAfter;
            return TiempoCierreConsumoAfter;
        }

        //Copia de IUServicio desde AsistenciaController
        public JsonResult RegistrarMarcacionConDni(ComedorMarcaConDni ObjEmpleadoConDni, int intTipoOperacion, wsPersona.Session_Movi objSession)//,wsAsistencia.Session_Movi objSession
        {

            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";
            int idAsistencia = 0;
            int idConsumoAuto = 0;
            MarcaDni obj = new MarcaDni();
            try
            {
                bool insert = false;


                using (proxy = new PersonalSrvClient())
                {
                    insert = proxy.RegistrarMarcaConDni(objSession, intTipoOperacion, ObjEmpleadoConDni, ref strMsgUsuario, ref idAsistencia, ref idConsumoAuto);
                    proxy.Close();
                }


                if (insert)
                {
                    result.type = "success";
                    result.message = strMsgUsuario;
                    obj.intIdMarca = idAsistencia;
                    obj.intIdConsumoAuto = idConsumoAuto;
                    result.objeto = obj;
                }else if (!strMsgUsuario.Equals(""))
                {
                    result.type = "info";
                    result.message = strMsgUsuario;
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs | RegistrarMarcacionConDni");
                result.type = "Error Desconocido";
                result.message = "Ocurrió un inconveniente al registrar el Marcación Con Dni";
            }

            return Json(result);
        }


        #endregion TOMA_DE_CONSUMO

        #region GESTION DE CONSUMOS
        //00.- VISTA HTML
        public ActionResult GestionConsumos(string intIdMenu, string strCodMenu)//originalmente solo tenia el parámetro intIdMenu
        {
            if (ValidarSession_view())//if (Auth.isAuthenticated())
            {
                intIdMenuGlo = Convert.ToInt32(intIdMenu);
                SeguridadController.strcoMenuGlo = strCodMenu;//añadido 06.05.2021 uso general
                return View();
            }
            return RedirectToAction("CerrarSesion", "LoginSiscop");
        }

        //01.- LISTAR TODOS LOS REGISTROS DE LA TABLA TCCONSUMO
        public JsonResult GetTablaGestionConsumo(wsPersona.Session_Movi objSession, string dttFiltroFchI, string dttFiltroFchF, string strDescripcion, int intConsumido, int intTipoServ, int intTipoMenu, int IntIdEmp, int intIdMarcador)
        
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            List<wsPersona.Consumo> lista = new List<wsPersona.Consumo>();
            PersonalSrvClient proxyOrg;
            try
            {
                using (proxyOrg = new PersonalSrvClient())
                {
                    lista = proxyOrg.ListarGestionConsumo(objSession, dttFiltroFchI, dttFiltroFchF, strDescripcion, intConsumido, intTipoServ, intTipoMenu, IntIdEmp, intIdMarcador, ref strMsgUsuario).ToList();
                    //ListarGestionConsumo = proxyOrg.ListarGestionConsumo(3, 1, 4, strEntidad, intIdFiltroGrupo, strGrupo, strSubGrupo, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs | GetTablaGestionConsumo");
                result.type = "Error Desconocido";
                result.message = "Ocurrió un inconveniente al obtener Datos";
            }
            //return Json(ListarGestionConsumo);
            //modificado 27.05.2021
            var json_ = Json(lista, JsonRequestBehavior.AllowGet);
            json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
            return json_;
        }



    //02.- 
    public JsonResult actualizarGetionConsumo(wsPersona.Session_Movi objSession, int intTipoOperacion, wsPersona.Consumo ObjConsumo)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                bool insert = false;

                using (proxy = new PersonalSrvClient())
                {
                    insert = proxy.UpdateGestionConsumo(objSession, intTipoOperacion, ObjConsumo, ref strMsgUsuario);
                    proxy.Close();
                }

                if (/*strMsgUsuario.Equals("") &&*/ insert)
                {
                    result.type = "success";
                    result.message = strMsgUsuario;// "La Atención del Consumo se registró satisfactoriamente.";
                }
                else
                {

                    if (strMsgUsuario.Contains("código"))
                    {
                        result.type = "error";
                        result.message = strMsgUsuario;
                    }
                    else
                    {
                        if (strMsgUsuario.Contains("razón"))
                        {
                            result.type = "info";
                            result.message = strMsgUsuario;
                        }
                        else
                        {
                            if (strMsgUsuario.Contains("ruc"))
                            {
                                result.type = "alert";
                                result.message = strMsgUsuario;
                            }

                        }
                    }


                }

            }
            catch (Exception)
            {
                result.type = "errorInt";
                result.message = "Ocurrió un inconveniente al registrar la Variable";
            }

            return Json(result);
        }

        //03.- 
        public JsonResult ActualizarGestionMasivoConsumo(wsPersona.Session_Movi objSession, int intTipoOperacion, List<int> listPersonal)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                bool insert = false;

                using (proxy = new PersonalSrvClient())
                {
                    insert = proxy.UpdateGestionMasivoConsumo(objSession, intTipoOperacion, listPersonal.ToArray(), ref strMsgUsuario);
                    proxy.Close();
                }

                if (strMsgUsuario.Equals("") && insert)
                {
                    result.type = "success";
                    result.message = "La Atención del los Consumo se registró satisfactoriamente.";
                }

                if (strMsgUsuario.Equals("") && insert)
                {
                    result.type = "success";
                    result.message = "Los Consumos Seleccionados se Actualizaron Satisfactoriamente.";
                }
                else
                {

                    if (strMsgUsuario.Contains("código"))
                    {
                        result.type = "error";
                        result.message = strMsgUsuario;
                    }
                    else
                    {
                        if (strMsgUsuario.Contains("razón"))
                        {
                            result.type = "info";
                            result.message = strMsgUsuario;
                        }
                        else
                        {
                            if (strMsgUsuario.Contains("ruc"))
                            {
                                result.type = "alert";
                                result.message = strMsgUsuario;
                            }

                        }
                    }


                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs | ActualizarGestionMasivoConsumo");
                result.type = "errorInt";
                result.message = "Ocurrió un inconveniente al actualizar consumos";
            }

            return Json(result);
        }

        ///* ========================================================================================
        // * MÉTODO PARA USO DE WEBSOCKET  
        // * ========================================================================================*/
        //public JsonResult GetGestionConsumo()
        //{
        //    using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["CustomerConnection"].ConnectionString))

        //    {
        //        connection.Open();

        //        //Ejecutándose mediante sp, pero aún sin parámetros
        //        using (SqlCommand command = new SqlCommand(@"TSP_WEBSOCKET_GESTION_CONSUMO", connection))

        //        {
        //            command.Notification = null;
        //            SqlDependency dependency = new SqlDependency(command);
        //            dependency.OnChange += new OnChangeEventHandler(dependency_OnChange2);

        //            if (connection.State == ConnectionState.Closed)
        //                connection.Open();

        //            SqlDataReader reader = command.ExecuteReader();

        //            var list = reader.Cast<IDataRecord>()
        //                    .Select(x => new
        //                    {
        //                        ultimoIntIdConsumo = (int)x["intIdConsumo"],

        //                    }).ToList();

        //            return Json(new { list = list }, JsonRequestBehavior.AllowGet);


        //        }

        //    }
        //}

        //private void dependency_OnChange2(object sender, SqlNotificationEventArgs e)
        //{
        //    //GesHub.Show();
        //    CusHub.Show();
        //}


        #endregion GESTION DE CONSUMOS

        #region GC-Modal

        public JsonResult GetTablaGC(wsPersona.Session_Movi objSession, int intId)
        {
            string strMsgUsuario = "";

            List<wsPersona.Consumo> lista = new List<wsPersona.Consumo>();
            PersonalSrvClient proxyOrg;
            try
            {
                using (proxyOrg = new PersonalSrvClient())
                {
                    lista = proxyOrg.ListarConsumosXid(objSession, intId, ref strMsgUsuario).ToList();

                    proxyOrg.Close();
                }
                //return Json(ListarGC);
            }catch(Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs | GetTablaGC");
            }
            //modificado 27.05.2021
            var json_ = Json(lista, JsonRequestBehavior.AllowGet);
            json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
            return json_;
        }

        public JsonResult UpConsumoGC(wsPersona.Session_Movi objSession, int intTipoOperacion, List<wsPersona.Consumo> listaConsumoSelects,int bitFlConsumido,int evento)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";
            if (listaConsumoSelects == null)
                listaConsumoSelects = new List<wsPersona.Consumo>();

            try
            {
                bool insert = false;

                using (proxy = new PersonalSrvClient())
                {
                    insert = proxy.UpdateGC(objSession, intTipoOperacion, listaConsumoSelects.ToArray(), bitFlConsumido, evento, ref strMsgUsuario);
                    proxy.Close();
                }

                if (insert)
                {
                    result.type = "success";
                    result.message = strMsgUsuario;// "La Atención del Consumo se registró satisfactoriamente.";
                }
                else
                {

                    if (strMsgUsuario.Contains("código"))
                    {
                        result.type = "error";
                        result.message = strMsgUsuario;
                    }
                    else
                    {
                        if (strMsgUsuario.Contains("razón"))
                        {
                            result.type = "info";
                            result.message = strMsgUsuario;
                        }
                        else
                        {
                            if (strMsgUsuario.Contains("ruc"))
                            {
                                result.type = "alert";
                                result.message = strMsgUsuario;
                            }

                        }
                    }


                }

            }
            catch (Exception)
            {
                result.type = "errorInt";
                result.message = "Ocurrió un inconveniente al registrar la Variable";
            }

            return Json(result);
        }

        #endregion GC-Modal


        //añadido 29.03.2021
        public JsonResult GetTSConfi(wsPersona.Session_Movi objSession, string strCoConfi)
        {
            string strMsgUsuario = "";
            TSConfi objConfi = new TSConfi();

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
                Log.AlmacenarLogError(ex, "PersonalController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);

        }

        //ImpresionTicket
        public JsonResult Imp_Consumos(wsSistema.Session_Movi objSession, int intIdConsumo,int tipo, List<wsSistema.Consumo> listaConsumoSelects)
        {
            /// tipo >> 0: cuando envias varios IdAsist / 1: cuando envias varios idConsumos/ 2: cuando envias un IdAsist con al menos un idconsumo
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";
            if (listaConsumoSelects == null)
                listaConsumoSelects = new List<wsSistema.Consumo>();
            try
            {
                bool impr = false;


 
                ////////string m = "DESAYUNO PRUEBA MAXIMO DE CARACTERES QUE SOPORTA LA APLICACI DESAYUNO PRUEBA MAXIMO DE CARACTERES QUE SOPORTA LA APLICACI";//datos[i].descr;
                ////////string primeros27caracteres = m.Substring(0, 9);
                ////////var split2 = m.Select((c, index) => new { c, index })
                ////////.GroupBy(x => x.index / 30)//Por cada 27 caracteres
                ////////.Select(group => group.Select(elem => elem.c))
                ////////.Select(chars => new string(chars.ToArray()));
                //////////Cada 27 carateres pasara a imprimir una linea
                ////////foreach (var str in split2)
                ////////{

                ////////    if (split2.First() == str)
                ////////    {
                ////////        Console.WriteLine(str);
                ////////        //BXLAPI.PrintText(str + "\n", BXLAPI.BXL_ALIGNMENT_LEFT, BXLAPI.BXL_FT_BOLD, BXLAPI.BXL_TS_1HEIGHT);
                ////////    }
                ////////    else
                ////////    {
                ////////        Console.WriteLine(str);
                ////////        //BXLAPI.PrintText("       " + str + "\n", BXLAPI.BXL_ALIGNMENT_LEFT, BXLAPI.BXL_FT_BOLD, BXLAPI.BXL_TS_1HEIGHT);
                ////////    }
                ////////}



                using (proxySis = new SistemaSrvClient())
                {
                   impr = proxySis.ImpresionTicket(objSession, intIdConsumo, tipo, listaConsumoSelects.ToArray(), ref strMsgUsuario);
                    proxySis.Close();
                }

                if (impr==true)
                {
                    result.type = "success";
                    result.message = strMsgUsuario;// "La Atención del Consumo se registró satisfactoriamente.";
                }
                else
                {
                        result.type = "error";
                        result.message = strMsgUsuario;
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs | Imp_Consumos");
                result.type = "errorInt";
                result.message = "Ocurrió un inconveniente al enviar Impresión al Servicio.";
            }

            return Json(result);
        }





        /************************************************************************************************************
           Bloque de funciones añadidas para la accion del botón Choose File de la ventana Importarción Masiva Excel             
        *************************************************************************************************************/

        //Clase creada (donde se almacenan cada documento cargado dentro de una misma sesion) Añadido HGM 04.11.2021
        public class ImportExcel
        {
            public int    strRandomId { get; set; }
            public string strNomExcel { get; set; }

        }
        // Crear una lista ImportExcel. Añadido HGM 04.11.2021
        public static List<ImportExcel> listIE = new List<ImportExcel>();


        //ELIMINAR EL ARCHIVO ANTERIORMENTE CARGADO AL DIRECTORIO - Añadido HGM 03.11.2021
        public ActionResult eliminarTodoExcelDeDirectorio()
        {
            int result = 0;
            string UploadPath = ConfigurationManager.AppSettings["rutaEmpleadoMasivo"]; //--->Ejem. "/DirMasivoEmpleado/"
            rutaDirectorioExcel = Path.Combine(HttpContext.Request.MapPath(UploadPath));

            //Si la carpeta"DirMasivoEmpleado" no existe lo creará automaticamente
            if (!Directory.Exists(rutaDirectorioExcel))
            {
                //Crea la carpeta
                Directory.CreateDirectory(rutaDirectorioExcel);
                Console.WriteLine(rutaDirectorioExcel);

            }

            //Elimina el anterior archivo excel (que tiene antepuesto y concatenado al nombre : la sesion + el numero aleatorio) del directorio "DirMasivoEmpleado" 
            if (nombreExcel != "" && nombreExcel != null)
            {
                DirectoryInfo di = new DirectoryInfo(rutaDirectorioExcel);

                foreach (FileInfo file in di.GetFiles())
                {
                    //for (int i = 0; i < listIE.Count; i++) // Loop through List with for
                    //{
                    //    Console.WriteLine(listIE[i]);
                    if (file.Name.Contains(nombreExcel))
                    {
                        file.Delete();
                        result = 1;//ha sido eliminado
                    }
                    //}

                }
            }

            return Json(result);
        }



        //14.5 OBTENER LA RUTA DE "FORMATOS"  ---> Aun no hay nada en el js
        public string CrearCarpetaFormatos()//getRutaDirImpotraExcel()  //GetRutaFormatos
        {
            string strRutaDir = "";
            //if (strRutaDir!="") { 
            strRutaDir = ConfigurationManager.AppSettings["rutaFormatos"];
            //}
            string rutaDirFormatos = Path.Combine(HttpContext.Request.MapPath(strRutaDir));

            //Genera la ruta en una variable
            string folderPath = rutaDirFormatos;//@"D:\MyFolder"
            if (!Directory.Exists(folderPath))
            {
                //Crea la carpeta
                Directory.CreateDirectory(folderPath);
                Console.WriteLine(folderPath);

            }
            //Devuelve la ruta de esa carpeta creada
            return rutaDirFormatos;
        }



        #region IMPORTACIÓN MASIVA PERMISOS
        public ActionResult ImportMasivoPermiso(int idComboPlantilla, int cboFormato, bool checkActualizar)
        {
            wsPersona.Session_Movi objSession = new wsPersona.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";
            try
            {
                List<PermisoMasivo> listPermisos = new List<PermisoMasivo>();

                using (proxy = new PersonalSrvClient())
                {
                    listPermisos = proxy.ImportMasivoPermiso(objSession, nombreExcel, idProceso, idComboPlantilla, cboFormato, checkActualizar, rutaDirectorioExcel, ref strMsgUsuario).ToList();
                    proxy.Close();
                }

                if (strMsgUsuario == "")
                {
                    result.type = "success";
                    result.message = "Los permisos fueron importados correctamente";
                    result.objeto = listPermisos;
                }
                else
                {
                    result.type = "infoc";
                    result.message = strMsgUsuario;
                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al importar los permisos";
            }

            //return Json(result);
            //modificado 27.05.2021
            var json_ = Json(result, JsonRequestBehavior.AllowGet);
            json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
            return json_;
        }



        public ActionResult GuardarMasivoPermiso()
        {
            wsPersona.Session_Movi objSession = new wsPersona.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";
            try
            {
                List<PermisoMasivo> listPermisos = new List<PermisoMasivo>();

                using (proxy = new PersonalSrvClient())
                {
                    listPermisos = proxy.GuardarMasivoPermiso(objSession, idProceso, nombreExcel, rutaDirectorioExcel, ref strMsgUsuario).ToList();
                    proxy.Close();
                }

                if (strMsgUsuario == "")
                {
                    result.type = "success";
                    result.message = "Los permisos fueron guardados de forma correcta";
                    result.objeto = listPermisos;
                }
                else
                {
                    result.type = "infoc";
                    result.message = strMsgUsuario;
                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al guardar los permisos";
            }

            //return Json(result);
            //modificado 27.05.2021
            var json_ = Json(result, JsonRequestBehavior.AllowGet);
            json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
            return json_;
        }
        #endregion



    }
}
