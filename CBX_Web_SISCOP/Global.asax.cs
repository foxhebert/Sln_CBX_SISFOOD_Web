using CBX_Web_SISCOP.App_Start;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
//Para SignalR de Websocket
using System.Configuration;
using System.Data.SqlClient;
using CBX_Web_SISCOP.Controllers;

namespace CBX_Web_SISCOP
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            try
            {
                AreaRegistration.RegisterAllAreas();
                FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
                RouteConfig.RegisterRoutes(RouteTable.Routes);
                BundleConfig.RegisterBundles(BundleTable.Bundles);

                JsonValueProviderFactory jsonValueProviderFactory = null;

                foreach (var factory in ValueProviderFactories.Factories)
                {
                    if (factory is JsonValueProviderFactory)
                    {
                        jsonValueProviderFactory = factory as JsonValueProviderFactory;
                    }
                }

                //remove the default JsonVAlueProviderFactory
                if (jsonValueProviderFactory != null) ValueProviderFactories.Factories.Remove(jsonValueProviderFactory);

                //add the custom one
                ValueProviderFactories.Factories.Add(new CustomJsonValueProviderFactory());

                //Línea añadida para SignalR de Websocket hg_08.02.21_TomaConsumo
                SqlDependency.Start(ConfigurationManager.ConnectionStrings["CustomerConnection"].ConnectionString);
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "Global.asax.cs | Application_Start");
            }
        }


        //Línea añadida para SignalR de Websocket hg_08.02.21_TomaConsumo
        protected void Application_End()
        {
            try
            {
                SqlDependency.Stop(ConfigurationManager.ConnectionStrings["CustomerConnection"].ConnectionString);
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "Global.asax.cs | Application_Start");
            }
        }

    }
}
