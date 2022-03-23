using CBX_Web_SISCOP.swReportes;
using CBX_Web_SISCOP.wsOrganizacion;
using CBX_Web_SISCOP.wsSeguridad;//22.04.2021
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TGTipoEN = CBX_Web_SISCOP.swReportes.TGTipoEN;
using Planilla = CBX_Web_SISCOP.swReportes.Planilla;
using CrystalDecisions.CrystalReports.Engine;
using System.Activities.Expressions;
using System.Data;
using System.Reflection;
using System.IO;
using CrystalDecisions.Shared;
using Newtonsoft.Json;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Spreadsheet;
using System.Net;
using CBX_Web_SISCOP.Models;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;

namespace CBX_Web_SISCOP.Controllers
{
    public class ReportesController : Controller
    {

        private OrganizacionSrvClient proxyOrg;
        private ReportesSrvClient proxyRep;
        public static int intIdMenuGlo { get; set; }
        public static List<int> listEmpleados;
        public static List<int> listConceptos;

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


        public ActionResult Reportes(string intIdMenu, string strCodMenu)//originalmente solo tenia el parámetro intIdMenu
        {
            if (ValidarSession_view())//if (Auth.isAuthenticated())
            {
                intIdMenuGlo = Convert.ToInt32(intIdMenu);
                SeguridadController.strcoMenuGlo = strCodMenu;//añadido 06.05.2021 uso general
                return View();
            }
            return RedirectToAction("CerrarSesion", "LoginSiscop");
        }

        public JsonResult GetCampJerare(int IntIdJerOrg)
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
                //return Json(lista_Unid_Sup);
                //modificado el 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "ReportesController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }

