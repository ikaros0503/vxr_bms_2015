using System.Collections.Generic;
using Newtonsoft.Json;

namespace Vxr.Bms.Models
{
    public class RC
    {
        public class CaptchaResponse
        {
            [JsonProperty("success")]
            public bool Success { get; set; }

            [JsonProperty("error-codes")]
            public List<string> ErrorCodes { get; set; }
        }
    }
}