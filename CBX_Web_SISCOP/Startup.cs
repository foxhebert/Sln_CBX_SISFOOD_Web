using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(CBX_Web_SISCOP.Startup))]
namespace CBX_Web_SISCOP
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);//
            app.MapSignalR();
        }
    }
}
