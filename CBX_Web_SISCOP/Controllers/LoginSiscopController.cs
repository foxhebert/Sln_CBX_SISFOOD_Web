using CBX_Web_SISCOP.Models;
using CBX_Web_SISCOP.wsPersona;
using CBX_Web_SISCOP.wsSeguridad;
using CBX_Web_SISCOP.wsSistema;//añadido 06.07.2021
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;

namespace CBX_Web_SISCOP.Controllers
{
    public class LoginSiscopController : Controller
    {

        private SeguridadSrvClient Seguridad_tsp;
        private PersonalSrvClient proxy;
        public static string url { get; set; }
        public static string texto { get; set; }
        public static string textoConfig { get; set; }
        public static string pieConfig { get; set; }
        public static int intMaxLenJson { get; set; }//copiado 27.05.2021 

        //añadido de la Internet como contingencia, falta probar en Servidor
        public static string GetUserIPAddress()
        {
            url = (System.Web.HttpContext.Current.Request.Url.AbsoluteUri).Replace("/LoginSiscop/LoginSiscop", "");//añadido 09.09.2021
            var context = System.Web.HttpContext.Current;
            string ip = String.Empty;

            if (context.Request.ServerVariables["HTTP_X_FORWARDED_FOR"] != null)
                ip = context.Request.ServerVariables["HTTP_X_FORWARDED_FOR"].ToString();
            else if (!String.IsNullOrWhiteSpace(context.Request.UserHostAddress))
                ip = context.Request.UserHostAddress;

            if (ip == "::1")
                ip = "127.0.0.1";
            return ip;
        }

        public bool ValidarConexWCF()
        {
            string version = "";
            try
            {
                using (Seguridad_tsp = new SeguridadSrvClient())
                {
                    version = Seguridad_tsp.wsVersion();
                    return true; //Si conecta al Servicio
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "LoginSiscopController.cs: Exception");
                version = "No es posible conectar con el Web Service";//añadido 22.04.2021
                return false; //No conecta al Servicio
            }
        }

