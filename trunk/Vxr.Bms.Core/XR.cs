using System.Collections;
using System.Globalization;
using System.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using log4net.Config;
using Vxr.Bms.Report;

namespace Vxr.Bms.Core
{
    // ReSharper disable InconsistentNaming
    public class XR
    {
        readonly L Log = new L();
        public string[] _a { get; set; }
        public string _ac { get; set; }
        public string[][] _fs; //List field cua table hoac view ma action do dung
        public readonly Dictionary<string, object> _ip; //Input cliet truyen vao
        public readonly string[][] _p = new string[100][]; //List field _c service push _c: fieldName; value: type
        public int _pc = 0; //List field _c service push _c: fieldName; value: type

        public readonly string[][] _c = new string[15][];
        //List field _c service push _c key: fieldName; value: value, type

        public int _cc = 0; //List field _c service push _c key: fieldName; value: value, type

        public readonly List<string[]> _d = new List<string[]>();
        //List field data client truyen vao key: fieldName; value: value, type

        public string _f; //Chuoi field client truyen vao
        public readonly R _r = new R { _s = 1 }; //Request gui ve cho client
        public string _sql; //Lenh sql tim duoc
        public static string _cs = ""; //Conection string
        public readonly Random _rd = new Random();
        public int _ct = 0; // Count data random               
        public readonly RptTable TblReport = new RptTable();
        public string _hd = "";
        public string _ft = "";
        public Dictionary<string, object> _cf;
        public static Dictionary<string, string[]> da;
        public static Dictionary<int, string> dh;
        public static Dictionary<int, string> dft;
        public static Dictionary<int, string[][]> df;
        private static bool _isDebug;

        public Dictionary<string, SqlDbType> _st = new Dictionary<string, SqlDbType>();

        public static void Init(string cs, bool isDebug, Dictionary<string, string[]> a, Dictionary<int, string> h, Dictionary<int, string> ft, Dictionary<int, string[][]> f)
        {
            _cs = cs;
            _isDebug = isDebug;
            da = a;
            dh = h;
            df = f;
            dft = ft;
        }

        public XR(object input)
        {
            _ip = (Dictionary<string, object>)input;
            _cf = (Dictionary<string, object>)_ip["_cf"];
        }

        public XR R()
        {
            if (_r._e) return this;
            _r._s = 1;
            return this;
        }

        public int Rd(int s, int e)
        {
            return _rd.Next(s, e);
        }

        public string Rd(int s, int e, int i, Dictionary<int, string[]> d)
        {
            return d[_rd.Next(s, e)][i];
        }

        public string Rd(int s, int e, int i, string c, DataTable d)
        {
            return string.IsNullOrEmpty(c)
                ? (d.Select()[_rd.Next(s, e)][i] + "")
                : (d.Select(c)[_rd.Next(s, e)][i] + "");
        }

        public XR A(string name = "")
        {
            // Kiem tra va lay action
            if (_r._e) return this;
            if (_ip.ContainsKey("_a"))
            {
                _ac = name == "" ? _ip["_a"] as string : name;
                if (_ac != null && da.ContainsKey(_ac))
                {
                    _a = da[_ac];
                    _pc = 0;
                    _cc = 0;
                    _fs = df[int.Parse(_a[1])];
                    return this;
                }
                _r._s = 0;
                _r._m = _E.E10001.G(_isDebug, null);
                return this;
            }
            _r._s = 0;
            _r._m = _E.E10002.G(_isDebug, null);
            return this;
        }

        public XR Pc(string value)
        {
            // Push Field
            if (_r._e) return this;
            var fi = L(value, 7, 0, _fs.Length, _fs);
            if (fi != "")
            {
                _p[_pc] = new[] { value, fi };
                _pc++;
            }
            else
            {
                _r._s = 0;
                _r._m = _E.E10005.G(_isDebug, null);
            }
            return this;
        }

