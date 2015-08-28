using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Globalization;
using System.Linq;
using System.ServiceModel.PeerResolvers;
using Vxr.Bms.Bu.Dic;
using Vxr.Bms.Core;

namespace Vxr.Bms.Bu
{
    // ReSharper disable InconsistentNaming
    public class PR
    {
        public static bool IsDebug = (ConfigurationManager.AppSettings["isDebug"] == "1");
        public static string _sc = ConfigurationManager.AppSettings["cs"];
        //for Account
        public static void pGetAccount(object obj, out object oo)
        {
            var x = new XR(obj); XR.Init(_sc, IsDebug, DR._a, DR._h, DR._f, DR._fd);
            var r =
                x.R().A().Pc("TripId").Pc("PickupDate")._CR().L().LC().EX().LV().LS().LG().B().G();
            oo = r._d;
        }
        public static void pGetAccount1(object obj, out object oo)
        {
            var x = new XR(obj); XR.Init(_sc, IsDebug, DR._a, DR._h, DR._f, DR._fd);
            var r =
                x.R().A().Pc("TripId").Pc("PickupDate")._CR().L().LC().EX().LS1().LG().B().G();
            oo = r._d;
        }
        public static void test1(object obj, out object oo)
        {
            var x = new XR(obj); XR.Init(_sc, IsDebug, DR._a, DR._h, DR._f, DR._fd);
            var r =
                x.R().A().Pc("TripId").Pc("PickupDate").Pc("IsPrgCreatedDate").Pc("CompId").Pc("AgentId").Pc("CreatedUser").Pc("Status")
                    ._CR().L().LC().EX().LS1().LG().B().G();
            oo = r._d;
        }
        public static void test2(object obj, out object oo)
        {
            var x = new XR(obj); XR.Init(_sc, IsDebug, DR._a, DR._h, DR._f, DR._fd);
            var r =
                x.R().A().Pc("TripId").Pc("PickupDate").Pc("IsPrgCreatedDate").Pc("CompId").Pc("AgentId").Pc("CreatedUser").Pc("Status")
                    ._CR().L().LC().EX().LS1().LG().B().G();
            oo = r._d;
        }

        public static void rp7(object obj, out object oo)
        {
            var x = new XR(obj); XR.Init(_sc, IsDebug, DR._a, DR._h, DR._f, DR._fd);
            var r = x.R().A().LC().EX().LS1().LG().B().G();
            oo = r._d;
        }
        public static void rp8(object obj, out object oo)
        {
            var x = new XR(obj); XR.Init(_sc, IsDebug, DR._a, DR._h, DR._f, DR._fd);
            var r = x.R().A().LC().EX().LS1().LG().B().G();
            oo = r._d;
        }
        public static void rp9(object obj, out object oo)
        {
            var x = new XR(obj); XR.Init(_sc, IsDebug, DR._a, DR._h, DR._f, DR._fd);
            var r = x.R().A().LC().EX().LS1().LG().B().G();
            oo = r._d;
        }
        public static void rp1(object obj, out object oo)
        {
            var x = new XR(obj); XR.Init(_sc, IsDebug, DR._a, DR._h, DR._f, DR._fd);
            var r = x.R().A().LC().EX().LS1().LG().B().G();
            oo = r._d;
        }
        public static void rp5(object obj, out object oo)
        {
            var x = new XR(obj); XR.Init(_sc, IsDebug, DR._a, DR._h, DR._f, DR._fd);
            var r = x.R().A().LC().EX().LS1().LG().B().G();
            oo = r._d;
        }
        public static void rp4(object obj, out object oo)
        {
            var x = new XR(obj); XR.Init(_sc, IsDebug, DR._a, DR._h, DR._f, DR._fd);
            var r = x.R().A().LC().EX().LS1().LG().B().G();
            oo = r._d;
        }
        public static void phongVeTheoNgay(object obj, out object oo)
        {
            var x = new XR(obj); XR.Init(_sc, IsDebug, DR._a, DR._h, DR._f, DR._fd);
            var r = x.R().A().LC().EX().LS1().LG().B().G();
            oo = r._d;
        }
        public static void rp(object obj, out object oo)
        {
            var where = string.Empty;
            var x = new XR(obj); XR.Init(_sc, IsDebug, DR._a, DR._h, DR._f, DR._fd);
            var confs = x._cf;
            where = confs["where"].ToString();
            var order = !string.IsNullOrWhiteSpace(confs["strOrderBy"].ToString()) ? confs["strOrderBy"].ToString() : "";
            var r = x.R();
            if (!string.IsNullOrWhiteSpace(where))
            {
                r.A().LC().Pr("where", SqlDbType.NVarChar).Pr("strOrderBy", SqlDbType.NVarChar).Pr("reportId", SqlDbType.Int)
                     .VS("ReportCallBack").LS1().LG().B().G();
                //r.A().LC().Pr("sql", SqlDbType.NVarChar)
                //    .C("sql", query + " where " + where + "  " + order)
                //    .VS("GetFastData").LS1().LG().B().G();   
            }
            oo = r._r._d;
        }

    }
}