        public ActionResult LoginSiscop()
        {
            getNomSoftWeb();
            getVersionWeb();
            getVersionWs();

            if (Auth.isAuthenticated())
            {
                return RedirectToAction("PaginaPrincipal", "Inicio");
            }
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult LoginSiscop(string usuario, string contraseña)
        {
            string strMsgUsuario = "";
            int Valida = 0;
            string strUserNameInput = "";
            string strMensajeError = "";
            string strMsgAlert = "";
            int LoginAttempts = 0;
            int tiempoEspera = 0;

                if (Session["LoginAttempts"] != null)
                {
                    LoginAttempts = Convert.ToInt32(Session["LoginAttempts"]);
                }

            string msj = "";
            using (Seguridad_tsp = new SeguridadSrvClient())
            {
                msj = Seguridad_tsp.ValidaServer("", 0);
            }


            if (msj == "")
            {
                if (ValidarConexWCF())
                {
                    if (LoginAttempts <= 3)
                    {

                        try
                        {
                            List<TG_USUARIO> detConcepto = new List<TG_USUARIO>();
                            wsSeguridad.Session_ objSession__ = new wsSeguridad.Session_();
                            objSession__.strIpHost = GetUserIPAddress();

                            using (Seguridad_tsp = new SeguridadSrvClient())
                            {
                                //detConcepto = Seguridad_tsp.ValidarUsuario(3, 1, 6, usuario, contraseña, getNomSoftWeb(), ref Valida, ref strMsgUsuario).ToList();
                                detConcepto = Seguridad_tsp.ValidarUsuario_(objSession__, usuario, contraseña, getNomSoftWeb(), ref Valida, ref strMsgUsuario).ToList();
                            }

                            if (detConcepto.Count() > 0)
                            {
                                strMensajeError = detConcepto[0].strDetalleValida;
                            }

                            if (Valida == 1 || Valida == 5)
                            {
                                int idUsuarioBd = detConcepto[0].intIdUsuar;

                                Session["isAuthenticated"] = "true";
                                Session["intCodValidaSesion"] = Valida;
                                Session["intIdUsuarioSesion"] = detConcepto[0].intIdUsuar;
                                //Session["imgFoto"] = detConcepto[0].imgFoto;
                                //inicio 27.03.2021 
                                string DirWebConfig = "";
                                DirWebConfig = System.Configuration.ConfigurationManager.AppSettings["rutaFotoEmpleado"];
                                //ruta = "/DirEmpleadosRuta/";//"~/DirEmpleadosRuta/";

                                var filePath = Server.MapPath(DirWebConfig + detConcepto[0].imgFoto);

                                if (System.IO.File.Exists(filePath))
                                {
                                    Session["imgFoto"] = detConcepto[0].imgFoto;
                                }
                                else
                                {
                                    Session["imgFoto"] = "descarga(1).jpg";
                                }
                                //fin
                                Session["imgfotoDefault"] = "descarga(1).jpg";
                                Session["strNombreUsuarioSesion"] = detConcepto[0].strNoUsuar;
                                Session["intIdPerfilSesion"] = detConcepto[0].intIdPerfil;
                                Session["strNomPerfilSesion"] = detConcepto[0].strNomPerfil;
                                Session["intIdSesionSesion"] = detConcepto[0].intIdSesion;
                                Session["strUserNameSesion"] = detConcepto[0].strUserName.ToUpper();
                                Session["intIdSoftSesion"] = detConcepto[0].intIdSoft;
                                Session["intCodValidaSesion"] = detConcepto[0].intCodValida;
                                Session["intIdPersonal"] = detConcepto[0].intIdPersonal;
                                Session["numMarcadorToma"] = detConcepto[0].intMarcadorTomaConsumo; //solo para Comedor 28.09.2021

                                Session["jsonUserInfoSesion"] = new
                                {
                                    isAuthenticated = Session["isAuthenticated"],
                                    codValida = Session["intCodValidaSesion"],
                                    idUser = Session["intIdUsuarioSesion"],
                                    imgFoto = Session["imgFoto"],
                                    strNombreUser = Session["strNombreUsuarioSesion"],
                                    intIdPerfil = Session["intIdPerfilSesion"],
                                    strNomPerfil = Session["strNomPerfilSesion"],
                                    intIdSesion = Session["intIdSesionSesion"],
                                    strUserName = Session["strUserNameSesion"],
                                    intIdSoft = Session["intIdSoftSesion"],
                                    intCodValida = Session["intCodValidaSesion"],
                                    intNumMarcadorTomaConsumo = Session["numMarcadorToma"],//solo para Comedor 28.09.2021
                                };
                                MenuPorUsuario();

                                Session["LoginAttempts"] = null;
                                Session["LoginTimeAttempts"] = null;
                                return Json(new { codValida = Valida, error = "", data = Session["jsonUserInfoSesion"], strMsgAlert = "", strUserNameInput = "", strMensajeError = "" });
                            }
                            else //añadido 05.07.2021
                            {
                                // Session["LoginAttempts"] = LoginAttempts+1;//MODIFICADO  =NULL
                                Session["LoginTimeAttempts"] = null;
                                // return Json(new { codValida = Valida, error = "login", data = tiempoEspera, strMsgAlert = strMsgUsuario, strUserNameInput = "", strMensajeError = "" });
                                if (Session["LoginAttempts"] != null)
                                {
                                    LoginAttempts = Convert.ToInt32(Session["LoginAttempts"]);
                                    Session["LoginAttempts"] = ++LoginAttempts;
                                    if (LoginAttempts == 2)
                                    {
                                        strMsgAlert = "Le quedan 2 intentos.";
                                    }
                                    else if (LoginAttempts == 3)
                                    {
                                        strMsgAlert = "Le queda 1 intento.";
                                    }
                                    else
                                    {
                                        tiempoEspera = Int32.Parse(WebConfigurationManager.AppSettings["tiempoespera"]);
                                        Session["LoginAttempts"] = null;
                                    }
                                    //return Json(new { codValida = Valida, error = "login", data = tiempoEspera, strMsgAlert = strMsgAlert, strUserNameInput = strUserNameInput, strMensajeError = strMensajeError });
                                }
                                else
                                {
                                    Session["LoginAttempts"] = 1;
                                    strMsgAlert = "Le quedan 3 intentos.";
                                    //return Json(new { codValida = Valida, error = "login", data = tiempoEspera, strMsgAlert = strMsgAlert, strUserNameInput = strUserNameInput, strMensajeError = strMensajeError });
                                }


                            }//añadido fin  05.07.2021
                        }
                        catch (Exception ex)
                        {
                            Log.AlmacenarLogError(ex, "LoginController.cs");
                        }
                    }
                    return Json(new { codValida = Valida, error = "login", data = tiempoEspera, strMsgAlert = strMsgAlert, strUserNameInput = strUserNameInput, strMensajeError = strMensajeError });
                }
                else
                {
                    Session["LoginAttempts"] = null;
                    Session["LoginTimeAttempts"] = null;
                    return Json(new { codValida = Valida, error = "login", data = tiempoEspera, strMsgAlert = "No es posible conectar con el Servicio Web", strUserNameInput = "", strMensajeError = "" });
                }
            }
            else
            {
                Session["LoginAttempts"] = null;
                Session["LoginTimeAttempts"] = null;
                return Json(new { codValida = Valida, error = "login", data = tiempoEspera, strMsgAlert = msj, strUserNameInput = "", strMensajeError = "" });
            }

        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult CambiarClave(string contraseña, string nuevacontraseña)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";
            string strEstado = "";

            int tiempoEspera = Convert.ToInt32(WebConfigurationManager.AppSettings["tiempoespera"]);
            int ActulizarClaveAttempts = 0;

            if (Session["ActualizarClaveTime"] != null)
            {
                DateTime CurrentTime = DateTime.UtcNow;
                DateTime LoginTime = Convert.ToDateTime(Session["ActualizarClaveTime"].ToString());
                if (CurrentTime > LoginTime)
                {
                    Session["ActulizarClaveAttempts"] = null;
                    Session["ActualizarClaveTime"] = null;
                }
            }
            if (Session["ActulizarClaveAttempts"] != null)
            {
                ActulizarClaveAttempts = Convert.ToInt32(Session["ActulizarClaveAttempts"]);
            }

            if (ActulizarClaveAttempts <= 3)
            {
                if (Auth.AuthenticatedGeneral())
                {

                    try
                    {
                        bool insert = false;
                        string strUsUsuar = Session["strUserNameSesion"].ToString();
                        int intIdUsuario = Convert.ToInt32(Session["intIdUsuarioSesion"].ToString());

                        using (Seguridad_tsp = new SeguridadSrvClient())
                        {
                            insert = Seguridad_tsp.ActualizarPasswrMx(3, 1, 6, strUsUsuar, contraseña, nuevacontraseña, intIdUsuario, ref strEstado, ref strMsgUsuario);
                            Seguridad_tsp.Close();
                        }

                        if (strEstado == "1" && insert)
                        {
                            result.type = "success";
                            result.message = "Contraseña actualizada con éxito.";

                            return Json(result);
                        }
                        else if (strEstado == "3")
                        {
                            result.type = "errorNoNoincide";
                            result.message = "La contraseña actual es incorrecta.";
                        }
                        else if (strEstado == "2")
                        {
                            result.type = "errorPassIgual";
                            result.message = "La nueva contraseña ingresada debe ser distinta a la contraseña actual.";
                        }
                        else
                        {
                            result.type = "error";
                            result.message = strMsgUsuario;

                        }

                    }
                    catch (Exception ex)
                    {
                        Log.AlmacenarLogError(ex, "LoginSiscopController.cs");
                        result.type = "errorInt";
                        result.message = "Ocurrió un inconveniente al actualizar contraseña por restablecimiento";
                    }
                }
                else
                {
                    result.type = "errorNoLogin";
                    result.message = "Ingrese al login.";
                }
            }

            if (Session["ActulizarClaveAttempts"] != null)
            {
                ActulizarClaveAttempts = Convert.ToInt32(Session["ActulizarClaveAttempts"]);
                Session["ActulizarClaveAttempts"] = ++ActulizarClaveAttempts;
                if (ActulizarClaveAttempts == 2)
                {
                    result.extramsg = "Le quedan 2 intentos.";
                }
                else if (ActulizarClaveAttempts == 3)
                {
                    result.extramsg = "Le queda 1 intento.";
                }
            }
            else
            {
                Session["ActulizarClaveAttempts"] = 1;
                result.extramsg = "Le quedan 3 intentos.";
            }

            if (ActulizarClaveAttempts > 3)
            {
                string timeShow = "" + tiempoEspera;
                if (Session["ActualizarClaveTime"] == null)
                {
                    DateTime CurrentTime = DateTime.UtcNow;
                    Session["ActualizarClaveTime"] = CurrentTime.AddSeconds(tiempoEspera);
                }
                else
                {
                    DateTime currentTimeDiff = DateTime.UtcNow;
                    DateTime loginTimeDiff = Convert.ToDateTime(Session["ActualizarClaveTime"].ToString());

                    TimeSpan diffResult = loginTimeDiff.Subtract(currentTimeDiff);
                    timeShow = diffResult.Seconds.ToString();
                }
                result.extramsg = "Espera " + timeShow + " segundos para volver intentar.";
            }
            return Json(result);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult RestablecerContra(string contrasena, int intIdPersonal)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";
            string strEstado = "";
            try
            {
                wsSeguridad.Session_Movi objSession = new wsSeguridad.Session_Movi();
                objSession.intIdSesion = Auth.intIdSesion();
                objSession.intIdSoft = Auth.intIdSoft();
                objSession.intIdMenu = 0;
                objSession.intIdUsuario = Auth.intIdUsuario();

                bool insert = false;

                using (Seguridad_tsp = new SeguridadSrvClient())
                {
                    insert = Seguridad_tsp.RestablecerContra(objSession, contrasena, intIdPersonal, ref strEstado, ref strMsgUsuario);
                    Seguridad_tsp.Close();
                }

                if (strEstado == "1" && insert)
                {
                    result.type = "success";
                    result.message = "Contraseña actualizada con éxito.";
                    result.extramsg = "1";
                }
                else
                {
                    result.type = "error";
                    result.message = strMsgUsuario;
                    result.extramsg = "0";
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "LoginSiscopController.cs");
                result.type = "errorInt";
                result.message = "Ocurrió un inconveniente al actualizar contraseña";
            }

            return Json(result);
        }

        public JsonResult ValidarEmail(string numDoc, string correo)
        {
            wsPersona.Session_Movi objSession = new wsPersona.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = 0;
            objSession.intIdUsuario = Auth.intIdUsuario();

            int ValidarCorreo = 0;

            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";
            string mensaje = "";

            if (Session["ValidarCorreo"] != null)
            {
                ValidarCorreo = Convert.ToInt32(Session["ValidarCorreo"]);
            }
            if (ValidarCorreo <= 3)
            {
                try
                {
                    using (proxy = new PersonalSrvClient())
                    {
                        mensaje = proxy.ValidarEmail(objSession, numDoc, correo, ref strMsgUsuario);
                        proxy.Close();
                    }

                    if (mensaje.Equals("no"))
                    {
                        result.type = "info";
                        result.message = strMsgUsuario;
                    }
                    else
                    {
                        result.type = "success";
                        result.message = strMsgUsuario;
                        return Json(result);
                    }
                }
                catch (Exception ex)
                {
                    Log.AlmacenarLogError(ex, "ProcesoController.cs");
                    return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
                }
            }

            if (Session["ValidarCorreo"] != null)
            {
                ValidarCorreo = Convert.ToInt32(Session["ValidarCorreo"]);
                Session["ValidarCorreo"] = ++ValidarCorreo;
                if (ValidarCorreo == 2)
                {
                    result.extramsg = "Le quedan 2 intentos.";
                }
                else if (ValidarCorreo == 3)
                {
                    result.extramsg = "Le queda 1 intento.";
                }
                else
                {
                    result.objeto = 100;
                    result.extramsg = WebConfigurationManager.AppSettings["tiempoespera"];
                    Session["ValidarCorreo"] = null;
                }
            }
            else
            {
                Session["ValidarCorreo"] = 1;
                result.extramsg = "Le quedan 3 intentos.";
            }
            return Json(result);
        }

        public JsonResult MenuPorUsuario()
        {
            if (Auth.isAuthenticated())
            {
                try
                {
                    int intIdUsuar = Convert.ToInt32(Session["intIdUsuarioSesion"].ToString());
                    string strMsgUsuario = "";

                    List<TS_MENU_PADRE> lista = new List<TS_MENU_PADRE>();
                    using (Seguridad_tsp = new SeguridadSrvClient())
                    {
                        lista = Seguridad_tsp.MenuPorUsuario(Auth.intIdSesion(), 1, Auth.intIdSoft(), intIdUsuar, 0, ref strMsgUsuario).ToList();
                        Session["jsonPerfilMenu"] = lista;
                        //Añadido 21.10.2021 para enviar la URL del publicado y guardarlo en la BD
                    }

                    ConfiguracionController ObjCon = new ConfiguracionController();
                    wsConfiguracion.Session_Movi objSession = new wsConfiguracion.Session_Movi();
                    objSession.intIdSesion = Auth.intIdSesion();
                    objSession.intIdSoft = Auth.intIdSoft();
                    objSession.intIdMenu = 0;
                    objSession.intIdUsuario = Auth.intIdUsuario();

                        List<wsConfiguracion.TSConfi> detalleConfig = new List<wsConfiguracion.TSConfi>();
                        wsConfiguracion.TSConfi ObjTsConfi = new wsConfiguracion.TSConfi();
                        ObjTsConfi.intIdConfi = 0;
                        ObjTsConfi.strCoConfi = "URL_WEBSITE_COM";
                        ObjTsConfi.strValorConfi = url.ToString();
                        ObjTsConfi.tipoControl = "V";
                        ObjTsConfi.bitFlActivo = true;
                        detalleConfig.Add(ObjTsConfi);

                    JsonResult JSonRpta;
                        JSonRpta = ObjCon.ActualizarConfiguracion(objSession, detalleConfig);
                        Log.AlmacenarLogMensaje("*>> Se registró URL Principal:" + url.ToString());

                    //return Json(DetMenu);
                    //modificado 27.05.2021
                    var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                    json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                    return json_;
                }
                catch (Exception ex)
                {
                    Log.AlmacenarLogError(ex, "LoginController.cs");
                }
            }
            Session["jsonPerfilMenu"] = null;
            return Json(new { error = 401, msg = "Error no login" });
        }

        public ActionResult RestablecerContrasena(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                texto = "";
            }
            else
            {
                texto = id;
            }

            //textoConfig = WebConfigurationManager.AppSettings["textoConfig"].ToString();
            //pieConfig = WebConfigurationManager.AppSettings["pieConfig"].ToString();
            //modificado 06.07.2021
            var secureAppSettings = WebConfigurationManager.GetSection("secureAppSettings") as NameValueCollection;
            textoConfig = secureAppSettings["textoConfig"].ToString();
            pieConfig = secureAppSettings["pieConfig"].ToString();

            if (Auth.isAuthenticated())
            {
                return RedirectToAction("PaginaPrincipal", "Inicio");
            }
            return View();
        }

