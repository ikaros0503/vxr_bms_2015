using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vxr.Bms.AuditLog;

namespace ConsoleApp
{
    class Program
    {
        static void Main(string[] args)
        {
            QueueReader.Read();
        }
    }
}
