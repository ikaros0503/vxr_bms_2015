using System.Collections.Generic;

namespace Vxr.Bms.Report
{
    public class RptParentDetailTable
    {
        public string strContent = "";
        public string strShowName = "Report Genaration";
        public List<RptTableItem> tables = new List<RptTableItem>();

        public void BuildAll()
        {
            this.strContent = this.strContent + "<table cellspacing=1>";
            for (int i = 0; i < this.tables.Count; i++)
            {
                string str = "";
                RptTableItem item = this.tables[i];
                if (item.isShowContent > 0)
                {
                    item.table.FillData();
                    for (int j = 0; j < item.table.mData.Count; j++)
                    {
                        double num3 = double.Parse((string) item.table.mData[j][5]);
                        double num4 = double.Parse((string) item.table.mData[j][6]);
                        double num5 = (num3 * num4) / 100.0;
                        double num6 = num3 - num5;
                        item.table.mData[j][8] = num5.ToString();
                        item.table.mData[j][9] = num6.ToString();
                    }
                    str = item.table.MakeSimpleTable();
                }
                this.strContent = this.strContent + "<tr>";
                this.strContent = this.strContent + "<td>";
                this.strContent = this.strContent + item.strContent;
                this.strShowName = this.strShowName + "</td>";
                this.strContent = this.strContent + "</tr>";
                if (item.isShowContent > 0)
                {
                    this.strContent = this.strContent + "<tr>";
                    this.strContent = this.strContent + "<td>";
                    this.strContent = this.strContent + str;
                    this.strContent = this.strContent + "</td>";
                    this.strContent = this.strContent + "</tr>";
                }
            }
            this.strContent = this.strContent + "</table>";
        }
    }
}

