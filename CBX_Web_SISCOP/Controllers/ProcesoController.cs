using CBX_Web_SISCOP.swProceso;
using CBX_Web_SISCOP.wsSeguridad;//22.04.2021
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CBX_Web_SISCOP.Models;
using System.Data;
using ClosedXML.Excel;
using System.IO;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml;
using System.Net;

namespace CBX_Web_SISCOP.Controllers
{
    public class ProcesoController : Controller
    {
        private ProcesoSrvClient proxyProc;
        public static int intIdMenuGlo { get; set; }
        public static List<PeriodoTmp> _listPeriodos { get; set; }

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

        #region Periodo de Pago

        public ActionResult PeriodoPago(string intIdMenu, string strCodMenu)//originalmente solo tenia el parámetro intIdMenu
        {
            if (ValidarSession_view())//if (Auth.isAuthenticated())
            {
                intIdMenuGlo = Convert.ToInt32(intIdMenu);
                SeguridadController.strcoMenuGlo = strCodMenu;//añadido 06.05.2021 uso general
                return View();
            }

            return RedirectToAction("CerrarSesion", "LoginSiscop");

        }

        public JsonResult EliminarPeriodo(int intIdPeriodo)
        {
            swProceso.Session_Movi objSession = new swProceso.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            CustomResponse result = new CustomResponse();

            string strMsgUsuario = "";
            try
            {
                bool boolEstado = false;

                using (proxyProc = new ProcesoSrvClient())
                {
                    boolEstado = proxyProc.EliminarPeriodo(objSession, intIdPeriodo, ref strMsgUsuario);
                    proxyProc.Close();
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
                Log.AlmacenarLogError(ex, "ProcesoController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al eliminar el registro";
            }

            return Json(result);
        }

        public JsonResult ObtenerPeriodoPorsuPK(int intIdPeriodo)
        {
            swProceso.Session_Movi objSession = new swProceso.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            string strMsgUsuario = "";

            try
            {
                Periodo obj = new Periodo();
                using (proxyProc = new ProcesoSrvClient())
                {
                    obj = proxyProc.ObtenerPeriodoPorsuPK(objSession, intIdPeriodo, ref strMsgUsuario);
                }
                return Json(obj);
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "ProcesoController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }

        public JsonResult IUperiodo(Periodo objDatos, int intTipoOperacion)
        {
            swProceso.Session_Movi objSession = new swProceso.Session_Movi();
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
                using (proxyProc = new ProcesoSrvClient())
                {
                    insert = proxyProc.IUperiodo(objSession, objDatos, intTipoOperacion, ref intResult, ref strMsjDB, ref strMsjUsuario);
                }
                if (intResult == 1)
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
                }
                else
                {
                    result.type = "info";
                    result.message = strMsjUsuario;
                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "ProcesoController.cs");
                result.type = "errorInt";
                result.message = "Ocurrió un inconveniente al actualizar el Periodo de Pago";
            }
            return Json(result);
        }

        public JsonResult ListarPeriodo(string filtroPeriodo, int filtroActivo, int filtroSituacion, string filtrojer_ini, string filtrojer_fin, int intIdPlanilla, int intIdUO)//modificado 04/08/2021
        {
            swProceso.Session_Movi objSession = new swProceso.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            string strMsjUsuario = "";
            IList<PeriodoData> lista = new List<PeriodoData>();

            try
            {
                using (proxyProc = new ProcesoSrvClient())
                {
                    lista = proxyProc.ListPeriodoPago(objSession, filtroPeriodo, filtroActivo, filtroSituacion, filtrojer_ini, filtrojer_fin, intIdPlanilla, intIdUO, ref strMsjUsuario);//modificado 04/08/2021
                }

                //return Json(lista); //modificado el 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "ProcesoController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }

        private JsonResult Json()
        {
            throw new NotImplementedException();
        }

        #endregion Periodo de Pago


        #region Grupo de Liquidación

        public ActionResult GrupoLiquidacion(string intIdMenu, string strCodMenu)//originalmente solo tenia el parámetro intIdMenu
        {
            if (ValidarSession_view())//if (Auth.isAuthenticated())
            {
                intIdMenuGlo = Convert.ToInt32(intIdMenu);
                SeguridadController.strcoMenuGlo = strCodMenu;//añadido 06.05.2021 uso general
                return View();
            }

            return RedirectToAction("CerrarSesion", "LoginSiscop");
        }

        public JsonResult EliminaGrupoLiq(int intIdGrupoLiq)
        {
            swProceso.Session_Movi objSession = new swProceso.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            CustomResponse result = new CustomResponse();

            string strMsgUsuario = "";
            try
            {
                bool boolEstado = false;

                using (proxyProc = new ProcesoSrvClient())
                {
                    boolEstado = proxyProc.EliminarGrupoLiquidacion(objSession, intIdGrupoLiq, ref strMsgUsuario);
                    proxyProc.Close();
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
                Log.AlmacenarLogError(ex, "ProcesoController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al eliminar el registro";
            }

            return Json(result);

        }

        public JsonResult ObtenerGrupoLiqPorsuPK(int intIdGrupoLiq)
        {
            swProceso.Session_Movi objSession = new swProceso.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            string strMsgUsuario = "";

            try
            {
                GrupoLiquidacion obj = new GrupoLiquidacion();
                using (proxyProc = new ProcesoSrvClient())
                {
                    obj = proxyProc.ObtenerGrupoLiquidacionPorsuPK(objSession, intIdGrupoLiq, ref strMsgUsuario);
                }
                return Json(obj);
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "ProcesoController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }

        public JsonResult IUGrupoLiq(GrupoLiquidacion objDatos, int intTipoOperacion)
        {
            swProceso.Session_Movi objSession = new swProceso.Session_Movi();
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
                using (proxyProc = new ProcesoSrvClient())
                {
                    insert = proxyProc.IUGrupoLiq(objSession, objDatos, intTipoOperacion, ref intResult, ref strMsjDB, ref strMsjUsuario);
                }
                if (intResult == 1)
                {
                    string mensaje = "";
                    if (intTipoOperacion == 1)
                    {
                        mensaje = "El registro se insertó satisfactoriamente";
                    }
                    else
                    {
                        mensaje = "El registro se actualizó satisfactoriamente";
                    }
                    result.type = "success";
                    result.message = mensaje;
                }
                else
                {
                    result.type = "info";
                    result.message = strMsjUsuario;
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "ProcesoController.cs");
                result.type = "errorInt";
                result.message = "Ocurrió un inconveniente al actualizar el Grupo de Liquidacion";
            }
            return Json(result);
        }

        public JsonResult ListarGrupoLiq(int filtroUniOrg, int filtroPlanilla, string filtroGrupoLiq, int filtroActivo, int filtroPeriodo)
        {
            swProceso.Session_Movi objSession = new swProceso.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            string strMsjUsuario = "";

            try
            {

                IList<GrupoLiquidacionData> lista = new List<GrupoLiquidacionData>();
                using (proxyProc = new ProcesoSrvClient())
                {
                    lista = proxyProc.ListGrupoLiquidacion(objSession, filtroUniOrg, filtroPlanilla, filtroGrupoLiq, filtroActivo, filtroPeriodo, ref strMsjUsuario);
                }
                //return Json(lista); //modificado el 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "ProcesoController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }

        #endregion Grupo de Liquidación


        #region Cálculo Manual

        public ActionResult CalculoManual(string intIdMenu, string strCodMenu)//originalmente solo tenia el parámetro intIdMenu
        {
            if (ValidarSession_view())//if (Auth.isAuthenticated())
            {
                intIdMenuGlo = Convert.ToInt32(intIdMenu);
                SeguridadController.strcoMenuGlo = strCodMenu;//añadido 06.05.2021 uso general
                return View();
            }

            return RedirectToAction("CerrarSesion", "LoginSiscop");
        }

        public JsonResult ListarGrupoLiqxPeriodo(List<int> listaPeriodo)
        {
            swProceso.Session_Movi objSession = new swProceso.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            string strMsgUsuario = "";

            try
            {
                IList<GrupoLiquidacion> lista = new List<GrupoLiquidacion>();
                using (proxyProc = new ProcesoSrvClient())
                {
                    lista = proxyProc.ListarGrupoLiqxPeriodo(objSession, listaPeriodo.ToArray(), ref strMsgUsuario);
                }
                //return Json(list);
                //modificado el 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "ProcesoController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }

        public JsonResult GetCampPeriodo(int intIdPlanilla)
        {
            string strMsgUsuario = "";
            List<Periodo> lista = new List<Periodo>();

            try
            {
                using (proxyProc = new ProcesoSrvClient())
                {
                    lista = proxyProc.ListarCampoPeriodoxPlanilla(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), intIdPlanilla, ref strMsgUsuario).ToList();
                    proxyProc.Close();
                }
                //return Json(lista_periodo);
                //modificado el 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "ProcesoController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }

        public JsonResult GetListaPersonal(int intIdPlanilla, string strFiltroCalculo, List<int> listaGrupoLiq)
        {
            swProceso.Session_Movi objSession = new swProceso.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            string strMsgUsuario = "";

            IList<CalculoPersonal> lista = new List<CalculoPersonal>();
            try
            {
                using (proxyProc = new ProcesoSrvClient())
                {
                    if (listaGrupoLiq == null)
                    {
                        listaGrupoLiq = new List<int>();
                    }
                    lista = proxyProc.GetListarPersonal(objSession, intIdPlanilla, strFiltroCalculo, listaGrupoLiq.ToArray(), ref strMsgUsuario);
                }
                //return Json(list);
                //modificado el 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "ProcesoController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }

        public JsonResult Calcular(int intIdPeriodos, List<int> listPersonal, int intIdPlanilla, int intIdProc)
        {
            swProceso.Session_Movi objSession = new swProceso.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            CustomResponse result = new CustomResponse();

            try
            {
                int insert = 0;
                using (proxyProc = new ProcesoSrvClient())
                {
                    insert = proxyProc.Calcular(objSession, intIdPeriodos, listPersonal.ToArray(), intIdPlanilla, intIdProc);
                }

                result.type = "success";
                result.message = "El cálculo terminó satisfactoriamente.";

                result.extramsg = insert.ToString();

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "ProcesoController.cs");
                result.type = "errorInt";
                result.message = "Ocurrió un inconveniente al realizar el cálculo";
            }
            return Json(result);
        }

        public JsonResult getPeriodoxPlanilla(int intIdPlanilla, bool bitCerrado)
        {
            swProceso.Session_Movi objSession = new swProceso.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            string strMsgUsuario = "";

            try
            {
                IList<Periodo> lista = new List<Periodo>();

                using (proxyProc = new ProcesoSrvClient())
                {
                    lista = proxyProc.getPeriodoxPlanilla(objSession, intIdPlanilla, bitCerrado, ref strMsgUsuario);
                    proxyProc.Close();
                }
                //return Json(lista_periodo);
                //modificado el 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "ProcesoController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }

        public JsonResult updatePeriodo(List<int> listPeriodos, bool bitCerrado)
        {
            swProceso.Session_Movi objSession = new swProceso.Session_Movi();
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
                using (proxyProc = new ProcesoSrvClient())
                {
                    insert = proxyProc.updatePeriodo(objSession, listPeriodos.ToArray(), bitCerrado, ref intResult, ref strMsjDB, ref strMsjUsuario);
                }
                if (intResult == 1)
                {
                    result.type = "success";
                    result.message = "El registro se actualizó satisfactoriamente.";
                }
                else
                {
                    result.type = "info";
                    result.message = strMsjUsuario;
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "ProcesoController.cs");
                result.type = "errorInt";
                result.message = "Ocurrió un inconveniente al actualizar el Grupo de Liquidacion";
            }
            return Json(result);
        }

        public JsonResult GuardarCalculo(int intIdProceso, string strFiltroCalculo, int intIdPlanilla, List<int> listaGrupoLiq)
        {
            swProceso.Session_Movi objSession = new swProceso.Session_Movi();
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
                IList<CalculoPersonal> list = new List<CalculoPersonal>();
                using (proxyProc = new ProcesoSrvClient())
                {
                    if (listaGrupoLiq == null)
                    {
                        listaGrupoLiq = new List<int>();
                    }
                    list = proxyProc.GuardarCalculo(objSession, intIdProceso, strFiltroCalculo, intIdPlanilla, listaGrupoLiq.ToArray(), ref intResult, ref strMsjDB, ref strMsjUsuario);
                }
                if (intResult == 1)
                {
                    result.type = "success";
                    result.message = "Los registros se insertaron satisfactoriamente.";
                    result.objeto = list;
                }
                else
                {
                    result.type = "info";
                    result.message = strMsjUsuario;
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "ProcesoController.cs");
                result.type = "errorInt";
                result.message = "Ocurrió un inconveniente al registrar los cálculos";
            }
            //return Json(result);
            //modificado el 27.05.2021
            var json_ = Json(result, JsonRequestBehavior.AllowGet);
            json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
            return json_;

        }

        public void exportExcel(int intIdProceso, string planilla)
        {

            swProceso.Session_Movi objSession = new swProceso.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            string strMsjUsuario = "";
            string strMsjDB = "";
            int intResult = 1;

            IList<CalculoPersonal> list = new List<CalculoPersonal>();
            try
            {
                using (proxyProc = new ProcesoSrvClient())
                {
                    list = proxyProc.getPersonalCalculo(objSession, intIdProceso, ref intResult, ref strMsjDB, ref strMsjUsuario);
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "ProcesoController.cs");
            }

            MemoryStream ms = new MemoryStream();
            SpreadsheetDocument xl = SpreadsheetDocument.Create(ms, SpreadsheetDocumentType.Workbook);
            WorkbookPart wbp = xl.AddWorkbookPart();
            WorksheetPart wsp = wbp.AddNewPart<WorksheetPart>();
            Workbook wb = new Workbook();
            FileVersion fv = new FileVersion();
            fv.ApplicationName = "Microsoft Office Excel";
            Worksheet ws = new Worksheet();

            //First sheet
            SheetData sd = new SheetData();
            Row r1 = new Row() { RowIndex = 1u };

            //LLENAMOS LA CABECERA
            Cell c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("Código - Registro");
            r1.Append(c1);

            Cell c2 = new Cell();
            c2.DataType = CellValues.String;
            c2.CellValue = new CellValue("Apellidos y Nombres");
            r1.Append(c2);

            Cell c3 = new Cell();
            c3.DataType = CellValues.String;
            c3.CellValue = new CellValue("N° Documento");
            r1.Append(c3);

            Cell c4 = new Cell();
            c4.DataType = CellValues.String;
            c4.CellValue = new CellValue("Fotocheck");
            r1.Append(c4);

            Cell c5 = new Cell();
            c5.DataType = CellValues.String;
            c5.CellValue = new CellValue("Unidad Organizacional");
            r1.Append(c5);

            Cell c6 = new Cell();
            c6.DataType = CellValues.String;
            c6.CellValue = new CellValue("Fiscalización");
            r1.Append(c6);

            Cell c7 = new Cell();
            c7.DataType = CellValues.String;
            c7.CellValue = new CellValue("Grupo de Liquidación");
            r1.Append(c7);

            Cell c8 = new Cell();
            c8.DataType = CellValues.String;
            c8.CellValue = new CellValue("Fecha de Admisión");
            r1.Append(c8);

            Cell c9 = new Cell();
            c9.DataType = CellValues.String;
            c9.CellValue = new CellValue("Fecha de Cese");
            r1.Append(c9);

            Cell c10 = new Cell();
            c10.DataType = CellValues.String;
            c10.CellValue = new CellValue("Dias Trabajados");
            r1.Append(c10);

            Cell c11 = new Cell();
            c11.DataType = CellValues.String;
            c11.CellValue = new CellValue("Dias Faltas");
            r1.Append(c11);

            Cell c12 = new Cell();
            c12.DataType = CellValues.String;
            c12.CellValue = new CellValue("Horas Adicionales");
            r1.Append(c12);

            Cell c13 = new Cell();
            c13.DataType = CellValues.String;
            c13.CellValue = new CellValue("Feriados");
            r1.Append(c13);

            Cell c14 = new Cell();
            c14.DataType = CellValues.String;
            c14.CellValue = new CellValue("Horas Fuera");
            r1.Append(c14);

            Cell c15 = new Cell();
            c15.DataType = CellValues.String;
            c15.CellValue = new CellValue("Tardanza");
            r1.Append(c15);

            Cell c16 = new Cell();
            c16.DataType = CellValues.String;
            c16.CellValue = new CellValue("Periodo");
            r1.Append(c16);

            sd.Append(r1);

            //LLENAMOS EL DETALLE

            int fila = 1;

            foreach (CalculoPersonal item in list)
            {
                Row r2 = new Row() { RowIndex = (UInt32)fila + 1 };

                Cell cc1 = new Cell();
                cc1.DataType = CellValues.String;
                cc1.CellValue = new CellValue(item.strCoPersonal);
                r2.Append(cc1);

                Cell cc2 = new Cell();
                cc2.DataType = CellValues.String;
                cc2.CellValue = new CellValue(item.strNomCompleto);
                r2.Append(cc2);

                Cell cc3 = new Cell();
                cc3.DataType = CellValues.String;
                cc3.CellValue = new CellValue(item.strNumDoc);
                r2.Append(cc3);

                Cell cc4 = new Cell();
                cc4.DataType = CellValues.String;
                cc4.CellValue = new CellValue(item.strFotocheck);
                r2.Append(cc4);

                Cell cc5 = new Cell();
                cc5.DataType = CellValues.String;
                cc5.CellValue = new CellValue(item.strDescripcion);
                r2.Append(cc5);

                Cell cc6 = new Cell();
                cc6.DataType = CellValues.String;
                cc6.CellValue = new CellValue(item.strDeTipo);
                r2.Append(cc6);

                Cell cc7 = new Cell();
                cc7.DataType = CellValues.String;
                cc7.CellValue = new CellValue(item.strDesGrupoLiq);
                r2.Append(cc7);

                Cell cc8 = new Cell();
                cc8.DataType = CellValues.String;
                cc8.CellValue = new CellValue(item.dttFecAdmin);
                r2.Append(cc8);

                Cell cc9 = new Cell();
                cc9.DataType = CellValues.String;
                cc9.CellValue = new CellValue(item.dttFecCese);
                r2.Append(cc9);

                Cell cc10 = new Cell();
                cc10.DataType = CellValues.String;
                cc10.CellValue = new CellValue(item.intDiasTrabajados.ToString());
                r2.Append(cc10);

                Cell cc11 = new Cell();
                cc11.DataType = CellValues.String;
                cc11.CellValue = new CellValue(item.intDiasFaltas.ToString());
                r2.Append(cc11);

                Cell cc12 = new Cell();
                cc12.DataType = CellValues.String;
                cc12.CellValue = new CellValue(item.intHorasAdicionales.ToString());
                r2.Append(cc12);

                Cell cc13 = new Cell();
                cc13.DataType = CellValues.String;
                cc13.CellValue = new CellValue(item.intFeriados.ToString());
                r2.Append(cc13);

                Cell cc14 = new Cell();
                cc14.DataType = CellValues.String;
                cc14.CellValue = new CellValue(item.intHorasFuera.ToString());
                r2.Append(cc14);

                Cell ccc15 = new Cell();
                ccc15.DataType = CellValues.String;
                ccc15.CellValue = new CellValue(item.intTardanza.ToString());
                r2.Append(ccc15);

                Cell ccc16 = new Cell();
                ccc16.DataType = CellValues.String;
                ccc16.CellValue = new CellValue(item.intIdPeriodo.ToString());
                r2.Append(ccc16);

                sd.Append(r2);

                fila++;
            }


            //// sheet 2
            WorksheetPart wsp2 = wbp.AddNewPart<WorksheetPart>();

            Worksheet ws2 = new Worksheet();
            SheetData sd2 = new SheetData();
            //ws2.Append(sd2);
            wsp2.Worksheet = ws2;
            wsp2.Worksheet.Save();

            r1 = new Row() { RowIndex = 1u };

            //LLENAMOS LA CABECERA
            c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("Código - Registro");
            r1.Append(c1);

            c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("Apellidos y Nombres");
            r1.Append(c1);

            c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("N° Documento");
            r1.Append(c1);

            c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("Fotocheck");
            r1.Append(c1);

            c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("Unidad Organizacional");
            r1.Append(c1);

            c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("Fiscalización");
            r1.Append(c1);

            c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("Grupo de Liquidación");
            r1.Append(c1);

            c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("Fecha de Admisión");
            r1.Append(c1);

            c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("Fecha de Cese");
            r1.Append(c1);

            c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("Dias Trabajados");
            r1.Append(c1);

            c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("Dias Faltas");
            r1.Append(c1);

            c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("Horas Adicionales");
            r1.Append(c1);

            c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("Feriados");
            r1.Append(c1);

            c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("Horas Fuera");
            r1.Append(c1);

            c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("Tardanza");
            r1.Append(c1);

            c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("Periodo");
            r1.Append(c1);

            sd2.Append(r1);

            IList<CalculoPersonal> list2 = new List<CalculoPersonal>();
            try
            {
                using (proxyProc = new ProcesoSrvClient())
                {
                    list2 = proxyProc.getPersonalNoProc(objSession, intIdProceso, ref intResult, ref strMsjDB, ref strMsjUsuario);
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "ProcesoController.cs");
            }

            //LLENAMOS EL DETALLE

            fila = 1;

            foreach (CalculoPersonal item in list2)
            {
                Row r2 = new Row() { RowIndex = (UInt32)fila + 1 };

                Cell cc1 = new Cell();
                cc1.DataType = CellValues.String;
                cc1.CellValue = new CellValue(item.strCoPersonal);
                r2.Append(cc1);

                Cell cc2 = new Cell();
                cc2.DataType = CellValues.String;
                cc2.CellValue = new CellValue(item.strNomCompleto);
                r2.Append(cc2);

                Cell cc3 = new Cell();
                cc3.DataType = CellValues.String;
                cc3.CellValue = new CellValue(item.strNumDoc);
                r2.Append(cc3);

                Cell cc4 = new Cell();
                cc4.DataType = CellValues.String;
                cc4.CellValue = new CellValue(item.strFotocheck);
                r2.Append(cc4);

                Cell cc5 = new Cell();
                cc5.DataType = CellValues.String;
                cc5.CellValue = new CellValue(item.strDescripcion);
                r2.Append(cc5);

                Cell cc6 = new Cell();
                cc6.DataType = CellValues.String;
                cc6.CellValue = new CellValue(item.strDeTipo);
                r2.Append(cc6);

                Cell cc7 = new Cell();
                cc7.DataType = CellValues.String;
                cc7.CellValue = new CellValue(item.strDesGrupoLiq);
                r2.Append(cc7);

                Cell cc8 = new Cell();
                cc8.DataType = CellValues.String;
                cc8.CellValue = new CellValue(item.dttFecAdmin);
                r2.Append(cc8);

                Cell cc9 = new Cell();
                cc9.DataType = CellValues.String;
                cc9.CellValue = new CellValue(item.dttFecCese);
                r2.Append(cc9);

                Cell cc10 = new Cell();
                cc10.DataType = CellValues.String;
                cc10.CellValue = new CellValue(item.intDiasTrabajados.ToString());
                r2.Append(cc10);

                Cell cc11 = new Cell();
                cc11.DataType = CellValues.String;
                cc11.CellValue = new CellValue(item.intDiasFaltas.ToString());
                r2.Append(cc11);

                Cell cc12 = new Cell();
                cc12.DataType = CellValues.String;
                cc12.CellValue = new CellValue(item.intHorasAdicionales.ToString());
                r2.Append(cc12);

                Cell cc13 = new Cell();
                cc13.DataType = CellValues.String;
                cc13.CellValue = new CellValue(item.intFeriados.ToString());
                r2.Append(cc13);

                Cell cc14 = new Cell();
                cc14.DataType = CellValues.String;
                cc14.CellValue = new CellValue(item.intHorasFuera.ToString());
                r2.Append(cc14);

                Cell ccc15 = new Cell();
                ccc15.DataType = CellValues.String;
                ccc15.CellValue = new CellValue(item.intTardanza.ToString());
                r2.Append(ccc15);

                Cell ccc16 = new Cell();
                ccc16.DataType = CellValues.String;
                ccc16.CellValue = new CellValue(item.intIdPeriodo.ToString());
                r2.Append(ccc16);

                sd2.Append(r2);

                fila++;
            }




            ws.Append(sd);
            ws2.Append(sd2);
            wsp.Worksheet = ws;
            wsp.Worksheet.Save();
            Sheets sheets = new Sheets();
            Sheet sheet = new Sheet();
            sheet.Name = planilla;
            sheet.SheetId = 1;
            sheet.Id = wbp.GetIdOfPart(wsp);
            Sheet sheet2 = new Sheet();
            sheet2.Name = "SIN CÁLCULO";
            sheet2.SheetId = 2;
            sheet2.Id = wbp.GetIdOfPart(wsp2);
            sheets.Append(sheet);
            sheets.Append(sheet2);
            wb.Append(fv);
            wb.Append(sheets);

            xl.WorkbookPart.Workbook = wb;
            xl.WorkbookPart.Workbook.Save();
            xl.Close();
            string fileName = "Cálculo Manual.xlsx";
            Response.Clear();
            byte[] dt = ms.ToArray();

            Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            Response.AddHeader("Content-Disposition", string.Format("attachment; filename={0}", fileName));
            Response.BinaryWrite(dt);
            Response.End();
        }

        public void exportExcelReporte(string planilla)
        {
            swProceso.Session_Movi objSession = new swProceso.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            string strMsjUsuario = "";
            string strMsjDB = "";
            int intResult = 1;

            IList<CalculoPersonal> list = new List<CalculoPersonal>();
            try
            {
                using (proxyProc = new ProcesoSrvClient())
                {
                    list = proxyProc.getExportEmpleados(objSession, getIntIdPeriodos(_listPeriodos).ToArray(), ref intResult, ref strMsjDB, ref strMsjUsuario);
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "ProcesoController.cs");
            }

            MemoryStream ms = new MemoryStream();
            SpreadsheetDocument xl = SpreadsheetDocument.Create(ms, SpreadsheetDocumentType.Workbook);
            WorkbookPart wbp = xl.AddWorkbookPart();
            WorksheetPart wsp = wbp.AddNewPart<WorksheetPart>();
            Workbook wb = new Workbook();
            FileVersion fv = new FileVersion();
            fv.ApplicationName = "Microsoft Office Excel";
            Worksheet ws = new Worksheet();

            //First sheet
            SheetData sd = new SheetData();
            Row r1 = new Row() { RowIndex = 1u };

            //LLENAMOS LA CABECERA
            Cell c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("Código - Registro");
            r1.Append(c1);

            Cell c2 = new Cell();
            c2.DataType = CellValues.String;
            c2.CellValue = new CellValue("Apellidos y Nombres");
            r1.Append(c2);

            Cell c3 = new Cell();
            c3.DataType = CellValues.String;
            c3.CellValue = new CellValue("N° Documento");
            r1.Append(c3);

            Cell c4 = new Cell();
            c4.DataType = CellValues.String;
            c4.CellValue = new CellValue("Fotocheck");
            r1.Append(c4);

            Cell c5 = new Cell();
            c5.DataType = CellValues.String;
            c5.CellValue = new CellValue("Unidad Organizacional");
            r1.Append(c5);

            Cell c6 = new Cell();
            c6.DataType = CellValues.String;
            c6.CellValue = new CellValue("Fiscalización");
            r1.Append(c6);

            Cell c7 = new Cell();
            c7.DataType = CellValues.String;
            c7.CellValue = new CellValue("Grupo de Liquidación");
            r1.Append(c7);

            Cell c8 = new Cell();
            c8.DataType = CellValues.String;
            c8.CellValue = new CellValue("Fecha de Admisión");
            r1.Append(c8);

            Cell c9 = new Cell();
            c9.DataType = CellValues.String;
            c9.CellValue = new CellValue("Fecha de Cese");
            r1.Append(c9);

            Cell c10 = new Cell();
            c10.DataType = CellValues.String;
            c10.CellValue = new CellValue("Dias Trabajados");
            r1.Append(c10);

            Cell c11 = new Cell();
            c11.DataType = CellValues.String;
            c11.CellValue = new CellValue("Dias Faltas");
            r1.Append(c11);

            Cell c12 = new Cell();
            c12.DataType = CellValues.String;
            c12.CellValue = new CellValue("Horas Adicionales");
            r1.Append(c12);

            Cell c13 = new Cell();
            c13.DataType = CellValues.String;
            c13.CellValue = new CellValue("Feriados");
            r1.Append(c13);

            Cell c14 = new Cell();
            c14.DataType = CellValues.String;
            c14.CellValue = new CellValue("Horas Fuera");
            r1.Append(c14);

            Cell c15 = new Cell();
            c15.DataType = CellValues.String;
            c15.CellValue = new CellValue("Tardanza");
            r1.Append(c15);

            Cell c16 = new Cell();
            c16.DataType = CellValues.String;
            c16.CellValue = new CellValue("Periodo");
            r1.Append(c16);

            Cell c17 = new Cell();
            c17.DataType = CellValues.String;
            c17.CellValue = new CellValue("Usuario");
            r1.Append(c17);

            Cell c18 = new Cell();
            c18.DataType = CellValues.String;
            c18.CellValue = new CellValue("Fecha Registro");
            r1.Append(c18);

            sd.Append(r1);

            //LLENAMOS EL DETALLE

            int fila = 1;

            foreach (CalculoPersonal item in list.ToList().FindAll(x => x.intTipo == 1))
            {
                Row r2 = new Row() { RowIndex = (UInt32)fila + 1 };

                Cell cc = new Cell();
                cc.DataType = CellValues.String;
                cc.CellValue = new CellValue(item.strCoPersonal);
                r2.Append(cc);

                cc = new Cell();
                cc.DataType = CellValues.String;
                cc.CellValue = new CellValue(item.strNomCompleto);
                r2.Append(cc);

                cc = new Cell();
                cc.DataType = CellValues.String;
                cc.CellValue = new CellValue(item.strNumDoc);
                r2.Append(cc);

                cc = new Cell();
                cc.DataType = CellValues.String;
                cc.CellValue = new CellValue(item.strFotocheck);
                r2.Append(cc);

                cc = new Cell();
                cc.DataType = CellValues.String;
                cc.CellValue = new CellValue(item.strDescripcion);
                r2.Append(cc);

                cc = new Cell();
                cc.DataType = CellValues.String;
                cc.CellValue = new CellValue(item.strDeTipo);
                r2.Append(cc);

                cc = new Cell();
                cc.DataType = CellValues.String;
                cc.CellValue = new CellValue(item.strDesGrupoLiq);
                r2.Append(cc);

                cc = new Cell();
                cc.DataType = CellValues.String;
                cc.CellValue = new CellValue(item.dttFecAdmin);
                r2.Append(cc);

                cc = new Cell();
                cc.DataType = CellValues.String;
                cc.CellValue = new CellValue(item.dttFecCese);
                r2.Append(cc);

                cc = new Cell();
                cc.DataType = CellValues.String;
                cc.CellValue = new CellValue(item.intDiasTrabajados.ToString());
                r2.Append(cc);

                cc = new Cell();
                cc.DataType = CellValues.String;
                cc.CellValue = new CellValue(item.intDiasFaltas.ToString());
                r2.Append(cc);

                cc = new Cell();
                cc.DataType = CellValues.String;
                cc.CellValue = new CellValue(item.intHorasAdicionales.ToString());
                r2.Append(cc);

                cc = new Cell();
                cc.DataType = CellValues.String;
                cc.CellValue = new CellValue(item.intFeriados.ToString());
                r2.Append(cc);

                cc = new Cell();
                cc.DataType = CellValues.String;
                cc.CellValue = new CellValue(item.intHorasFuera.ToString());
                r2.Append(cc);

                cc = new Cell();
                cc.DataType = CellValues.String;
                cc.CellValue = new CellValue(item.intTardanza.ToString());
                r2.Append(cc);

                cc = new Cell();
                cc.DataType = CellValues.String;
                cc.CellValue = new CellValue(item.intIdPeriodo.ToString());
                r2.Append(cc);

                cc = new Cell();
                cc.DataType = CellValues.String;
                cc.CellValue = new CellValue(item.strNoUsuar.ToString());
                r2.Append(cc);

                cc = new Cell();
                cc.DataType = CellValues.String;
                cc.CellValue = new CellValue(item.dttFeRegistro.ToString());
                r2.Append(cc);

                sd.Append(r2);

                fila++;
            }


            //// sheet 2
            WorksheetPart wsp2 = wbp.AddNewPart<WorksheetPart>();

            Worksheet ws2 = new Worksheet();
            SheetData sd2 = new SheetData();
            //ws2.Append(sd2);
            wsp2.Worksheet = ws2;
            wsp2.Worksheet.Save();

            r1 = new Row() { RowIndex = 1u };

            //LLENAMOS LA CABECERA
            c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("Código - Registro");
            r1.Append(c1);

            c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("Apellidos y Nombres");
            r1.Append(c1);

            c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("N° Documento");
            r1.Append(c1);

            c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("Fotocheck");
            r1.Append(c1);

            c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("Unidad Organizacional");
            r1.Append(c1);

            c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("Fiscalización");
            r1.Append(c1);

            c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("Grupo de Liquidación");
            r1.Append(c1);

            c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("Fecha de Admisión");
            r1.Append(c1);

            c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("Fecha de Cese");
            r1.Append(c1);

            c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("Dias Trabajados");
            r1.Append(c1);

            c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("Dias Faltas");
            r1.Append(c1);

            c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("Horas Adicionales");
            r1.Append(c1);

            c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("Feriados");
            r1.Append(c1);

            c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("Horas Fuera");
            r1.Append(c1);

            c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("Tardanza");
            r1.Append(c1);

            c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("Periodo");
            r1.Append(c1);


            c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("Usuario");
            r1.Append(c1);

            c1 = new Cell();
            c1.DataType = CellValues.String;
            c1.CellValue = new CellValue("Fecha Registro");
            r1.Append(c1);

            sd2.Append(r1);

            //LLENAMOS EL DETALLE

            fila = 1;

            foreach (CalculoPersonal item in list.ToList().FindAll(x => x.intTipo == 2))
            {
                Row r2 = new Row() { RowIndex = (UInt32)fila + 1 };

                Cell cc1 = new Cell();
                cc1.DataType = CellValues.String;
                cc1.CellValue = new CellValue(item.strCoPersonal);
                r2.Append(cc1);

                Cell cc2 = new Cell();
                cc2.DataType = CellValues.String;
                cc2.CellValue = new CellValue(item.strNomCompleto);
                r2.Append(cc2);

                Cell cc3 = new Cell();
                cc3.DataType = CellValues.String;
                cc3.CellValue = new CellValue(item.strNumDoc);
                r2.Append(cc3);

                Cell cc4 = new Cell();
                cc4.DataType = CellValues.String;
                cc4.CellValue = new CellValue(item.strFotocheck);
                r2.Append(cc4);

                Cell cc5 = new Cell();
                cc5.DataType = CellValues.String;
                cc5.CellValue = new CellValue(item.strDescripcion);
                r2.Append(cc5);

                Cell cc6 = new Cell();
                cc6.DataType = CellValues.String;
                cc6.CellValue = new CellValue(item.strDeTipo);
                r2.Append(cc6);

                Cell cc7 = new Cell();
                cc7.DataType = CellValues.String;
                cc7.CellValue = new CellValue(item.strDesGrupoLiq);
                r2.Append(cc7);

                Cell cc8 = new Cell();
                cc8.DataType = CellValues.String;
                cc8.CellValue = new CellValue(item.dttFecAdmin);
                r2.Append(cc8);

                Cell cc9 = new Cell();
                cc9.DataType = CellValues.String;
                cc9.CellValue = new CellValue(item.dttFecCese);
                r2.Append(cc9);

                Cell cc10 = new Cell();
                cc10.DataType = CellValues.String;
                cc10.CellValue = new CellValue(item.intDiasTrabajados.ToString());
                r2.Append(cc10);

                Cell cc11 = new Cell();
                cc11.DataType = CellValues.String;
                cc11.CellValue = new CellValue(item.intDiasFaltas.ToString());
                r2.Append(cc11);

                Cell cc12 = new Cell();
                cc12.DataType = CellValues.String;
                cc12.CellValue = new CellValue(item.intHorasAdicionales.ToString());
                r2.Append(cc12);

                Cell cc13 = new Cell();
                cc13.DataType = CellValues.String;
                cc13.CellValue = new CellValue(item.intFeriados.ToString());
                r2.Append(cc13);

                Cell cc14 = new Cell();
                cc14.DataType = CellValues.String;
                cc14.CellValue = new CellValue(item.intHorasFuera.ToString());
                r2.Append(cc14);

                Cell ccc15 = new Cell();
                ccc15.DataType = CellValues.String;
                ccc15.CellValue = new CellValue(item.intTardanza.ToString());
                r2.Append(ccc15);

                Cell ccc16 = new Cell();
                ccc16.DataType = CellValues.String;
                ccc16.CellValue = new CellValue(item.intIdPeriodo.ToString());
                r2.Append(ccc16);

                Cell ccc17 = new Cell();
                ccc17.DataType = CellValues.String;
                ccc17.CellValue = new CellValue(item.strNoUsuar.ToString());
                r2.Append(ccc17);

                Cell ccc18 = new Cell();
                ccc18.DataType = CellValues.String;
                ccc18.CellValue = new CellValue(item.dttFeRegistro.ToString());
                r2.Append(ccc18);

                sd2.Append(r2);

                fila++;
            }




            ws.Append(sd);
            ws2.Append(sd2);
            wsp.Worksheet = ws;
            wsp.Worksheet.Save();
            Sheets sheets = new Sheets();
            Sheet sheet = new Sheet();
            sheet.Name = planilla;
            sheet.SheetId = 1;
            sheet.Id = wbp.GetIdOfPart(wsp);
            Sheet sheet2 = new Sheet();
            sheet2.Name = "SIN CÁLCULO";
            sheet2.SheetId = 2;
            sheet2.Id = wbp.GetIdOfPart(wsp2);
            sheets.Append(sheet);
            sheets.Append(sheet2);
            wb.Append(fv);
            wb.Append(sheets);

            xl.WorkbookPart.Workbook = wb;
            xl.WorkbookPart.Workbook.Save();
            xl.Close();
            string fileName = "Cálculo Manual " + _listPeriodos.First().nombre + " a " + _listPeriodos.Last().nombre + ".xlsx";
            Response.Clear();
            byte[] dt = ms.ToArray();

            Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            Response.AddHeader("Content-Disposition", string.Format("attachment; filename={0}", fileName));
            Response.BinaryWrite(dt);
            Response.End();
        }

        public JsonResult LimpiarTemporal(int intIdProceso)
        {
            swProceso.Session_Movi objSession = new swProceso.Session_Movi();
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
                using (proxyProc = new ProcesoSrvClient())
                {
                    insert = proxyProc.LimpiarTemporal(objSession, intIdProceso, ref intResult, ref strMsjDB, ref strMsjUsuario);
                }
                if (intResult == 1)
                {
                    result.type = "success";
                    result.message = "Los registros se insertaron satisfactoriamente.";
                }
                else
                {
                    result.type = "info";
                    if (strMsjUsuario.Contains("FK_TSSESION_MOVI_TSSOFTWARE_intIdSoft"))
                    {
                        strMsjUsuario = "Su sesion ah expirado";
                    }
                    result.message = strMsjUsuario;
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "ProcesoController.cs");
                result.type = "errorInt";
                result.message = "Ocurrió un inconveniente al registrar los cálculos";
            }
            return Json(result);

        }

        public void llenarListaPeriodos(List<PeriodoTmp> lista)
        {
            _listPeriodos = lista;
        }

        public int validarPeriodo(List<int> lista)
        {
            swProceso.Session_Movi objSession = new swProceso.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            CustomResponse result = new CustomResponse();

            int cantidad = 0;

            try
            {
                using (proxyProc = new ProcesoSrvClient())
                {
                    cantidad = proxyProc.validarPeriodo(objSession, lista.ToArray());
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "ProcesoController.cs");
                result.type = "errorInt";
                result.message = "Ocurrió un inconveniente al registrar los cálculos";
            }
            return cantidad;
        }

        #endregion Cálculo Manual

        public List<int> getIntIdPeriodos(List<PeriodoTmp> lista)
        {
            List<int> list = new List<int>();
            foreach (PeriodoTmp item in lista)
            {
                list.Add(item.id);
            }

            return list;
        }

        public class PeriodoTmp
        {
            public int id { set; get; }
            public string fecha { set; get; }
            public string nombre { set; get; }
        }


        //#region Servicio
        //public JsonResult MaestroMaxCaracteres(string StrNomMan)
        //{
        //    List<ValidacionesxLongitud> lista = new List<ValidacionesxLongitud>();
        //    using (proxyProc = new ProcesoSrvClient())
        //    {
        //        lista = proxyProc.MaestroMaxCaracteres(StrNomMan).ToList();
        //    }
        //    //return Json(detConcepto);
        //    //modificado el 27.05.2021
        //    var json_ = Json(lista, JsonRequestBehavior.AllowGet);
        //    json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
        //    return json_;
        //}
        //#endregion Servicio



    }
}
