using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Data;
using System.Text;
using System.Text.RegularExpressions;

namespace Vxr.Bms.Report
{
    public class RptTable
    {
        public List<RptColumn> arrListLeaf = new List<RptColumn>();
        public List<int> arrPos;
        public bool bExtexntRow;
        public bool bShowGroupBy;
        public bool bShowIndexRow;
        public bool bShowSTT;
        public string bShowSTTName;
        public int bShowSubSumary = 0;
        public int cCols;
        public string colValue;
        public int cRows;
        public int curPos;
        public string ExtexntRowCSS = "rptTDExtern";
        public string ExtexntRowValue = "";
        public string gobalFormat = "";
        public bool isBIGDATA = false;
        public string[] lstTable;
        public string mainField;
        public List<int> mArrArgSumary;
        public List<string> mArrCssForRow;
        public List<int> mArrFormatNumber;
        public int[] mArrId;
        public int[] mArrPos;
        public List<int> mArrRightStyle;
        public List<string> mArrRightStyleCss;
        public string[] mColGroup = null;
        public int mColMergForSubSumRow = 0;
        public int mColMergForSubSumRowSub = 0;
        public int mCountRows;
        public List<object[]> mData;
        public int mGobalGroupRowFisrt = 0;
        public List<RptItem> mListItem;
        public List<RptTailItem> mListTailItem;
        public int mMaxLevel;
        public int mShowSumPosition;
        public string mStrFormatNumber = ",";
        public List<string> mStrShowContent;
        public string mTypeBuild;
        public int posValeForMakeRow;
        public TreeNode<RptColumn> root;
        public RptRow Row;
        public RptRow RowSumGobal;
        public RptRow[] RowSumGroupBy;
        public string server;
        public string strConfigColumnSql;
        private StringDictionary strDictionary;
        public string strMainTable;
        public string strOrderBy;
        public string strTblSql;
        public string strWhere;
        public RptRow SubRowSumGobal;
        public RptRow SubSubRowSumGobal;

        public RptTable()
        {
            this.bShowSubSumary = 0;
            this.mShowSumPosition = 1;
            this.mTypeBuild = "isSimple";
            this.strMainTable = "tbl_Test_MakeReport";
            this.strWhere = "";
            this.strOrderBy = "";
            this.strTblSql = "";
            this.strConfigColumnSql = "";
            this.mainField = "";
            this.cRows = 0;
            this.cCols = 0;
            RptColumn column = new RptColumn
            {
                Id = -1,
                Index = -1
            };
            this.root = new TreeNode<RptColumn>(column);
            this.curPos = 0;
            this.bExtexntRow = false;
            this.bShowIndexRow = true;
            this.mMaxLevel = 1;
            this.colValue = "rValue";
            this.posValeForMakeRow = 0;
            this.bShowSTT = false;
            this.bShowSTTName = "STT";
            this.bShowGroupBy = false;
            this.mListItem = new List<RptItem>();
            this.mListTailItem = new List<RptTailItem>();
            this.mStrShowContent = new List<string>();
            this.strDictionary = new StringDictionary();
            this.mData = new List<object[]>();
            this.mArrRightStyle = new List<int>();
            this.mArrFormatNumber = new List<int>();
            this.mArrRightStyleCss = new List<string>();
            this.mArrCssForRow = new List<string>();
        }

        public void AddChildMakup(ref StringBuilder table, RptItem item, int Row, int[] arrPos, int curIndex, object[] a, bool bAddSubSub)
        {
            if (curIndex != arrPos.Length)
            {
                if (Row == item.from)
                {
                    this.AddParentMakup(ref table, item, (this.cCols - arrPos.Length) + curIndex, a, arrPos, curIndex, bAddSubSub);
                }
                if (item.list != null)
                {
                    for (int i = 0; i < item.list.Count; i++)
                    {
                        this.AddChildMakup(ref table, item.list[i], Row, arrPos, curIndex + 1, a, bAddSubSub);
                    }
                }
            }
        }

        public TreeNode<RptColumn> AddDataNode(TreeNode<RptColumn> parent, string hField, string hText, string hTable, string hRefField, string hRefText, string hRefTable, int level, bool isleaf, string type, string datatype, int index, int id)
        {
            RptColumn column = new RptColumn
            {
                cPattern = { hField = hField, hText = hText, hTable = hTable },
                cRef = { hRefField = hRefField, hRefText = hRefText, hRefTable = hRefTable },
                isLeaf = isleaf,
                mLevel = level,
                type = type,
                datatype = datatype,
                Id = id,
                Index = index,
                iNotFillData = 0
            };
            return parent.Children.Add(new TreeNode<RptColumn>(column));
        }

        public TreeNode<RptColumn> AddDataNode(TreeNode<RptColumn> parent, string hField, string hText, string hTable, string hRefField, string hRefText, string hRefTable, int level, bool isleaf, string type, string datatype, int index, int id, int iNotFillData, int compId)
        {
            RptColumn column = new RptColumn
            {
                cPattern = { hField = hField, hText = hText, hTable = hTable },
                cRef = { hRefField = hRefField, hRefText = hRefText, hRefTable = hRefTable },
                isLeaf = isleaf,
                mLevel = level,
                type = type,
                datatype = datatype,
                Id = id,
                Index = index,
                iNotFillData = iNotFillData,
                CompId = compId,
            };
            return parent.Children.Add(new TreeNode<RptColumn>(column));
        }

        public void AddGroupRow(ref StringBuilder table, RptItem item, int cCountCols)
        {
            table.Append("<tr class=\"rptContentGroupBy\">");
            table.Append("<td class=\"rptTDContentGroupBy\" colspan=");
            table.Append(this.mGobalGroupRowFisrt.ToString());
            table.Append(">");
            table.Append(item.strContent);
            table.Append("</td>");
            for (int i = 0; i < (cCountCols - this.mGobalGroupRowFisrt); i++)
            {
                table.Append("<td class=\"rptTDContentGroupBy\" >&nbsp;</td>");
            }
            table.Append("</tr>");
        }