        public JsonResult GetTexto()
        {
            return Json(texto);
        }

        public JsonResult GetConfig()
        {
            Dictionary<string, string> config = new Dictionary<string, string>();

            config.Add("textoConfig", textoConfig);
            config.Add("pieConfig", pieConfig);

            return Json(config);
        }

        [HttpGet]
        public ActionResult CerrarSesion()
        {
            bool cierre = false;
            string strMsgUsuario = "";
            if (Session["intIdSesionSesion"] != null)
            {
                long idSession = Convert.ToInt64(Session["intIdSesionSesion"].ToString());
                using (Seguridad_tsp = new SeguridadSrvClient())
                {
                    cierre = Seguridad_tsp.CerrarSession(idSession, ref strMsgUsuario);
                }
            }

            Session["LoginAttempts"] = null;
            Session["intCodValidaSesion"] = null;
            Session["isAuthenticated"] = null;
            Session["intIdUsuarioSesion"] = null;
            Session["strNombreUsuarioSesion"] = null;
            Session["intIdPerfilSesion"] = null;
            Session["strNomPerfilSesion"] = null;
            Session["intIdSesionSesion"] = null;
            Session["strUserNameSesion"] = null;
            Session["intIdSoftSesion"] = null;
            Session["intCodValidaSesion"] = null;
            Session["jsonUserInfoSesion"] = null;
            Session["jsonPerfilMenu"] = null;

            Session["ActulizarClaveAttempts"] = null;
            Session["LoginAttempts"] = null;
            Session["LoginTimeAttempts"] = null;

            Session.Clear();
            Session.Abandon();
            Session.RemoveAll();
            //añadido 06.05.2021 Consumir el SP

            getVersionWs();
            getVersionWeb();

            return RedirectToAction("LoginSiscop");
        }

