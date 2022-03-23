using CBX_Web_SISCOP.wsPersona;
using CBX_Web_SISCOP.wsSeguridad;//añadido 22.04.2021
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CBX_Web_SISCOP.Controllers
{
    public class InicioController : Controller
    {

        private PersonalSrvClient proxy;

        //******-------------------------------------------------------------------------------------------------
        #region Validación Session y Conexión con WCF para usar en los ActionResult (vistas)

        //*-----------------------------------------------------------------------------------
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
        //*-----------------------------------------------------------------------------------
        #endregion Validación Session y Conexión con WCF para usar en los ActionResult (vistas)
        //******-------------------------------------------------------------------------------------------------


        #region Pagina Principal

        // GET: Inicio
        public ActionResult PaginaPrincipal()
        {
            if (ValidarSession_view())//if (Auth.isAuthenticated())
            {
                SeguridadController.strcoMenuGlo = "0";//añadido 06.05.2021 uso general
                return View();
            }
            return RedirectToAction("CerrarSesion", "LoginSiscop");
        }

        public JsonResult ListarAsistenciaDiaria(string fechaInicio, string fechaFin, int intIdPersonal)
        {
            wsPersona.Session_Movi objSession = new wsPersona.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = 0;
            objSession.intIdUsuario = Auth.intIdUsuario();

            string strMsjUsuario = "";
            string strMsjDB = "";
            int intResult = 1;

            IList<TSPTAASISTENCIA> lista = new List<TSPTAASISTENCIA>();

            try
            {
                using (proxy = new PersonalSrvClient())
                {
                    lista = proxy.ListarAsistenciaDiaria(objSession, intIdPersonal, fechaInicio, fechaFin, ref intResult, ref strMsjDB, ref strMsjUsuario);
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

        public JsonResult ListarDiasAusencia(string fechaInicio, string fechaFin, int intIdPersonal)
        {
            wsPersona.Session_Movi objSession = new wsPersona.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = 0;
            objSession.intIdUsuario = Auth.intIdUsuario();

            string strMsjUsuario = "";
            string strMsjDB = "";
            int intResult = 1;

            IList<DiaAusen> lista = new List<DiaAusen>();

            try
            {
                using (proxy = new PersonalSrvClient())
                {
                    lista = proxy.ListarDiasAusencia(objSession, intIdPersonal, fechaInicio, fechaFin, ref intResult, ref strMsjDB, ref strMsjUsuario);
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

        public JsonResult ListarCabeceras(string fechaInicio, string fechaFin, int intIdPersonal)
        {
            wsPersona.Session_Movi objSession = new wsPersona.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = 0;
            objSession.intIdUsuario = Auth.intIdUsuario();

            string strMsjUsuario = "";
            string strMsjDB = "";
            int intResult = 1;

            IList<HomeCabe> lista = new List<HomeCabe>();

            try
            {
                using (proxy = new PersonalSrvClient())
                {
                    lista = proxy.ListarCabeceras(objSession, intIdPersonal, fechaInicio, fechaFin, ref intResult, ref strMsjDB, ref strMsjUsuario);
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonaController.cs");
            }

            //return Json(lista);
            //modificado 27.05.2021
            var json_ = Json(lista, JsonRequestBehavior.AllowGet);
            json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
            return json_;
        }

        public JsonResult ListarHorasDescontadas(string fechaInicio, string fechaFin, int intIdPersonal)
        {
            wsPersona.Session_Movi objSession = new wsPersona.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = 0;
            objSession.intIdUsuario = Auth.intIdUsuario();

            string strMsjUsuario = "";
            string strMsjDB = "";
            int intResult = 1;

            IList<HorasDesc> lista = new List<HorasDesc>();

            try
            {
                using (proxy = new PersonalSrvClient())
                {
                    lista = proxy.ListarHorasDescontadas(objSession, intIdPersonal, fechaInicio, fechaFin, ref intResult, ref strMsjDB, ref strMsjUsuario);
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonaController.cs");
            }

            //return Json(lista);
            //modificado 27.05.2021
            var json_ = Json(lista, JsonRequestBehavior.AllowGet);
            json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
            return json_;

        }

        public JsonResult ListarHorasExtras(string fechaInicio, string fechaFin, int intIdPersonal)
        {
            wsPersona.Session_Movi objSession = new wsPersona.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = 0;
            objSession.intIdUsuario = Auth.intIdUsuario();

            string strMsjUsuario = "";
            string strMsjDB = "";
            int intResult = 1;

            IList<HorasDesc> lista = new List<HorasDesc>();
            try
            {
                using (proxy = new PersonalSrvClient())
                {
                    lista = proxy.ListarHorasExtras(objSession, intIdPersonal, fechaInicio, fechaFin, ref intResult, ref strMsjDB, ref strMsjUsuario);
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

        #endregion

    }
}
