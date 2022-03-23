using CBX_Web_SISCOP.Controllers;
using CBX_Web_SISCOP.swReportes;
using CrystalDecisions.CrystalReports.Engine;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
//Traer lista de la Ventana Principal
using System.Web.Mvc;
//--------------------------------
//using System.Drawing;



namespace CBX_Web_SISCOP.Rep.Vista
{

     public partial class RepVentanaPrincipal : System.Web.UI.Page 
    {
        private ReportDocument Rel;


        //LISTA ESTATICA
        public static List<listado_ventana_principal> listadoVentanaPricipal_;
        public static List<listado_screenshot_ventana_principal> listGraficoDashboard_;
        //CLASE MODELO LISTADO DEL JS
        public class listado_ventana_principal
        {
            public string strTitulo { get; set; }
            public string strValor { get; set; }
            public string strCalculadoFecha { get; set; }
            public string strTipoBienesX { get; set; }
            public string strNumeroBienesY { get; set; }
        }
        //CLASE MODELO PARA LA CAPTURA DE PANTALLA 
        public class listado_screenshot_ventana_principal
        {
            public string strIdImagen { get; set; }
            public string strDescripcion { get; set; }
            public string byteImagenData { get; set; }
            public string strPathImagen { get; set; }
        }

        //LISTADO DESDE EL JS CON UN POST
        [System.Web.Services.WebMethod]
        public static void DeleteRecord(List<listado_ventana_principal> listadoVentanaPricipal)
        {
            listadoVentanaPricipal_ = listadoVentanaPricipal;
        }
       
        [System.Web.Services.WebMethod]
        public static void ReportDashboardPrincipal(List<listado_screenshot_ventana_principal> listGraficoDashboard)
        {
            listGraficoDashboard_ = listGraficoDashboard;
        }


        protected void Page_PreInit(object sender, EventArgs e)
        {
            Container.Visible = false;
            //string arrayEncabezadoCrystal
            int zoomLevel = int.Parse((Request.QueryString["zoomLevel"]));
            string filtroDeReporte = Request.QueryString["filtroDeReporte"];

            ////List<ReporteExcelsExportados> list = new List<ReporteExcelsExportados>();
            List<listado_screenshot_ventana_principal> listScreenshtDashboard = new List<listado_screenshot_ventana_principal>();
                try
                {
                    {
                        ///REPORTE NORMAL CON RESUMEN DE DATOS DEL DASHBOARD
                        if (filtroDeReporte == "ReporteResumenDeDashboard")
                        {                            
                            DataTable tb = ConvertDataTable(listadoVentanaPricipal_);

                            if (listadoVentanaPricipal_.Count > 0)//listScreenshtDashboard
                            {
                                Rel = new ReportDocument();
                                Rel.Load(Server.MapPath("~/Rep/CrystalRep/VentanaPrincipal/RepVentanaPrincipal.rpt"));
                                Rel.SetDataSource(tb);
                                if (Request.QueryString["pdf"] != null)
                                {
                                    ExportPDF(Rel, filtroDeReporte);
                                }
                                ReporteVentanaPrincipal.ReportSource = Rel;
                                ReporteVentanaPrincipal.ToolPanelView = CrystalDecisions.Web.ToolPanelViewType.None;
                                ReporteVentanaPrincipal.HasToggleGroupTreeButton = false;
                            }
                            else
                            {
                                Container.Visible = true;
                                txtMensaje.InnerHtml = "No existen datos.";
                            }

                        }
                        //https://www.youtube.com/watch?v=MvbxpvUcxdU&t=635s   min 11:00

                        ///REPORTE CON IMAGEN DEL DASHBOARD
                        else if (filtroDeReporte == "ReporteGraficoDeDashboard")
                        {
                            DataTable tb = ConvertDataTable(listGraficoDashboard_);

                            if (listGraficoDashboard_.Count > 0)
                            {                                
                                Rel = new ReportDocument();
                                Rel.Load(Server.MapPath("~/Rep/CrystalRep/VentanaPrincipal/RepImagenDashboard100.rpt"));
                                Rel.SetDataSource(tb);

                                if (Request.QueryString["pdf"] != null)
                                {
                                    ExportPDF(Rel, filtroDeReporte);
                                }
                                ReporteVentanaPrincipal.ReportSource = Rel;
                                ReporteVentanaPrincipal.ToolPanelView = CrystalDecisions.Web.ToolPanelViewType.None;
                                ReporteVentanaPrincipal.HasToggleGroupTreeButton = false;
                            }
                            else
                            {
                                Container.Visible = true;
                                txtMensaje.InnerHtml = "No se ha generado reporte.";
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Container.Visible = true;
                    txtMensaje.InnerHtml = "Ocurrió un problema con el reporte.";
                    Log.AlmacenarLogError(ex, "RepVentanaPrincipal.aspx.cs");
                }
        }

        protected void Page_Unload(object sender, EventArgs e)
        {
            if (Rel != null)
            {
                if (Rel.IsLoaded)
                {
                    Rel.Close();
                    Rel.Dispose();
                }
            }
        }

        public void ExportPDF(ReportDocument Rel, string filtroDeReporte)
        {

            BinaryReader stream = new BinaryReader(Rel.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat));
            Response.ClearContent();
            Response.ClearHeaders();
            Response.ContentType = "application/pdf";
            Response.BinaryWrite(stream.ReadBytes(Convert.ToInt32(stream.BaseStream.Length)));
  
            if (filtroDeReporte == "ReporteResumenDeDashboard")
            {
                Response.AddHeader("content-disposition", @" attachment; filename=""Reporte Resumen de Dashboard.pdf"" ");
            }
            if (filtroDeReporte == "ReporteGraficoDeDashboard")
            {
                Response.AddHeader("content-disposition", @" attachment; filename=""Reporte Gráfico de Dashboard.pdf"" ");
            }

            Response.Flush();
            Response.Close();
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

    }
}
