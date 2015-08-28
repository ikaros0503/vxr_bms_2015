<%@ Page Async="true" Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Vxr.Bms.Api.Client.Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <script src="Scripts/pace/pace.min.js"></script>
    <link href="Scripts/pace/minimal.css" rel="stylesheet" />
</head>
<body>
    <form id="form1" runat="server">
    <div>
        
        Booking Service Demo<br />
        <br />
        <asp:TextBox ID="txt_Trip" TextMode="multiline" Columns="50" Rows="5" runat="server"></asp:TextBox>
        
        <br />
        <asp:Button ID="bt_GetTrip" runat="server" OnClick="bt_GetTrip_Click" Text="GetTrip" />
        <asp:Button ID="bt_GetBusStatus" runat="server" Text="GetBusStatus" OnClick="bt_GetBusStatus_Click" />
        <br />
        <br />
        <br />
        <asp:TextBox ID="txt_BookTicket" TextMode="multiline" Columns="50" Rows="5"  runat="server"></asp:TextBox>
        <br />
        <asp:Button ID="bt_BookTicket" runat="server" Text="BookTicket" OnClick="bt_BookTicket_Click" />
        
        <asp:Button ID="bt_BookTicketJS" runat="server" Text="BookTicket JS" />
        
        <asp:Button ID="btn_UpdateTicketJS" runat="server" Text="UpdateTicketJS" />
        
        <br />
        
        <br />
        <asp:Label ID="lbl_Username" runat="server" Text="Username"></asp:Label>
        :
        <asp:TextBox ID="txt_Username" runat="server"></asp:TextBox>
&nbsp;<asp:Label ID="lbl_Password" runat="server" Text="Password"></asp:Label>
        :
        <asp:TextBox ID="txt_Password" TextMode="Password" runat="server"></asp:TextBox>
        
    &nbsp;<asp:Button ID="btn_Login" runat="server" OnClick="btn_Login_Click" Text="Login" />
        
    </div>
    </form>
    <script src="//code.jquery.com/jquery-1.11.2.min.js"></script>
    <script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
    <script type="text/javascript">
        $(document).ready(function() {
            $('#bt_BookTicketJS').on('click', function(e) {
                e.preventDefault();
                var obj = {
                    _a: "BookTicket",
                    _c: [
                        {
                            TripId: 1115,
                            SeatCode: "B11|1|1|3",
                            PickupDate: "2015-03-15T17:00:00.000",
                            Bus: 0,
                            StageCode: 31
                        },

                        {
                            TripId: 1115,
                            SeatCode: "C11|1|1|5",
                            PickupDate: "2015-03-15T17:00:00.000",
                            Bus: 0,
                            StageCode: 31
                        }
                    ],
                    _d: [
                        {
                            AgentId: 74,
                            AgentInfo: "74|2|VXR|VeXeRe",
                            CompId: "80",
                            CreatedUser: "admin.vxr",
                            Fare: 250000,
                            IssueDate: "2015-03-15T17:00:00.000",
                            PickupDate: "2015-03-15T17:00:00.000",
                            SeatCode: "B11|1|1|3",
                            SeatType: 2,
                            StageCode: 31,
                            Status: 1,
                            TripAlias: 0,
                            TripDate: "2015-03-15T17:00:00.000",
                            TripId: 1115,
                            CustomerInfo: "1|1|0|Huong008|0902363331||huong001@gmail.com|"
                        },

                        {
                            AgentId: 74,
                            AgentInfo: "74|2|VXR|VeXeRe",
                            CompId: "80",
                            CreatedUser: "admin.vxr",
                            Fare: 250000,
                            IssueDate: "2015-03-15T17:00:00.000",
                            PickupDate: "2015-03-15T17:00:00.000",
                            SeatCode: "C11|1|1|5",
                            SeatType: 2,
                            StageCode: 31,
                            Status: 1,
                            TripAlias: 0,
                            TripDate: "2015-03-15T17:00:00.000",
                            TripId: 1115,
                            CustomerInfo: "1|1|0|Huong009|0902363331||huong001@gmail.com|"
                        }
                    ]
                };

                $.ajax({
                    url: "http://localhost:2015/api/api/booking",
                    type: 'POST',
                    //dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    xhrFields: {
                        withCredentials: true
                    },
                    data: JSON.stringify(obj),
                    success: function(data) {
                        var r = JSON.parse(data);
                        console.log(r);
                    },
                    error: function (jqXhr, textStatus, errorThrown) {
                        console.log(errorThrown);
                    }
                });

            });


            $('#btn_UpdateTicketJS').on('click', function (e) {
                e.preventDefault();
                var obj = {
                    _a: "UpdateBookTicket",
                    _c: [
                        {
                            Bus: 0,
                            Id: 31917,
                            PickupDate: "2015-02-12T14:59:00.000",
                            SeatCode: "A17|1|7|1",
                            TripId: 1115,
                        }
                    ],
                    _d: [
                        {
                            PaymentInfo: "7:VeXeRe:",
                            UserCharge: "admin.saoviet",
                            Status: 2
                        }
                    ]
                };

                $.ajax({
                    url: "http://localhost:2015/api/api/booking",
                    type: 'POST',
                    //dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    xhrFields: {
                        withCredentials: true
                    },
                    data: JSON.stringify(obj),
                    success: function (data) {
                        var r = JSON.parse(data);
                        console.log(r);
                    },
                    error: function (jqXhr, textStatus, errorThrown) {
                        console.log(errorThrown);
                    }
                });

            });
        });
    </script>
</body>
</html>