        public string AddMakup(List<RptItem> list, int[] arrPos, int curIndex)
        {
            StringBuilder table = new StringBuilder();

            //Offset for adjust sum total row
            int conditionForLevel3 = 0;
            int conditionForLevel4 = 0;
            if (this.mMaxLevel > 2 && this.mMaxLevel <= 3)
                conditionForLevel3 = -1;
            if (this.mMaxLevel > 3)
            {
                conditionForLevel3 = -2;
                conditionForLevel4 = -1;
            }


            table.Append("");
            for (int i = 0; i < list.Count; i++)
            {
                RptItem item = list[i];
                int from = item.from;
                int to = item.to;
                for (int j = from; j < to; j++)
                {
                    int num5;
                    object[] a = this.mData[j];
                    if (j == from)
                    {
                        this.AddParentMakup(ref table, item, this.cCols, a, arrPos, curIndex, false);
                    }
                    else
                    {
                        table.Append("<tr>");
                        if (this.bShowSTT)
                        {
                            table.Append("<td class=\"");
                            table.Append(this.mArrCssForRow[j]);
                            table.Append("\">");
                            table.Append((string)a[0]);
                            table.Append("</td>");
                        }
                        else
                        {
                            table.Append("<td class=\"");
                            table.Append(this.mArrCssForRow[j]);
                            table.Append("\">");
                            table.Append("</td>");
                        }
                    }
                    if (item.list != null)
                    {
                        num5 = 0;
                        while (num5 < item.list.Count)
                        {
                            if (this.bShowSubSumary > 0)
                            {
                                if (item.list.Count > 1)
                                {
                                    this.AddChildMakup(ref table, item.list[num5], j, arrPos, curIndex + 1, a, true);
                                }
                                else
                                {
                                    this.AddChildMakup(ref table, item.list[num5], j, arrPos, curIndex + 1, a, false);
                                }
                            }
                            else
                            {
                                this.AddChildMakup(ref table, item.list[num5], j, arrPos, curIndex + 1, a, false);
                            }
                            num5++;
                        }
                    }

                    for (int k = arrPos[arrPos.Length - 1] + 1; k < this.cCols; k++)
                    {
                        if (this.mArrRightStyle[k] == 1)
                        {
                            table.Append("<td class=\"");
                            table.Append(this.mArrRightStyleCss[k]);
                            table.Append("\">");
                        }
                        else
                        {
                            table.Append("<td class=\"");
                            table.Append(this.mArrCssForRow[j]);
                            table.Append("\">");
                        }
                        if (this.isBIGDATA)
                        {
                            table.Append((string)a[k]);
                        }
                        else
                        {
                            table.Append(this.InterFormatDataNumBer((string)a[k], this.mArrFormatNumber[k]));
                        }
                        table.Append("</td>");
                    }
                    table.Append("</tr>");

                    if ((this.bShowSubSumary > 0) && (item.list.Count > 1 || (item.list.Count > 0 && item.list[0].list.Count > 1) || (item.list[0].list.Count > 0 && item.list[0].list[0].list.Count > 1)))
                    {
                        for (num5 = 0; num5 < item.list.Count; num5++)
                        {
                            RptItem item2 = item.list[num5];
                            //Create sum row for level 3
                            if (item2.list.Count > 1 || (item2.list.Count > 0 && item2.list[0].list.Count > 1))
                            {
                                for (int num6 = 0; num6 < item2.list.Count; num6++)
                                {
                                    RptItem item3 = item2.list[num6];

                                    //Create sum row for level 4
                                    if (item3.list.Count > 1)
                                    {
                                        for (int num7 = 0; num7 < item3.list.Count; num7++)
                                        {
                                            RptItem item4 = item3.list[num7];

                                            //Create sum row for level 4

                                            if ((item4.to - 1) == j)
                                            {
                                                int mColMergForSubSumRowSub = this.mColMergForSubSumRowSub + 2;

                                                if ((this.SubRowSumGobal != null) && (this.SubRowSumGobal.posFunc != null))
                                                {
                                                    table.Append("<tr>");
                                                    table.Append("<td class=\"rptTD\"></td>");
                                                    for (int m = 2; m < this.cCols; m++)
                                                    {
                                                        if (this.SubRowSumGobal.posFunc[m] > 0)
                                                        {
                                                            string input = item4.mValue[m];
                                                            if (input != null)
                                                            {
                                                                if (input.Contains("<"))
                                                                {
                                                                    string[] strArray = Regex.Split(input, "<br/>");
                                                                    int index = 0;
                                                                    while (index < strArray.Length)
                                                                    {
                                                                        strArray[index] = this.InterFormatDataNumBer(strArray[index], this.mArrFormatNumber[m]);
                                                                        index++;
                                                                    }
                                                                    input = "";
                                                                    for (index = 0; index < strArray.Length; index++)
                                                                    {
                                                                        input = input + strArray[index];
                                                                        if (index < (strArray.Length - 1))
                                                                        {
                                                                            input = input + "<br/>";
                                                                        }
                                                                    }
                                                                }
                                                                else
                                                                {
                                                                    input = this.InterFormatDataNumBer(input, this.mArrFormatNumber[m]);
                                                                }
                                                            }
                                                            table.Append("<td class=\"" + "warning-sub-total text-right" + "\">" + input + "</td>");
                                                        }
                                                        else if (this.SubRowSumGobal.position == m)
                                                        {
                                                            if (mColMergForSubSumRowSub > 0)
                                                            {
                                                                mColMergForSubSumRowSub--;
                                                                table.Append(string.Concat(new object[] { "<td class=\"", "warning-sub-total text-right", "\" colspan=", this.mColMergForSubSumRowSub, ">", this.SubRowSumGobal.showName, "</td>" }));
                                                            }
                                                            else
                                                            {
                                                                table.Append("<td class=\"" + "warning-sub-total text-right" + "\" >" + this.SubRowSumGobal.showName + "</td>");
                                                            }
                                                        }
                                                        else if (mColMergForSubSumRowSub > 0)
                                                        {
                                                            mColMergForSubSumRowSub--;
                                                        }
                                                        else
                                                        {
                                                            table.Append("<td class=\"" + "warning-sub-total text-right" + "\">&nbsp;</td>");
                                                        }
                                                    }
                                                    table.Append("</tr>");
                                                }
                                                break;
                                            }
                                        }
                                    }
                                    //Create sum row for level 3
                                    if ((item3.to - 1) == j)
                                    {
                                        int mColMergForSubSumRowSub = this.mColMergForSubSumRowSub + 1;

                                        if ((this.SubRowSumGobal != null) && (this.SubRowSumGobal.posFunc != null))
                                        {
                                            table.Append("<tr>");
                                            table.Append("<td class=\"rptTD\"></td>");
                                            for (int m = 2; m < this.cCols; m++)
                                            {
                                                if (this.SubRowSumGobal.posFunc[m] > 0)
                                                {
                                                    string input = item3.mValue[m];
                                                    if (input != null)
                                                    {
                                                        if (input.Contains("<"))
                                                        {
                                                            string[] strArray = Regex.Split(input, "<br/>");
                                                            int index = 0;
                                                            while (index < strArray.Length)
                                                            {
                                                                strArray[index] = this.InterFormatDataNumBer(strArray[index], this.mArrFormatNumber[m]);
                                                                index++;
                                                            }
                                                            input = "";
                                                            for (index = 0; index < strArray.Length; index++)
                                                            {
                                                                input = input + strArray[index];
                                                                if (index < (strArray.Length - 1))
                                                                {
                                                                    input = input + "<br/>";
                                                                }
                                                            }
                                                        }
                                                        else
                                                        {
                                                            input = this.InterFormatDataNumBer(input, this.mArrFormatNumber[m]);
                                                        }
                                                    }
                                                    table.Append("<td class=\"" + "success-sub-sub-total text-right" + "\">" + input + "</td>");
                                                }
                                                else if (this.SubRowSumGobal.position == m)
                                                {
                                                    if (mColMergForSubSumRowSub > 0)
                                                    {
                                                        mColMergForSubSumRowSub--;
                                                        table.Append(string.Concat(new object[] { "<td class=\"", "success-sub-sub-total text-right", "\" colspan=", this.mColMergForSubSumRowSub - conditionForLevel4, ">", this.SubRowSumGobal.showName, "</td>" }));
                                                    }
                                                    else
                                                    {
                                                        table.Append("<td class=\"" + "success-sub-sub-total text-right" + "\" >" + this.SubRowSumGobal.showName + "</td>");
                                                    }
                                                }
                                                else if (mColMergForSubSumRowSub > conditionForLevel4)
                                                {
                                                    mColMergForSubSumRowSub--;
                                                }
                                                else
                                                {
                                                    table.Append("<td class=\"" + "success-sub-sub-total text-right" + "\">&nbsp;</td>");
                                                }
                                            }
                                            table.Append("</tr>");
                                        }
                                        break;
                                    }
                                }
                            }
                            //Create Sub Row for level 2
                            if ((item2.to - 1) == j)
                            {
                                int mColMergForSubSumRowSub = this.mColMergForSubSumRowSub;
                                if ((this.SubRowSumGobal != null) && (this.SubRowSumGobal.posFunc != null))
                                {
                                    table.Append("<tr>");
                                    table.Append("<td class=\"rptTD\"></td>");
                                    for (int m = 2; m < this.cCols; m++)
                                    {
                                        if (this.SubRowSumGobal.posFunc[m] > 0)
                                        {
                                            string input = item2.mValue[m];
                                            if (input != null)
                                            {
                                                if (input.Contains("<"))
                                                {
                                                    string[] strArray = Regex.Split(input, "<br/>");
                                                    int index = 0;
                                                    while (index < strArray.Length)
                                                    {
                                                        strArray[index] = this.InterFormatDataNumBer(strArray[index], this.mArrFormatNumber[m]);
                                                        index++;
                                                    }
                                                    input = "";
                                                    for (index = 0; index < strArray.Length; index++)
                                                    {
                                                        input = input + strArray[index];
                                                        if (index < (strArray.Length - 1))
                                                        {
                                                            input = input + "<br/>";
                                                        }
                                                    }
                                                }
                                                else
                                                {
                                                    input = this.InterFormatDataNumBer(input, this.mArrFormatNumber[m]);
                                                }
                                            }
                                            table.Append("<td class=\"" + this.SubRowSumGobal.cssClass + "\">" + input + "</td>");
                                        }
                                        else if (this.SubRowSumGobal.position == m)
                                        {
                                            if (mColMergForSubSumRowSub > conditionForLevel3 + 1)
                                            {
                                                mColMergForSubSumRowSub--;
                                                table.Append(string.Concat(new object[] { "<td class=\"", this.SubRowSumGobal.cssClassShowName, "\" colspan=", this.mColMergForSubSumRowSub - conditionForLevel3, ">", this.SubRowSumGobal.showName, "</td>" }));
                                            }
                                            else
                                            {
                                                table.Append("<td class=\"" + this.SubRowSumGobal.cssClassShowName + "\" >" + this.SubRowSumGobal.showName + "</td>");
                                            }
                                        }
                                        else if (mColMergForSubSumRowSub > conditionForLevel3)
                                        {
                                            mColMergForSubSumRowSub--;
                                        }
                                        else
                                        {
                                            table.Append("<td class=\"" + this.SubRowSumGobal.cssClassShowName + "\">&nbsp;</td>");
                                        }
                                    }
                                    table.Append("</tr>");
                                }
                                break;
                            }
                        }
                    }
                }
                int mColMergForSubSumRow = this.mColMergForSubSumRow;
                table.Append(this.PrintSumaryRow(item));
            }
            return table.ToString();
        }

