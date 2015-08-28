using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace Vxr.Bms.Core
{
    // ReSharper disable InconsistentNaming
    public class X
    {
        public string[] _a { get; set; }
        public string _ac { get; set; }
        public string[][] _fs;                                      //List field cua table hoac view ma action do dung
        public readonly Dictionary<string, object> _ip;             //Input client truyen vao
        public readonly string[][] _p = new string[100][];           //List field _c service push _c: fieldName; value: type
        public int _pc = 0;                                         //List field _c service push _c: fieldName; value: type
        public readonly string[][] _c = new string[15][];           //List field _c service push _c key: fieldName; value: value, type
        public int _cc = 0;                                         //List field _c service push _c key: fieldName; value: value, type
        public readonly List<string[]> _d = new List<string[]>();   //List field data client truyen vao key: fieldName; value: value, type
        public string _f;                                           //Chuoi field client truyen vao
        public readonly R _r = new R { _s = 1 };                    //Request gui ve cho client
        public string _sql;                                         //Lenh sql tim duoc
        public static string _cs = "";                              //Conection string

        public readonly Random _rd = new Random();
        public int _ct = 0;
        private static bool _isDebug;
        public static Dictionary<string, string[]> da;
        public static Dictionary<int, string[][]> df;
        public Dictionary<string, SqlDbType> _st = new Dictionary<string, SqlDbType>();
        readonly L Log = new L();
        // Count data random               
        public static void Init(string cs, bool isDebug, Dictionary<string, string[]> a, Dictionary<int, string[][]> f)
        {
            _cs = cs;
            _isDebug = isDebug;
            da = a;
            df = f;
        }
        public X(object input)
        {
            _ip = (Dictionary<string, object>)input;
        }
        public X R()
        {
            if (_r._e) return this; _r._s = 1; return this;
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
            return string.IsNullOrEmpty(c) ? (d.Select()[_rd.Next(s, e)][i] + "") : (d.Select(c)[_rd.Next(s, e)][i] + "");
        }
        public X A(string name = "")
        {  // Kiem tra va lay action
            if (_r._e) return this;
            if (_ip.ContainsKey("_a"))
            {
                _ac = name == "" ? _ip["_a"] as string : name;
                if (_ac != null && da.ContainsKey(_ac))
                {
                    _a = da[_ac]; _pc = 0; _cc = 0; _fs = _a[0][0] == 'G' ? df[int.Parse(_a[2])] : df[int.Parse(_a[1])];
                    return this;
                }
                _r._s = 0; _r._m = _E.E10001.G(_isDebug, null);
                Log.LogContent("A: (" + _E.E10001 + ") " + name);
                return this;
            }
            _r._s = 0; _r._m = _E.E10002.G(_isDebug, null);
            Log.LogContent("A: (" + _E.E10002 + ") " + _ip.ToString());
            return this;
        }
        public X Pc(string value)
        {       // Push Field
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
                Log.LogContent("Pc: (" + _E.E10005 + ") " + value);
            }
            return this;
        }

        public X Pr(string n, SqlDbType t)
        {
            _st.Add(n, t);
            return this;
        }

        public X _CR()
        {       //Check _c
            if (_r._e) return this;
            if (!_ip.ContainsKey("_c")) return this;
            var c = _ip["_c"] as Dictionary<string, object>;
            if (c == null) return this;
            if (c.All(i => L(i.Key, 0, 0, _pc, _p) != "")) return this;
            _r._s = 0; _r._m = _E.E10006.G(_isDebug, null);
            Log.LogContent("_CR: (" + _E.E10006 + ") " + c.ToString());
            return this;
        }
        public X _CF()
        {        //Kiem tra field trong obj.data va obj.field
            if (_r._e) return this;
            if (_ip.ContainsKey("_d"))
            {       //Check obj._d
                var _da = _ip["_d"] as Dictionary<string, object>;
                if (_da != null)
                {
                    foreach (var d in _da)
                        if (L(d.Key, 7, 0, _fs.Length, _fs) == "") { _r._s = 0; _r._m = _E.E10007.G(_isDebug, null); }
                    if (!V(_da))
                    {
                        _r._s = 0;
                        _r._m = _E.E10010.G(_isDebug, null);
                        Log.LogContent("_CF: (" + _E.E10010 + ") " + _da.ToString());
                    }     //Validate
                }
            }
            if (!_ip.ContainsKey("_f") || _ip["_f"] + "" == "") _f = "*";
            else
            {
                //Change: split field to check SQL injection
                string[] arr = _ip["_f"].ToString().Split(',');
                StringBuilder b = new StringBuilder();
                for (int i = 0; i < arr.Length; i++) { b.Append(ReplaceString(arr[i]) + ","); }
                b = b.Remove(b.Length - 1, 1);
                _f = b.ToString();
            }
            //Note: Trong service thì nên split Field để kiểm tra.

            return this;
        }
        public X _CG()
        {
            if (!_ip.ContainsKey("_d") || !((Dictionary<string, object>)_ip["_d"]).ContainsKey("count")
                || (int)(((Dictionary<string, object>)_ip["_d"])["count"]) < 1)
            {
                _r._s = 0; _r._m = _E.E10011.G(_isDebug, null);
                Log.LogContent("_CG: (" + _E.E10011 + ") " + _ip.ToString());
            }
            _ct = (int)(((Dictionary<string, object>)_ip["_d"])["count"]);
            return this;
        }
        public string L(string k, int i, int j, int l, string[][] f)    // Lookup FieldName: key, index compare, index value, length, array
        {
            for (var m = 0; m < l; m++) if (f[m][i] == k) return f[m][j]; return "";
        }
        public string[] LI(List<string[]> f)
        {
            string[] r = { "", "" };
            foreach (var t1 in f.Where(t1 => !t1[0].Equals("Id")))
            {
                string tr0 = ReplaceString(t1[0]);
                string tr2 = ReplaceString(t1[2]);
                if (r[0] == "") r[0] += tr0; else r[0] += "," + tr0;
                string t; //= (t1[1][0] == '0' || t1[1][0] == '1') ? t1[2] : ("N'" + t1[2] + "'");
                switch (t1[1])
                {
                    case "0":
                    case "1":
                        if (String.IsNullOrEmpty(t1[2]))
                        {
                            t = "NULL";
                        }
                        else
                        {
                            t = tr2;
                        }
                        break;
                    case "4":
                        if (String.IsNullOrEmpty(t1[2]))
                        {
                            t = "NULL";
                        }
                        else
                        {
                            t = "N'" + tr2 + "'";
                        }
                        break;
                    case "5":
                        if (String.IsNullOrEmpty(t1[2]))
                        {
                            t = "NULL";
                        }
                        else
                        {
                            t = "'" + tr2 + "'";
                        }
                        break;
                    default:
                        t = "N'" + tr2 + "'";
                        break;
                }
                if (r[1] == "") r[1] += t; else r[1] += "," + t;
            }
            return r;
        }
        public string LW(string[][] f, int l, string specialCond = "")
        {       // loopup for update sql
            var r = "";
            for (var i = 0; i < l; i++)
            {
                string x = null;
                if (f[i][2].Trim().IndexOf("$x", StringComparison.Ordinal) != -1) x = f[i][2].Replace("$x", f[i][0]);
                else if (!((f[i][1][0] == '0' || f[i][1][0] == '1') && f[i][2] == ""))
                {
                    string c = ((f[i][1][0] == '0' || f[i][1][0] == '1') ? f[i][2] : ("N'" + f[i][2] + "'"));
                    x = f[i][0] + "=" + ReplaceString(c);
                }
                if (x != null)
                {
                    if (r == "")
                    {
                        r += " WHERE " + x;
                    }
                    else
                    {
                        r += " AND " + x;
                    }
                }

            }
            if (!string.IsNullOrWhiteSpace(specialCond))
            {
                r += " AND " + specialCond;
            }
            return r;
        }
        public string LS(string[][] f, int l, string specialCond = "")
        {       // loopup for update sql
            var r = "";
            for (var i = 0; i < l; i++)
            {
                string a = ReplaceString((f[i][1][0] == '0' || f[i][1][0] == '1') ? (String.IsNullOrEmpty(f[i][2]) ? " IS NULL" : "=" + f[i][2]) : ("= N'" + f[i][2] + "'"));
                string c = ReplaceString(f[i][2]);
                if (!f[i][0].Equals("Id", StringComparison.OrdinalIgnoreCase))
                {
                    string x;
                    if (f[i][2].Trim().IndexOf("$x", StringComparison.Ordinal) != -1) x = f[i][2].Replace("$x", f[i][0]);
                    else x = f[i][0] + a;
                    if (r == "") r += " WHERE " + x; else r += " AND " + x;
                }
                else if (r == "")
                {
                    r += " WHERE " + f[i][0] + "!=" + c;
                }
                else r += " AND " + f[i][0] + "!=" + c;
            }
            if (!string.IsNullOrWhiteSpace(specialCond))
            {
                r += " AND " + specialCond;
            }
            return r;
        }
        public string LU(string[][] f, int l)
        {       // loopup for update sql
            var r = "";
            for (var i = 0; i < l; i++)
            {
                string c = ReplaceString((f[i][1][0] == '0' || f[i][1][0] == '1') ? f[i][2] : ("N'" + f[i][2] + "'"));
                if (f[i][0].Equals("Id", StringComparison.OrdinalIgnoreCase))
                {
                    string x;
                    if (f[i][2].Trim().IndexOf("$x", StringComparison.Ordinal) != -1) x = f[i][2].Replace("$x", f[i][0]);
                    else x = f[i][0] + "=" + c;
                    r += " WHERE " + x;
                    break;
                }
            }
            return r;
        }
        public string LU1(string[][] f, int l)
        {       // loopup for update sql
            var r = "";
            for (var i = 0; i < l; i++)
            {
                string c = ReplaceString((f[i][1][0] == '0' || f[i][1][0] == '1') ? (String.IsNullOrEmpty(f[i][2]) ? " IS NULL" : "=" + f[i][2]) : ("= N'" + f[i][2] + "'"));
                string x;
                if (f[i][2].Trim().IndexOf("$x", StringComparison.Ordinal) != -1) x = f[i][2].Replace("$x", f[i][0]);
                else x = f[i][0] + c;
                if (r == "") r += " WHERE " + x;
                else r += " AND " + x;
            }
            return r;
        }
        public string LU(List<string[]> f)
        {
            // loopup for update sql
            var r = "";
            foreach (var t1 in f.Where(t1 => !t1[0].Equals("Id")))
            {
                string t;
                string c = ReplaceString(t1[2]);
                if (t1[2].Trim().IndexOf("$x", StringComparison.Ordinal) != -1) t = t1[2].Replace("$x", t1[0]);
                else
                {
                    switch (t1[1][0])
                    {
                        case '0':
                        case '1':
                            if (String.IsNullOrEmpty(t1[2]))
                            {
                                t = t1[0] + "= NULL";
                            }
                            else
                            {
                                t = t1[0] + "=" + c;
                            }
                            break;
                        case '4':
                            if (String.IsNullOrEmpty(t1[2]))
                            {
                                t = t1[0] + "=" + "NULL";
                            }
                            else
                            {
                                t = t1[0] + "=" + "N'" + c + "'";
                            }
                            break;
                        case '5':
                            if (String.IsNullOrEmpty(t1[2]))
                            {
                                t = t1[0] + "= NULL";
                            }
                            else
                            {
                                t = t1[0] + "=" + "'" + c + "'";
                            }
                            break;
                        default:
                            t = t1[0] + "=" + "N'" + c + "'";
                            break;
                    }
                    //t = t1[0] + "=" + ((t1[1][0] == '0' || t1[1][0] == '1') ? t1[2] : ("N'" + t1[2] + "'"));
                }
                //string t = (f[i][1][0] == '0' || f[i][1][0] == '1') ? f[i][2] : ("N'" + f[i][2] + "'");
                if (r == "") r += t; else r += ("," + t);
            }
            return r;
        }
        public X L()
        {
            if (_r._e) return this;
            var _cd = _ip.ContainsKey("_c") ? _ip["_c"] as Dictionary<string, object> : null;
            var _da = _ip.ContainsKey("_d") ? _ip["_d"] as Dictionary<string, object> : null;
            if (_cd != null) foreach (var c in _cd)
                {
                    if (c.Key.Contains("Password")) { string pass = MD5Hash(c.Value.ToString()) + "/MD5Hash"; _c[_cc] = new[] { c.Key, L(c.Key, 7, 0, _fs.Length, _fs), pass + "" }; }
                    else _c[_cc] = new[] { c.Key, L(c.Key, 7, 0, _fs.Length, _fs), c.Value + "" }; _cc++;
                }
            if (_da != null) foreach (var d in _da)
                {
                    if (d.Key.Contains("Password"))
                    {
                        if (isNewPass(d.Value.ToString())) { string pass = MD5Hash(d.Value.ToString()) + "/MD5Hash"; _d.Add(new[] { d.Key, L(d.Key, 7, 0, _fs.Length, _fs), pass + "" }); }
                        else _d.Add(new[] { d.Key, L(d.Key, 7, 0, _fs.Length, _fs), d.Value + "" });
                    }
                    else _d.Add(new[] { d.Key, L(d.Key, 7, 0, _fs.Length, _fs), d.Value + "" });
                }
            return this;
        }
        public bool isNewPass(string pass)
        {
            bool check = true;
            string[] cp = pass.Split('/');
            if (cp.Length >= 2) if (cp[1].Contains("MD5Hash")) check = false;
            return check;
        }
        //public Dictionary<string, DataTable> LT()
        //{
        //    var r = new Dictionary<string, DataTable>();
        //    if (_r._e) return null;
        //    foreach (var f in _fs)
        //    {
        //        if (f[5] != "")
        //        {
        //            G(f[5], "*", 0, new string[15][]); Gd(_sql);
        //            r.Add(f[5], (DataTable)_r._d);
        //        }
        //    }
        //    return r;
        //}
        public bool V(object d)
        {
            return true;
        }
        public R G()
        {
            return _r;
        }
        public X EX()
        {
            if (_r._e) return this;

            switch (_a[0][0])
            {
                case 'G': GD(_sql); break;
                case 'I': I(_sql); break;
                case 'P': GDP(); break;
                case 'U':
                case 'D': U(_sql); break;
                case 'L': LB(); break;
                case 'S': ES(); break;
                case 'V': VS(); break;
            }
            return this;
        }

        public X Q(string s = "qFields")
        {
            var c = _ip["_c"] as Dictionary<string, object>;
            var f = _ip.ContainsKey("_f") ? _ip["_f"] + "" : "*";
            if (c == null) return this;
            c.Add(s, f);
            return this;
        }
        public X C(string k, object v)
        {
            var c = _ip["_c"] as Dictionary<string, object>;
            if (c == null)
            {
                c = new Dictionary<string, object>();
                _ip["_c"] = c;
            }
            c.Add(k, v);
            return this;
        }
        public string D()
        {
            var c = _ip["_d"] as Dictionary<string, object>;
            if (c == null)
            {
                c = new Dictionary<string, object>();
                _ip["_d"] = c;
            }
            return string.Join(",", c.Keys);
        }

        //public string DT()
        //{
        //    var c = ((object[])_ip["_d"])[0] as Dictionary<string, object>;
        //    if (c == null)
        //    {
        //        c = new Dictionary<string, object>();
        //        _ip["_d"] = c;
        //    }
        //    return string.Join(",", c.Keys);
        //}

        public string DT()
        {
            var abc = (_ip["_d"] as List<object>);
            Dictionary<string, object> c = null;
            if (abc != null)
            {
                c = abc[0] as Dictionary<string, object>;

            }
            else
            {
                c = ((object[])_ip["_d"])[0] as Dictionary<string, object>;
            }
            if (c == null)
            {
                c = new Dictionary<string, object>();
                _ip["_d"] = c;
            }
            return string.Join(",", c.Keys);
        }

        public object C(string k)
        {
            var c = _ip["_c"] as Dictionary<string, object>;
            if (c == null)
            {
                return null;
            }

            return c[k];
        }


        public X VS(string stName = "")
        {
            var c = _ip["_c"] as Dictionary<string, object>;

            if (c == null) return this;
            try
            {
                var dataset = new DataSet();
                using (var conn = new SqlConnection(_cs))
                {
                    var adapter = new SqlDataAdapter
                    {
                        SelectCommand = new SqlCommand(stName == "" ? _a[3] : stName, conn) { CommandType = CommandType.StoredProcedure }
                    };
                    foreach (var para in _st)
                    {
                        adapter.SelectCommand.Parameters.Add("@" + para.Key, para.Value);
                        adapter.SelectCommand.Parameters["@" + para.Key].Value = c.ContainsKey(para.Key) ? c[para.Key] : DBNull.Value;
                    }
                    adapter.Fill(dataset);
                }
                var list = new List<object[]>();
                for (var i = 0; i < dataset.Tables.Count; i++)
                {
                    var t = new List<object>();
                    for (var m = 0; m < dataset.Tables[i].Rows.Count; m++) t.Add(dataset.Tables[i].Rows[m].ItemArray);

                    list.Add(t.ToArray());
                }
                _r._d = list;
                _r._t = list.Count;
            }
            catch (Exception e)
            {
                Log.LogContent("Excute Store: " + e);
            }
            return this;
        }


        public X ES()
        {
            try
            {
                var dataset = new DataSet();
                using (var conn = new SqlConnection(_cs))
                {
                    var adapter = new SqlDataAdapter
                    {
                        SelectCommand = new SqlCommand(_a[3], conn) { CommandType = CommandType.StoredProcedure }
                    };
                    foreach (var para in _st)
                    {
                        adapter.SelectCommand.Parameters.Add("@" + para.Key, para.Value);
                        adapter.SelectCommand.Parameters["@" + para.Key].Value = _ip.ContainsKey(para.Key) ? _ip[para.Key] : 0;
                    }
                    adapter.Fill(dataset);
                }
                var list = new List<object[]>();
                for (var i = 0; i < dataset.Tables.Count; i++)
                {
                    var t = new List<object>();
                    for (var m = 0; m < dataset.Tables[i].Rows.Count; m++) t.Add(dataset.Tables[i].Rows[m].ItemArray);

                    list.Add(t.ToArray());
                }
                _r._d = list;
                _r._t = list.Count;
            }
            catch (Exception e)
            {
                Log.LogContent("Excute Store: " + e);
            }
            return this;
        }

        public X ESL()
        {
            try
            {
                var dataset = new DataSet();
                using (var conn = new SqlConnection(_cs))
                {
                    var adapter = new SqlDataAdapter
                    {
                        SelectCommand = new SqlCommand("GetDataFirst", conn) { CommandType = CommandType.StoredProcedure }
                    };
                    foreach (var para in _st)
                    {
                        adapter.SelectCommand.Parameters.Add("@" + para.Key, para.Value);
                        adapter.SelectCommand.Parameters["@" + para.Key].Value = _ip.ContainsKey(para.Key) ? _ip[para.Key] : 0;
                    }
                    adapter.Fill(dataset);
                }
                var list = new List<object[]>();
                for (var i = 0; i < dataset.Tables.Count; i++)
                {
                    var t = new List<object>();
                    for (var m = 0; m < dataset.Tables[i].Rows.Count; m++) t.Add(dataset.Tables[i].Rows[m].ItemArray);

                    list.Add(t.ToArray());
                }
                _r._d = list;
                _r._t = list.Count;
            }
            catch (Exception e)
            {
                Log.LogContent("Excute Store: " + e);
            }
            return this;
        }

        public X EXO(string[] sql)
        {
            if (_r._e) return this;
            switch (_a[0][0])
            {
                case 'G':
                case 'I': IO(sql); break;
                case 'U': UO(sql); break;
                //case 'D': U(sql); break;
                case 'S': GDS(sql[0], _a[4]); break;
            }
            return this;
        }
        public X S()
        {
            if (_r._e) return this;
            var v = _a[0][0] == 'G' ? _a[4] : _a[3];
            switch (_a[0][0])
            {
                case 'G': G(v, _f, _cc, _c); break;
                case 'I': I(v, _d); break;
                case 'U': U(v, _cc, _c, _d); break;
                case 'D': R(v, _cc, _c); break;

            }
            return this;
        }
        public X S1()
        {
            if (_r._e) return this;
            var v = _a[0][0] == 'G' ? _a[4] : _a[3];
            switch (_a[0][0])
            {
                case 'G': G(v, _f, _cc, _c); break;
                case 'I': I(v, _d); break;
                case 'U': U1(v, _cc, _c, _d); break;
                case 'D': R(v, _cc, _c); break;

            }
            return this;
        }
        void GD(string sql)
        {       //Get data
            var result = new DataTable();
            var con = new SqlConnection(_cs);
            //using (var con = new SqlConnection(_cs))
            //{
            var cmd = new SqlCommand(sql, con);
            cmd.Connection.Open();
            var adap = new SqlDataAdapter(cmd);
            try
            {
                adap.Fill(result);
                var list = new List<object[]>();
                for (var m = 0; m < result.Rows.Count; m++) list.Add(result.Rows[m].ItemArray);
                _r._d = list;
                _r._t = result.Rows.Count;
            }
            catch (Exception ex)
            {
                _r._s = 0;
                _r._m = (ex.ToString());// _E.E10009.G(_isDebug, ex);
                Log.LogContent("GD: (" + _E.E10009 + ") " + ex.ToString() + " \n- SQL: " + sql);
            }
            finally
            {
                adap.Dispose(); cmd.Dispose(); con.Close();
            }
            //}
        }

        public void LB()
        {
            try
            {
                var compId = _ip.ContainsKey("_cid") ? _ip["_cid"] : 0;
                var tripId = _ip.ContainsKey("_tid") ? _ip["_tid"] : 0;
                var dataset = new DataSet();
                using (var conn = new SqlConnection(_cs))
                {
                    var adapter = new SqlDataAdapter
                    {
                        SelectCommand = new SqlCommand("LoadBms", conn) { CommandType = CommandType.StoredProcedure }
                    };
                    adapter.SelectCommand.Parameters.Add("@compId", SqlDbType.Int);
                    adapter.SelectCommand.Parameters["@compId"].Value = compId;
                    adapter.SelectCommand.Parameters.Add("@tripId", SqlDbType.Int);
                    adapter.SelectCommand.Parameters["@tripId"].Value = tripId;
                    if (_ip.ContainsKey("_tD"))
                    {
                        adapter.SelectCommand.Parameters.Add("@trDate", SqlDbType.Date);
                        adapter.SelectCommand.Parameters["@trDate"].Value = _ip["_tD"];
                    }
                    if (_ip.ContainsKey("_tT"))
                    {
                        adapter.SelectCommand.Parameters.Add("@trTime", SqlDbType.Time);
                        adapter.SelectCommand.Parameters["@trTime"].Value = _ip["_tT"];
                    }
                    adapter.Fill(dataset);
                }

                var list = new List<object[]>();
                for (var i = 0; i < dataset.Tables.Count; i++)
                {
                    var t = new List<object>();
                    for (var m = 0; m < dataset.Tables[i].Rows.Count; m++) t.Add(dataset.Tables[i].Rows[m].ItemArray);

                    list.Add(t.ToArray());
                }
                _r._d = list;
                _r._t = list.Count;
            }
            catch (Exception e)
            {
                Log.LogContent("LB: " + e);
            }
        }
        public void GDP()
        {
            var se = _ip.ContainsKey("_se") ? _ip["_se"] + "" : " Id desc";
            var ft = _ip.ContainsKey("_ft") ? _ip["_ft"] + "" : "";
            var f = _ip.ContainsKey("_f") ? _ip["_f"] + "" : "*";
            var mr = _ip.ContainsKey("_mr") ? Convert.ToInt32(_ip["_mr"]) : 25;
            var si = _ip.ContainsKey("_si") ? Convert.ToInt32(_ip["_si"]) : 1;
            var table = _a[0][0] == 'P' ? _a[4] : _a[3];
            //---------------------------------------------------------------
            var cmd = new SqlCommand { CommandText = "GetRowNum", CommandType = CommandType.StoredProcedure };
            cmd.Parameters.Add("@sort", SqlDbType.NVarChar);
            cmd.Parameters["@sort"].Value = se;
            cmd.Parameters.Add("@table", SqlDbType.NVarChar);
            cmd.Parameters["@table"].Value = table;
            cmd.Parameters.Add("@column", SqlDbType.NVarChar);
            cmd.Parameters["@column"].Value = f;
            cmd.Parameters.Add("@filter", SqlDbType.NVarChar);
            cmd.Parameters["@filter"].Value = ft;
            cmd.Parameters.Add("@SL", SqlDbType.Int);
            cmd.Parameters["@SL"].Value = mr;
            cmd.Parameters.Add("@index", SqlDbType.Int);
            cmd.Parameters["@index"].Value = si;

            var pIdOut = new SqlParameter("@p_Count_out", SqlDbType.Int) { Direction = ParameterDirection.Output };
            cmd.Parameters.Add(pIdOut);

            var dt = ExecuteProcedureData(cmd, _cs);
            var total = 0;
            if ((pIdOut.Value != DBNull.Value))
                total = Convert.ToInt32(pIdOut.Value);

            var list = new List<object[]>();
            for (var m = 0; m < dt.Rows.Count; m++) list.Add(dt.Rows[m].ItemArray);
            _r._d = list; _r._t = total;
        }//end proc
        public void GDS(string sql, string p)
        {
            //---------------------------------------------------------------
            var cmd = new SqlCommand { CommandText = p, CommandType = CommandType.StoredProcedure };
            cmd.Parameters.Add("@sql", SqlDbType.NVarChar);
            cmd.Parameters["@sql"].Value = sql;

            var pIdOut = new SqlParameter("@p_Count_out", SqlDbType.Int) { Direction = ParameterDirection.Output };
            cmd.Parameters.Add(pIdOut);

            var dt = ExecuteProcedureData(cmd, _cs);
            var total = 0;
            if ((pIdOut.Value != DBNull.Value))
                total = Convert.ToInt32(pIdOut.Value);

            var list = new List<object[]>();
            for (var m = 0; m < dt.Rows.Count; m++) list.Add(dt.Rows[m].ItemArray);
            _r._d = list; _r._t = total;
        }
        public static void ExecuteProcedureDataReader(SqlCommand cmd, string strConnect, out IDataReader dt)
        {
            using (var myCon = new SqlConnection((strConnect)))
            {
                myCon.Open();
                var transaction = myCon.BeginTransaction(IsolationLevel.ReadCommitted, "Sample Transaction 0901");
                try
                {
                    cmd.CommandTimeout = 36000;
                    cmd.Connection = myCon;
                    dt = cmd.ExecuteReader();
                    //var dataAdapter = new SqlDataAdapter { SelectCommand = cmd };
                    //dataAdapter.SelectCommand.Transaction = transaction;
                    //dataAdapter.SelectCommand.Connection = myCon;
                    //dataAdapter.Fill(dt);
                    //transaction.Commit();
                }
                catch (Exception)
                {
                    dt = null;
                    try
                    {
                        transaction.Rollback();
                    }
                    catch (SqlException)
                    {
                        if (transaction.Connection != null)
                        {
                            //NoneException(ex);
                        }
                    }
                    //NoneException(e);
                }
            }
        }
        public static DataTable ExecuteProcedureData(SqlCommand cmd, string strConnect)
        {
            var dt = new DataTable();
            using (var myCon = new SqlConnection((strConnect)))
            {
                myCon.Open();
                var transaction = myCon.BeginTransaction(IsolationLevel.ReadCommitted, "Sample Transaction 0901");
                try
                {
                    cmd.CommandTimeout = 36000;
                    var dataAdapter = new SqlDataAdapter { SelectCommand = cmd };
                    dataAdapter.SelectCommand.Transaction = transaction;
                    dataAdapter.SelectCommand.Connection = myCon;
                    dataAdapter.Fill(dt);
                    transaction.Commit();
                }
                catch (Exception)
                {
                    try
                    {
                        transaction.Rollback();
                    }
                    catch (SqlException)
                    {
                        if (transaction.Connection != null)
                        {
                            //NoneException(ex);
                        }
                    }
                    //NoneException(e);
                }
            }
            return dt;
        }
        /*
                void Gd(string sql)
                {       //Get data
                    var result = new DataTable();
                    using (var con = new SqlConnection(_cs))
                    {
                        var cmd = new SqlCommand(sql, con);
                        cmd.Connection.Open();
                        var adap = new SqlDataAdapter(cmd);
                        try
                        {
                            adap.Fill(result);
                            //_r._d = result;
                            var list = new List<object[]>();
                            for (var m = 0; m < result.Rows.Count; m++) list.Add(result.Rows[m].ItemArray);
                            _r._d = list; _r._t = result.Rows.Count;
                        }
                        catch (Exception ex) { _r._s = 0; _r._m = _E.E10009.G(_isDebug, ex); }
                        finally { adap.Dispose(); cmd.Dispose(); con.Close(); }
                    }
                }
        */
        public X EX2(string[] sql)
        {
            if (_r._e) return this;
            foreach (var s in sql)
            {
                Log.LogSQL(s);
            }
            switch (_a[0][0])
            {
                case 'G':
                case 'I': I2(sql); break;
                case 'U': U2(sql); break;
                //case 'U': UO(sql); break;
                //case 'D': U(sql); break;
                case 'S': GDS(sql[0], _a[4]); break;
            }
            return this;
        }

        void I2(IEnumerable<string> sqls)
        {
            var con = new SqlConnection(_cs);
            con.Open();
            var lI = new List<int>();
            var mT = con.BeginTransaction();
            var stop = false;
            SqlCommand cmd = null;
            try
            {
                foreach (var sql in sqls)
                {
                    cmd = new SqlCommand(sql, con) { Transaction = mT };
                    var result = cmd.ExecuteScalar();
                    var s = Convert.ToString(result);
                    int v = Convert.ToInt32(result);
                    if (!string.IsNullOrEmpty(s) && !lI.Contains(v)) lI.Add(v);
                    else
                    {
                        _r._s = 0;
                        _r._m = _E.E10009.G(_isDebug, null);
                        mT.Rollback();
                        stop = true;
                        break;
                    }
                }
                _r._d = new List<object[]> { lI.Cast<object>().ToArray() };
                if (!stop) mT.Commit();
            }
            catch (Exception ex)
            {
                if (cmd != null) cmd.Dispose();
                mT.Rollback();
                _r._s = 0;
                _r._m = ex.ToString(); //_E.E10009.G(_isDebug, ex);
                Log.LogContent("I2: (" + _E.E10009 + ") " + ex.ToString() + " \n- SQL: " + string.Join(";", sqls));
            }
            finally
            {
                con.Close();
            }
        }

        void U2(IEnumerable<string> sqls)
        {
            var con = new SqlConnection(_cs);
            con.Open();
            var lI = new List<int>();
            var mT = con.BeginTransaction();
            SqlCommand cmd = null;
            try
            {
                foreach (var sql in sqls)
                {
                    cmd = new SqlCommand(sql, con) { Transaction = mT };
                    var v = cmd.ExecuteNonQuery();
                    lI.Add(v);
                }
                _r._d = new List<object[]> { lI.Cast<object>().ToArray() };
                mT.Commit();
            }
            catch (Exception ex)
            {
                if (cmd != null) cmd.Dispose();
                mT.Rollback();
                _r._s = 0;
                _r._m = ex.ToString(); //_E.E10009.G(_isDebug, ex);
                Log.LogContent("U2: (" + _E.E10009 + ") " + ex.ToString() + " \n- SQL: " + string.Join(";", sqls));
            }
            finally
            {
                con.Close();
            }
        }

        void IO(IEnumerable<string> sql)
        {
            var mC = new SqlConnection(_cs);
            mC.Open();
            var mT = mC.BeginTransaction();      // Start a local transaction.

            var lI = new List<int>();
            try
            {
                foreach (var t in sql)
                {
                    var mD = mC.CreateCommand();       // Enlist the command in the current transaction.
                    mD.CommandTimeout = 36000;
                    mD.Transaction = mT;
                    mD.CommandType = CommandType.StoredProcedure;
                    mD.CommandText = "MyProcess";
                    mD.Parameters.Add("@_sql", SqlDbType.NVarChar);
                    mD.Parameters["@_sql"].Value = t;
                    var pIdOut = new SqlParameter("@p_Id_out", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    mD.Parameters.Add(pIdOut);
                    mD.ExecuteNonQuery();
                    //mD.ExecuteScalar();
                    if (!string.IsNullOrEmpty(pIdOut.Value + "") && !lI.Contains((int)pIdOut.Value))
                        lI.Add((int)pIdOut.Value);
                    else
                    {
                        mC.Close();
                        _r._s = 0;
                        _r._m = _E.E10009.G(_isDebug, null);
                        Log.LogContent("IO: (" + _E.E10009 + ") " + " \n- SQL: " + t);
                        return;
                    }
                }
                _r._d = new List<object[]> { lI.Cast<object>().ToArray() }; mT.Commit();
            }
            catch (Exception ex)
            {
                try
                {
                    mT.Rollback();
                }
                catch (SqlException)
                {
                    if (mT.Connection != null)
                    {
                        //NoneException(ex);
                    }
                }
                Log.LogContent("IO: (" + _E.E10009 + ") " + ex.ToString() + " \n- SQL: " + sql.ToString());
                //NoneException(e);
            }
            finally
            {
                mC.Close();
            }
        }
        void UO(IEnumerable<string> sql)
        {
            var mC = new SqlConnection(_cs);
            mC.Open();
            var mT = mC.BeginTransaction();      // Start a local transaction.
            var lI = new List<int>();
            try
            {
                foreach (var t1 in sql)
                {
                    var mD = mC.CreateCommand();       // Enlist the command in the current transaction.
                    mD.CommandTimeout = 36000;
                    mD.Transaction = mT;
                    mD.CommandType = CommandType.StoredProcedure;
                    mD.CommandText = "MyProcess1";
                    mD.Parameters.Add("@_sql", SqlDbType.NVarChar);
                    mD.Parameters["@_sql"].Value = t1;
                    var t = mD.ExecuteNonQuery();
                    if (t > 0) lI.Add(t);
                    else
                    {
                        mC.Close();
                        _r._s = 0;
                        _r._m = _E.E10009.G(_isDebug, null);
                        Log.LogContent("UO: (" + _E.E10009 + ") \n- SQL: " + t1);
                        return;
                    }
                }
                _r._d = new List<object[]> { lI.Cast<object>().ToArray() }; mT.Commit();
            }
            catch (Exception ex)
            {
                try
                {
                    mT.Rollback();
                }
                catch (SqlException)
                {
                    if (mT.Connection != null)
                    {
                        //NoneException(ex);
                    }
                }
                Log.LogContent("UO: (" + _E.E10009 + ") " + ex.ToString() + " \n- SQL: " + sql.ToString());
            }
            finally
            {
                mC.Close();
            }
        }
        public bool DT(string[] ls)     // Do transaction list non query
        {
            var mC = new SqlConnection(_cs);
            mC.Open();
            var mT = mC.BeginTransaction();      // Start a local transaction.
            var mD = mC.CreateCommand();       // Enlist the command in the current transaction.
            mD.CommandTimeout = 36000;
            mD.Transaction = mT;
            try
            {
                var curCount = 0;
                if (ls.Length > 0)
                    while (curCount < ls.Length)
                    {
                        var sumSql = "";
                        var tmp = curCount;
                        while (curCount < tmp + 35 && curCount < ls.Length)
                        {
                            sumSql += ls[curCount];
                            curCount++;
                        }
                        if (sumSql.Length > 0)
                        {
                            mD.CommandText = sumSql;
                            mD.ExecuteNonQuery();
                        }
                    }
                mT.Commit();
                return true;
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
                    Log.LogContent("DT: (" + _E.E10009 + ") " + ex.ToString() + " - ls: " + ls.ToString());
                }
                _r._s = 0;
                _r._m = e.ToString();//_E.E10009.G(_isDebug, e);
                Log.LogContent("DT: (" + _E.E10009 + ") " + e.ToString() + " - ls: " + ls.ToString());
            }
            finally
            {
                mC.Close();
            }
            return false;
        }
        void I(string sql)
        {
            var con = new SqlConnection(_cs);
            //using (var con = new SqlConnection(_cs))
            //{
            var cmd = new SqlCommand(sql, con);
            cmd.Connection.Open();
            try
            {
                var result = cmd.ExecuteScalar();
                _r._d = new List<object[]> { new[] { result } };
            }
            catch (Exception ex)
            {
                _r._s = 0;
                _r._m = ex.ToString();//_E.E10009.G(_isDebug, ex);
                Log.LogContent("I: (" + _E.E10009 + ") " + ex.ToString() + " \n- SQL: " + sql);
            }
            finally { cmd.Dispose(); con.Close(); }
            //}
        }
        void U(string sql)
        {
            var con = new SqlConnection(_cs);
            //using (var con = new SqlConnection(_cs))
            //{
            var cmd = new SqlCommand(sql, con);
            cmd.Connection.Open();
            try
            {
                var result = cmd.ExecuteNonQuery();
                _r._d = new List<object[]> { new object[] { result } };
            }
            catch (Exception ex)
            {
                _r._s = 0;
                _r._m = ex.ToString();//_E.E10009.G(_isDebug, null);
                Log.LogContent("U: (" + _E.E10009 + ") " + ex.ToString() + " \n- SQL: " + sql);
            }
            finally { cmd.Dispose(); con.Close(); }
            //}
        }
        public void I(string v, List<string[]> d)
        {
            var r = LI(d); _sql = string.Format("INSERT {0} ({1}) VALUES ({2}); SELECT SCOPE_IDENTITY();", v, r[0], r[1]);
        }
        public void U(string v, int l, string[][] c, List<string[]> d)
        {
            _sql = string.Format("UPDATE {0} SET {1} {2}", v, LU(d), LU(c, l));      //{2} if WHERE is _c not null
        }
        public void U1(string v, int l, string[][] c, List<string[]> d)
        {
            _sql = string.Format("UPDATE {0} SET {1} {2}", v, LU(d), LU1(c, l));      //{2} if WHERE is _c not null
        }
        public void R(string v, int l, string[][] c)
        {
            _sql = string.Format("DELETE FROM {0} {1}", v, LW(c, l));
        }
        public void G(string v, string f, int l, string[][] c)
        {
            _sql = string.Format("SELECT {0} FROM {1} {2}", _f, v, LW(c, l));
        }
        public string ReplaceString(string value)
        {
            string[] arr = { "--", " or ", " OR ", " and ", " AND ", "orderby", "ORDERBY", "union", "UNION", "select", "SELECT", "order", "ORDER", "information_schema", "INFORMATION_SCHEMA", "order", "ORDER", "insert", "INSERT", "drop", "DROP", "load_file", "LOAD_FILE", "update", "UPDATE", "DELETE", "delete", "like", "LIKE" };
            StringBuilder b = new StringBuilder(value);
            for (int i = 0; i < arr.Length; i++)
            {
                if (value.Contains(arr[i]))
                    b.Replace(arr[i], string.Empty);
            }
            return b.ToString();
        }
        public static string MD5Hash(string text)
        {
            MD5 md5 = new MD5CryptoServiceProvider();

            //compute hash from the bytes of text
            md5.ComputeHash(ASCIIEncoding.ASCII.GetBytes(text));

            //get hash result after compute it
            byte[] result = md5.Hash;

            StringBuilder strBuilder = new StringBuilder();
            for (int i = 0; i < result.Length; i++)
            {
                //change it into 2 hexadecimal digits
                //for each byte
                strBuilder.Append(result[i].ToString("x2"));
            }

            return strBuilder.ToString();
        }

        public void Insert()
        {
            var compId = _ip.ContainsKey("_cid") ? _ip["_cid"] : 0;
            var tripId = _ip.ContainsKey("_tid") ? _ip["_tid"] : 0;
            DataSet dataset = new DataSet();
            using (SqlConnection conn = new SqlConnection(_cs))
            {
                SqlDataAdapter adapter = new SqlDataAdapter();
                adapter.SelectCommand = new SqlCommand("LoadBms", conn);
                adapter.SelectCommand.CommandType = CommandType.StoredProcedure;
                adapter.SelectCommand.Parameters.Add("@compId", SqlDbType.Int);
                adapter.SelectCommand.Parameters["@compId"].Value = compId;
                adapter.SelectCommand.Parameters.Add("@tripId", SqlDbType.Int);
                adapter.SelectCommand.Parameters["@tripId"].Value = tripId;
                adapter.Fill(dataset);
            }
            //---------------------------------------------------------------
            //var cmd = new SqlCommand { CommandText = "LoadBms", CommandType = CommandType.StoredProcedure };
            //cmd.Parameters.Add("@compId", SqlDbType.Int);
            //cmd.Parameters["@compId"].Value = compId;
            //cmd.Parameters.Add("@tripId", SqlDbType.Int);
            //cmd.Parameters["@tripId"].Value = tripId;

            //DataSet datasedt = new DataSet();
            //SqlDataAdapter adapdter = new SqlDataAdapter();
            //adapter.SelectCommand = new SqlCommand("MyProcedure", conn);
            //adapter.SelectCommand.CommandType = CommandType.StoredProcedure;
            //adapter.Fill(dataset);

            var list = new List<object[]>();
            for (var i = 0; i < dataset.Tables.Count; i++)
            {
                var t = new List<object>();
                for (var m = 0; m < dataset.Tables[i].Rows.Count; m++) t.Add(dataset.Tables[i].Rows[m].ItemArray);

                list.Add(t.ToArray());
            }
            _r._d = list; _r._t = list.Count;
        }

        public X Excuse()
        {
            if (_r._e) return this;
            switch (_a[0][0])
            {
                case 'I': InsertBookingTicket(); break;
                case 'U': UpdateTicketStatus(); break;
                case 'C':GetCustomers();break;
            }
            return this;
        }

        public void GetCustomers()
        {
            try
            {
                var dataset = new DataSet();
                using (var conn = new SqlConnection(_cs))
                {
                    var adapter = new SqlDataAdapter
                    {
                        SelectCommand = new SqlCommand("GetCustomers", conn) { CommandType = CommandType.StoredProcedure }
                    };
                    adapter.SelectCommand.Parameters.AddWithValue("@compId",_ip.ContainsKey("compId") ? _ip["compId"]:-1);
                    adapter.SelectCommand.Parameters.AddWithValue("@fromDate", _ip.ContainsKey("fromDate") ? _ip["fromDate"] : -1);
                    adapter.SelectCommand.Parameters.AddWithValue("@toDate", _ip.ContainsKey("toDate") ? _ip["toDate"] : -1);
                    adapter.SelectCommand.Parameters.AddWithValue("@order", _ip.ContainsKey("order") ? _ip["order"] : -1);
                    adapter.SelectCommand.Parameters.AddWithValue("@names", _ip.ContainsKey("names") ? _ip["names"] : -1);
                    adapter.SelectCommand.Parameters.AddWithValue("@phones", _ip.ContainsKey("phones") ? _ip["phones"] : -1);
                    adapter.SelectCommand.Parameters.AddWithValue("@emails", _ip.ContainsKey("emails") ? _ip["emails"] : -1);

                    adapter.Fill(dataset);
                }

                
                var t = new List<object[]>();
                for (var m = 0; m < dataset.Tables[0].Rows.Count; m++) t.Add(dataset.Tables[0].Rows[m].ItemArray);
                
                _r._d = t;
                _r._t = t.Count;
            }
            catch (Exception e)
            {
                Log.LogContent("LB: " + e);
            }

        }
        public void UpdateTicketStatus()
        {
            var bookingCode = _ip.ContainsKey("bookingCode") ? _ip["bookingCode"] : "";
            var actor = _ip.ContainsKey("actor") ? _ip["actor"] : "";
            var transactionStatus = _ip.ContainsKey("transactionStatus") ? Convert.ToInt32(_ip["transactionStatus"]) : 0;
            var paymentMethod = _ip.ContainsKey("paymentMethod") ? _ip["paymentMethod"] : "";
            var note = _ip.ContainsKey("note") ? _ip["note"] : "";

            var cmd = new SqlCommand { CommandText = "UpdateTicketStatus", CommandType = CommandType.StoredProcedure };
            cmd.Parameters.Add("@BookingCode", SqlDbType.NVarChar); cmd.Parameters["@BookingCode"].Value = bookingCode;
            cmd.Parameters.Add("@Actor", SqlDbType.NVarChar); cmd.Parameters["@Actor"].Value = actor;
            cmd.Parameters.Add("@TransactionStatus", SqlDbType.Int); cmd.Parameters["@TransactionStatus"].Value = transactionStatus;
            cmd.Parameters.Add("@PaymentMethod", SqlDbType.Int); cmd.Parameters["@PaymentMethod"].Value = paymentMethod;
            cmd.Parameters.Add("@Note", SqlDbType.NVarChar); cmd.Parameters["@Note"].Value = note;

            var dt = ExecuteProcedureData(cmd, _cs);

            var list = new List<object[]>();
            _r._s = 0;
            if (dt.Rows.Count > 0)
            {
                _r._s = Convert.ToInt32(dt.Rows[0][0]);
            };
        }

        public void InsertBookingTicket()
        {
            var customerPhone = _ip.ContainsKey("customerPhone") ? _ip["customerPhone"] : "";
            var address = _ip.ContainsKey("address") ? _ip["address"] : "";
            var cityId = _ip.ContainsKey("cityId") ? Convert.ToInt32(_ip["cityId"]) : 0;
            var districtId = _ip.ContainsKey("districtId") ? Convert.ToInt32(_ip["districtId"]) : 0;
            var cityName = _ip.ContainsKey("cityName") ? _ip["cityName"] : "";
            var districtName = _ip.ContainsKey("districtName") ? _ip["districtName"] : "";
            var bookingCode = _ip.ContainsKey("bookingCode") ? _ip["bookingCode"] : "";
            var ticketCode = _ip.ContainsKey("ticketCode") ? _ip["ticketCode"] : "";
            var actor = _ip.ContainsKey("actor") ? _ip["actor"] : "";
            var paymentMethod = _ip.ContainsKey("paymentMethod") ? _ip["paymentMethod"] : "";
            var source = _ip.ContainsKey("source") ? _ip["source"] : "";
            var bankCode = _ip.ContainsKey("bankCode") ? _ip["bankCode"] : "";

            //            var table = _a[0][0] == 'P' ? _a[4] : _a[3];
            //---------------------------------------------------------------
            var cmd = new SqlCommand { CommandText = "InsertCodTicket", CommandType = CommandType.StoredProcedure };
            cmd.Parameters.Add("@CustomerPhone", SqlDbType.NVarChar); cmd.Parameters["@CustomerPhone"].Value = customerPhone;
            cmd.Parameters.Add("@Address", SqlDbType.NVarChar); cmd.Parameters["@Address"].Value = address;
            cmd.Parameters.Add("@CityId", SqlDbType.Int); cmd.Parameters["@CityId"].Value = cityId;
            cmd.Parameters.Add("@DistrictId", SqlDbType.Int); cmd.Parameters["@DistrictId"].Value = districtId;
            cmd.Parameters.Add("@CityName", SqlDbType.NVarChar); cmd.Parameters["@CityName"].Value = cityName;
            cmd.Parameters.Add("@DistrictName", SqlDbType.NVarChar); cmd.Parameters["@DistrictName"].Value = districtName;
            cmd.Parameters.Add("@BookingCode", SqlDbType.NVarChar); cmd.Parameters["@BookingCode"].Value = bookingCode;
            cmd.Parameters.Add("@TicketCode", SqlDbType.NVarChar); cmd.Parameters["@TicketCode"].Value = ticketCode;
            cmd.Parameters.Add("@Actor", SqlDbType.NVarChar); cmd.Parameters["@Actor"].Value = actor;
            cmd.Parameters.Add("@PaymentMethod", SqlDbType.Int); cmd.Parameters["@PaymentMethod"].Value = paymentMethod;
            cmd.Parameters.Add("@Source", SqlDbType.Int); cmd.Parameters["@Source"].Value = source;
            cmd.Parameters.Add("@BankCode", SqlDbType.NVarChar); cmd.Parameters["@BankCode"].Value = bankCode;


            var dt = ExecuteProcedureData(cmd, _cs);

            var list = new List<object[]>();
            _r._s = 0;
            if (dt.Rows.Count > 0)
            {
                _r._s = Convert.ToInt32(dt.Rows[0][0]);
            };
        }
    }
}
