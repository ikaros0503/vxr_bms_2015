using System.Collections.Generic;

namespace Vxr.Bms.Core
{
    // ReSharper disable InconsistentNaming
    public class R
    {

        public int _s { get; set; }
        //public object _d { get; set; }
        public List<object[]> _d { get; set; }
        public int _t { get; set; }
        public bool _e { get { return _s.Equals(0); } }
        public string _m { get; set; }
    }
}
