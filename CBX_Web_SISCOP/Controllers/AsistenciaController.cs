using CBX_Web_SISCOP.wsAsistencia;
using CBX_Web_SISCOP.wsConfiguracion; //12.03.2021
using CBX_Web_SISCOP.wsSeguridad;//22.04.2021
using CBX_Web_SISCOP.wsPersona;//añadido 27.09.2021
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CBX_Web_SISCOP.Models;
using System.Net;

namespace CBX_Web_SISCOP.Controllers
{
    public class AsistenciaController : Controller
    {
        private AsistenciaSrvClient proxy;
        private ConfiguracionSrvClient proxyConfi; //añadido 12.03.2021
        private PersonalSrvClient proxyPer; //añadido 27.09.2021
        private AsistenciaSrvClient proxyOrg;
        public static int intIdMenuGlo { get; set; }

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

        #region Feriado

        public ActionResult Feriado(string intIdMenu, string strCodMenu)//originalmente solo tenia el parámetro intIdMenu
        {

            if (ValidarSession_view())//if (Auth.isAuthenticated())
            {
                intIdMenuGlo = Convert.ToInt32(intIdMenu);
                SeguridadController.strcoMenuGlo = strCodMenu;//añadido 06.05.2021 uso general
                return View();
            }

            return RedirectToAction("CerrarSesion", "LoginSiscop");

        }
        public ActionResult NuevoFeriado()
        {
            return PartialView("_PartialNuevoFeriado");
        }
        public ActionResult EditarFeriado()
        {
            return PartialView("_PartialEditarFeriado");
        }

        //[HttpPost]
        public JsonResult GetTablaFeriado(int IntActivoFilter, string strfilter, string intfiltrojer1, string intfiltrojer2)
        {
            string strMsgUsuario = "";

            List<Feriado> lista = new List<Feriado>();
            try
            {
                using (proxyOrg = new AsistenciaSrvClient())
                {
                    lista = proxyOrg.ListarFeriados(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), IntActivoFilter, strfilter, intfiltrojer1, intfiltrojer2, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                //return Json(ListarFeriados);
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

        public JsonResult EliminarFeriado(int intIdFeriado)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                bool delete = false;

                using (proxy = new AsistenciaSrvClient())
                {
                    delete = proxy.EliminarFeriado(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), 1, intIdFeriado, ref strMsgUsuario);
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
                Log.AlmacenarLogError(ex, "AsistenciaController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al eliminar el registro";
            }

            return Json(result);
        }

        public JsonResult RegistrarEditarFeriado(Feriado ObjFeriado, List<TGFER_UNIORG_DET> listaOrgxFer, int intTipoOperacion)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            if (listaOrgxFer == null)
                listaOrgxFer = new List<TGFER_UNIORG_DET>();

            try
            {
                bool insert = false;
                using (proxy = new AsistenciaSrvClient())
                {
                    insert = proxy.IUFeriado(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), ObjFeriado, listaOrgxFer.ToArray(), Auth.intIdUsuario(), intTipoOperacion, ref strMsgUsuario);
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
                    //if (strMsgUsuario.Contains("descripción"))
                    //{
                    //    result.type = "error";
                    //    result.message = strMsgUsuario;
                    //}
                    //else
                    //{
                    //    if (strMsgUsuario.Contains("planilla"))
                    //    {
                    //        result.type = "alert";
                    //        result.message = strMsgUsuario;
                    //    }
                    //    else
                    //    {
                    //        if (strMsgUsuario.Contains("Externo"))
                    //        {
                    //            result.type = "externo";
                    //            result.message = strMsgUsuario;
                    //        }
                    //        else
                    //        {
                    //            result.type = "info";
                    //            result.message = strMsgUsuario;
                    //        }
                    //    }
                    //}
                    result.type = "infoc";
                    result.message = strMsgUsuario;
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "AsistenciaController.cs / RegistrarEditarFeriado");
                result.type = "error";
                if (intTipoOperacion == 1)
                {
                    result.message = "Ocurrió un inconveniente al insertar el Feriado";
                }
                else
                {
                    result.message = "Ocurrió un inconveniente al actualizar el Feriado";
                }
            }
            return Json(result);
        }

