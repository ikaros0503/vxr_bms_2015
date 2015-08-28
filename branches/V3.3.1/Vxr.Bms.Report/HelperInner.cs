using System;
using System.Data;
using System.Data.SqlClient;

namespace Vxr.Bms.Report
{
    internal class HelperInner
    {
        private HelperInner()
        {
        }

        public static DataTable GetDataTable(string query, string server)
        {
            DataTable dataTable = new DataTable();
            string str = server;
            using (SqlConnection connection = new SqlConnection(server))
            {
                connection.Open();
                SqlDataAdapter adapter = new SqlDataAdapter {
                    SelectCommand = new SqlCommand(query, connection)
                };
                try
                {
                    try
                    {
                        adapter.Fill(dataTable);
                    }
                    catch (Exception)
                    {
                    }
                    return dataTable;
                }
                finally
                {
                }
            }
            return dataTable;
        }
    }
}