        public XR _CR()
        {
            //Check _c
            if (_r._e) return this;
            if (!_ip.ContainsKey("_c")) return this;
            var c = _ip["_c"] as Dictionary<string, object>;
            if (c == null) return this;
            if (c.All(i => L(i.Key, 0, 0, _pc, _p) != "")) return this;
            _r._s = 0;
            _r._m = _E.E10006.G(_isDebug, null);
            return this;
        }

        public XR _CF()
        {
            //Kiem tra field trong obj.data va obj.field
            if (_r._e) return this;
            if (_ip.ContainsKey("_d"))
            {
                //Check obj._d
                var _da = _ip["_d"] as Dictionary<string, object>;
                if (_da != null)
                {
                    // ReSharper disable once UnusedVariable
                    foreach (var d in _da.Where(d => L(d.Key, 7, 0, _fs.Length, _fs) == ""))
                    {
                        _r._s = 0;
                        _r._m = _E.E10007.G(_isDebug, null);
                    }
                    if (!V(_da))
                    {
                        _r._s = 0;
                        _r._m = _E.E10010.G(_isDebug, null);
                    } //Validate
                }
            }
            if (!_ip.ContainsKey("_f") || _ip["_f"] + "" == "") _f = "*";
            else _f = _ip["_f"].ToString(); //Note: Trong service thì nên split Field để kiểm tra.
            return this;
        }

        public XR _CG()
        {
            if (!_ip.ContainsKey("_d") || !((Dictionary<string, object>)_ip["_d"]).ContainsKey("count")
                || (int)(((Dictionary<string, object>)_ip["_d"])["count"]) < 1)
            {
                _r._s = 0;
                _r._m = _E.E10011.G(_isDebug, null);
            }
            _ct = (int)(((Dictionary<string, object>)_ip["_d"])["count"]);
            return this;
        }

        public string L(string k, int i, int j, int l, string[][] f)
        // Lookup FieldName: key, index compare, index value, length, array
        {
            for (var m = 0; m < l; m++) if (f[m][i] == k) return f[m][j];
            return "";
        }

        public string[] LI(List<string[]> f)
        {
            string[] r = { "", "" };
            foreach (var t1 in f.Where(t1 => !t1[0].Equals("Id")))
            {
                if (r[0] == "") r[0] += t1[0];
                else r[0] += "," + t1[0];
                var t = (t1[1][0] == '0' || t1[1][0] == '1') ? t1[2] : ("N'" + t1[2] + "'");
                if (r[1] == "") r[1] += t;
                else r[1] += "," + t;
            }
            return r;
        }

        public string LW(string[][] f, int l)
        {
            // loopup for update sql
            var r = "";
            for (var i = 0; i < l; i++)
            {
                string x;
                if (f[i][2].Trim().IndexOf("$x", StringComparison.Ordinal) != -1) x = f[i][2].Replace("$x", f[i][0]);
                else x = f[i][0] + "=" + ((f[i][1][0] == '0' || f[i][1][0] == '1') ? f[i][2] : ("N'" + f[i][2] + "'"));
                if (r == "") r += " " + x;
                else r += " AND " + x;
            }
            return r;
        }

        public string LS(string[][] f, int l)
        {
            // loopup for update sql
            var r = "";
            for (var i = 0; i < l; i++)
            {
                if (!f[i][0].Equals("Id", StringComparison.OrdinalIgnoreCase))
                {
                    string x;
                    if (f[i][2].Trim().IndexOf("$x", StringComparison.Ordinal) != -1) x = f[i][2].Replace("$x", f[i][0]);
                    else
                        x = f[i][0] + "=" +
                            ((f[i][1][0] == '0' || f[i][1][0] == '1') ? f[i][2] : ("N'" + f[i][2] + "'"));
                    if (r == "") r += " WHERE " + x;
                    else r += " AND " + x;
                }
                else if (r == "") r += " WHERE " + f[i][0] + "!=" + f[i][2];
                else r += " AND " + f[i][0] + "!=" + f[i][2];
            }
            return r;
        }

