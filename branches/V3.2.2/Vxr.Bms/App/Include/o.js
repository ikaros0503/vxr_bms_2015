/* Code spirit and naming convention
 * 
 * --------------------------------------------------
 * 
 * 1. Visionaries
 *    > Review the vision frequently!
 *    > Fulfill the duties, don't care too many!
 *    > One way, don't stop, except we are done!
 *    
 * 2. Code in App folder only, NEVER code in Base folder which contain external plugins / libraries!
 *    > If need: override or config in App/Core => See example in html/form or html/table
 * 
 * 3. A module have no sub js folder, and only in a package:
 *    > [Group name].[Module name]
 *    > [Group name].[Parent module name].[Child module name]
 * 
 * 4. Opt = Optimze / Optional = ( Data Structures + Algorithms = Programs )
 *    > o.js = Object | Data Structures (Configs, Trees, Dictionaries, Classes, ...)
 *    > p.js = Process | Algorithms (Functions, Events, ...)
 *    > t.js = Target (Module, Program, Report, Customer, ...) | Temporary (variable, status, memory, caching, code before preview, ...)
 *    
 * 5. Only load z files: z.js, z.css, z.html or z.min.js, z.min.css,  z.min.html
 *    > o.js + p.js + t.js = z.js = z.min.js
 *    > Load z file in development or debug mode
 *    > Load z.min file in testing or production mode
 *    > Todo: v.html => z.html?
 *    > Todo: v.css => z.css?
 * 
 * 6. Always use short name for popular case or localy variables or function
 *    > vRqs => Request | vRqr: Request for report
 *    > o, x, d, c => object, field, data, condition
 *    > (u, r, l, t) => Params of ajax callback methods: u = status, r = results / records, l = length of records, t = total of records or orther target data
 * 
 * 7. Always think and apply:
 *    > Performace => user must happy!
 *    > Core or library for reuseable, changable!
 *    > Modular, independent for manageable, overridable, publishable (no need code!)
 *    > Hook, Publish / event for extendable
 *    > Optmize and concise in action, => love code and development thinking
 *    > Smart comment, log, note, ... => speed up team, done make team to a missing info problem!
 *    > As real life, put things to right place, domain, package, private in module folder or public in core folder, config in o.js, ... 
 * 
 * --------------------------------------------------
 * 
*/

app.mdf = "App"; //Module base folder

/* Config for a module: 
 * Idx 0: Priority (small is hight, zero is lowest)
 * Idx 1: Business type (0 = system, 1 = Manage modules, 2 = Business modules, 3 = report modules, 4 = ext modules)
 * Idx 2: UI type (0=sheet, 1 = popup, 2 = like history panel, 3 = hide friends show with ref = idx 12 or idx 2 , selector = target html), 
 * Idx 3: Auto load type (0 = no load, 1 = auto, 2 = wait for parent module, 3 = always hide),
 * Idx 4: Cache type (0 = no cache, 1 = auto cache)
 * Idx 5: Name 
 * Idx 6: Parent modules name, child module will load only if the parent module is loaded
 * Idx 7: Paths config (Module folder or service url or object config or array config)
 * Idx 8: Rights (Check rights for load, * or empty is ignore check)
 * Idx 9: Open classes with comma (Click event on these classes will open the module to the targer config)
 * Idx 10: Structure config (0 = use default with o.js > p.js > ..., 1 = z file only, 2 = p file only, 3 = o file only)
 * Idx 11: Is load css (0 = no load, 1 = auto load  v.css)
 * Idx 12: Is load template (0 = noload, string = auto load v.html to the target ref)
 * Idx 13: Is load temporary file (0 = noload, 1 = auto load t.js) Todo: Load and use temp file (Idx 13)
 * Idx 14: Is use min files (0 = no, 1 = true, array or object config)
 * Idx 15: Load orther resources (0 = noload, formated string or array or object config)
 * Idx 16: (hidden, no config): Status config (after module loaded => object) 
 * Idx 17: url
 * Idx 18: version
*/

