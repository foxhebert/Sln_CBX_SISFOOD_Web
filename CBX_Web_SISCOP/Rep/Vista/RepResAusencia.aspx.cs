using CBX_Web_SISCOP.Controllers;
using CBX_Web_SISCOP.swReportes;
using CrystalDecisions.CrystalReports.Engine;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace CBX_Web_SISCOP.Rep.Vista
{
    public partial class RepResAusencia : System.Web.UI.Page
    {
        private ReportesSrvClient proxyRep;
        private ReportDocument Rel;

        protected void Page_PreInit(object sender, EventArgs e)
        {
            Container.Visible = false;
            string filtrojer_ini = Request.QueryString["filtrojer_ini"];
            string filtrojer_fin = Request.QueryString["filtrojer_fin"];

            Session_Movi objSession = new Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = 0;

            string strMsgUsuario = "";
            List<ReporteAusencia> list = new List<ReporteAusencia>();
            List<int> listEmpleados = ReportesController.listEmpleados;
            List<int> listConceptos = ReportesController.listConceptos;

            using (proxyRep = new ReportesSrvClient())
            {
                try
                {
                    list = proxyRep.ReporteAusencia(objSession, listEmpleados.ToArray(), listConceptos.ToArray(), filtrojer_ini, filtrojer_fin, ref strMsgUsuario).ToList();
                    DataTable tb = ConvertDataTable(list);

                    if (list.Count > 0)
                    {
                        Rel = new ReportDocument();
                        Rel.Load(Server.MapPath("~/Rep/CrystalRep/RepResDiarioJust.rpt"));
                        Rel.SetDataSource(tb);
                        Rel.SetParameterValue("FechaIni", Convert.ToDateTime(filtrojer_ini));
                        Rel.SetParameterValue("FechaFin", Convert.ToDateTime(filtrojer_fin));

                        if (Request.QueryString["pdf"] != null)
                        {
                            ExportPDF(Rel);
                        }
                        if (Request.QueryString["excel"] != null)
                        {
                            ExportExcel(Rel);
                        }

                        ReporteAusenciaId.ReportSource = Rel;
                        ReporteAusenciaId.ToolPanelView = CrystalDecisions.Web.ToolPanelViewType.None;
                        ReporteAusenciaId.HasToggleGroupTreeButton = false;
                    }
                    else
                    {
                        Container.Visible = true;
                        txtMensaje.InnerHtml = "No existen datos calculados.";
                    }
                }
                catch (Exception ex)
                {
                    Container.Visible = true;
                    txtMensaje.InnerHtml = "Ocurrió un problema.";
                    Log.AlmacenarLogError(ex, "RepResAusencia");
                }
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

        public void ExportPDF(ReportDocument Rel)
        {

            BinaryReader stream = new BinaryReader(Rel.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat));
            Response.ClearContent();
            Response.ClearHeaders();
            Response.ContentType = "application/pdf";
            Response.BinaryWrite(stream.ReadBytes(Convert.ToInt32(stream.BaseStream.Length)));
            Response.AddHeader("content-disposition", @"attachment;filename=""Reporte Diario de Ausencias.pdf""");
            Response.Flush();
            Response.Close();
        }

        public void ExportExcel(ReportDocument Rel)
        {
            BinaryReader stream = new BinaryReader(Rel.ExportToStream(CrystalDecisions.Shared.ExportFormatType.Excel));
            Response.ClearContent();
            Response.ClearHeaders();
            Response.ContentType = "application/vnd.ms-excel";
            Response.BinaryWrite(stream.ReadBytes(Convert.ToInt32(stream.BaseStream.Length)));
            Response.AddHeader("content-disposition", @"attachment;filename=""Reporte Diario de Ausencias.xls""");
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