        public string LU(string[][] f, int l)
        {
            // loopup for update sql
            var r = "";
            for (var i = 0; i < l; i++)
            {
                if (f[i][0].Equals("Id", StringComparison.OrdinalIgnoreCase))
                {
                    string x;
                    if (f[i][2].Trim().IndexOf("$x", StringComparison.Ordinal) != -1) x = f[i][2].Replace("$x", f[i][0]);
                    else
                        x = f[i][0] + "=" +
                            ((f[i][1][0] == '0' || f[i][1][0] == '1') ? f[i][2] : ("N'" + f[i][2] + "'"));
                    r += " WHERE " + x;
                    break;
                }
            }
            return r;
        }

        public string LU(List<string[]> f)
        {
            // loopup for update sql
            var r = "";
            foreach (var t1 in f)
                if (!t1[0].Equals("Id"))
                {
                    var t = (t1[1][0] == '0' || t1[1][0] == '1') ? t1[2] : ("N'" + t1[2] + "'");
                    if (r == "") r += (t1[0] + "=" + t);
                    else r += ("," + t1[0] + "=" + t);
                }
            return r;
        }

        public XR L()
        {
            if (_r._e) return this;
            var _cd = _ip.ContainsKey("_c") ? _ip["_c"] as Dictionary<string, object> : null;
            var _da = _ip.ContainsKey("_d") ? _ip["_d"] as Dictionary<string, object> : null;
            if (_cd != null)
                foreach (var c in _cd)
                {
                    _c[_cc] = new[] { c.Key, L(c.Key, 7, 0, _fs.Length, _fs), c.Value + "" };
                    _cc++;
                }
            if (_da == null) return this;
            foreach (var d in _da)
                _d.Add(new[] { d.Key, L(d.Key, 7, 0, _fs.Length, _fs), d.Value + "" });
            return this;
        }

        public bool V(object d)
        {
            return true;
        }

        public XR G()
        {
            if (_r._d.Count > 0)
            {
                _r._t = _r._d.Count;
            }
            return this;
        }