        public JsonResult ConsultaReporte(int cboUniOrg, string filtroCalculo, int cboPlanilla, int cboCategoria, bool cesado, int estado, List<int> listGrupoLiq)
        {
            swReportes.Session_Movi objSession = new swReportes.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            string strMsjUsuario = "";
            IList<Reporte> lista = new List<Reporte>();

            try
            {
                using (proxyRep = new ReportesSrvClient())
                {
                    if (listGrupoLiq == null)
                    {
                        listGrupoLiq = new List<int>();
                    }
                    lista = proxyRep.ConsultaReporte(objSession, cboUniOrg, filtroCalculo, cboPlanilla, cboCategoria, cesado, estado, listGrupoLiq.ToArray(), ref strMsjUsuario);
                }
                //return Json(lista);
                //modificado el 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "ReportesController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }

        public JsonResult GetCampPlanilla(List<int> lstIntIdUniOrg)
        {
            if (lstIntIdUniOrg == null)
                lstIntIdUniOrg = new List<int>();
            string strMsgUsuario = "";
            List<Planilla> lista = new List<Planilla>();

            try
            {
                using (proxyRep = new ReportesSrvClient())
                {
                    lstIntIdUniOrg.ForEach(x => {
                        var tmp = proxyRep.ListarCampoPlanilla(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(), x, ref strMsgUsuario).ToList();
                        lista.AddRange(tmp);
                    });
                    proxyRep.Close();
                }

                //return Json(lista_Planilla);
                //modificado el 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "ReportesController.cs");
            }
            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }

        public JsonResult GetCampFizcalizacion()
        {
            string strMsgUsuario = "";
            List<TGTipoEN> lista = new List<TGTipoEN>();

            try
            {
                using (proxyRep = new ReportesSrvClient())
                {
                    lista = proxyRep.ListarCampoFizcalizacion(Auth.intIdSesion(), intIdMenuGlo, Auth.intIdSoft(),ref strMsgUsuario).ToList();
                    proxyRep.Close();

                    //return Json(lista_Fizcalizacion);
                }
                //modificado el 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            { 
                Log.AlmacenarLogError(ex, "ReportesController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }

        public ActionResult Graficos(string intIdMenu, string strCodMenu)//originalmente solo tenia el parámetro intIdMenu
        {
            if (ValidarSession_view())//if (Auth.isAuthenticated())
            {
                intIdMenuGlo = Convert.ToInt32(intIdMenu);
                SeguridadController.strcoMenuGlo = strCodMenu;//añadido 06.05.2021 uso general
                return View();
            }

            return RedirectToAction("CerrarSesion", "LoginSiscop");
        }

        public JsonResult GetReportes()
        {
            swReportes.Session_Movi objSession = new swReportes.Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = intIdMenuGlo;
            objSession.intIdUsuario = Auth.intIdUsuario();

            string strMsjUsuario = "";
            IList<ReporteM> lista = new List<ReporteM>();
            try
            {
                using (proxyRep = new ReportesSrvClient())
                {
                    lista = proxyRep.GetReportes(objSession, ref strMsjUsuario);
                }

                //return Json(lista);
                //modificado el 27.05.2021
                var json_ = Json(lista, JsonRequestBehavior.AllowGet);
                json_.MaxJsonLength = LoginSiscopController.intMaxLenJson;
                return json_;
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "ReportesController.cs");
            }

            return new JsonErrorResult(new { msg = RespuestaMensaje.errorGeneral }, HttpStatusCode.MethodNotAllowed);
        }

        public static DataTable ConvertDataTable<TItemType>(List<TItemType> list)
        {
            DataTable convertedData = new DataTable();

            // Get List Item Properties info
            Type itemType = typeof(TItemType);
            PropertyInfo[] publicProperties =
                // Only public non inherited properties
                itemType.GetProperties(BindingFlags.Instance | BindingFlags.Public);

            // Create Table Columns
            foreach (PropertyInfo property in publicProperties)
            {
                // DataSet does not support System.Nullable<>
                if (property.PropertyType.IsGenericType &&
                    property.PropertyType.GetGenericTypeDefinition() == typeof(Nullable<>))
                {
                    // Set the column datatype as the nullable value type
                    convertedData.Columns.Add(property.Name, property.PropertyType.GetGenericArguments()[0]);
                }
                else
                {
                    convertedData.Columns.Add(property.Name, property.PropertyType);
                }
            }

            // Convert the Data
            foreach (TItemType item in list)
            {
                object[] rowData = new object[convertedData.Columns.Count];
                int rowDataIndex = 0;
                // Iterate through Item Properties
                foreach (PropertyInfo property in publicProperties)
                {
                    // Add a single cell data
                    rowData[rowDataIndex] = property.GetValue(item, null);
                    rowDataIndex++;
                }
                convertedData.Rows.Add(rowData);
            }

            return convertedData;
        }

        public void llenarListaEmpleados(List<int> lista, List<int> lista2)
        {
            listEmpleados = lista;
            listConceptos = lista2;
        }

        #region ReportesComedor
        public ActionResult ReportesComedor(string intIdMenu, string strCodMenu)//originalmente solo tenia el parámetro intIdMenu
        {
            if (ValidarSession_view())//if (Auth.isAuthenticated())
            {
                intIdMenuGlo = Convert.ToInt32(intIdMenu);
                SeguridadController.strcoMenuGlo = strCodMenu;//añadido 06.05.2021 uso general
                return View();
            }
            return RedirectToAction("CerrarSesion", "LoginSiscop");
        }
        #endregion ReportesComedor

        //añadido Hebert 19.07.2021
        public JsonResult SaveImage(string base64image, string imagenDashboardHead, int zoom)
        {
            CustomResponse result = new CustomResponse();
            var Directorio = Server.MapPath("~/Graficas/"); //Graficas //~/Content/img/
            var fullPath = Path.Combine(Directorio, imagenDashboardHead);
            //var fullPath2 = Path.Combine(Directorio, "_" + imagenDashboardHead); //Se comenta todo el Bloque de redimensión

            try
            {
                //var PercentH = 100;//60
                //var PercentW = 100;//60
                //if (zoom > 100)
                //{
                //    PercentH = 55;
                //    PercentW = 55;
                //}

                if (System.IO.File.Exists(fullPath))
                {
                    //if (System.IO.File.Exists(fullPath2))
                    //{
                    var myFile = System.IO.File.OpenRead(fullPath);
                    myFile.Close();
                    //eliminarlo.
                    //System.IO.File.Delete(fullPath2);
                    System.IO.File.Delete(fullPath);
                    //   }
                }


                var t = base64image.Substring(22);  // remove data:image/png;base64,
                byte[] bytes = Convert.FromBase64String(t);
                System.Drawing.Image image;
                //System.Drawing.Image image2;

                using (MemoryStream ms = new MemoryStream(bytes))
                {
                    image = System.Drawing.Image.FromStream(ms);

                    image.Save(fullPath, System.Drawing.Imaging.ImageFormat.Png);
                    image.Dispose();

                    //Obtenemos la imagen del filesystem para redimensionar 
                    //var IMG = Image.FromFile(fullPath);
                    //image2 = this.Redimensionar(IMG, PercentH, PercentW);
                    //IMG.Dispose();
                    ////Guardamos la imagen modificada
                    //image2.Save(fullPath2, System.Drawing.Imaging.ImageFormat.Png);
                    //image2.Dispose();
                }

            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "ReportesController.cs");
                result.type = "errorInt";
                result.message = "Ocurrió un inconveniente al Guardar Screen del HomePage";
            }
            //Devolver la Ruta
            result.message = fullPath;//fullPath2
            return Json(fullPath);//fullPath2
        }

        private Image Redimensionar(Image Imagen, int Ancho, int Alto, int resolucion)
        {
            //Bitmap sera donde trabajaremos los cambios
            using (Bitmap imagenBitmap = new Bitmap(Ancho, Alto, PixelFormat.Format32bppRgb))
            {
                imagenBitmap.SetResolution(resolucion, resolucion);
                //Hacemos los cambios a ImagenBitmap usando a ImagenGraphics y la Imagen Original(Imagen)
                //ImagenBitmap se comporta como un objeto de referenciado
                using (Graphics imagenGraphics = Graphics.FromImage(imagenBitmap))
                {
                    imagenGraphics.SmoothingMode = SmoothingMode.AntiAlias;
                    imagenGraphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    imagenGraphics.PixelOffsetMode = PixelOffsetMode.HighQuality;
                    imagenGraphics.DrawImage(Imagen, new Rectangle(0, 0, Ancho, Alto), new Rectangle(0, 0, Imagen.Width, Imagen.Height), GraphicsUnit.Pixel);
                    //todos los cambios hechos en imagenBitmap lo llevaremos un Image(Imagen) con nuevos datos a travez de un MemoryStream
                    MemoryStream imagenMemoryStream = new MemoryStream();
                    imagenBitmap.Save(imagenMemoryStream, System.Drawing.Imaging.ImageFormat.Jpeg);
                    Imagen = Image.FromStream(imagenMemoryStream);

                }
            }
            return Imagen;
        }

        private Image Redimensionar(Image image, int SizeHorizontalPercent, int SizeVerticalPercent)
        {
            //Obntenemos el ancho y el alto a partir del porcentaje de tamaño solicitado
            int anchoDestino = image.Width * SizeHorizontalPercent / 100;
            int altoDestino = image.Height * SizeVerticalPercent / 100;
            //Obtenemos la resolucion original
            int resolucion = Convert.ToInt32(image.HorizontalResolution);

            return Redimensionar(image, anchoDestino, altoDestino, resolucion);

        }
    }
}
