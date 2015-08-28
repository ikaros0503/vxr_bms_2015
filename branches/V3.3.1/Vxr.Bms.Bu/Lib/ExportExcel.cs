//using DocumentFormat.OpenXml.Spreadsheet;

using System.Collections.Generic;
using System.IO;
using OfficeOpenXml;
using OfficeOpenXml.Style;

namespace Vxr.Bms.Bu.Lib
{
    public class ExportExcel
    {
        public void CreateBackUpFile(string filePath, List<string> fields, List<object[]> data, string title)
        {
            using (var p = new ExcelPackage())
            {
               
                //Here setting some document properties
                p.Workbook.Properties.Author = "VeXeRe JSC";
                p.Workbook.Properties.Title = title;

                //Create a sheet
                p.Workbook.Worksheets.Add("Sheet1");
                var ws = p.Workbook.Worksheets[1];
                ws.Name = "Sheet1"; //Setting Sheet's name
                ws.Cells.Style.Font.Size = 11; //Default font size for whole sheet
                ws.Cells.Style.Font.Name = "Calibri"; //Default Font name for whole sheet

                //Merging cells and create a center heading for out table
                ws.Cells[1, 1].Value = title.ToUpper();
                ws.Cells[1, 1, 1, fields.Count].Merge = true;
                ws.Cells[1, 1, 1, fields.Count].Style.Font.Bold = true;
                ws.Cells[1, 1, 1, fields.Count].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                //Add headings
                for (var i = 0; i < fields.Count; i++)
                {
                    var cell = ws.Cells[2, i + 1];
                    cell.Style.Font.Bold = true;
                    cell.Value = fields[i];
                }

                //Add data
                for (var j = 0; j < data.Count; j++)
                {
                    for (var k = 0; k < data[j].Length; k++)
                    {
                        var cell = ws.Cells[j + 3, k + 1];
                        cell.Value = data[j][k];
                    }
                }

                //Generate A File with Random name
                var bin = p.GetAsByteArray();
                File.WriteAllBytes(filePath, bin);

            }

        }

    }
}