        //public object
        public XR LC()
        {

            //-----------------------------------------------------------
            //Cài đặt báo cáo tự động
            //mMaxLevel số mức tối đa của cây
            _hd = string.Format(_cf.ContainsKey("hd") ? dh[(int)_cf["hd"]] : dh[1], _a[4],
                _cf.ContainsKey("hdValue") ? _cf["hdValue"] : "");
            _ft = string.Format(_cf.ContainsKey("ft") ? dft[(int)_cf["ft"]] : dft[1]
                /*, _cf.ContainsKey("_fdValue") ? _cf["_fdValue"] : ""*/);
            TblReport.strMainTable = _a[2];
            TblReport.bShowIndexRow = _cf.ContainsKey("bShowIndexRow") && (bool)_cf["bShowIndexRow"];
            TblReport.mColMergForSubSumRow = _cf.ContainsKey("mColMergForSubSumRow")
                ? Convert.ToInt32(_cf["mColMergForSubSumRow"])
                : 0;
            TblReport.bShowSubSumary = _cf.ContainsKey("bShowSubSumary") ? Convert.ToInt32(_cf["bShowSubSumary"]) : 0;

            TblReport.mTypeBuild = _cf.ContainsKey("mTypeBuild") ? (string)_cf["mTypeBuild"] : "isSimple";
            TblReport.bShowSTT = true;
            TblReport.strOrderBy = _cf.ContainsKey("strOrderBy") ? (string)_cf["strOrderBy"] : "";
            TblReport.server = _cs;
            TblReport.strWhere = _cf.ContainsKey("alterView") ? "" : LW(_c, _cc);

            if (_cf.ContainsKey("mMaxLevel") && Convert.ToInt32(_cf["mMaxLevel"]) > 0)
            {
                TblReport.mArrPos = new int[Convert.ToInt32(_cf["mMaxLevel"])];
                for (var i = 0; i < Convert.ToInt32(_cf["mMaxLevel"]); i++)
                {
                    TblReport.mArrPos[i] = i + 1;
                    //1 ở đây là cột 1, cột 0 đã chứa số thứ tự không thì chúng ta sét cột 0 vào
                    TblReport.mStrShowContent.Add(""); //Tương ứng với 3 phần tử trên
                }
                TblReport.mColMergForSubSumRowSub = TblReport.mColMergForSubSumRow - Convert.ToInt32(_cf["mMaxLevel"]);
                TblReport.bShowGroupBy = true;
                TblReport.mMaxLevel = Convert.ToInt32(_cf["mMaxLevel"]);
            }
            else
                TblReport.bShowGroupBy = false;
            if (_cf.ContainsKey("col"))
                BuildASimple(TblReport.root);
            else
                if (_cf.ContainsKey("compId"))
                    TblReport.BuidlASimpleByDB(TblReport, _a[2], "ReportDetail", _cf["reportId"] + "", _cf["compId"] + "");
                else
                    TblReport.BuidlASimpleByDB(TblReport, _a[2], "ReportDetail", _cf["reportId"] + "", "");

            TblReport.InitTable();
            TblReport.mArrArgSumary = new List<int>();
            for (var t = 0; t < TblReport.cCols; t++)
                TblReport.mArrArgSumary.Add(0);
            if (_cf.ContainsKey("mArrArgSumary"))
            {
                var m = _cf["mArrArgSumary"] as ArrayList;
                if (m != null)
                    foreach (var t in m)
                        TblReport.mArrArgSumary[Convert.ToInt32(t)] = 1;
            }
            TblReport.MakeGobalRowForTesting();
            return this;
        }

        public XR VS(string stName = "")
        {
            var c = _ip["_cf"] as Dictionary<string, object>;
            var dataTbl = new DataTable();
            if (c == null) return this;
            try
            {
                var dataset = new DataSet();
                using (var conn = new SqlConnection(_cs))
                {
                    var adapter = new SqlDataAdapter
                    {
                        SelectCommand = new SqlCommand(stName, conn) { CommandType = CommandType.StoredProcedure }
                    };
                    foreach (var para in _st)
                    {
                        adapter.SelectCommand.Parameters.Add("@" + para.Key, para.Value);
                        adapter.SelectCommand.Parameters["@" + para.Key].Value = c.ContainsKey(para.Key) ? c[para.Key] : DBNull.Value;
                    }
                    adapter.Fill(dataset);
                    dataTbl = dataset.Tables[0];
                }

            }
            catch (Exception e)
            {
                //Log.LogContent("Excute Store: " + e);
            }
            FillDataInner(dataTbl);

            return this;
        }

        public XR Pr(string n, SqlDbType t)
        {
            _st.Add(n, t);
            return this;
        }

        public XR C(string k, object v)
        {
            var c = _ip["_cf"] as Dictionary<string, object>;
            if (c == null)
            {
                c = new Dictionary<string, object>();
                _ip["_cf"] = c;
            }
            c.Add(k, v);
            return this;
        }