        public void AddParentMakup(ref StringBuilder table, RptItem item, int cCountCols, object[] a, int[] arrPos, int curIndex, bool bAddSubSub)
        {
            if ((curIndex == 0) && (item.strContent != string.Empty))
            {
                this.AddGroupRow(ref table, item, cCountCols);
            }
            if (curIndex == 0)
            {
                table.Append("<tr>");
                if (this.bShowSTT)
                {
                    table.Append("<td class=\"rptTD\">");
                    table.Append((string)a[0]);
                    table.Append("</td>");
                }
            }
            string str = "<td class=\"rptTD\" rowspan=" + item.arrIndexData.Count + ">";
            if (bAddSubSub)
            {
                //Truong hop 1 : n : n : n (n >= 1)

                int offset = item.arrIndexData.Count;
                if (item.list.Count >= 1)
                    if (item.list[0].list.Count>=1)
                        if (item.list[0].list[0].list.Count >=1)
                            offset = item.list[0].list[0].arrIndexData.Count;
                        else
                            offset = item.list[0].arrIndexData.Count;
                    else
                        offset = item.arrIndexData.Count;
                    str = "<td class=\"rptTD\" rowspan=" + offset.ToString() + ">";
            }

            //Truong hop khac
            //Kiem tra tat ca cac cap nho hon
            if (((this.bShowSubSumary > 0) && (item.list.Count != 0)) && (item.list.Count > 1 || 
                ((item.list[0].list.Count != 0) && (item.list[0].list.Count > 1 || 
                    ((item.list[0].list[0].list.Count != 0) && item.list[0].list[0].list.Count > 1)))))
            {
                int offset = 0;
                for (int k = 0; k < item.list.Count; k++)
                {
                    if (item.list[k].list.Count != 0 && (item.list[k].list.Count > 1 || 
                        (item.list[k].list[0].list.Count != 0 && item.list[k].list[0].list.Count > 1)))
                    {
                        for (int z = 0; z < item.list[k].list.Count; z++)
                            if (item.list[k].list[z].list.Count != 0 && (item.list[k].list[z].list.Count > 1))
                                offset += item.list[k].list[z].list.Count;
                            offset += item.list[k].list.Count;
                    }
                }
                str = "<td class=\"rptTD \" rowspan=" + ((item.arrIndexData.Count + item.list.Count + offset)).ToString() + ">";
            }
            table.Append(str);
            string str2 = this.InterFormatDataNumBer((string)a[arrPos[curIndex]], this.mArrFormatNumber[arrPos[curIndex]]);
            table.Append(str2);
            table.Append("</td>");
        }

