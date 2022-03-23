using CBX_Web_SISCOP.wsSeguridad;
//using CBX_Web_SISCOP.wsPacking;
using CBX_Web_SISCOP.wsPersona;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.Web.Mvc;
using CBX_Web_SISCOP.Models;

namespace CBX_Web_SISCOP.Controllers
{
    public class SeguridadController : Controller
    {
        private SeguridadSrvClient Seguridad_tsp;
        //private PackingSrvClient PackingTsp;
        private PersonalSrvClient proxyOrg;
        public static string strcoMenuGlo { get; set; }//añadido 06.05.2021 para usarlo en Toma de Consumo
        public static int intIdMenuGlo { get; set; }//copiado 06.05.2021 desde PersonalController
        private string strTableNamePerfil = "TSPERFIL";
        private string strTableNameUsuario = "TSUSUARIO";

        //añadido 06.05.2021 uso general para 
        public string setCoMenuGlo_(string CoMenu, string Operac)
        {
            try
            {
                if (Operac == "SET")
                {
                    SeguridadController.strcoMenuGlo = CoMenu;
                }
                if (Operac == "GET")
                {
                    CoMenu = SeguridadController.strcoMenuGlo;
                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "PersonalController.cs");
            }
            return CoMenu;
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
                    Log.AlmacenarLogError(ex, "SeguridadController.cs: Exception");
                    version = "Verificar Web Service";//añadido 22.04.2021
                    return false; //No conecta al Servicio
                }
            }

        #endregion Validación Session y Conexión con WCF para usar en los ActionResult (vistas)
        //*-----------------------------------------------------------------------------------


        #region Perfil
        public ActionResult Perfil(string intIdMenu, string strCodMenu)//originalmente sin parámetros
        {
            if (ValidarSession_view())//if (Auth.isAuthenticated())
            {
                intIdMenuGlo = Convert.ToInt32(intIdMenu);
                SeguridadController.strcoMenuGlo = strCodMenu;//añadido 06.05.2021 uso general
                return View();
            }
            return RedirectToAction("CerrarSesion", "LoginSiscop");
        }

