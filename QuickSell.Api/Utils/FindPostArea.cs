namespace QuickSell.Api.Utils;

using System;
using ClosedXML.Excel;



public static class FindPostAreaClass
{
    public static string GetPostArea(string filePath, string postCode)
    {
        using (var workbook = new XLWorkbook(filePath))
        {
            var worksheet = workbook.Worksheet(1); 
            foreach (var row in worksheet.RowsUsed().Skip(1)) 
            {
                string excelPostnummer = row.Cell(1).GetString().PadLeft(4, '0'); // Col 1 is PostCode
                if (excelPostnummer == postCode.PadLeft(4, '0'))
                {
                    return row.Cell(2).GetString(); // Col 2 is PostalArea
                }
            }
        }
        return null;
    }
}