        public void BuidlASimpleByDB(RptTable table, string tblName, string tblGobal, string reportId)
        {
            string query;
            query = "SELECT * FROM " + tblGobal + " WHERE     ReportId = " + reportId + " and isShow='isShow' ORDER BY OrderCol ";
            if ((this.strConfigColumnSql != string.Empty) && (this.strConfigColumnSql.Length > 3))
            {
                query = this.strConfigColumnSql;
            }
            DataTable dataTable = HelperInner.GetDataTable(query, this.server);
            int num = 0;
            if (dataTable.Rows.Count > 0)
            {
                int index = 0;
                TreeNode<RptColumn>[] nodeArray = new TreeNode<RptColumn>[dataTable.Rows.Count + 2];
                if (table.bShowSTT)
                {
                    nodeArray[0] = table.AddDataNode(table.root, "", this.bShowSTTName, "", "", this.bShowSTTName, "", 0, true, "isData", "int", -1, -1, 1, 0);
                    index = 1;
                }
                while (num < dataTable.Rows.Count)
                {
                    string hField = (dataTable.Rows[num]["ColName"] == DBNull.Value) ? "" : ((string)dataTable.Rows[num]["ColName"]);
                    string hText = (dataTable.Rows[num]["FormName"] == DBNull.Value) ? "" : ((string)dataTable.Rows[num]["FormName"]);
                    string datatype = (dataTable.Rows[num]["ColType"] == DBNull.Value) ? "" : ((string)dataTable.Rows[num]["ColType"]);
                    string hTable = (dataTable.Rows[num]["TableName"] == DBNull.Value) ? "" : ((string)dataTable.Rows[num]["TableName"]);
                    string str6 = (dataTable.Rows[num]["isShow"] == DBNull.Value) ? "" : ((string)dataTable.Rows[num]["isShow"]);
                    string str7 = (dataTable.Rows[num]["Parent"] == DBNull.Value) ? "" : ((string)dataTable.Rows[num]["Parent"]);
                    string str8 = (dataTable.Rows[num]["ChildNode"] == DBNull.Value) ? "" : ((string)dataTable.Rows[num]["ChildNode"]);
                    int iNotFillData = (dataTable.Rows[num]["iNotFillData"] == DBNull.Value) ? 0 : ((int)dataTable.Rows[num]["iNotFillData"]);
                    int compId = (dataTable.Rows[num]["CompId"] == DBNull.Value) ? 0 : ((int)dataTable.Rows[num]["CompId"]);

                    if (str7.ToUpper().Contains("ISPARENT"))
                    {
                        if (str8.ToUpper().Contains("HASCHILD"))
                        {
                            nodeArray[index] = table.AddDataNode(table.root, hField, hText, hTable, hField, hText, hTable, 0, false, "isData", datatype, -1, -1, iNotFillData, compId);
                        }
                        else
                        {
                            nodeArray[index] = table.AddDataNode(table.root, hField, hText, hTable, hField, hText, hTable, 0, true, "isData", datatype, -1, -1, iNotFillData, compId);
                        }
                    }
                    else
                    {
                        int level = 1;
                        string str9 = "";
                        int num5 = 0;
                        string[] strArray = str7.Split(new char[] { ':' });
                        if (strArray.Length > 0)
                        {
                            str9 = strArray[0];
                            if (str9.Substring(1).Length > 0)
                            {
                                num5 = int.Parse(str9.Substring(1));
                                level = int.Parse(strArray[1]);
                            }
                        }
                        if (str8.ToUpper().Contains("HASCHILD"))
                        {
                            nodeArray[index] = table.AddDataNode(nodeArray[num5], hField, hText, hTable, hField, hText, hTable, level, false, "isData", datatype, -1, -1, iNotFillData, compId);
                        }
                        else
                        {
                            nodeArray[index] = table.AddDataNode(nodeArray[num5], hField, hText, hTable, hField, hText, hTable, level, true, "isData", datatype, -1, -1, iNotFillData, compId);
                        }
                    }
                    index++;
                    num++;
                }
            }
        }

        public void Build(TreeNode<RptColumn> node, int curLevel, int Level, ref StringBuilder tr)
        {
            if (node != null)
            {
                if ((curLevel == (Level - 1)) && (node.Value.mLevel == curLevel))
                {
                    tr.Append("<td class=\"rptTDHeader\" align=center>");
                    tr.Append(node.Value.cRef.hRefText);
                    tr.Append("</td>");
                }
                else if (node.Value.mLevel == curLevel)
                {
                    int mLevel;
                    int num2;
                    if (curLevel == 0)
                    {
                        if (node.Value.isLeaf)
                        {
                            tr.Append("<td class=\"rptTDHeader\" align=center rowspan=");
                            tr.Append(Level);
                            tr.Append(">");
                            if (node.Value.type.Contains("isAutoGen"))
                            {
                                tr.Append(node.Value.cRef.hRefText);
                            }
                            else if (node.Value.type.Contains("isData"))
                            {
                                tr.Append(node.Value.cPattern.hText);
                            }
                            else if (node.Value.type.Contains("isCalculate"))
                            {
                                tr.Append(node.Value.cPattern.hText);
                            }
                            else if (node.Value.type.Contains("isFomular"))
                            {
                                tr.Append(node.Value.cPattern.hText);
                            }
                            tr.Append("</td>");
                        }
                        else if (node.Value.type.Contains("isAutoGen"))
                        {
                            tr.Append("<td class=\"rptTDHeader\" align=center colspan=");
                            tr.Append(node.Value.cChild);
                            tr.Append(">");
                            tr.Append(node.Value.cRef.hRefText);
                            tr.Append("</td>");
                        }
                        else if (node.Children.Count > 0)
                        {
                            mLevel = node.Children[0].Value.mLevel;
                            if (node.Value.mLevel == (mLevel - 1))
                            {
                                tr.Append("<td class=\"rptTDHeader\" align=center colspan=");
                                tr.Append(node.Value.cChild);
                                tr.Append(">");
                                tr.Append(node.Value.cRef.hRefText);
                                tr.Append("</td>");
                            }
                            else
                            {
                                num2 = mLevel - node.Value.mLevel;
                                tr.Append("<td class=\"rptTDHeader\" align=center colspan=");
                                tr.Append(node.Value.cChild);
                                tr.Append(" rowspan=");
                                tr.Append(num2);
                                tr.Append(">");
                                tr.Append(node.Value.cRef.hRefText);
                                tr.Append("</td>");
                            }
                        }
                    }
                    else if (node.Value.type.Contains("isAutoGen"))
                    {
                        tr.Append("<td class=\"rptTDHeader\" align=center colspan=");
                        tr.Append(node.Value.cChild);
                        tr.Append(">");
                        tr.Append(node.Value.cRef.hRefText);
                        tr.Append("</td>");
                    }
                    else if (node.Value.isLeaf)
                    {
                        num2 = Level - node.Value.mLevel;
                        tr.Append("<td class=\"rptTDHeader\" align=center colspan=");
                        tr.Append(node.Value.cChild);
                        tr.Append(" rowspan=");
                        tr.Append(num2);
                        tr.Append(">");
                        tr.Append(node.Value.cRef.hRefText);
                        tr.Append("</td>");
                    }
                    else if (node.Children.Count > 0)
                    {
                        mLevel = node.Children[0].Value.mLevel;
                        if (node.Value.mLevel == (mLevel - 1))
                        {
                            tr.Append("<td class=\"rptTDHeader\" align=center colspan=");
                            tr.Append(node.Value.cChild);
                            tr.Append(">");
                            tr.Append(node.Value.cRef.hRefText);
                            tr.Append("</td>");
                        }
                        else
                        {
                            num2 = mLevel - node.Value.mLevel;
                            tr.Append("<td class=\"rptTDHeader\" align=center colspan=");
                            tr.Append(node.Value.cChild);
                            tr.Append(" rowspan=");
                            tr.Append(num2);
                            tr.Append(">");
                            tr.Append(node.Value.cRef.hRefText);
                            tr.Append("</td>");
                        }
                    }
                }
                else
                {
                    for (int i = 0; i < node.Children.Count; i++)
                    {
                        this.Build(node.Children[i], curLevel, Level, ref tr);
                    }
                }
            }
        }