        public XR EX()
        {
            //-----------------------------------------------------------
            //BuilSampleTree(tblReport.root, tblReport);
            //-----------------------------------------------------------
            if (_r._e) return this;
            var mC = new SqlConnection(_cs);
            mC.Open();
            var mT = mC.BeginTransaction(); // Start a local transaction.
            var dt = new DataTable();
            try
            {
                SqlCommand mD;
                var arrayList = _cf["alterView"] as ArrayList;
                if (arrayList != null && (_cf.ContainsKey("alterView") && arrayList.Count > 0))
                {
                    var sql = _cf["alterView"] as ArrayList;
                    if (sql != null)
                    {
                        foreach (var t in sql)
                        {
                            Log.LogReport(t.ToString());
                            mD = mC.CreateCommand(); // Enlist the command in the current transaction.
                            mD.CommandTimeout = 36000;
                            mD.Transaction = mT;
                            mD.CommandText = t + "";
                            mD.ExecuteNonQuery();
                        }
                    }

                }
                mD = mC.CreateCommand(); // Enlist the command in the current transaction.
                mD.CommandTimeout = 36000;
                mD.Transaction = mT;
                mD.CommandText = TblReport.PrepairFillData();
                var adap = new SqlDataAdapter(mD);
                adap.Fill(dt);
                mT.Commit();
            }
            catch (Exception e)
            {
                try
                {
                    mT.Rollback();
                }
                catch (SqlException ex)
                {
                    _r._s = 0;
                    _r._m = ex.ToString();//_E.E10009.G(_isDebug, ex);
                }
                _r._s = 0;
                _r._m = e.ToString(); //_E.E10009.G(_isDebug, e);
            }
            finally
            {
                mC.Close();
            }
            if (_r._e) return this;
            FillDataInner(dt);

            return this;
        }

        public XR LV()
        {
            if (_r._e) return this;
            if (!_cf.ContainsKey("colValue")) return this;
            var m = _cf["colValue"] as ArrayList;
            if (m == null) return this;
            var f = new Stack();
            foreach (var it in m.OfType<ArrayList>())
            {
                foreach (var t in TblReport.mData)
                {
                    for (var k = 1; k < it.Count; k++)
                    {
                        switch (it[k] + "")
                        {
                            case "+":
                                f.Push(double.Parse(f.Pop() + "") + double.Parse(f.Pop() + ""));
                                break;
                            case "-":
                                f.Push(double.Parse(f.Pop() + "") - double.Parse(f.Pop() + ""));
                                break;
                            case "*":
                                f.Push(double.Parse(f.Pop() + "") * double.Parse(f.Pop() + ""));
                                break;
                            case "/":
                                f.Push(double.Parse(f.Pop() + "") / double.Parse(f.Pop() + ""));
                                break;
                            default:
                                f.Push(t[(int)it[k]]);
                                break;
                        }
                    }
                    t[(int)it[0]] = f.Pop() + "";
                }
            }
            return this;
        }

        public XR LS()
        {
            if (_r._e) return this;
            if (!_cf.ContainsKey("mArrArgSumary")) return this;
            var m = _cf["mArrArgSumary"] as ArrayList;
            if (m == null) return this;
            foreach (var t1 in m)
            {
                double sum = 0;
                foreach (var t2 in TblReport.mData)
                {
                    var value = (string)t2[(int)t1];
                    double t;
                    if (string.IsNullOrWhiteSpace(value))
                        t2[(int)t1] = "0";
                    else if (double.TryParse(value, out t))
                    {
                        sum += t;
                        t2[(int)t1] = double.Parse(value) + "";
                    }
                    else sum++;
                }
                TblReport.RowSumGobal.mValue[(int)t1] = sum + "";
            }
            return this;
        }