        public string getVersionWs()
        {
            string version = "";
            try
            {
                using (Seguridad_tsp = new SeguridadSrvClient())
                {
                    version = Seguridad_tsp.wsVersion();
                }
                //Session["wsVersionSesion"] = version;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "LoginSiscopController.cs");
                version = "Verificar Conexión con Web Service";//añadido 22.04.2021
            }
            
            Session["wsVersionSesion"] = version;//añadido 22.04.2021
            return version;
        }

        public string getVersionWeb()
        {
            string versionweb = "";
            try
            {
                wsSistema.TSConfi objConfi = new wsSistema.TSConfi();
                wsPersona.Session_Movi objSession = new wsPersona.Session_Movi();
                var qa = "";
                SistemaSrvClient proxySis;//añadido 06.07.2021
                using (proxySis = new SistemaSrvClient())
                {
                    string strMsgUsuario = "";
                    objConfi = proxySis.ConsultarTSConfi_xCod(objSession.intIdSesion, 0, objSession.intIdSoft, "HAB_SERVICE", ref strMsgUsuario);
                    proxySis.Close();
                }
                if (objConfi.strValorConfi == "1")
                {
                    qa = " [DEMO]";
                }
                //versionweb = WebConfigurationManager.AppSettings["webversion"].ToString();
                //Session["webVersionSesion"] = versionweb;
                //modificado 06.07.2021
                var secureAppSettings = WebConfigurationManager.GetSection("secureAppSettings") as NameValueCollection;
                versionweb = secureAppSettings["webversion"].ToString();
                Session["webVersionSesion"] = versionweb + qa;

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "LoginSiscopController.cs");
            }
            return versionweb;
        }