        public string ChangeMinute(int m)
        {
            switch (m)
            {
                case 0:
                    return "00";

                case 1:
                    return "01";

                case 2:
                    return "02";

                case 3:
                    return "03";

                case 4:
                    return "04";

                case 5:
                    return "05";

                case 6:
                    return "06";

                case 7:
                    return "07";

                case 8:
                    return "08";

                case 9:
                    return "09";
            }
            return m.ToString();
        }

        public string ChangeMonth(int m)
        {
            switch (m)
            {
                case 1:
                    return "Jan";

                case 2:
                    return "Feb";

                case 3:
                    return "Mar";

                case 4:
                    return "Apr";

                case 5:
                    return "May";

                case 6:
                    return "Jun";

                case 7:
                    return "Jul";

                case 8:
                    return "Aug";

                case 9:
                    return "Sep";

                case 10:
                    return "Oct";

                case 11:
                    return "Nov";

                case 12:
                    return "Dec";
            }
            return "";
        }

        private bool CheckOrgLicese()
        {
            this.FillDataInner();
            return true;
        }

        public int CountChild(TreeNode<RptColumn> node)
        {
            if (node != null)
            {
                if (node.Children.Count > 0)
                {
                    if (node.Children[0].Value.isLeaf)
                    {
                        node.Value.cChild = node.Children.Count;
                        return node.Value.cChild;
                    }
                    for (int i = 0; i < node.Children.Count; i++)
                    {
                        RptColumn local1 = node.Value;
                        local1.cChild += this.CountChild(node.Children[i]);
                    }
                }
                else if (node.Value.isLeaf)
                {
                    node.Value.cChild = 1;
                }
            }
            return 0;
        }

        public void FillData()
        {
            this.CheckOrgLicese();
        }

        private void FillDataInner()
        {
            DataTable dataTable = HelperInner.GetDataTable(this.PrepairFillData(), this.server);
            int index = 0;
            if (dataTable.Rows.Count > 0)
            {
                RptColumn column;
                TreeNodeList<RptColumn> children = this.root.Children;
                bool flag = false;
                if (this.mTypeBuild.ToUpper().Contains("ISKEY"))
                {
                    flag = true;
                    this.mArrId = new int[dataTable.Rows.Count];
                }
                int num2 = 0;
                while (num2 < this.arrListLeaf.Count)
                {
                    column = this.arrListLeaf[num2];
                    string hField = column.cPattern.hField;
                    if ((column.iNotFillData == 0) && !dataTable.Columns.Contains(hField))
                    {
                        column.iNotFillData = 1;
                    }
                    num2++;
                }
                if (this.mTypeBuild.ToUpper().Contains("ISSIMPLE"))
                {
                    while (index < dataTable.Rows.Count)
                    {
                        if (flag)
                        {
                            this.mArrId[index] = (int)dataTable.Rows[index]["Id"];
                        }
                        string[] item = new string[this.cCols];
                        for (num2 = 0; num2 < this.arrListLeaf.Count; num2++)
                        {
                            column = this.arrListLeaf[num2];
                            if (this.bShowSTT)
                            {
                                item[0] = (this.mCountRows + 1).ToString();
                            }
                            if (column.iNotFillData == 1)
                            {
                                item[num2] = "0";
                            }
                            else
                            {
                                item[num2] = this.GetStringValue(column.datatype, dataTable.Rows[index][column.cPattern.hField]);
                            }
                        }
                        index++;
                        this.mCountRows++;
                        this.mData.Add(item);
                    }
                }
            }
            if (this.bShowGroupBy)
            {
                int from = 0;
                int count = this.mData.Count;
                this.FindGroupBy(this.mListItem, this.mArrPos, 0, ref from, ref count);
            }
            for (int i = 0; i < this.mData.Count; i++)
            {
                this.mArrCssForRow.Add("rptTD");
            }
            for (int j = 0; j < this.cCols; j++)
            {
                this.mArrFormatNumber.Add(0);
            }
            this.FormatNumber(this.root, this.mArrFormatNumber);
        }

        public void FindGroupBy(List<RptItem> list, int[] arrPos, int curIndex, ref int from, ref int to)
        {
            if (curIndex < arrPos.Length)
            {
                int num = from;
                while (num < to)
                {
                    int num2 = arrPos[curIndex];
                    RptItem item = new RptItem
                    {
                        mValue = new string[this.cCols],
                        mPosData = num2,
                        strContent = this.mStrShowContent[0],
                        cssClass = "rptTD",
                        cssClassShowName = "rptTD",
                        cssValueClass = "rptTD"
                    };
                    for (int i = 0; i < this.cCols; i++)
                    {
                        item.arrArgSumary.Add(this.mArrArgSumary[i]);
                    }
                    bool flag = false;
                    int num4 = num;
                    int num5 = num;
                    while (!flag)
                    {
                        string str = (string)this.mData[num][item.mPosData];
                        item.arrIndexData.Add(num);
                        num++;
                        num5++;
                        if (num < to)
                        {
                            if (str != ((string)this.mData[num][item.mPosData]))
                            {
                                flag = true;
                            }
                        }
                        else
                        {
                            flag = true;
                        }
                        if (flag)
                        {
                            item.from = num4;
                            item.to = num5;
                            list.Add(item);
                        }
                    }
                    item.from = num4;
                    item.to = num5;
                    if (curIndex < arrPos.Length)
                    {
                        item.list = new List<RptItem>();
                        this.FindGroupBy(item.list, arrPos, curIndex + 1, ref num4, ref num5);
                    }
                }
            }
        }

