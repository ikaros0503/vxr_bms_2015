using System.Collections.Generic;

namespace Vxr.Bms.Report
{
    public class RptItem
    {
        public List<int> arrArgSumary = new List<int>();
        public List<int> arrIndexData = new List<int>();
        public string cssClass = "";
        public string cssClassShowName = "";
        public string cssValueClass = "";
        public int from = 0;
        public List<RptItem> list = new List<RptItem>();
        public int mPosData = -1;
        public string[] mValue;
        public int position = 0;
        public string strContent = "";
        public string strShowName = "Tổng cộng";
        public int to = 0;
    }
}

