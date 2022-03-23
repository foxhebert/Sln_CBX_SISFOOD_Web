using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CBX_Web_SISCOP.Controllers
{
    public class Auth
    {
        public static bool isAuthenticated()
        {
            int codValida = 0;
            bool isAuthenticated = false;
            try
            {
                if (HttpContext.Current.Session["intCodValidaSesion"] != null)
                {
                    codValida = Convert.ToInt32(HttpContext.Current.Session["intCodValidaSesion"].ToString());
                }
                if (HttpContext.Current.Session["isAuthenticated"] != null && HttpContext.Current.Session["intIdUsuarioSesion"] != null && HttpContext.Current.Session["strNombreUsuarioSesion"] != null && codValida == 1)
                {
                    isAuthenticated = true;
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "Auth.cs");
                isAuthenticated = false;
                throw;
            }

            return isAuthenticated;
        }

        public static bool AuthenticatedGeneral()
        {
            bool isAuthenticated = false;
            try
            {
                if (HttpContext.Current.Session["isAuthenticated"] != null && HttpContext.Current.Session["intIdUsuarioSesion"] != null && HttpContext.Current.Session["strNombreUsuarioSesion"] != null)
                {
                    isAuthenticated = true;
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "Auth.cs");
                isAuthenticated = false;
                throw;
            }

            return isAuthenticated;
        }

        public static int intIdSesion()
        {
            int intIdSesion = 0;
            try
            {
                if (isAuthenticated())
                {
                    intIdSesion = Convert.ToInt32(HttpContext.Current.Session["intIdSesionSesion"].ToString());
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "Auth.cs");
                intIdSesion = 0;
                throw;
            }

            return intIdSesion;
        }

        public static int intIdSoft()
        {
            int intIdSoft = 0;
            try
            {
                if (isAuthenticated())
                {
                    intIdSoft = Convert.ToInt32(HttpContext.Current.Session["intIdSoftSesion"].ToString());
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "Auth.cs");
                intIdSoft = 0;
                throw;
            }
            return intIdSoft;
        }

        public static int intIdUsuario()
        {
            int intIdUsuario = 0;
            try
            {
                if (isAuthenticated())
                {
                    intIdUsuario = Convert.ToInt32(HttpContext.Current.Session["intIdUsuarioSesion"].ToString());
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "Auth.cs");
                intIdUsuario = 0;
                throw;
            }
            return intIdUsuario;
        }

        public static string strNombreUsuario()
        {
            string strNombreUsuario = "";
            try
            {
                if (isAuthenticated())
                {
                    strNombreUsuario = HttpContext.Current.Session["strNombreUsuarioSesion"].ToString();
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "Auth.cs");
                strNombreUsuario = "";
                throw;
            }
            return strNombreUsuario;
        }

        public static string strUserName()
        {
            string strUserName = "";
            try
            {
                if (isAuthenticated())
                {
                    strUserName = HttpContext.Current.Session["strUserNameSesion"].ToString();
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "Auth.cs");
                strUserName = "";
                throw;
            }
            return strUserName;
        }

        //añadido 07.04.2021
        public static int intNumMarcadorTomaConsumo()
        {
            int numMarcador = 0;
            try
            {
                if (isAuthenticated())
                {
                    numMarcador = Convert.ToInt32(HttpContext.Current.Session["numMarcadorToma"].ToString());
                }
            }
            catch (Exception ex)
            {
                Log.AlmacenarLogError(ex, "Auth.cs");
                numMarcador = 0;
                throw;
            }
            return numMarcador;
        }

    }
}