        public void FormatNumber(TreeNode<RptColumn> node, List<int> arr)
        {
            if (node != null)
            {
                if (node.Value.isLeaf)
                {
                    if (node.Value.datatype == "float")
                    {
                        arr[node.Value.Index] = 1;
                    }
                    else if (node.Value.datatype == "long")
                    {
                        arr[node.Value.Index] = 1;
                    }
                    else if (node.Value.datatype == "real")
                    {
                        arr[node.Value.Index] = 1;
                    }
                    else if (node.Value.datatype == "int")
                    {
                        arr[node.Value.Index] = 1;
                    }
                    else if (node.Value.datatype == "double")
                    {
                        arr[node.Value.Index] = 1;
                    }
                }
                if (node.Children.Count > 0)
                {
                    for (int i = 0; i < node.Children.Count; i++)
                    {
                        this.FormatNumber(node.Children[i], arr);
                    }
                }
            }
        }

        public void GetSizeAndAddLeaf(TreeNode<RptColumn> node)
        {
            if (node != null)
            {
                if (node.Value.isLeaf)
                {
                    node.Value.Index = this.cCols;
                    this.arrListLeaf.Add(node.Value);
                    this.cCols++;
                }
                else
                {
                    for (int i = 0; i < node.Children.Count; i++)
                    {
                        this.GetSizeAndAddLeaf(node.Children[i]);
                    }
                }
            }
        }

        public string GetStringValue(string datatype, object o)
        {
            object[] objArray;
            DateTime time;
            string str = "";
            if (o == null)
            {
                return str;
            }
            if (o == DBNull.Value)
            {
                return str;
            }
            if (datatype.Contains("date"))
            {
                objArray = new object[5];
                time = (DateTime)o;
                objArray[0] = time.Day.ToString();
                objArray[1] = "/";
                time = (DateTime)o;
                objArray[2] = time.Month;
                objArray[3] = "/";
                time = (DateTime)o;
                objArray[4] = time.Year;
                str = string.Concat(objArray);
                if (this.gobalFormat == "ENGLISH")
                {
                    objArray = new object[5];
                    time = (DateTime)o;
                    objArray[0] = time.Day;
                    objArray[1] = "-";
                    time = (DateTime)o;
                    objArray[2] = this.ChangeMonth(time.Month);
                    objArray[3] = "-";
                    time = (DateTime)o;
                    objArray[4] = time.Year;
                    str = string.Concat(objArray);
                }
                return str;
            }
            if (datatype.Contains("spectime"))
            {
                objArray = new object[9];
                time = (DateTime)o;
                objArray[0] = time.Day.ToString();
                objArray[1] = "/";
                time = (DateTime)o;
                objArray[2] = time.Month;
                objArray[3] = "/";
                time = (DateTime)o;
                objArray[4] = time.Year;
                objArray[5] = " ";
                time = (DateTime)o;
                objArray[6] = time.Hour;
                objArray[7] = ":";
                time = (DateTime)o;
                objArray[8] = this.ChangeMinute(time.Minute);
                str = string.Concat(objArray);
                if (this.gobalFormat == "ENGLISH")
                {
                    objArray = new object[9];
                    time = (DateTime)o;
                    objArray[0] = time.Day;
                    objArray[1] = "-";
                    time = (DateTime)o;
                    objArray[2] = this.ChangeMonth(time.Month);
                    objArray[3] = "-";
                    time = (DateTime)o;
                    objArray[4] = time.Year;
                    objArray[5] = " ";
                    time = (DateTime)o;
                    objArray[6] = time.Hour;
                    objArray[7] = ":";
                    time = (DateTime)o;
                    objArray[8] = this.ChangeMinute(time.Minute);
                    str = string.Concat(objArray);
                }
                return str;
            }
            return o.ToString();
        }

        public void GoStepDepth(TreeNode<RptColumn> node, object[] row, int[] p, string value)
        {
            for (int i = 0; i < node.Children.Count; i++)
            {
                if (node.Children[i].Value.Id == p[node.Children[i].Value.mLevel])
                {
                    if (node.Children[i].Value.isLeaf)
                    {
                        row[node.Children[i].Value.Index] = value;
                        node.Children[i].Value.value = double.Parse(value);
                    }
                    else
                    {
                        this.GoStepDepth(node.Children[i], row, p, value);
                    }
                }
            }
        }

        public void InitTable()
        {
            this.cCols = 0;
            this.arrListLeaf = new List<RptColumn>();
            this.GetSizeAndAddLeaf(this.root);
        }

        public string InterFormatColGroup()
        {
            StringBuilder builder = new StringBuilder();
            builder.Append("<colgroup> ");
            for (int i = 0; i < this.cCols; i++)
            {
                builder.Append("<col ");
                builder.Append(this.mColGroup[i]);
                builder.Append(" />");
            }
            builder.Append("</colgroup> ");
            return builder.ToString();
        }

        public string InterFormatDataNumBer(string value, int bFormat)
        {
            string str = value;
            if (value == null)
            {
                return "0";
            }
            if (value.Trim().Length >= 1)
            {
                if (value.IndexOf('.') >= 0)
                {
                    return value;
                }
                bool flag = false;
                if (str.Contains("$"))
                {
                    str = str.Replace("$", "").Trim();
                    flag = true;
                    if (str.Length < 1)
                    {
                        return value;
                    }
                }
                if (bFormat > 0)
                {
                    bool flag2 = false;
                    if (str[0] == '-')
                    {
                        str = str.Substring(1, value.Length - 1);
                        flag2 = true;
                    }
                    if ((str.Trim().Length > 3) && (bFormat > 0))
                    {
                        for (int i = str.Length - 3; i > 0; i -= 3)
                        {
                            str = str.Insert(i, this.mStrFormatNumber);
                        }
                    }
                    if (flag2)
                    {
                        str = '-' + str;
                    }
                }
                if (flag)
                {
                    str = "$ " + str;
                }
            }
            return str;
        }

        public string MakeExpertHeader(TreeNode<RptColumn> node, int Level)
        {
            StringBuilder tr = new StringBuilder();
            for (int i = 0; i < Level; i++)
            {
                tr.Append("<tr>");
                this.Build(node, i, Level, ref tr);
                tr.Append("</tr>");
            }
            return tr.ToString();
        }