        public XR LS1()
        {
            if (_r._e) return this;
            var mA = _cf.ContainsKey("mArrArgSumary") ? _cf["mArrArgSumary"] as ArrayList : null;
            var cV = _cf.ContainsKey("colValue") ? _cf["colValue"] as ArrayList : null;
            var s = mA == null ? null : new double[mA.Count];
            var f = new Stack();
            for (var i = 0; i < TblReport.mData.Count; i++)
            {
                if (cV != null)
                {
                    foreach (var it in cV.OfType<ArrayList>())
                    {
                        for (var k = 1; k < it.Count; k++)
                        {
                            if (it.Count == 2)
                                f.Push(it[k] + "");
                            else
                                switch (it[k] + "")
                                {
                                    case "+":
                                        f.Push(double.Parse(f.Pop() + "") + double.Parse(f.Pop() + ""));
                                        break;
                                    case "-":
                                        f.Push(double.Parse(f.Pop() + "") - double.Parse(f.Pop() + ""));
                                        break;
                                    case "*":
                                        f.Push(double.Parse(f.Pop() + "") * double.Parse(f.Pop() + ""));
                                        break;
                                    case "/":
                                        f.Push(double.Parse(f.Pop() + "") / double.Parse(f.Pop() + ""));
                                        break;
                                    default:
                                        f.Push(TblReport.mData[i][(int)it[k]]);
                                        break;
                                }
                        }
                        TblReport.mData[i][(int)it[0]] = f.Pop() + "";
                    }
                }
                if (mA != null)
                {
                    for (var j = 0; j < mA.Count; j++)
                    {
                        var value = (string)TblReport.mData[i][Convert.ToInt32(mA[j])];
                        double t;
                        if (string.IsNullOrWhiteSpace(value))
                            TblReport.mData[i][Convert.ToInt32(mA[j])] = "0";
                        else if (TblReport.arrListLeaf[Convert.ToInt32(mA[j])].datatype == "int")
                        {
                            if (double.TryParse(value, out t))
                            {
                                s[j] += t;
                                TblReport.mData[i][Convert.ToInt32(mA[j])] = double.Parse(value) + "";
                            }
                            else s[j]++;
                        }
                        else
                        {
                            s[j]++;
                        }
                        if (i == TblReport.mData.Count - 1)
                        {
                            TblReport.RowSumGobal.mValue[Convert.ToInt32(mA[j])] = s[j] + "";
                        }
                    }
                }
            }
            return this;
        }

