using System.Web;
using System.Web.Optimization;

namespace CBX_Web_SISCOP
{
    public class BundleConfig
    {
        // Para obtener más información sobre las uniones, visite https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                       "~/Scripts/jquery/jquery.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery/jquery.validate*"));

            // Utilice la versión de desarrollo de Modernizr para desarrollar y obtener información. De este modo, estará
            // para la producción, use la herramienta de compilación disponible en https://modernizr.com para seleccionar solo las pruebas que necesite.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/popper.min.js",
                      "~/Scripts/bootstrap/bootstrap.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap/bootstrap.css",
                      "~/Content/nprogress/nprogress.css",
                      "~/Content/bootstrap-progressbar/bootstrap-progressbar-3.3.4.css",
                      "~/Content/iCheck/blue.css",
                      "~/Content/select2/select2.css",
                      "~/Content/switchery/switchery.css",
                      "~/Content/bootstrap-daterangepicker/daterangepicker.css",
                      "~/Content/datatables.net/dataTables.bootstrap.css",
                      "~/Content/datatables.net/responsive.bootstrap.css",
                      "~/Content/dialog/sweetalert2.min.css",
                      "~/Content/pnotify/pnotify.css",
                      "~/Content/pnotify/pnotify.buttons.css",
                      "~/Content/pnotify/pnotify.nonblock.css",
                      "~/Content/bootstrap-datetimepicker.min.css",
                      "~/Content/custom.css",
                      "~/Content/site.css"));

            bundles.Add(new ScriptBundle("~/bundles/Javascript").Include(
                        "~/Scripts/fastclick/fastclick.js",
                        "~/Scripts/nprogress/nprogress.js",
                        "~/Scripts/jQuery-Smart-Wizard/jquery.smartWizard.js",
                        "~/Scripts/bootstrap-progressbar/bootstrap-progressbar.js",
                        "~/Scripts/iCheck/icheck.js",
                        "~/Scripts/datatables.net/jquery.dataTables.js",
                        "~/Scripts/datatables.net/dataTables.bootstrap.js",
                        "~/Scripts/datatables.net/dataTables.responsive.js",
                        "~/Scripts/moment/moment.min.js",
                        "~/Scripts/bootstrap-daterangepicker/daterangepicker.js",
                        "~/Scripts/jquery.tagsinput/jquery.tagsinput.js",
                        "~/Scripts/jquery.inputmask/jquery.inputmask.bundle.min.js",
                        "~/Scripts/switchery/switchery.js",
                        "~/Scripts/select2/select2.full.js",
                        "~/Scripts/parsleyjs/parsley.js",
                        "~/Scripts/autosize/autosize.min.js",
                        "~/Scripts/dialog/sweetalert2.min.js",
                        "~/Scripts/pnotify/pnotify.js",
                        "~/Scripts/pnotify/pnotify.buttons.js",
                        "~/Scripts/pnotify/pnotify.nonblock.js",
                        "~/Scripts/autocomplete/jquery.autocomplete.min.js",
                        "~/Scripts/echarts/echarts.min.js",
                        "~/Scripts/raphael/raphael.min.js",
                        "~/Scripts/moris.js/morris.min.js",
                        "~/Scripts/blockUI/jquery.blockUI.js",
                        "~/Scripts/bootstrap-datetimepicker.min.js" //,

                        //Script añadido desde el SISFOOD para los manteniemintos a copiar 15.02.2021
                        //"~/Scripts/site.js" //lun.22.02.21_17:11PM HG
                        //Se esta comentando pues lo que se necesita del SITE.JS se traslado al ALL.JS
                ));
        }
    }
}