        public void MakeGobalRowForTesting()
        {
            int num;
            this.RowSumGobal = new RptRow();
            this.RowSumGobal.posFunc = new int[this.cCols];
            this.RowSumGobal.mFunc = new string[this.cCols];
            this.RowSumGobal.mValue = new string[this.cCols];
            this.RowSumGobal.cssClass = "rptTD";
            this.RowSumGobal.cssClassShowName = "rptTD";
            for (num = 0; num < this.cCols; num++)
            {
                this.RowSumGobal.posFunc[num] = this.mArrArgSumary[num];
                this.RowSumGobal.mFunc[num] = "SUM";
                this.RowSumGobal.mValue[num] = "";
            }
            this.mColGroup = new string[this.cCols];
            this.SubRowSumGobal = new RptRow();
            this.SubRowSumGobal.posFunc = new int[this.cCols];
            this.SubRowSumGobal.mFunc = new string[this.cCols];
            this.SubRowSumGobal.mValue = new string[this.cCols];
            this.SubRowSumGobal.cssClass = "rptTD";
            this.SubRowSumGobal.cssClassShowName = "rptTD";
            for (num = 0; num < this.cCols; num++)
            {
                this.SubRowSumGobal.posFunc[num] = this.mArrArgSumary[num];
                this.SubRowSumGobal.mFunc[num] = "SUM";
                this.SubRowSumGobal.mValue[num] = "";
                this.mColGroup[num] = "";
            }
            for (int i = 0; i < this.mData.Count; i++)
            {
                this.mArrCssForRow.Add("rptTD");
            }
            for (int j = 0; j < this.cCols; j++)
            {
                this.mArrFormatNumber.Add(0);
                this.mArrRightStyle.Add(0);
                this.mArrRightStyleCss.Add("rptTD");
            }
            this.mGobalGroupRowFisrt = this.cCols;
        }

        public string MakeSimpleTable()
        {
            int num;
            string str;
            string[] strArray;
            int num3;
            StringBuilder builder = new StringBuilder();
            builder.Append("<table class=\"rptTable\" cellspacing=0 border=1>");
            builder.Append(this.InterFormatColGroup());
            builder.Append(this.MakeExpertHeader(this.root, this.mMaxLevel));
            if (this.bShowIndexRow)
            {
                builder.Append("<tr>");
                for (num = 0; num < this.cCols; num++)
                {
                    builder.Append("<td class=\"rptTD\">(" + num + ")</td>");
                }
                builder.Append("</tr>");
            }
            if (this.bExtexntRow)
            {
                builder.Append("<tr>");
                builder.Append(string.Concat(new object[] { "<td class=\"", this.ExtexntRowCSS, "\" colspan=", this.cCols, ">", this.ExtexntRowValue, "</td>" }));
                builder.Append("</tr>");
            }
            int mColMergForSubSumRow = this.mColMergForSubSumRow;
            if ((this.mShowSumPosition == 0) && ((this.RowSumGobal != null) && (this.RowSumGobal.posFunc != null)))
            {
                builder.Append("<tr>");
                for (num = 0; num < this.cCols; num++)
                {
                    if (this.RowSumGobal.posFunc[num] > 0)
                    {
                        str = this.RowSumGobal.mValue[num];
                        if (str.Contains("<"))
                        {
                            strArray = Regex.Split(str, "<br/>");
                            num3 = 0;
                            while (num3 < strArray.Length)
                            {
                                strArray[num3] = this.InterFormatDataNumBer(strArray[num3], this.mArrFormatNumber[num]);
                                num3++;
                            }
                            str = "";
                            num3 = 0;
                            while (num3 < strArray.Length)
                            {
                                str = str + strArray[num3];
                                if (num3 < (strArray.Length - 1))
                                {
                                    str = str + "<br/>";
                                }
                                num3++;
                            }
                        }
                        else
                        {
                            str = this.InterFormatDataNumBer(str, this.mArrFormatNumber[num]);
                        }
                        builder.Append("<td class=\"" + this.RowSumGobal.cssClass + "\">" + str + "</td>");
                    }
                    else if (this.RowSumGobal.position == num)
                    {
                        if (mColMergForSubSumRow > 0)
                        {
                            mColMergForSubSumRow--;
                            builder.Append(string.Concat(new object[] { "<td class=\"", this.RowSumGobal.cssClassShowName, "\" colspan=", this.mColMergForSubSumRow, ">", this.RowSumGobal.showName, "</td>" }));
                        }
                        else
                        {
                            builder.Append("<td class=\"" + this.RowSumGobal.cssClassShowName + "\" >" + this.RowSumGobal.showName + "</td>");
                        }
                    }
                    else if (mColMergForSubSumRow > 0)
                    {
                        mColMergForSubSumRow--;
                    }
                    else
                    {
                        builder.Append("<td class=\"" + this.RowSumGobal.cssClassShowName + "\">&nbsp;</td>");
                    }
                }
                builder.Append("</tr>");
            }
            if (this.bShowGroupBy)
            {
                builder.Append(this.AddMakup(this.mListItem, this.mArrPos, 0));
            }
            else
            {
                for (num = 0; num < this.mData.Count; num++)
                {
                    builder.Append("<tr>");
                    for (int j = 0; j < this.cCols; j++)
                    {
                        string str2 = "<td class=\"" + this.mArrCssForRow[num] + "\">";
                        if ((this.mArrRightStyle.Count > 0) && (this.mArrRightStyle[j] == 1))
                        {
                            str2 = "<td class=\"" + this.mArrRightStyleCss[j] + "\">";
                        }
                        builder.Append(str2);
                        if (this.isBIGDATA)
                        {
                            builder.Append((string)this.mData[num][j]);
                        }
                        else
                        {
                            builder.Append(this.InterFormatDataNumBer((string)this.mData[num][j], this.mArrFormatNumber[j]));
                        }
                        builder.Append("</td>");
                    }
                    builder.Append("</tr>");
                }
            }
            if ((this.mShowSumPosition == 1) && ((this.RowSumGobal != null) && (this.RowSumGobal.posFunc != null)))
            {
                builder.Append("<tr>");
                for (num = 0; num < this.cCols; num++)
                {
                    if (this.RowSumGobal.posFunc[num] > 0)
                    {
                        str = this.RowSumGobal.mValue[num];
                        if (str.Contains("<"))
                        {
                            strArray = Regex.Split(str, "<br/>");
                            num3 = 0;
                            while (num3 < strArray.Length)
                            {
                                strArray[num3] = this.InterFormatDataNumBer(strArray[num3], this.mArrFormatNumber[num]);
                                num3++;
                            }
                            str = "";
                            for (num3 = 0; num3 < strArray.Length; num3++)
                            {
                                str = str + strArray[num3];
                                if (num3 < (strArray.Length - 1))
                                {
                                    str = str + "<br/>";
                                }
                            }
                        }
                        else
                        {
                            str = this.InterFormatDataNumBer(str, this.mArrFormatNumber[num]);
                        }
                        builder.Append("<td class=\"" + this.RowSumGobal.cssClass + "\">" + str + "</td>");
                    }
                    else if (this.RowSumGobal.position == num)
                    {
                        if (mColMergForSubSumRow > 0)
                        {
                            mColMergForSubSumRow--;
                            builder.Append(string.Concat(new object[] { "<td class=\"", this.RowSumGobal.cssClassShowName, "\" colspan=", this.mColMergForSubSumRow, ">", this.RowSumGobal.showName, "</td>" }));
                        }
                        else
                        {
                            builder.Append("<td class=\"" + this.RowSumGobal.cssClassShowName + "\" >" + this.RowSumGobal.showName + "</td>");
                        }
                    }
                    else if (mColMergForSubSumRow > 0)
                    {
                        mColMergForSubSumRow--;
                    }
                    else
                    {
                        builder.Append("<td class=\"" + this.RowSumGobal.cssClassShowName + "\">&nbsp;</td>");
                    }
                }
                builder.Append("</tr>");
            }
            for (int i = 0; i < this.mListTailItem.Count; i++)
            {
                RptTailItem item = this.mListTailItem[i];
                builder.Append("<tr>");
                if (item.ColSpan == this.cCols)
                {
                    builder.Append("<td class=\"" + item.cssClassFormName + "\" colspan=" + item.ColSpan.ToString() + ">" + item.strFormName + "</td>");
                }
                else
                {
                    builder.Append("<td class=\"" + item.cssClassFormName + "\" colspan=" + item.ColSpan.ToString() + ">" + item.strFormName + "</td><td class=\"" + item.cssValueClass + "\">" + item.Value + "</td>");
                }
                if (item.ColSpan < (this.cCols - 1))
                {
                    for (int k = 0; k < ((this.cCols - item.ColSpan) - 1); k++)
                    {
                        builder.Append("<td class=\"");
                        builder.Append(item.cssClassFormName);
                        builder.Append("\">&nbsp;</td>");
                    }
                }
                builder.Append("</tr>");
            }
            builder.Append("</table>");
            return builder.ToString();
        }