        public JsonResult ObtenerRegistroFeriado(int intIdFeriado)
        {
            string strMsgUsuario = "";
            List<Feriado> lista = new List<Feriado>();
            try
            {
                using (proxy = new AsistenciaSrvClient())
                {
                    lista = proxy.ObtenerRegistroFeriado(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), intIdFeriado, ref strMsgUsuario).ToList();
                }
                //return Json(detConcepto);
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

        public JsonResult ObtenerRegistroReglaDetalleDeOrgixFer(int intIdFeriado)
        {
            string strMsgUsuario = "";
            List<TGFER_UNIORG_DET> lista = new List<TGFER_UNIORG_DET>();
            try
            {
                using (proxy = new AsistenciaSrvClient())
                {
                    lista = proxy.ObtenerRegistroReglaDetalleDeOrgixFer(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), intIdFeriado, ref strMsgUsuario).ToList();
                }
                //return Json(detConcepto);
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

        #endregion Feriado

        #region Horario

        public ActionResult Horario(string intIdMenu, string strCodMenu)//originalmente solo tenia el parámetro intIdMenu
        {
            if (ValidarSession_view())//if (Auth.isAuthenticated())
            {
                intIdMenuGlo = Convert.ToInt32(intIdMenu);
                SeguridadController.strcoMenuGlo = strCodMenu;//añadido 06.05.2021 uso general
                return View();
            }

            return RedirectToAction("CerrarSesion", "LoginSiscop");

        }

        public JsonResult GetTablaFiltradaHorario(int IntActivoFilter, string strfilter, int intfiltrojer)
        {
            string strMsgUsuario = "";
            List<HorarioData> lista = new List<HorarioData>();
            try
            {
                using (proxyOrg = new AsistenciaSrvClient())
                {
                    lista = proxyOrg.ListarHorario(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), IntActivoFilter, strfilter, intfiltrojer, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                //return Json(ListarJornada);
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

        public JsonResult EliminarHorario(int intIdHorario)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                bool delete = false;

                using (proxy = new AsistenciaSrvClient())
                {
                    delete = proxy.EliminarHorario(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), 1, intIdHorario, ref strMsgUsuario);
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
                Log.AlmacenarLogError(ex, "AsistenciaController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al eliminar el registro";
            }

            return Json(result);
        }

        public JsonResult RegistrarEditarHorario(Horario ObjHorario, List<HorJor> lISTAHorJor, int intTipoOperacion)
        {
            CustomResponse result = new CustomResponse();
            if (lISTAHorJor == null)
                lISTAHorJor = new List<HorJor>();

            string strMsgUsuario = "";
            try
            {
                bool insert = false;

                using (proxy = new AsistenciaSrvClient())
                {
                    insert = proxy.IUHorario(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), ObjHorario, lISTAHorJor.ToArray(), Auth.intIdUsuario(), intTipoOperacion, ref strMsgUsuario);
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
                    if (strMsgUsuario.Contains("descripción"))
                    {
                        result.type = "error";
                        result.message = strMsgUsuario;
                    }
                    else
                    {
                        result.type = "infoc";
                        result.message = strMsgUsuario;
                    }

                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "AsistenciaController.cs / RegistrarEditarHorario");
                result.type = "errorInt";
                if (intTipoOperacion == 1)
                {
                    result.message = "Ocurrió un inconveniente al insertar el Horario";
                }
                else
                {
                    result.message = "Ocurrió un inconveniente al actualizar el Horario";
                }
            }

            return Json(result);
        }

        public JsonResult ObtenerHorarioPorsuPK(int intIdHorario)
        {
            string strMsgUsuario = "";
            List<Horario> lista = new List<Horario>();
            try
            {
                using (proxyOrg = new AsistenciaSrvClient())
                {
                    lista = proxyOrg.ObtenerHorarioPorsuPK(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), intIdHorario, ref strMsgUsuario).ToList();
                }
                //return Json(detConcepto);
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

        #endregion Horario

        #region Variable
        public ActionResult Variable(string intIdMenu, string strCodMenu)//originalmente solo tenia el parámetro intIdMenu
        {

            if (ValidarSession_view())//if (Auth.isAuthenticated())
            {
                intIdMenuGlo = Convert.ToInt32(intIdMenu);
                SeguridadController.strcoMenuGlo = strCodMenu;//añadido 06.05.2021 uso general
                return View();
            }

            return RedirectToAction("CerrarSesion", "LoginSiscop");

        }
        public ActionResult NuevoVariable()
        {
            string strMsgUsuario = "";
            List<Jornada> lista_Horario = new List<Jornada>();
            List<wsPersona.TGTipoEN> lista_Var = new List<wsPersona.TGTipoEN>();//añadida 27.09.2021
            List<wsPersona.TGTipoEN> lista_Tipo_Red = new List<wsPersona.TGTipoEN>();//añadida 27.09.2021
            List<wsPersona.TGTipoEN> lista_Aplica_por = new List<wsPersona.TGTipoEN>();//añadida 27.09.2021
            List<wsPersona.TGTipoEN> lista_Fomra_Redondeo = new List<wsPersona.TGTipoEN>();//añadida 27.09.2021

            using (proxyPer = new PersonalSrvClient())
            {
                lista_Var = proxyPer.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), "TGTIPO", 0, "VARI", "TIPO", ref strMsgUsuario).ToList();
                lista_Tipo_Red = proxyPer.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), "TGTIPO", 0, "VARI", "TRED", ref strMsgUsuario).ToList();
                lista_Aplica_por = proxyPer.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), "TGTIPO", 0, "VARI", "APLI", ref strMsgUsuario).ToList();
                lista_Fomra_Redondeo = proxyPer.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), "TGTIPO", 0, "VARI", "FRED", ref strMsgUsuario).ToList();
                proxyPer.Close();
            }
            using (proxyOrg = new AsistenciaSrvClient())
            {
                lista_Horario = proxyOrg.ListarHorarioEspecifico(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), 0, ref strMsgUsuario).ToList();
                proxyOrg.Close();
            }

            ViewBag.CampVar = new SelectList(lista_Var, "intidTipo", "strDeTipo");
            ViewBag.CampTRed = new SelectList(lista_Tipo_Red, "intidTipo", "strDeTipo");
            ViewBag.CampAplic = new SelectList(lista_Aplica_por, "intidTipo", "strDeTipo");
            ViewBag.CampForm = new SelectList(lista_Fomra_Redondeo, "intidTipo", "strDeTipo");
            ViewBag.LisHor = new SelectList(lista_Horario, "intIdJornada", "strDscJornada");

            object[] Datos = { ViewBag.CampVar };
            return PartialView("_PartialNuevoVariable");
        }
        public ActionResult EditarVariable(int IdVar) //añadimos parámetro IdVar
        {
            string strMsgUsuario = "";
            List<Jornada> lista_Horario = new List<Jornada>();
            List<wsPersona.TGTipoEN> lista_Var = new List<wsPersona.TGTipoEN>();//añadida 27.09.2021
            List<wsPersona.TGTipoEN> lista_Tipo_Red = new List<wsPersona.TGTipoEN>();//añadida 27.09.2021
            List<wsPersona.TGTipoEN> lista_Aplica_por = new List<wsPersona.TGTipoEN>();//añadida 27.09.2021
            List<wsPersona.TGTipoEN> lista_Fomra_Redondeo = new List<wsPersona.TGTipoEN>();//añadida 27.09.2021

            using (proxyPer = new PersonalSrvClient())
            {
                lista_Var = proxyPer.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), "TGTIPO", 0, "VARI", "TIPO", ref strMsgUsuario).ToList();
                lista_Tipo_Red = proxyPer.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), "TGTIPO", 0, "VARI", "TRED", ref strMsgUsuario).ToList();
                lista_Aplica_por = proxyPer.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), "TGTIPO", 0, "VARI", "APLI", ref strMsgUsuario).ToList();
                lista_Fomra_Redondeo = proxyPer.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), "TGTIPO", 0, "VARI", "FRED", ref strMsgUsuario).ToList();
                proxyPer.Close();
            }
            using (proxyOrg = new AsistenciaSrvClient())
            {
                lista_Horario = proxyOrg.ListarHorarioEspecifico(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), IdVar, ref strMsgUsuario).ToList(); //modificado 26.05.2021
                proxyOrg.Close();
            }

            ViewBag.CampVar = new SelectList(lista_Var, "intidTipo", "strDeTipo");
            ViewBag.CampTRed = new SelectList(lista_Tipo_Red, "intidTipo", "strDeTipo");
            ViewBag.CampAplic = new SelectList(lista_Aplica_por, "intidTipo", "strDeTipo");
            ViewBag.CampForm = new SelectList(lista_Fomra_Redondeo, "intidTipo", "strDeTipo");
            ViewBag.LisHor = new SelectList(lista_Horario, "intIdJornada", "strDscJornada");

            object[] Datos = { ViewBag.CampVar };
            return PartialView("_PartialEditarVariable");
        }

        public JsonResult EliminarConcepto(int intIdConcepto)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                bool delete = false;

                using (proxy = new AsistenciaSrvClient())
                {
                    delete = proxy.EliminarConcepto(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), 1, intIdConcepto, ref strMsgUsuario);
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
                Log.AlmacenarLogError(ex, "AsistenciaController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al eliminar el registro";
            }

            return Json(result);
        }
        public JsonResult GetTablaFiltradaVariable(int IntActivoFilter, string strfilter, int intfiltrojer)
        {
            string strMsgUsuario = "";
            List<VariableData> lista = new List<VariableData>();
            try
            {
                using (proxyOrg = new AsistenciaSrvClient())
                {
                    lista = proxyOrg.ListarConcepto(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), IntActivoFilter, strfilter, intfiltrojer, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                //return Json(ListarVariable);
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
        public JsonResult GetTablaFiltradaHorasExtra()
        {
            string strMsgUsuario = "";
            List<Concepto> lista = new List<Concepto>();
            try
            {
                using (proxyOrg = new AsistenciaSrvClient())
                {
                    lista = proxyOrg.ListarHorasExtras(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                //return Json(ListarVariable);
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
        public JsonResult LlenarTipoVar()
        {
            string strMsgUsuario = "";
            List<wsPersona.TGTipoEN> lista = new List<wsPersona.TGTipoEN>();//añadida 27.09.2021
            try
            {
                using (proxyPer = new PersonalSrvClient())
                {
                    lista = proxyPer.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), "TGTIPO", 0, "VARI", "TIPO", ref strMsgUsuario).ToList();
                    proxyPer.Close();
                }
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
        public JsonResult LlenarTipoUM(string strEntidad, int intIdFiltroGrupo, string strGrupo, string strSubGrupo)
        {
            string strMsgUsuario = "";
            List<wsPersona.TGTipoEN> lista = new List<wsPersona.TGTipoEN>();

            try
            {
                using (proxyPer = new PersonalSrvClient())
                {
                    //lista = proxyPer.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), "TGTIPO", 0, "VARI", "UM", ref strMsgUsuario).ToList();
                    lista = proxyPer.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), strEntidad, intIdFiltroGrupo, strGrupo, strSubGrupo, ref strMsgUsuario).ToList();//modificado 29.09.2021
                    proxyPer.Close();
                    //lista = proxyOrg.ListarTipoUM(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), strEntidad, intIdFiltroGrupo, strGrupo, strSubGrupo, ref strMsgUsuario).ToList();
                }
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
        public JsonResult ObtenerConceptoPorsuPK(int intIdConcepto)
        {
            string strMsgUsuario = "";
            List<Concepto> lista = new List<Concepto>();
            try
            {
                using (proxyOrg = new AsistenciaSrvClient())
                {
                    lista = proxyOrg.ObtenerConceptoPorsuPK(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), intIdConcepto, ref strMsgUsuario).ToList();
                }
                //return Json(detConcepto);
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
        public JsonResult ListarHorasExtrasxPrio(string strEntidad, int intIdFiltroGrupo, string strGrupo, string strSubGrupo)
        {
            string strMsgUsuario = "";
            List<Concepto> lista = new List<Concepto>();
            try
            {
                using (proxyOrg = new AsistenciaSrvClient())
                {
                    lista = proxyOrg.ListarPrioritariosdeHorasExtras(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), strEntidad, intIdFiltroGrupo, strGrupo, strSubGrupo, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                //return Json(lista_Var);
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
        public JsonResult ListarHorarioEspecifico(string strEntidad, int intId, int intUso, string strGrupo, string strSubGrupo)
        {
            string strMsgUsuario = "";
            List<Concepto> lista = new List<Concepto>();
            try
            {
                using (proxyOrg = new AsistenciaSrvClient())
                {
                    lista = proxyOrg.ListarHorarioEspecificos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), strEntidad, intId, intUso, strGrupo, strSubGrupo, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                //return Json(lista_Var);
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

        public JsonResult RegistrarEditarVariable(Concepto ObjConcepto, List<Concepto> listaConcepto, List<TGJOR_BON_DET> listaDetaBoni, int intTipoOperacion)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            if (listaDetaBoni == null)
                listaDetaBoni = new List<TGJOR_BON_DET>();
            if (listaConcepto == null)
                listaConcepto = new List<Concepto>();
            try
            {
                bool insert = false;

                using (proxy = new AsistenciaSrvClient())
                {
                    insert = proxy.IUVariable(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), ObjConcepto, listaConcepto.ToArray(), listaDetaBoni.ToArray(), Auth.intIdUsuario(), intTipoOperacion, ref strMsgUsuario);
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
                    //if (strMsgUsuario.Contains("descripción"))
                    //{
                    //    result.type = "error";
                    //    result.message = strMsgUsuario;
                    //}
                    //else
                    //{
                    //    if (strMsgUsuario.Contains("planilla"))
                    //    {
                    //        result.type = "alert";
                    //        result.message = strMsgUsuario;
                    //    }
                    //    else
                    //    {
                    //        if (strMsgUsuario.Contains("Externo"))
                    //        {
                    //            result.type = "externo";
                    //            result.message = strMsgUsuario;
                    //        }
                    //        else if (strMsgUsuario.Contains("código"))
                    //        {
                    //            result.type = "info";
                    //            result.message = strMsgUsuario;
                    //        }
                    //    }
                    //}
                    result.type = "infoc";
                    result.message = strMsgUsuario;
                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "AsistenciaController.cs");
                result.type = "errorInt";
                if (intTipoOperacion == 1)
                {
                    result.message = "Ocurrió un inconveniente al insertar la Variable";
                }
                else
                {
                    result.message = "Ocurrió un inconveniente al actualizar la Variable";
                }
            }

            return Json(result);
        }

        #endregion Variable

        #region Servicio

        public ActionResult Servicio(string intIdMenu, string strCodMenu)//originalmente solo tenia el parámetro intIdMenu
        {
            if (ValidarSession_view())//if (Auth.isAuthenticated())
            {
                intIdMenuGlo = Convert.ToInt32(intIdMenu);
                SeguridadController.strcoMenuGlo = strCodMenu;//añadido 06.05.2021 uso general
                return View();
            }
            return RedirectToAction("CerrarSesion", "LoginSiscop");
        }

        //modificado 18.03.2021
        public JsonResult GetTablaServicio(wsAsistencia.Session_Movi objSession, int IntActivoFilter, string strfilter, int intfiltrojer1, int intfiltrojer2, int intfiltroClase, int intUso)
        {
            string strMsgUsuario = "";

            List<TCSERVICIO> lista = new List<TCSERVICIO>();
            try {

                using (proxyOrg = new AsistenciaSrvClient())
                {
                    lista = proxyOrg.ListarServicios(objSession, IntActivoFilter, strfilter, intfiltrojer1, intfiltrojer2, intfiltroClase, intUso, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                //return Json(ListarServicios);
                //modificado 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "AsistenciaController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral}, HttpStatusCode.MethodNotAllowed);
        }

        public JsonResult IUServicio(TCSERVICIO ObjConcepto, int intTipoOperacion, wsAsistencia.Session_Movi objSession)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                bool insert = false;

                using (proxy = new AsistenciaSrvClient())
                {
                    insert = proxy.IUServicio(objSession, intTipoOperacion, ObjConcepto, ref strMsgUsuario);
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
            catch (Exception)
            {
                result.type = "Error Desconocido";
                result.message = "Ocurrió un inconveniente al registrar el Servicio";
            }

            return Json(result);
        }

        public JsonResult EliminarServicio(wsAsistencia.Session_Movi objSession, int intIdServicio)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                bool delete = false;

                using (proxy = new AsistenciaSrvClient())
                {
                    delete = proxy.EliminarServicio(objSession, intIdServicio, ref strMsgUsuario);
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

        public JsonResult ObtenerRegistroServicio(wsAsistencia.Session_Movi objSession, int intIdServicio)
        {
            string strMsgUsuario = "";
            List<TCSERVICIO> lista = new List<TCSERVICIO>();
            try { 
                using (proxy = new AsistenciaSrvClient())
                {
                    lista = proxy.ObtenerRegistrodeServicio(objSession, intIdServicio, ref strMsgUsuario).ToList();
                }
                //return Json(detConcepto);
                //modificado 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "AsistenciaController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral}, HttpStatusCode.MethodNotAllowed);
        }

        public JsonResult CamposAdicionales_eliminable(string strEntidad)
        {
            string strMsgUsuario = "";
            List<CamposAdicionales2> lista = new List<CamposAdicionales2>();
            try
            {
                using (proxyOrg = new AsistenciaSrvClient())
                {
                    lista = proxyOrg.ListarCamposAdicionales(3, 1, 4, strEntidad, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }

                //return Json(DatosCargo);
                //modificado 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "AsistenciaController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral}, HttpStatusCode.MethodNotAllowed);
        }

        //AÑADIDO 12.03.2021
        #region Tipos 

        public JsonResult GetTablaTipo(wsConfiguracion.Session_Movi objSession, string strGrupo, string strSubGrupo, int IntIdTipo)
        {
            string strMsgUsuario = "";

            List<TGTipo> lista = new List<TGTipo>();
            try
            {
                using (proxyConfi = new ConfiguracionSrvClient())
                {
                    lista = proxyConfi.ListarTGTipo(objSession, strGrupo, strSubGrupo, IntIdTipo, ref strMsgUsuario).ToList();
                    proxyConfi.Close();
                }
                //return Json(Listar);
                //modificado 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "AsistenciaController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral}, HttpStatusCode.MethodNotAllowed);
        }

        public JsonResult IUTGTipo(TGTipo Objeto, int intTipoOperacion, wsConfiguracion.Session_Movi objSession)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                bool insert = false;
                using (proxyConfi = new ConfiguracionSrvClient())
                {
                    insert = proxyConfi.IUTGTipo(objSession, intTipoOperacion, Objeto, ref strMsgUsuario);
                    proxyConfi.Close();//proxy.Close();
                }

                if (strMsgUsuario.Equals("") && insert)
                {
                    result.type = "success";
                    result.message = "El registro se insertó satisfactoriamente.";
                }

                else
                {
                    if (strMsgUsuario.Contains("código"))
                    {
                        result.type = "info";
                        result.message = strMsgUsuario;
                    }
                    else if (strMsgUsuario.Contains("descripción"))
                    {
                        result.type = "info";
                        result.message = strMsgUsuario;
                    }
                    else if (strMsgUsuario.Contains("Abreviatura"))
                    {
                        result.type = "info";
                        result.message = strMsgUsuario;
                    }
                    else
                    {
                        result.type = "error";
                        result.message = strMsgUsuario;
                    }
                }
            }
            catch (Exception)
            {
                result.type = "Error Desconocido";
                result.message = "Ocurrió un inconveniente al registrar el Tipo";
            }

            return Json(result);
        }

        public JsonResult EliminarTGTipo(wsConfiguracion.Session_Movi objSession, int intId)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                bool delete = false;

                using (proxyConfi = new ConfiguracionSrvClient())
                {
                    delete = proxyConfi.EliminarTGTipo(objSession, intId, ref strMsgUsuario);
                    proxyConfi.Close();
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

        #endregion Tipos

        #endregion Servicio

        #region JornadaDiaria
        public ActionResult JornadaDiaria(string intIdMenu, string strCodMenu)//originalmente solo tenia el parámetro intIdMenu
        {
            if (ValidarSession_view())//if (Auth.isAuthenticated())
            {
                intIdMenuGlo = Convert.ToInt32(intIdMenu);
                SeguridadController.strcoMenuGlo = strCodMenu;//añadido 06.05.2021 uso general
                return View();
            }
            return RedirectToAction("CerrarSesion", "LoginSiscop");
        }
        public ActionResult NuevoJornadaDiaria()
        {
            return PartialView("_PartialNuevoJornadaDiaria");
        }
        public ActionResult EditarJornadaDiaria()
        {
            return PartialView("_PartialEditarJornadaDiaria");
        }
        public JsonResult ObtenerJornadaPorsuPK(int intIdJornada)
        {
            string strMsgUsuario = "";
            List<Jornada> lista = new List<Jornada>();
            try
            {
                using (proxyOrg = new AsistenciaSrvClient())
                {
                    lista = proxyOrg.ObtenerJornadaPorsuPK(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), intIdJornada, ref strMsgUsuario).ToList();
                }
                //return Json(detConcepto);
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

        public JsonResult GetTablaFiltradaJornadaDiaria(int IntActivoFilter, string strfilter, int intfiltrojer)
        {
            string strMsgUsuario = "";
            List<JornadaData> lista = new List<JornadaData>();
            try
            {
                using (proxyOrg = new AsistenciaSrvClient())
                {
                    int filtroTipoServ = 0;//no se usa en SISCOP pero se mantiene el input
                    lista = proxyOrg.ListarJornada(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), IntActivoFilter, strfilter, intfiltrojer, filtroTipoServ, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                //return Json(ListarJornada);
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

        public JsonResult GetTablaFiltradaJornadaDiariaHoraria(int IntActivoFilter, string strfilter, int intfiltrojer)
        {
            string strMsgUsuario = "X";
            List<JornadaxHorario> lista = new List<JornadaxHorario>();
            try
            {
                using (proxyOrg = new AsistenciaSrvClient())
                {
                    lista = proxyOrg.ListarJornadaHorario(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), IntActivoFilter, strfilter, intfiltrojer, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                //return Json(ListarJornada);
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

        public JsonResult EliminarJornada(int intIdJornada)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                bool delete = false;

                using (proxy = new AsistenciaSrvClient())
                {
                    delete = proxy.EliminmarJornada(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), 1, intIdJornada, ref strMsgUsuario);
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
                Log.AlmacenarLogError(ex, "AsistenciaController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al eliminar el registro";
            }

            return Json(result);
        }

        public JsonResult GetTablaFiltradaIntervalos(int intfiltrojer)
        {
            string strMsgUsuario = "";
            List<Intervalos> lista = new List<Intervalos>();
            try
            {
                using (proxyOrg = new AsistenciaSrvClient())
                {
                    lista = proxyOrg.ListarIntervalos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), intfiltrojer, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                //return Json(ListarJornada);
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

        public JsonResult ListarHorJor(int intfiltrojer)
        {
            string strMsgUsuario = "";
            List<HorJor> lista = new List<HorJor>();
            try
            {
                using (proxyOrg = new AsistenciaSrvClient())
                {
                    lista = proxyOrg.ObtenerHORXJORPorsuPK(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), intfiltrojer, ref strMsgUsuario).ToList();
                    proxyOrg.Close();
                }
                //return Json(ListarJornada);
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

        public JsonResult IUJornada(wsAsistencia.Session_Movi objSession, int intTipoOperacion, Jornada ObjJornada, List<Intervalos> listaIntervalos)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";
            if (listaIntervalos == null)
                listaIntervalos = new List<Intervalos>();

            try
            {
                bool insert = false;

                using (proxy = new AsistenciaSrvClient())
                {
                    insert = proxy.IUJornada(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), intTipoOperacion, ObjJornada, listaIntervalos.ToArray(), Auth.intIdUsuario(), ref strMsgUsuario);
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
                    //if (strMsgUsuario.Contains("descripción"))
                    //{
                    //    result.type = "error";
                    //    result.message = strMsgUsuario;
                    //}
                    //else
                    //{
                    //    if (strMsgUsuario.Contains("planilla"))
                    //    {
                    //        result.type = "alert";
                    //        result.message = strMsgUsuario;
                    //    }
                    //    else
                    //    {
                    //        if (strMsgUsuario.Contains("Externo"))
                    //        {
                    //            result.type = "externo";
                    //            result.message = strMsgUsuario;
                    //        }
                    //        else if (strMsgUsuario.Contains("código"))
                    //        {
                    //            result.type = "info";
                    //            result.message = strMsgUsuario;
                    //        }
                    //    }
                    //}
                    result.type = "infoc";
                    result.message = strMsgUsuario;
                }
            }
            catch (Exception)
            {
                result.type = "errorInt";
                if (intTipoOperacion == 1)
                {
                    result.message = "Ocurrió un inconveniente al insertar la Jornada";
                }
                else
                {
                    result.message = "Ocurrió un inconveniente al actualizar la Jornada";
                }
            }
            return Json(result);
        }

        #endregion JornadaDiaria

        #region ReglaNegocioComedor

        public ActionResult ReglaNegocioComedor(string intIdMenu, string strCodMenu)//originalmente solo tenia el parámetro intIdMenu
        {
            if (ValidarSession_view())//if (Auth.isAuthenticated())
            {
                intIdMenuGlo = Convert.ToInt32(intIdMenu);
                SeguridadController.strcoMenuGlo = strCodMenu;//añadido 06.05.2021 uso general
                return View();
            }
            return RedirectToAction("CerrarSesion", "LoginSiscop");
        }

        public JsonResult GetTablaFiltradaReglaNegocioComedor(int IntActivoFilter, string strfilter, int intfiltrojer)//modificado 23.09.2021
        {
            string strMsgUsuario = "";
            List<ReglaNegocio> lista = new List<ReglaNegocio>();
            try
            {
                using (proxy = new AsistenciaSrvClient())
                {
                    lista = proxy.ListarRegNegCom(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), IntActivoFilter, strfilter, intfiltrojer, ref strMsgUsuario).ToList();
                    proxy.Close();
                }
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

        public JsonResult EliminarReglaNegocioCom(int intIdReglaNeg)//modificado 23.09.2021
        {
            wsAsistencia.Session_Movi objSession = new wsAsistencia.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdUsuario = Auth.intIdUsuario();

            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                bool delete = false;

                using (proxy = new AsistenciaSrvClient())
                {
                    delete = proxy.EliminarReglaNegocioCom(objSession, intIdReglaNeg, ref strMsgUsuario);
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

        public JsonResult IUReglaCom(int intTipoOperacion, ReglaNegocio ObjReglaNeg, List<TGREGNEG_DET> listaReglaNegDet, List<TGREGLANEG_SUBSIDIO_DET> listaDetSubsi, List<wsAsistencia.TGREGLANEG_SERV_DET> listaDetServ)//modificado 23.09.2021
        {
            wsAsistencia.Session_Movi objSession = new wsAsistencia.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdUsuario = Auth.intIdUsuario();
            CustomResponse result = new CustomResponse();

            string strMsgUsuario = "";

            if (listaReglaNegDet == null)
                listaReglaNegDet = new List<TGREGNEG_DET>();

            if (listaDetSubsi == null)
                listaDetSubsi = new List<TGREGLANEG_SUBSIDIO_DET>();

            if (listaDetServ == null)
                listaDetServ = new List<wsAsistencia.TGREGLANEG_SERV_DET>();

            try
            {
                bool insert = false;

                using (proxy = new AsistenciaSrvClient())
                {
                    insert = proxy.IUNegocioCom_T(objSession, intTipoOperacion, ObjReglaNeg, listaReglaNegDet.ToArray(), listaDetSubsi.ToArray(), listaDetServ.ToArray(), ref strMsgUsuario);
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
                    if (strMsgUsuario.Equals(""))
                    {
                        result.type = "errorInt";
                        result.message = strMsgUsuario;
                    }
                    else
                    {
                        result.type = "infoc";
                        result.message = strMsgUsuario;
                    }
                }
            }
            catch (Exception)
            {
                result.type = "errorInt";
                if (intTipoOperacion == 1)
                {
                    result.message = "Ocurrió un inconveniente al insertar la Regla de Negocio";
                }
                else
                {
                    result.message = "Ocurrió un inconveniente al actualizar la Regla de Negocio";
                }
            }

            return Json(result);
        }

        public JsonResult ObtenerRegistroReglaNegocioCom(int intIdReglaNeg)//modificado 23.09.2021
        {
            wsAsistencia.Session_Movi objSession = new wsAsistencia.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdUsuario = Auth.intIdUsuario();

            string strMsgUsuario = "";
            List<ReglaNegocio> lista = new List<ReglaNegocio>();
            try
            {
                using (proxy = new AsistenciaSrvClient())
                {
                    lista = proxy.ObtenerRegistroReglaNegocioCom(objSession, intIdReglaNeg, ref strMsgUsuario).ToList();
                    proxy.Close();
                }
                //return Json(detConcepto);
                //modificado 27.05.2021
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

        public JsonResult ObtenerRegistroReglaNegocioDetCom(int intIdReglaNeg)
        {
            wsAsistencia.Session_Movi objSession = new wsAsistencia.Session_Movi();//modificado 23.09.2021
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdUsuario = Auth.intIdUsuario();
            string strMsgUsuario = "";
            List<TGREGNEG_DET> lista = new List<TGREGNEG_DET>();
            try
            {

                using (proxy = new AsistenciaSrvClient())
                {
                    lista = proxy.ObtenerRegistroReglaNegocioDetCom(objSession, intIdReglaNeg, ref strMsgUsuario).ToList();
                    proxy.Close();
                }
                //return Json(detConcepto);
                //modificado 27.05.2021
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

        //CON SUBSIDIO HG 26.02.2021
        public JsonResult ObtenerRegistroReglaNegocioSubsiCom(int intIdReglaNeg)//modificado 23.09.2021
        {
            wsAsistencia.Session_Movi objSession = new wsAsistencia.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdUsuario = Auth.intIdUsuario();
            string strMsgUsuario = "";
            List<TGREGLANEG_SUBSIDIO_DET> lista = new List<TGREGLANEG_SUBSIDIO_DET>();
            try
            {
                using (proxy = new AsistenciaSrvClient())
                {
                    lista = proxy.ObtenerRegistroReglaNedocioSubsiCom(objSession, intIdReglaNeg, ref strMsgUsuario).ToList();
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
                Log.AlmacenarLogError(ex, "AsistenciaController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }

        //ObtenerRegistroReglaNedocioServCom
        //SERVICOS DETALLES AÑADIDOS HG 26.02.21
        public JsonResult ObtenerRegistroReglaNegocioServCom(int intIdReglaNeg)//modificado 23.09.2021
        {
            wsAsistencia.Session_Movi objSession = new wsAsistencia.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdUsuario = Auth.intIdUsuario();
            string strMsgUsuario = "";
            List<wsAsistencia.TGREGLANEG_SERV_DET> lista = new List<wsAsistencia.TGREGLANEG_SERV_DET>();
            try
            {
                using (proxy = new AsistenciaSrvClient())
                {
                    lista = proxy.ObtenerRegistroReglaNedocioServCom(objSession, intIdReglaNeg, ref strMsgUsuario).ToList();
                    proxy.Close();
                }
                //return Json(detSubsidiosCom);
                //modificado 27.05.2021
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

        #endregion ReglaNegocioComedor

        #region ReglaNegocio

        //public ActionResult ReglaNegocio(string intIdMenu, string strCodMenu)//originalmente solo tenia el parámetro intIdMenu
        //{
        //    if (ValidarSession_view())//if (Auth.isAuthenticated())
        //    {
        //        intIdMenuGlo = Convert.ToInt32(intIdMenu);
        //        SeguridadController.strcoMenuGlo = strCodMenu;//añadido 06.05.2021 uso general
        //        return View();
        //    }

        //    return RedirectToAction("CerrarSesion", "LoginSiscop");

        //}

        public ActionResult NuevaReglaNegocioComedor()
        {
            return PartialView("_PartialNuevoReglaNegocio");
        }
        public ActionResult EditarReglaNegocio()
        {
            return PartialView("_PartialEditarReglaNegocio");
        }

        //public JsonResult GetTablaFiltradaReglaNegocio(int IntActivoFilter, string strfilter, int intfiltrojer)
        //{
        //    string strMsgUsuario = "";
        //    List<ReglaNegocio> lista = new List<ReglaNegocio>();

        //    try
        //    {
        //        using (proxyOrg = new AsistenciaSrvClient())
        //        {
        //            lista = proxyOrg.ListarReglaNegocio(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), IntActivoFilter, strfilter, intfiltrojer, ref strMsgUsuario).ToList();
        //            proxyOrg.Close();
        //        }
        //        //modificado 27.05.2021
        //        var json_ = Json(lista, JsonRequestBehavior.AllowGet);
        //        json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
        //        return json_;

        //    }
        //    catch (Exception ex)
        //    {
        //        Log.AlmacenarLogError(ex, "AsistenciaController.cs");
        //    }

        //    return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        //}

        //public JsonResult RegistrarEditarRegla(ReglaNegocio ObjReglaNeg, List<TGREGNEG_DET> listaReglaNegDet, List<TGREG_NEG_CONFIG_HORAS> listaReglaNegHEDet, int intTipoOperacion)
        //{

        //    CustomResponse result = new CustomResponse();

        //    string strMsgUsuario = "";

        //    if (listaReglaNegDet == null)
        //        listaReglaNegDet = new List<TGREGNEG_DET>();

        //    if (listaReglaNegHEDet == null)
        //        listaReglaNegHEDet = new List<TGREG_NEG_CONFIG_HORAS>();

        //    try
        //    {
        //        bool insert = false;

        //        using (proxy = new AsistenciaSrvClient())
        //        {
        //            insert = proxy.IUNegocio(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), ObjReglaNeg, listaReglaNegDet.ToArray(), listaReglaNegHEDet.ToArray(), intTipoOperacion, Auth.intIdUsuario(), ref strMsgUsuario);
        //            proxy.Close();
        //        }

        //        if (strMsgUsuario.Equals("") && insert)
        //        {
        //            result.type = "success";
        //            if (intTipoOperacion == 1)
        //            {
        //                result.message = "El registro se insertó satisfactoriamente.";
        //            }
        //            else
        //            {
        //                result.message = "El registro se actualizó satisfactoriamente.";
        //            }
        //        }
        //        else
        //        {
        //            if (strMsgUsuario.Contains("descripción"))
        //            {
        //                result.type = "error";
        //                result.message = strMsgUsuario;
        //            }
        //            else
        //            {
        //                if (strMsgUsuario.Contains("planilla"))
        //                {
        //                    result.type = "alert";
        //                    result.message = strMsgUsuario;
        //                }
        //                else
        //                {
        //                    if (strMsgUsuario.Contains("Externo"))
        //                    {
        //                        result.type = "externo";
        //                        result.message = strMsgUsuario;
        //                    }
        //                    else if (strMsgUsuario.Contains("código"))
        //                    {
        //                        result.type = "info";
        //                        result.message = strMsgUsuario;
        //                    }
        //                    else
        //                    {
        //                        result.type = "errorInt";
        //                        result.message = strMsgUsuario;
        //                    }
        //                }
        //            }

        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        Log.AlmacenarLogError(ex, "AsistenciaController.cs");
        //        result.type = "errorInt";
        //        if (intTipoOperacion == 1)
        //        {
        //            result.message = "Ocurrió un inconveniente al insertar la Regla de Negocio";
        //        }
        //        else
        //        {
        //            result.message = "Ocurrió un inconveniente al actualizar la Regla de Negocio";
        //        }
        //    }

        //    return Json(result);
        //}
        //public JsonResult EliminarReglaNegocio(int intIdReglaNeg)
        //{
        //    CustomResponse result = new CustomResponse();
        //    string strMsgUsuario = "";

        //    try
        //    {
        //        bool delete = false;

        //        using (proxy = new AsistenciaSrvClient())
        //        {
        //            delete = proxy.EliminmarReglaNegocio(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), 1, intIdReglaNeg, ref strMsgUsuario);
        //            proxy.Close();
        //        }

        //        if (strMsgUsuario.Equals("") && delete)
        //        {
        //            result.type = "success";
        //            result.message = "El registro fue eliminado correctamente";
        //        }
        //        else
        //        {
        //            result.type = "error";
        //            result.message = strMsgUsuario;
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        Log.AlmacenarLogError(ex, "AsistenciaController.cs");
        //        result.type = "error";
        //        result.message = "Ocurrió un inconveniente al eliminar el registro";
        //    }

        //    return Json(result);
        //}

        //public JsonResult ObtenerRegistroReglaNedocio(int intIdReglaNeg)
        //{
        //    string strMsgUsuario = "";
        //    List<TGREGNEG_DET> lista = new List<TGREGNEG_DET>();
        //    try
        //    {
        //        using (proxyOrg = new AsistenciaSrvClient())
        //        {
        //            lista = proxyOrg.ObtenerRegistroReglaNedocio(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), intIdReglaNeg, ref strMsgUsuario).ToList();
        //        }
        //        //return Json(detConcepto);
        //        //modificado 27.05.2021
        //        var json_ = Json(lista, JsonRequestBehavior.AllowGet);
        //        json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
        //        return json_;

        //    }
        //    catch (Exception ex)
        //    {
        //        Log.AlmacenarLogError(ex, "AsistenciaController.cs");
        //    }

        //    return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);

        //}

        //public JsonResult ObtenerRegistroReglaNedocioConfigHE(int intIdReglaNeg)
        //{
        //    string strMsgUsuario = "";
        //    List<TGREG_NEG_CONFIG_HORAS> lista = new List<TGREG_NEG_CONFIG_HORAS>();
        //    try
        //    {
        //        using (proxyOrg = new AsistenciaSrvClient())
        //        {
        //            lista = proxyOrg.ObtenerRegistroReglaDetalleDeNedocioHE(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), intIdReglaNeg, ref strMsgUsuario).ToList();
        //        }
        //        //return Json(detConcepto);
        //        //modificado 27.05.2021
        //        var json_ = Json(lista, JsonRequestBehavior.AllowGet);
        //        json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
        //        return json_;

        //    }
        //    catch (Exception ex)
        //    {
        //        Log.AlmacenarLogError(ex, "AsistenciaController.cs");
        //    }

        //    return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);

        //}

        #endregion ReglaNegocio

        #region MarcaManual

        public ActionResult MarcaManual(string intIdMenu, string strCodMenu)//originalmente solo tenia el parámetro intIdMenu
        {
            if (ValidarSession_view())//if (Auth.isAuthenticated())
            {
                intIdMenuGlo = Convert.ToInt32(intIdMenu);
                SeguridadController.strcoMenuGlo = strCodMenu;//añadido 06.05.2021 uso general
                return View();
            }
            return RedirectToAction("CerrarSesion", "LoginSiscop");
        }

        public JsonResult GetEmpleados(int IntActivoFilter, string strfilter, int IntIdEmp, string dttfiltrofch1, string dttfiltrofch2)
        {
            string strMsgUsuario = "";

            wsAsistencia.Session_Movi objSession = new wsAsistencia.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            List<wsAsistencia.AsigHorarioData> lista = new List<wsAsistencia.AsigHorarioData>();
            try
            {
                using (proxyOrg = new AsistenciaSrvClient())
                {
                    lista = proxyOrg.GetEmpleados(objSession, IntActivoFilter, strfilter, IntIdEmp, dttfiltrofch1, dttfiltrofch2, ref strMsgUsuario).ToList();
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
                Log.AlmacenarLogError(ex, "AsistenciaController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);

        }

        public JsonResult GetAsistencias(int intIdPerHor, string dttfiltrofch1, string dttfiltrofch2)
        {
            string strMsgUsuario = "";

            wsAsistencia.Session_Movi objSession = new wsAsistencia.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            List<AsistenciaData> lista = new List<AsistenciaData>();
            try
            {
                using (proxyOrg = new AsistenciaSrvClient())
                {
                    lista = proxyOrg.GetAsistencias(objSession, intIdPerHor, dttfiltrofch1, dttfiltrofch2, ref strMsgUsuario).ToList();
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
                Log.AlmacenarLogError(ex, "AsistenciaController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);

        }

        public JsonResult getAsistenciaXID(int intIdAsistencia)
        {
            wsAsistencia.Session_Movi objSession = new wsAsistencia.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            string strMsgUsuario = "";
            Asistencia obj = new Asistencia();
            try
            {
                using (proxyOrg = new AsistenciaSrvClient())
                {
                    obj = proxyOrg.getAsistenciaXID(objSession, intIdAsistencia, ref strMsgUsuario);
                }
                return Json(obj);

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "AsistenciaController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);

        }

        public JsonResult ActualizarMarca(Asistencia objAsistencia)
        {
            string strMsgUsuario = "";
            CustomResponse result = new CustomResponse();

            wsAsistencia.Session_Movi objSession = new wsAsistencia.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            try
            {
                bool insert = false;

                using (proxy = new AsistenciaSrvClient())
                {
                    insert = proxy.ActualizarMarca(objSession, objAsistencia, ref strMsgUsuario);
                    proxy.Close();
                }

                if (strMsgUsuario.Equals("") && insert == true)
                {
                    result.type = "success";
                    result.message = "El registro se actualizó satisfactoriamente.";
                }
                else
                {
                    result.type = "info";
                    result.message = strMsgUsuario;
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "AsistenciaController.cs");
                result.type = "errorInt";
                result.message = "Ocurrió un inconveniente al registrar la Regla de Negocio";
            }

            return Json(result);
        }

        public JsonResult EliminarMarca(long intIdAsistencia)
        {
            string strMsgUsuario = "";
            CustomResponse result = new CustomResponse();

            wsAsistencia.Session_Movi objSession = new wsAsistencia.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            try
            {
                bool delete = false;
                using (proxyOrg = new AsistenciaSrvClient())
                {
                    delete = proxyOrg.EliminarMarca(objSession, intIdAsistencia, ref strMsgUsuario);
                    proxyOrg.Close();
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
                Log.AlmacenarLogError(ex, "AsistenciaController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al eliminar el registro";
            }

            return Json(result);
        }

        public JsonResult Guardar(Asistencia objAsistencia, List<Dictionary<string, string>> fechas)
        {
            string strMsgUsuario = "";
            CustomResponse result = new CustomResponse();

            wsAsistencia.Session_Movi objSession = new wsAsistencia.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            try
            {
                List<Dictionary<string, string>> salida;

                using (proxy = new AsistenciaSrvClient())
                {
                    salida = proxy.Guardar(objSession, objAsistencia, fechas.ToArray(), ref strMsgUsuario).ToList();
                    proxy.Close();
                }

                if (strMsgUsuario.Equals("") && salida.Count == 0)
                {
                    result.type = "success";
                    result.message = "El registro se insertó satisfactoriamente.";
                }
                else if (salida.Count > 0)
                {
                    result.type = "error";
                    result.objeto = salida;
                }
                else
                {
                    result.type = "error";
                    result.message = strMsgUsuario;
                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "AsistenciaController.cs");
                result.type = "errorInt";
                result.message = "Ocurrió un inconveniente al registrar la Regla de Negocio";
            }

            return Json(result);
        }

        public JsonResult GetMarcasHorario(int intIdPersonal)
        {
            string strMsgUsuario = "";

            wsAsistencia.Session_Movi objSession = new wsAsistencia.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            Dictionary<string, string> objeto = new Dictionary<string, string>();
            try
            {
                using (proxyOrg = new AsistenciaSrvClient())
                {
                    objeto = proxyOrg.GetMarcasHorario(objSession, intIdPersonal, ref strMsgUsuario);
                    proxyOrg.Close();
                }
                return Json(objeto);

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "AsistenciaController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);

        }

        public JsonResult GetUltimaMarca(int intIdPersonal)
        {
            string strMsgUsuario = "";

            wsAsistencia.Session_Movi objSession = new wsAsistencia.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            Dictionary<string, string> objeto = new Dictionary<string, string>();
            try
            {
                using (proxyOrg = new AsistenciaSrvClient())
                {
                    objeto = proxyOrg.GetUltimaMarca(objSession, intIdPersonal, ref strMsgUsuario);
                    proxyOrg.Close();
                }
                return Json(objeto);

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "AsistenciaController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);

        }

        #endregion MarcaManual


    }


}
