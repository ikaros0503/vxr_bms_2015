using System;

namespace Vxr.Bms.Core
{
    public class _E
    {
        public string[] T { get; set; }
        public string G(bool isDebug, Exception ex)
        {
            if (!isDebug || ex == null)
            {
                return T[0] + ":" + T[1] + ":" + T[2];
            }
            return ex.ToString();

        }
        public static _E E10001 = new _E { T = new[] { "10001", "Trip", "Action not found" } };
        public static _E E10002 = new _E { T = new[] { "10002", "Trip", "Wrong input" } };
        public static _E E10004 = new _E { T = new[] { "10004", "Trip", "Format wrong" } };
        public static _E E10005 = new _E { T = new[] { "10005", "Trip", "Push Condition field wrong" } };
        public static _E E10006 = new _E { T = new[] { "10006", "Trip", "Condition field wrong" } };
        public static _E E10007 = new _E { T = new[] { "10007", "Trip", "Data field wrong" } };
        public static _E E10008 = new _E { T = new[] { "10008", "Trip", "Field wrong" } };
        public static _E E10009 = new _E { T = new[] { "10009", "Trip", "Excute sql error" } };
        public static _E E10010 = new _E { T = new[] { "10010", "Trip", "Validate error" } };
        public static _E E10011 = new _E { T = new[] { "10011", "Trip", "Count not found" } };

    }
}
