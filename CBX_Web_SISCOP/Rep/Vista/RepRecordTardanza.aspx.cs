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
    public partial class RepRecordTardanza : System.Web.UI.Page
    {
        private ReportesSrvClient proxyRep;
        private ReportDocument Rel;

        protected void Page_PreInit(object sender, EventArgs e)
        {
            Container.Visible = false;
            int intPeriodo = Int32.Parse(Request.QueryString["intPeriodo"]);
            int tipo = Int32.Parse(Request.QueryString["tipo"]);
            var fecIni = Request.QueryString["fecIni"];
            var fecFin = Request.QueryString["fecFin"];

            Session_Movi objSession = new Session_Movi();
            objSession.intIdSesion = Auth.intIdSesion();
            objSession.intIdSoft = Auth.intIdSoft();
            objSession.intIdMenu = 0;

            string strMsgUsuario = "";
            List<ReporteTardanza> list = new List<ReporteTardanza>();
            List<int> listEmpleados = ReportesController.listEmpleados;

            DateTime now = DateTime.Now;
            string Fecha = now.ToString("HH:mm tt");

            using (proxyRep = new ReportesSrvClient())
            {
                try
                {
                    list = proxyRep.ReporteTardanza(objSession, listEmpleados.ToArray(), intPeriodo, ref strMsgUsuario).ToList();
                    DataTable tb = ConvertDataTable(list);

                    if (list.Count > 0)
                    {
                        Rel = new ReportDocument();
                        if (tipo == 1)
                        {
                            Rel.Load(Server.MapPath("~/Rep/CrystalRep/Tardanza/RepRecordTardanza.rpt"));
                            Rel.SetDataSource(tb);
                            Rel.SetParameterValue("FechaPeriodo", fecIni + " - " + fecFin);
                        }
                        else if (tipo == 2)
                        {
                            Rel.Load(Server.MapPath("~/Rep/CrystalRep/Tardanza/RepRecordTardanzaEstadistico.rpt"));
                            Rel.SetDataSource(tb);
                            Rel.SetParameterValue("FechaPeriodo", fecIni + " - " + fecFin);
                        }
                        if (Request.QueryString["pdf"] != null)
                        {
                            ExportPDF(Rel, tipo);
                        }
                        if (Request.QueryString["excel"] != null)
                        {
                            ExportExcel(Rel, tipo);
                        }

                        ReporteTardanza.ReportSource = Rel;
                        ReporteTardanza.ToolPanelView = CrystalDecisions.Web.ToolPanelViewType.None;
                        ReporteTardanza.HasToggleGroupTreeButton = false;
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
                    Log.AlmacenarLogError(ex, "RepRecordTardanza");
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

        public void ExportPDF(ReportDocument Rel, int tipo)
        {
            BinaryReader stream = new BinaryReader(Rel.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat));
            Response.ClearContent();
            Response.ClearHeaders();
            Response.ContentType = "application/pdf";
            Response.BinaryWrite(stream.ReadBytes(Convert.ToInt32(stream.BaseStream.Length)));
            if (tipo == 1)
            {
                Response.AddHeader("content-disposition", @"attachment;filename=""Reporte Record Tardanza.pdf""");
            }
            else if (tipo == 2)
            {
                Response.AddHeader("content-disposition", @"attachment;filename=""Reporte Record Tardanza Gráfico.pdf""");
            }
            Response.Flush();
            Response.Close();
        }

        public void ExportExcel(ReportDocument Rel, int tipo)
        {
            BinaryReader stream = new BinaryReader(Rel.ExportToStream(CrystalDecisions.Shared.ExportFormatType.Excel));
            Response.ClearContent();
            Response.ClearHeaders();
            Response.ContentType = "application/vnd.ms-excel";
            Response.BinaryWrite(stream.ReadBytes(Convert.ToInt32(stream.BaseStream.Length)));
            if (tipo == 1)
            {
                Response.AddHeader("content-disposition", @"attachment;filename=""Reporte Record Tardanza.xls""");
            }
            else if (tipo == 2)
            {
                Response.AddHeader("content-disposition", @"attachment;filename=""Reporte Record Tardanza Gráfico.xls""");
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