app.bms = { //Base modules
    BksMSeat: [0, 2, 0, 1, 0, 'Seat Model', '', 'Bu/Co.Bks/Model/Seat', '', '', 1, 0, '', 0, 1, ''],
    BksMTicket: [0, 2, 0, 1, 0, 'Ticket Model', '', 'Bu/Co.Bks/Model/Ticket', '', '', 1, 0, '', 0, 1, ''],
    BksCoreModule: [0, 0, 0, 1, 0, 'Core Bks', '', 'Bu/Co.Bks/Core', '', '', 0, 0, '', 0, 1, ''],
    BksShippingCore: [0, 2, 0, 1, 0, 'Core Shipping Module', '', 'Bu/Co.Bks.Shipping/Core', '', '', 1, 0, '', 0, 1, ''],
    BksModule: [0, 2, 0, 1, 0, 'Bks Module', '', 'Bu/Co.Bks/Module/Bks', '', '', 0, 0, '', 0, 1, ''],
};

app.mds = {
    //Business Modules   
    HomeTopMenu: [0, 2, 0, 1, 0, 'Home HomeTopMenu', '', 'Bu/Co.Bks/Module/Home', '', '', 0, 0, '#HomeTopMenu', 0, 1, ''],
    DataCenter: [0, 2, 0, 1, 0, 'Bks Data Center module', '', 'Bu/Co.Bks/Data', '', '', 0, 0, '', 0, 1, '', '', '', ''],
    Router: [0, 2, 0, 1, 0, 'Router', '', 'Bu/Co.Bks/Module/Router', '', '', 0, 0, '', 0, 1, '', '', '', ''],
    BksFilterModule: [0, 2, 0, 1, 0, 'Bks Filter filter module', '', 'Bu/Co.Bks/Module/Filter', '', '', 2, 0, '', 0, 1, '', '', '', ''],
    FSearch: [0, 2, 0, 1, 0, 'Bks Filter filter module', '', 'Bu/Co.Bks/Module/Filter/FSearch', '', '', 0, 0, '#HomeTopSearch', 0, 1, '', '', '', ''],
    FTripModule: [0, 2, 0, 1, 0, 'FTrip filter module', '', 'Bu/Co.Bks/Module/Filter/FTrip', '', '', 0, 0, '', 0, 1, '', '', '', ''],
    FDateModule: [0, 2, 0, 1, 0, 'FDate filter module', '', 'Bu/Co.Bks/Module/Filter/FDate', '', '', 2, 0, '', 0, 1, '', '', '', ''],
    FTimeModule: [0, 2, 0, 1, 0, 'FTime filter module', '', 'Bu/Co.Bks/Module/Filter/FTime', '', '', 2, 0, '', 0, 1, '', '', '', ''],
    BksStatisticModule: [0, 2, 0, 1, 0, 'Bks Statistic module', '', 'Bu/Co.Bks/Module/Statistic', '', '', 0, 0, '', 0, 1, '', '', '', ''],
    BksAdvModule: [0, 2, 0, 1, 0, 'Bks Adv / Extend Module', '', 'Bu/Co.Bks/Module/Adv', '', '', 2, 0, '', 0, 1, '', '', '', ''],
    BksVCModule: [0, 2, 0, 1, 0, 'Bks Adv / Cancelled Module', '', 'Bu/Co.Bks/Module/Adv/VCSheet', '', '', 0, 0, '', 0, 1, '', '', '', ''],
    BksMainModule: [0, 2, 3, 0, 0, 'Booking module', '', 'Bu/Co.Bks/Main', '', 'a.watch-bks', 2, 1, '#bksContent', 0, 1, 'xBksCss:[C]/custom.css, xBksJs:[C]/custom.js', '', '/', ''],
    BksPrintModule: [0, 2, 0, 1, 0, 'Print Bks Module', '', 'Bu/Co.Bks/Module/Print', '', '', 2, 0, '', 0, 1, '', '', '', ''],
    BksVTicketModule: [0, 2, 0, 1, 0, 'Vexere Ticket Module', '', 'Bu/Co.Bks/Module/VTicket', '', '', 2, 0, '', 0, 1, '', '', '', ''],
    BksShippingMain: [0, 2, 0, 0, 0, 'Product Main', 'BksShippingCore', 'Bu/Co.Bks.Shipping/Main', 'S60000', 'a.btn-hang-hoa', 0, 1, '#product-content', 0, 1, '', '', '', ''],
    BksForAgent: [0, 4, 0, 1, 0, 'Agent booking modules', 'B_Co_Bks', 'Bu/Co.Bks.Ag', '~2|2|1', '', 2, 1, '', 0, 1, '', '', '', ''],
    BksWidgetHistory: [0, 4, 2, 1, 0, 'Lịch sử', '', 'Bu/Co.Bks.Wg.History', '', '', 1, 0, '', 0, 1, '', '', '', ''],
    BTickets: [0, 2, 3, 0, 0, 'Vé online', '', 'Bu/Co.Bks/Module/BTicket', '', 'a.watch-tickets', 0, 1, '#bTickets', 0, 1, '', '', 'online-ticket', ''],
    FPrintModule: [0, 2, 0, 1, 0, 'In BKS', '', 'Bu/Co.Bks/Module/Filter/FPrint', '', '', 0, 0, '', 0, 1, '', '', '', ''],
    MTrip2: [0, 2, 3, 0, 0, 'Manage Trips', '', 'Manage/Co.Bo.BusMa', '', 'a.bus-manager', 0, 1, '#busManager', 0, 1, '', '', 'bus-manager', ''],
    MCustomers: [0, 2, 3, 0, 0, 'Manage Customers', '', 'Manage/Co.Bo.Cus', '', 'a.customersManager', 0, 1, '#customerManager', 0, 1, '', '', 'customers', ''],
    

    BksBookModule: [0, 2, 0, 1, 0, 'Bks Book Module', '', 'Bu/Co.Bks/Module/Book', '', '', 0, 0, '', 0, 1, ''],
    BksUpdateHistoryTabModule: [0, 2, 0, 1, 0, 'Bks UpdateHistoryTab Module', 'BksModule', 'Bu/Co.Bks/Module/UpHistory', '', '', 0, 0, '', 0, 1, ''],
    BksUpdateModule: [0, 2, 0, 1, 0, 'Bks Update Module', 'BksModule', 'Bu/Co.Bks/Module/Update', '', '', 0, 0, '', 0, 1, 'xBksCss:[C]/custom.css, xBksJs:[C]/custom.js'],
    BksCancelModule: [0, 2, 0, 1, 0, 'Bks Cancel Module', 'BksModule', 'Bu/Co.Bks/Module/Cancel', '', '', 0, 0, '', 0, 1, ''],
    BksBookMoreModule: [0, 2, 0, 1, 0, 'Bks BookMore Module', 'BksModule', 'Bu/Co.Bks/Module/BookMore', '', '', 0, 0, '', 0, 1, ''],
    BksBookReturnModule: [0, 2, 0, 1, 0, 'Bks BookReturn Module', 'BksModule', 'Bu/Co.Bks/Module/BookReturn', '', '', 0, 0, '', 0, 1, ''],
    BksPrintETicketModule: [0, 2, 0, 1, 0, 'Bks PrintETicket Module', 'BksModule', 'Bu/Co.Bks/Module/PrintETicket', '', '', 0, 0, '', 0, 1, ''],
    BksSuggestCustomerModule: [0, 2, 0, 1, 0, 'Bks SuggestCustomer Module', 'BksModule', 'Bu/Co.Bks/Module/SuggestCus', '', '', 0, 0, '', 0, 1, ''],
    BksWarningCustomerModule: [0, 2, 0, 1, 0, 'Bks WarningCustomer Module', 'BksModule', 'Bu/Co.Bks/Module/WarningCus', '', '', 0, 0, '', 0, 1, ''],
    BksQBookModule: [0, 2, 0, 1, 0, 'Bks Quick Book Module', '', 'Bu/Co.Bks/Module/QBook', '', '', 0, 0, '', 0, 1, ''],
    BksSuggestPickupModule: [0, 2, 0, 1, 0, 'Bks SuggestPickup Module', 'BksModule', 'Bu/Co.Bks/Module/SuggestPickup', '', '', 0, 0, '', 0, 1, ''],
    BksSuggestTransferModule: [0, 2, 0, 1, 0, 'Bks SuggestTransfer Module', 'BksModule', 'Bu/Co.Bks/Module/SuggestTransfer', '', '', 0, 0, '', 0, 1, ''],
    BksErrorModule: [0, 2, 0, 1, 0, 'Bks Error Module', 'BksModule', 'Bu/Co.Bks/Module/Error', '', '', 0, 0, '', 0, 1, ''],
    BksMoveModule: [0, 2, 0, 1, 0, 'Bks Move Module', 'BksModule', 'Bu/Co.Bks/Module/Move', '', '', 0, 0, '', 0, 1, ''],
    BksQuickPayModule: [0, 2, 0, 1, 0, 'Bks QuickPay Module', 'BksModule', 'Bu/Co.Bks/Module/QPay', '', '', 0, 0, '', 0, 1, ''],
    //BksTMove: [0, 2, 0, 1, 0, 'Bks Move Seats Module', 'BksModule', 'Bu/Co.Bks/Module/TMove', '', '', 0, 1, '', 0, 0, ''],


    //Manage modules 
    Initbo: [0, 1, 1, 0, 0, 'Khởi tạo nhà xe', '', 'Manage/Co.Ma', '', 'a.manage', 0, 1, '', 0, 1, '', '', 'company-init', ''],
    MCo: [0, 1, 1, 0, 0, 'Quản lý công ty', '', 'Manage/Co', '', 'a.company', 0, 0, '', 0, 1, '', '', 'company-manager', '2.1.50'],
    
    MAg: [0, 1, 1, 0, 0, 'Quản lý đại lý', '', 'Manage/Co.Ag', '', 'a.agent', 0, 0, '', 0, 1, '', '', 'agent-manager', ''],
    MArea: [0, 1, 1, 0, 0, 'Quản lí địa điểm', '', 'Manage/Co.Area', '', 'a.area', 0, 0, '', 0, 1, '', '', 'area-manager', ''],
    MBus: [0, 1, 1, 0, 0, 'Quản lý xe', '', 'Manage/Co.Bo.Bus', '', 'a.vehicle', 0, 0, '', 0, 1, '', '', 'bus', ''],
    MStpl: [0, 1, 1, 0, 0, 'sơ đồ ghế', '', 'Manage/Co.Bo.Bus.Stpl', '', 'a.seat-template', 0, 1, '', 0, 1, '', '', 'seat-template-manager', ''],
    MCu: [0, 1, 1, 0, 0, 'Quản lý khách hàng', '', 'Manage/Co.Bo.Cu', '', 'a.customer', 0, 0, '', 0, 1, '', '', 'customer-manager', ''],
    MEm: [0, 1, 1, 0, 0, 'Quản lý nhân viên', '', 'Manage/Co.Bo.Em', '', 'a.person', 0, 0, '', 0, 1, '', '', 'employee-manager', ''],
    MRole: [0, 2, '#roleConfig', 0, 0, 'Quản lý vai trò', '', 'Manage/Co.Em.Ac.Role', '', 'a.role', 0, 1, '', 0, 1, '', '', 'role-manager', ''],
    MAid: [0, 1, 1, 0, 0, 'Quản lý vé trợ lí', '', 'Manage/Co.Bo.Em.Aid', '', 'a.assistant', 0, 0, '', 0, 1, '', '', 'assitant-manager', ''],
    MTicConf: [0, 1, 1, 0, 0, 'Quản lý cấu hình vé', '', 'Manage/Co.Bo.Tic.Conf', '', 'a.tic-conf', 0, 1, '', 0, 1, '', '', 'ticket-config', ''],
    MDrive: [0, 1, 1, 0, 0, 'Quản lý tài xế', '', 'Manage/Co.Bo.Em.Drive', '', 'a.driver', 0, 0, '', 0, 1, '', '', 'driver-manager', ''],
    MGuide: [0, 1, 1, 0, 0, 'Quản lý hướng dẫn viên', '', 'Manage/Co.Bo.Em.Guide', '', 'a.guide', 0, 0, '', 0, 1, '', '', 'guide-manager', ''],
    MRoute: [0, 1, 1, 0, 0, 'Quản lý tuyến đường', '', 'Manage/Co.Bo.Rou', '', 'a.trip', 0, 1, '', 0, 1, '', '', 'route-manager', ''],
    MFare: [0, 1, 1, 0, 0, 'Quản lý giá vé', '', 'Manage/Co.Bo.Rou.Fare', '', 'a.fare', 0, 1, '', 0, 1, '', '', 'fare-manager', ''],
    MTrip: [0, 1, 1, 0, 0, 'Quản lý chuyến', '', 'Manage/Co.Bo.Rou.Trip', '', 'a.config-route', 0, 1, '', 0, 1, '', '', 'trip-manager', ''],
    MAcc: [0, 1, 1, 0, 0, 'Quản lý tài khoản', '', 'Manage/Co.Em.Ac', '', 'a.account', 0, 0, '', 0, 1, '', '', 'account-manager', ''],
    //MAcc: [0, 1, '#watchRoutes', 0, 0, 'Quản lý tài khoản', '', 'Manage/Co.Em.Ac.Ver1', '', 'a.account', 0, 0, '', 0, 1, '', '', 'account-manager', ''],
    MPwd: [0, 0, 1, 0, 0, 'Đổi mật khẩu', '', 'Manage/Co.Em.Ac.Pwd', '', 'a.change-password', 0, 1, '', 0, 1, '', '', 'change-password', ''],
    PkPoint: [0, 1, 1, 0, 0, 'Điểm đón khách', '', 'Manage/Co.Bo.PkPoint', '', 'a.pickup-point', 0, 0, '', 0, 1, '', '', 'pickup-points', ''],
    CusPro: [0, 1, 1, 0, 0, 'Thông tin khách hàng', '', 'Manage/Co.Bo.CusPf', '', 'a.customer-profile', 0, 0, '', 0, 1, '', '', 'customer-profile', ''],
    TfPoint: [0, 1, 1, 0, 0, 'Điểm trung chuyển', '', 'Manage/Co.Bo.TfPoint', '', 'a.transfer-point', 0, 0, '', 0, 1, '', '', 'transfer-points', ''],
    VxrLog: [0, 1, 1, 0, 0, 'Vms Log', '', 'Manage/Co.Vxr.Log', '', 'a.vxr-log', 0, 1, '#vexereLogTemplate', 0, 1, '', '', 'vxr-log', ''],
    MPhoi: [0, 1, 1, 0, 0, 'Quản lí Phoi', '', 'Manage/Co.Bo.Phoi', '', 'a.phoiManager', 0, 0, '', 0, 1, '', '', 'phoi-manager', ''],
    //MPhoiTrip: [0, 1, 1, 0, 0, 'Quản lí Phoi', '', 'Manage/Co.Bo.PhoiMa', '', 'a.tripPhoiManager', 0, 1, '', 0, 0, '', '', 'trip-phoi-manager', ''],
    BksReport: [0, 3, 1, 0, 0, 'Báo cáo', '', 'Bu/Co.Bks.Report', '', 'a.watch-report', 0, 1, '#report', 0, 1, 'xRptJs:[C]/report.js']
};
app.rp = {
    //BksReport: [0, 3, 0, 1, 0, 'Báo cáo', '', 'Bu/Co.Bks.Report', '', '', 0, 1, '', 0, 1, 'xRptJs:[C]/report.js'],
};