        public string getNomSoftWeb()
        {
            string nameSoft = "";
            try
            {
                //nameSoft = WebConfigurationManager.AppSettings["nomsoft"].ToString();
                //Session["webNameSoft"] = nameSoft;
                //modificado 06.07.2021
                var secureAppSettings = WebConfigurationManager.GetSection("secureAppSettings") as NameValueCollection;
                nameSoft = secureAppSettings["nomsoft"].ToString();
                Session["webNameSoft"] = nameSoft;
                // >> nuevo valor de uso general -- añadido 27.05.2021
                try
                {
                    string MaxLenJson_ = WebConfigurationManager.AppSettings["MaxJsonLengthConfi"].ToString();
                    intMaxLenJson = Convert.ToInt32(MaxLenJson_);
                }
                catch (Exception ex)
                {
                    intMaxLenJson = 500000000; // valor por defecto si en confi
                    throw (ex);
                }
                //<< fin
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "LoginSiscopController.cs");
            }
            return nameSoft;
        }

        //añadido 05.07.2021
        public ActionResult RegistrarServerWCF(string llave, int Oper)//public string RegistrarServerWCF(string llave, int Oper)
        {
            CustomResponse result = new CustomResponse();

            wsSeguridad.Session_Movi objSesion = new wsSeguridad.Session_Movi();
            objSesion.intIdSesion = 1;
            objSesion.intIdSoft = 1;
            objSesion.intIdMenu = 1;
            int intRpta = 0;
            try
            {
                using (Seguridad_tsp = new SeguridadSrvClient())
                {
                    string msj = Seguridad_tsp.GenerarServerEncriptado(objSesion, ref intRpta, llave, Oper); //Oper= 0: Encriptar //1: Encriptar y Registrar // 2: Registrar
                    if (intRpta == 1)
                    {
                        result.type = "success";
                    }
                    else
                    {
                        result.type = "errorInt";
                    }

                    result.message = msj;
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "LoginSiscopController.cs");
                result.type = "errorInt";
                result.message = "Ocurrió un inconveniente al RegistrarServerWCF";
            }
            return Json(result);
        }


        //AÑADIDO 07.04.2021 - INTENTANDO ALMACENAR EL N° DE MARCADOR - SISFOODWEB
        public int setNumMarcadorTomaConsumo(int numMarcador)
        {
            try
            {
                Session["numMarcadorToma"] = numMarcador;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "LoginSiscopController.cs");
            }
            return numMarcador;
        }
        //AÑADIDO 07.04.2021 - INTENTANDO ALMACENAR EL N° DE MARCADOR - SISFOODWEB
        public int getNumMarcadorTomaConsumo()
        {
            int numMarcador = 0;
            try
            {
                numMarcador = Auth.intNumMarcadorTomaConsumo();  
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "LoginSiscopController.cs");
            }
            return numMarcador;
        }
    }
}
