using System.Data;

namespace Vxr.Bms.Report
{
    public class RptColumn
    {
        public RptPattern[] arrAutoColunm;
        public double Calvalue = 0.0;
        public int cChild = 0;
        public RptPattern cPattern = new RptPattern();
        public RptRef cRef = new RptRef();
        public int cVisit = 0;
        public string datatype = "nvarchar";
        public string formular;
        public string funcStr = "SUM";
        public int Id = -1;
        public int Index;
        public int iNotFillData;
        public bool isLeaf = false;
        public int mCalfunLevel = -1;
        public int mLevel = -1;
        public int mSize;
        public Range range = new Range();
        public string type = "isFix";
        public double value = 0.0;

        public void BuildAutoGen(string server)
        {
            if (this.type.Contains("isAutoGen") && (this.cRef.hRefTable != string.Empty))
            {
                string query = " SELECT * FROM " + this.cRef.hRefTable;
                if (this.cRef.hRefCondition != string.Empty)
                {
                    query = " SELECT * FROM " + this.cRef.hRefTable + " where Id IN " + this.cRef.hRefCondition;
                }
                DataTable dataTable = HelperInner.GetDataTable(query, server);
                if (dataTable.Rows.Count > 0)
                {
                    this.arrAutoColunm = new RptPattern[dataTable.Rows.Count];
                    for (int i = 0; i < dataTable.Rows.Count; i++)
                    {
                        this.arrAutoColunm[i].hText = (string) dataTable.Rows[i][this.cRef.hRefField];
                        this.arrAutoColunm[i].hValue = ((int) dataTable.Rows[i]["Id"]).ToString();
                        this.arrAutoColunm[i].hField = "Id";
                        this.arrAutoColunm[i].hTable = this.cRef.hRefTable;
                    }
                }
            }
        }
    }
}