        public XR LG()
        {
            if (_r._e) return this;
            //Tong theo nhom và định dạng
            if (TblReport.mListItem.Count <= 0) return this;
            var t = _cf["mArrArgSumary"] as ArrayList;
            if (t == null) return this;
            foreach (var t3 in TblReport.mListItem)
            {
                var item = t3;
                if (!_cf.ContainsKey("mMaxLevel") || Convert.ToInt32(_cf["mMaxLevel"]) <= 0) continue;
                double tem3; //, temp4 = 0;
                foreach (var t2 in t)
                {
                    tem3 = 0;
                    for (var i = item.@from; i < item.to; i++)
                    {
                        var value = (string)TblReport.mData[i][Convert.ToInt32(t2)];
                        double t1;
                        if (TblReport.arrListLeaf[Convert.ToInt32(t2)].datatype == "int")
                        {
                            if (double.TryParse(value, out t1))
                                tem3 += t1;
                            else tem3++;
                        }
                        else
                        {
                            tem3++;
                        }
                    }
                    item.mValue[Convert.ToInt32(t2)] = tem3.ToString(CultureInfo.InvariantCulture);
                }
                if (_cf.ContainsKey("classListItem"))
                {
                    item.cssClass = (string)_cf["classListItem"];
                    item.cssValueClass = (string)_cf["classListItem"];
                    item.cssClassShowName = (string)_cf["classListItem"];
                }
                foreach (var item2 in t3.list)
                {
                    foreach (var t2 in t)
                    {
                        tem3 = 0;
                        for (var i = item2.@from; i < item2.to; i++)
                        {
                            var value = (string)TblReport.mData[i][Convert.ToInt32(t2)];
                            double t1;
                            if (TblReport.arrListLeaf[Convert.ToInt32(t2)].datatype == "int")
                            {
                                if (double.TryParse(value, out t1))
                                    tem3 += t1;
                                else tem3++;
                            }
                            else
                            {
                                tem3++;
                            }
                        }
                        item2.mValue[Convert.ToInt32(t2)] = tem3.ToString(CultureInfo.InvariantCulture);
                    }
                    if (_cf.ContainsKey("classListItem"))
                    {
                        item2.cssClass = (string)_cf["classListItem"];
                        item2.cssValueClass = (string)_cf["classListItem"];
                        item2.cssClassShowName = (string)_cf["classListItem"];
                    }

                    //Calculate data of level 3
                    foreach (var item3 in item2.list)
                    {
                        foreach (var t2 in t)
                        {
                            var tem4 = 0.0;
                            for (var i = item3.@from; i < item3.to; i++)
                            {
                                var value = (string)TblReport.mData[i][Convert.ToInt32(t2)];
                                double t1;
                                if (TblReport.arrListLeaf[Convert.ToInt32(t2)].datatype == "int")
                                {
                                    if (double.TryParse(value, out t1))
                                        tem4 += t1;
                                    else tem4++;
                                }
                                else
                                {
                                    tem4++;
                                }
                            }
                            item3.mValue[Convert.ToInt32(t2)] = tem4.ToString(CultureInfo.InvariantCulture);
                            if (_cf.ContainsKey("classListItem"))
                            {
                                item3.cssClass = (string)_cf["classListItem"];
                                item3.cssValueClass = (string)_cf["classListItem"];
                                item3.cssClassShowName = (string)_cf["classListItem"];
                            }

                            //Calculate for level 4

                            foreach (var item4 in item3.list)
                            {
                                foreach (var t24 in t)
                                {
                                    var tem5 = 0.0;
                                    for (var i = item4.@from; i < item4.to; i++)
                                    {
                                        var value = (string)TblReport.mData[i][Convert.ToInt32(t24)];
                                        double t1;
                                        if (TblReport.arrListLeaf[Convert.ToInt32(t24)].datatype == "int")
                                        {
                                            if (double.TryParse(value, out t1))
                                                tem5 += t1;
                                            else tem5++;
                                        }
                                        else
                                        {
                                            tem5++;
                                        }
                                    }
                                    item4.mValue[Convert.ToInt32(t24)] = tem5.ToString(CultureInfo.InvariantCulture);
                                    if (_cf.ContainsKey("classListItem"))
                                    {
                                        item4.cssClass = (string)_cf["classListItem"];
                                        item4.cssValueClass = (string)_cf["classListItem"];
                                        item4.cssClassShowName = (string)_cf["classListItem"];
                                    }
                                }
                            }
                        }
                    }

                }
            }
            return this;
        }

        public XR B()
        {
            if (_r._e) return this;
            ////------------------------------------------------------------
            ////Xuất dữ liệu

            for (var t = 0; t < TblReport.cCols; t++)
            {
                TblReport.mArrRightStyle.Add(0);
                TblReport.mArrRightStyleCss.Add("");
            }
            if (TblReport.mArrPos != null)
                for (var i = 1; i < TblReport.mArrPos.Length; i++)
                {
                    TblReport.SubRowSumGobal.position = i + 1;
                }
            if (TblReport.mArrPos != null && TblReport.mArrPos.Length > 2)
                TblReport.SubRowSumGobal.position--;
            if (_cf.ContainsKey("classRowSumGobal"))
            {
                TblReport.RowSumGobal.cssClass = (string)_cf["classRowSumGobal"];
                TblReport.RowSumGobal.cssValueClass = (string)_cf["classRowSumGobal"];
                TblReport.RowSumGobal.cssClassShowName = (string)_cf["classRowSumGobal"];
            }
            if (_cf.ContainsKey("classSubRowSumGobal"))
            {
                TblReport.SubRowSumGobal.cssClass = (string)_cf["classSubRowSumGobal"];
                TblReport.SubRowSumGobal.cssValueClass = (string)_cf["classSubRowSumGobal"];
                TblReport.SubRowSumGobal.cssClassShowName = (string)_cf["classSubRowSumGobal"];
            }
            if (_cf.ContainsKey("classCol"))
            {
                var m = _cf["classCol"] as ArrayList;
                if (m != null)
                {
                    foreach (var it in m.OfType<ArrayList>())
                    {
                        TblReport.mArrRightStyle[Convert.ToInt32(it[0])] = 1;
                        TblReport.mArrRightStyleCss[Convert.ToInt32(it[0])] = it[1] + "";
                    }
                }
            }
            //Xuất dữ liệu
            //
            _r._d = new List<object[]> { new object[] { _hd + TblReport.MakeSimpleTable() + _ft } };
            return this;
        }

