namespace Vxr.Bms.Report
{
    public class RptTailItem
    {
        public int ColSpan = 1;
        public string cssClassFormName = "rptTD";
        public string cssValueClass = "rptTD";
        public string strFormName = "";
        public string Value = "";

        public RptTailItem()
        {
            this.strFormName = "";
            this.Value = "";
            this.ColSpan = 1;
            this.cssClassFormName = "rptTD";
            this.cssValueClass = "rptTD";
        }
    }
}