        public string PrepairFillData()
        {
            for (int i = 0; i < this.root.Children.Count; i++)
            {
                this.CountChild(this.root.Children[i]);
            }
            string strTblSql = "SELECT * FROM " + this.strMainTable;
            if (this.mainField != "")
            {
                strTblSql = "SELECT " + this.mainField + " FROM " + this.strMainTable;
            }
            if (this.strWhere != string.Empty)
            {
                strTblSql = "SELECT * FROM " + this.strMainTable + " WHERE " + this.strWhere;
                if (this.mainField != "")
                {
                    strTblSql = "SELECT " + this.mainField + " FROM " + this.strMainTable + " WHERE " + this.strWhere;
                }
            }
            if (this.strOrderBy != string.Empty)
            {
                strTblSql = strTblSql + this.strOrderBy;
            }
            if (this.strTblSql != string.Empty)
            {
                strTblSql = this.strTblSql;
            }
            this.mCountRows = 0;
            return strTblSql;
        }

        public string PrintSumaryRow(RptItem item)
        {
            StringBuilder builder = new StringBuilder();
            int mColMergForSubSumRow = this.mColMergForSubSumRow;
            if ((item.strShowName != "IsEmpty") && (item.arrArgSumary.Count > 0))
            {
                builder.Append("<tr>");
                for (int i = 0; i < this.cCols; i++)
                {
                    if (item.arrArgSumary[i] > 0)
                    {
                        string str = this.InterFormatDataNumBer(item.mValue[i], this.mArrFormatNumber[i]);
                        builder.Append("<td class=\"");
                        builder.Append(item.cssClass);
                        builder.Append("\">");
                        builder.Append(str);
                        builder.Append("</td>");
                    }
                    else if (this.RowSumGobal.position == i)
                    {
                        if (mColMergForSubSumRow > 0)
                        {
                            builder.Append("<td class=\"rptTD\" />");
                            builder.Append("<td class=\"");
                            builder.Append(item.cssClassShowName);
                            builder.Append("\" colspan=");
                            builder.Append(mColMergForSubSumRow - 1);
                            builder.Append(">");
                            builder.Append(item.strShowName);
                            builder.Append("</td>");
                            mColMergForSubSumRow--;
                        }
                        else
                        {
                            builder.Append("<td class=\"");
                            builder.Append(item.cssClassShowName);
                            builder.Append("\" >");
                            builder.Append(item.strShowName);
                            builder.Append("</td>");
                        }
                    }
                    else if (mColMergForSubSumRow > 0)
                    {
                        mColMergForSubSumRow--;
                    }
                    else
                    {
                        builder.Append("<td class=\"");
                        builder.Append(item.cssClassShowName);
                        builder.Append("\">&nbsp;</td>");
                    }
                }
                builder.Append("</tr>");
            }
            return builder.ToString();
        }

        public void ResetValue(TreeNode<RptColumn> node)
        {
            node.Value.value = 0.0;
            if ((node != null) && (node.Children.Count > 0))
            {
                for (int i = 0; i < node.Children.Count; i++)
                {
                    this.ResetValue(node.Children[i]);
                }
            }
        }

        public void RunFunctoNode(TreeNode<RptColumn> curNode, Range range)
        {
            if (!curNode.Value.isLeaf)
            {
                for (int i = range.a; i < range.b; i++)
                {
                    TreeNode<RptColumn> node = curNode.Children[i];
                    Range range2 = new Range();
                    bool flag = false;
                    for (int j = 0; j < node.Children.Count; j++)
                    {
                        if (node.Children[j].Value.type.Contains("isAutoGen"))
                        {
                            if (!flag)
                            {
                                range2.a = j;
                                range2.b = range2.a + 1;
                                flag = true;
                            }
                            else
                            {
                                range2.b++;
                            }
                        }
                        else if (flag)
                        {
                            break;
                        }
                    }
                    this.RunFunctoNode(node, range2);
                    if (node.Children.Count > 0)
                    {
                        if (node.Children[0].Value.isLeaf)
                        {
                            for (int k = 0; k < node.Children.Count; k++)
                            {
                                RptColumn local1 = node.Value;
                                local1.value += node.Children[k].Value.value;
                            }
                        }
                        else
                        {
                            for (int m = range2.a; m < range2.b; m++)
                            {
                                RptColumn local2 = node.Value;
                                local2.value += node.Children[m].Value.value;
                            }
                        }
                    }
                }
            }
        }

        public void RunFunctoNodeRoot(TreeNode<RptColumn> root)
        {
            Range range = new Range();
            bool flag = false;
            for (int i = 0; i < root.Children.Count; i++)
            {
                if (root.Children[i].Value.type.Contains("isAutoGen"))
                {
                    if (!flag)
                    {
                        range.a = i;
                        range.b = range.a + 1;
                        flag = true;
                    }
                    else
                    {
                        range.b++;
                    }
                }
                else if (flag)
                {
                    break;
                }
            }
            this.RunFunctoNode(root, range);
        }
    }
}

