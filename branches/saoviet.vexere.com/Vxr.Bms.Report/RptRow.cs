namespace Vxr.Bms.Report
{
    public class RptRow
    {
        public RptColumn[] cols;
        public int countCols;
        public string cssClass = "";
        public string cssClassShowName = "";
        public string cssValueClass = "";
        public string[] mFunc;
        public string[] mValue;
        public int[] posFunc = null;
        public int position = 0;
        public int posShow;
        public string showName = "Tổng cộng";
        public string type = "isData";
    }
}