        private void FillDataInner(DataTable dt)
        {

            var j = 0;
            if (dt.Rows.Count > 0)
            {
                //nên lưu 1 dãy trật tự các cột sẽ được build trên cây
                //Điều kiện lọc ở đây dược tính theo ngày

                var bStoreId = false;
                if (TblReport.mTypeBuild.ToUpper().Contains("ISKEY"))
                {
                    bStoreId = true;
                    TblReport.mArrId = new int[dt.Rows.Count];
                }

                //check field before fill data
                foreach (var item in from item in TblReport.arrListLeaf let field = item.cPattern.hField where item.iNotFillData == 0 where !dt.Columns.Contains(field) select item)
                {
                    item.iNotFillData = 1; // cot du lieu nay ko ton tai, ko the fill data dc 
                }

                if (TblReport.mTypeBuild.ToUpper().Contains("ISSIMPLE"))
                    while (j < dt.Rows.Count)
                    {
                        if (bStoreId)
                            TblReport.mArrId[j] = (int)dt.Rows[j]["Id"];

                        var row = new object[TblReport.cCols];

                        for (var l = 0; l < TblReport.arrListLeaf.Count; l++)
                        {
                            var item = TblReport.arrListLeaf[l];
                            if (TblReport.bShowSTT)
                            {
                                row[0] = (TblReport.mCountRows + 1).ToString(CultureInfo.InvariantCulture);
                            }

                            if (item.iNotFillData == 1) //add new column chỉ ra cột này không lấy data
                            {
                                row[l] = "0";
                            }
                            else
                                row[l] = TblReport.GetStringValue(item.datatype, dt.Rows[j][item.cPattern.hField]);

                        }

                        j++;
                        TblReport.mCountRows++;
                        TblReport.mData.Add(row);
                    }
            }
            //end if (dt.Rows.Count > 0)
            //-------------------------------------------
            //build calculate column
            if (TblReport.bShowGroupBy)
            {
                //------------------------------------------------
                //phải build dạng cây đệ quy không thì dùng cấp độ 
                var from = 0;
                var to = TblReport.mData.Count;
                TblReport.FindGroupBy(TblReport.mListItem, TblReport.mArrPos, 0, ref from, ref to);
            }
            //--------------------------------------
            //add row style
            for (var p = 0; p < TblReport.mData.Count; p++)
                TblReport.mArrCssForRow.Add("rptTD");

            for (var mJ = 0; mJ < TblReport.cCols; mJ++)
                TblReport.mArrFormatNumber.Add(0);

            TblReport.FormatNumber(TblReport.root, TblReport.mArrFormatNumber);
        }

        public void BuildASimple(TreeNode<RptColumn> root)
        {
            if (TblReport.bShowSTT)
                TblReport.AddDataNode(root, "", "STT", "rpt_TEST_", "", "STT", "rpt_TEST_", 0, true, "isData", "int", -1, -1);
            var col = _cf["col"] as ArrayList;
            if (col == null) return;
            foreach (var it in col.OfType<ArrayList>())
            {
                TblReport.AddDataNode(root, it[0] + "", it[1] + "", it[2] + "", it[3] + "", it[4] + "",
                    it[5] + "",
                    (int)it[6], (bool)it[7], it[8] + "", it[9] + "", (int)it[10], (int)it[11]);
            }
        }
    }
}