        public JsonResult GetTablaPerfil(int intActivo, string strDescripcion)//public JsonResult GetTablaPerfil(int intIdMenu, int intActivo, string strDescripcion)
        {
            string strMsgUsuario = "";
            try
            {
                List<TS_PERFIL> lista = new List<TS_PERFIL>();
                SeguridadSrvClient Seguridad_tsp;
                using (Seguridad_tsp = new SeguridadSrvClient())
                {
                    lista = Seguridad_tsp.ListarPerfil(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), intActivo, strDescripcion, ref strMsgUsuario).ToList();
                    Seguridad_tsp.Close();
                }
                //return Json(ListarPerfil);
                //modificado el 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "SeguridadController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }

        public JsonResult EliminarPerfil(int intIdPerfil)//(int intIdMenu, int intIdPerfil)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";
            try
            {
                bool delete = false;

                using (Seguridad_tsp = new SeguridadSrvClient())
                {
                    delete = Seguridad_tsp.EliminarPerfil(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), Auth.intIdUsuario(), intIdPerfil, ref strMsgUsuario);
                    Seguridad_tsp.Close();
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
                Log.AlmacenarLogError(ex, "SeguridadController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al eliminar el registro";
            }
            return Json(result);
        }

        public JsonResult ObtenerListadoSubMenus(int intActivo, string strDescripcion)//(int intIdMenu, int intActivo, string strDescripcion)
        {
            try
            {
                string strMsgUsuario = "";
                List<TS_MENU> lista = new List<TS_MENU>();
                using (Seguridad_tsp = new SeguridadSrvClient())
                {
                    lista = Seguridad_tsp.ListarMenuSubMenus(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), intActivo, strDescripcion, ref strMsgUsuario).ToList();
                }
                //return Json(detConcepto);
                //modificado el 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "SeguridadController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }

        public JsonResult ObtenerRegistroPerfil(int IntIdPerfil)
        {
            try
            {
                string strMsgUsuario = "";
                List<TS_PERFIL> lista = new List<TS_PERFIL>();
                using (Seguridad_tsp = new SeguridadSrvClient())
                {
                    lista = Seguridad_tsp.ObtenerRegistroPerfil(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), IntIdPerfil, ref strMsgUsuario).ToList();
                }
                //return Json(detConcepto);
                //modificado el 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {

                Log.AlmacenarLogError(ex, "SeguridadController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }

        public JsonResult InsertUpdatePerfil(TS_PERFIL ObjPerfil, List<TT_TSPERFIL_MENU> listaDetallesPerfil,int intTipoOperacion)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";
            bool insert = false;
            try
            {
                //Validaciones 02.08.2021 - INICIO
                var Cod_ = ObjPerfil.strCoPerfil;
                var Desc_ = ObjPerfil.strDesPerfil;
                var Valida = 0;

                if (Cod_ == "" || Cod_ == null)
                {
                    Valida = 1;
                    result.message = "Debe ingresar un Código.";
                }
                else
                if (Desc_ == "" || Desc_ == null)
                {
                    Valida = 1;
                    result.message = "Debe ingresar una Descripción.";
                }

                if (Valida == 1)
                {
                    result.type = "error";
                }
                else
                {  //Validaciones 02.08.2021 -FIN

                    using (Seguridad_tsp = new SeguridadSrvClient())
                    {
                        insert = Seguridad_tsp.InsertarOrUpdatePerfil(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), ObjPerfil, listaDetallesPerfil.ToArray(), Auth.intIdUsuario(), intTipoOperacion, ref strMsgUsuario);
                        Seguridad_tsp.Close();
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
                        if (strMsgUsuario.Contains("código"))
                        {
                            result.type = "codigo";
                            result.message = strMsgUsuario;
                        }
                        else
                        {
                            if (strMsgUsuario.Contains("descripción"))
                            {
                                result.type = "descripcion";
                                result.message = strMsgUsuario;
                            }
                            else
                            {
                                result.type = "infoc";
                                result.message = strMsgUsuario;
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "SeguridadController.cs");
                result.type = "errorInt";
                if (intTipoOperacion == 1)
                {
                    result.message = "Ocurrió un inconveniente al insertar el Perfil";
                }
                else
                {
                    result.message = "Ocurrió un inconveniente al actualizar el Perfil";
                }
            }
            return Json(result);
        }

        #endregion

        #region Usuarios

        public ActionResult Usuarios(string intIdMenu, string strCodMenu)//originalmente sin parámetros
        {
            if (ValidarSession_view())//if (Auth.isAuthenticated())
            {
                intIdMenuGlo = Convert.ToInt32(intIdMenu);
                SeguridadController.strcoMenuGlo = strCodMenu;//añadido 06.05.2021 uso general
                return View();
            }
            return RedirectToAction("CerrarSesion", "LoginSiscop");
        }

        public JsonResult GetTablaUsuario(int intActivo, string strDescripcion, int intPerfil)
        {
            string strMsgUsuario = "";

            try
            {
                List<TG_USUARIO> lista = new List<TG_USUARIO>();
                SeguridadSrvClient Seguridad_tsp;
                using (Seguridad_tsp = new SeguridadSrvClient())
                {
                    lista = Seguridad_tsp.ListarUsuarios(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), intActivo, strDescripcion, intPerfil, ref strMsgUsuario).ToList();
                    Seguridad_tsp.Close();
                }
                //return Json(ListarPerfil);
                //modificado el 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "SeguridadController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }

        public JsonResult EliminarUsuario(int intIdUsu)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";

            try
            {
                bool delete = false;
                using (Seguridad_tsp = new SeguridadSrvClient())
                {
                    delete = Seguridad_tsp.EliminarUsuario(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), Auth.intIdUsuario(), intIdUsu, ref strMsgUsuario);
                    Seguridad_tsp.Close();
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
                Log.AlmacenarLogError(ex, "SeguridadController.cs");
                result.type = "error";
                result.message = "Ocurrió un inconveniente al eliminar el registro";
            }
            return Json(result);
        }

        public JsonResult ObtenerRegistroUsuario(int IntIdUsuar)
        {
            string strMsgUsuario = "";
            try
            {
                List<TG_USUARIO> lista = new List<TG_USUARIO>();
                using (Seguridad_tsp = new SeguridadSrvClient())
                {
                    lista = Seguridad_tsp.ObtenerRegistroUsuario(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), IntIdUsuar, ref strMsgUsuario).ToList();
                }
                //return Json(detConcepto);
                //modificado el 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "SeguridadController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }

        public JsonResult InsertUpdateUsuario(TG_USUARIO ObjUsuario, List<TSUSUAR_PERFI> listaDetallesUsuarioPerfil, List<TT_TSUSUAR_FILTRO> listaDetallesUsuarioFiltro, int intTipoOperacion)
        {
            CustomResponse result = new CustomResponse();
            string strMsgUsuario = "";
            List<TGTipoEN> lista_Tipo = new List<TGTipoEN>();
            if (listaDetallesUsuarioPerfil == null)
                listaDetallesUsuarioPerfil = new List<TSUSUAR_PERFI>();

            try
            {
                //Validaciones 02.08.2021 - INICIO
                var idPerfil = listaDetallesUsuarioPerfil[0].intIdPerfil;
                var Nomb_ = ObjUsuario.strNoUsuar;
                var User_ = ObjUsuario.strUsUsuar;
                var Pass_ = ObjUsuario.strCoPassw;
                var Valida = 0;


                if (User_ == "" || User_ == null)
                {
                    Valida = 1;
                    result.message = "Debe ingresar una cuenta de usuario";
                }
                else
                if (Pass_ == "" || Pass_ == null)
                {
                    result.message = "Debe ingresar una contraseña";
                    Valida = 1;
                }
                //else
                //if (Nomb_ == "" || Nomb_ == null)
                //{
                //    Valida = 1;
                //    result.message = "Debe ingresar un Nombre Referencial para el Usuario";
                //}
                else
                if (idPerfil == 0)
                {
                    Valida = 1;
                    result.message = "Debe Seleccionar un Perfil.";
                }

                if (Valida == 1)
                {
                    result.type = "error";
                }
                else
                {  //Validaciones 02.08.2021 -FIN
                    using (proxyOrg = new PersonalSrvClient())
                    {
                        lista_Tipo = proxyOrg.ListarCombos(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), "TGPERFIL", 0, "PERFIL", "VALIDA",/*strEntidad, intIdFiltroGrupo, strGrupo, strSubGrupo,*/ ref strMsgUsuario).ToList();
                        proxyOrg.Close();
                    }

                    var idPerfilEmpleadoBD = lista_Tipo[0].intidTipo;

                    if (intTipoOperacion == 1)
                    {
                        if (idPerfil == 0)
                        {
                            result.type = "error";
                            result.message = "Debe Seleccionar un Perfil.";
                            return Json(result);
                        }
                        else if (idPerfilEmpleadoBD == idPerfil)
                        {
                            result.type = "error";
                            result.message = "El Perfil Empleado [*] no es válido para Nuevos Usuarios, Cambie de Perfil.";
                            return Json(result);
                        }
                    }
                    if (intTipoOperacion == 2)
                    {
                        if (idPerfil == 0)
                        {
                            result.type = "error";
                            result.message = "Debe Seleccionar un Perfil.";
                            return Json(result);
                        }
                        else if (idPerfilEmpleadoBD == idPerfil)
                        {
                            List<TG_USUARIO> Objusuar = new List<TG_USUARIO>();
                            using (Seguridad_tsp = new SeguridadSrvClient())
                            {
                                Objusuar = Seguridad_tsp.ObtenerRegistroUsuario(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), ObjUsuario.intIdUsuar, ref strMsgUsuario).ToList();
                                Seguridad_tsp.Close();
                            }
                            var intIdPersonal_ = Objusuar[0].intIdPersonal;
                            if (intIdPersonal_ == 0)
                            {
                                result.type = "error";
                                result.message = "El Perfil Empleado [*] solo se puede usar para Empleados afiliados, Cambie de Perfil.";
                                return Json(result);
                            }
                        }
                    }

                    if (listaDetallesUsuarioFiltro == null)
                        listaDetallesUsuarioFiltro = new List<TT_TSUSUAR_FILTRO>();


                    bool insert = false;
                    using (Seguridad_tsp = new SeguridadSrvClient())
                    {
                        insert = Seguridad_tsp.InsertOrUpdateUsuario(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), ObjUsuario, listaDetallesUsuarioPerfil.ToArray(), listaDetallesUsuarioFiltro.ToArray(), Auth.intIdUsuario(), intTipoOperacion, ref strMsgUsuario);
                        Seguridad_tsp.Close();
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
                        if (strMsgUsuario.Contains("usuario"))
                        {
                            result.type = "usuario";
                            result.message = strMsgUsuario;
                        }
                        else
                        {
                            result.type = "infoc";
                            result.message = strMsgUsuario;
                        }
                    }

                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "SeguridadController.cs");
                result.type = "errorInt";
                if (intTipoOperacion == 1)
                {
                    result.message = "Ocurrió un inconveniente al insertar el Usuario";
                }
                else
                {
                    result.message = "Ocurrió un inconveniente al actualizar el Usuario";
                }
            }
            return Json(result);
        }
        #endregion


        //public JsonResult getMaestroCaracteres()
        //{
        //    try
        //    {
        //        //modificado, para usar el proxyOrg del Servicio Persona y no Packing.
        //        List<MaestroCaracteres> ListarCaracteres = new List<MaestroCaracteres>();
        //        using (proxyOrg = new PersonalSrvClient())
        //        {
        //            ListarCaracteres = proxyOrg.MaestroMaxCaracteres(strTableNamePerfil).ToList(); //desde wsPacking;
        //            proxyOrg.Close();
        //        }
        //        return Json(ListarCaracteres);
        //    }
        //    catch (Exception ex)
        //    {
        //        Log.AlmacenarLogError(ex, "SeguridadController.cs");
        //    }
        //    return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        //}

        //public JsonResult getMaestroCaracteresUsuario()
        //{
        //    try
        //    {
        //        //modificado, para usar el proxyOrg del Servicio Persona y no Packing.
        //        List<MaestroCaracteres> ListarCaracteres = new List<MaestroCaracteres>();
        //        using (proxyOrg = new PersonalSrvClient())
        //        {
        //            ListarCaracteres = proxyOrg.MaestroMaxCaracteres(strTableNameUsuario).ToList();
        //            proxyOrg.Close();
        //        }
        //        return Json(ListarCaracteres);
        //    }
        //    catch (Exception ex)
        //    {
        //        Log.AlmacenarLogError(ex, "SeguridadController.cs");
        //    }
        //    return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);

        //}


    }
}
