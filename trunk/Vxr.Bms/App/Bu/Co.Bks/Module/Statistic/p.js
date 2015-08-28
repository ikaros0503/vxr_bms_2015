define({
    start: function () {
        var me = this;
        vbv('doShowStatistic', function(e) {
            me._statisticByTrip(e.d);
        });
    },

    _statisticByTrip: function (data) {
        var me = this;
        var tripDate = $.trim(data.tDate.toFormatString('dd-mm-yyyy'));
        var tripTime = $.trim(data.tTime);
        var tripName = $.trim(data.tData.Name);

        var $sheet = $('.vbooking-sheet').empty();
        $('.vbooking-csheet').hide();

        $('.vbooking-info').append('<h4 style="font-size: 24px;text-align: center;">Thống kê theo chuyến ' + tripName + ' ngày ' + tripDate + ' lúc ' + tripTime + '</h4>');

        // prepare data
        var tInfo = FlatObj.cTripInfo;
        var anotherFareTienKhach = tInfo._anotherFareTienKhach;
        var nameAnotherFareTienKhach = tInfo._nameAnotherFareTienKhach;
        var mainFareTienKhach = tInfo._mainFareTienKhach;
        var feeTienKhach = tInfo._feeTienKhach;
        var nameFeeTienKhach = tInfo._nameFeeTienKhach;
        var totalFareTienKhach = anotherFareTienKhach + mainFareTienKhach - feeTienKhach;
        var totalNumNotPaid = tInfo._totalNumBranchNotPaid + tInfo._numPickedProNotPaid;
        var totalNumPaid = tInfo._totalNumBranchPaid + tInfo._numPickedProPaid;
        var totalMoneyNotPaid = tInfo._totalMoneyBranchNotPaid + tInfo._moneyPickedProNotPaid;
        var totalMoneyPaid = tInfo._totalMoneyBranchPaid + tInfo._moneyPickedProPaid;
        var totalFareTienHangNotFee = tInfo._totalMoneyBranchNotPaid + tInfo._totalMoneyBranchPaid + tInfo._moneyPickedProNotPaid + tInfo._moneyPickedProPaid;
        var feeTienHang = tInfo._feeTienHang;
        var nameFeeTienHang = tInfo._nameFeeTienHang;
        var totalFareTienHang = totalFareTienHangNotFee - feeTienHang;
        var anotherFees = tInfo._anotherFee;
        var firstAnotherFee = [];
        var moreAnotherFee = [];
        var totalAnotherFee = 0;
        if (anotherFees.length > 0) {
            $.each(anotherFees, function (ni, nk) {
                if (firstAnotherFee.length == 0) {
                    firstAnotherFee.push(nk);
                } else {
                    moreAnotherFee.push(nk);
                }
                totalAnotherFee += nk._money.toNum();
            });
        } else {
            firstAnotherFee.push({
                _index: 0,
                _name: "",
                _money: ''
            });
        }
        var totalFee = tInfo._tollFee + tInfo._washFee + tInfo._eatFee + totalAnotherFee;
        var totalTotal = totalFareTienKhach + totalFareTienHang - totalFee;

        var htmlTienKhach = $('<div class="col-md-6 col-sm-12 col-xs-12 pl0"/>')
                .append('<h4>TIỀN KHÁCH</h4>')
                .append(_dict._tienKhachTitle);

        var htmlTienHang = $('<div class="col-md-6 col-sm-12 col-xs-12 pr0 pl0"/>')
                .append('<h4>TIỀN HÀNG</h4>')
                .append(_dict._tienHangTitle);

        var htmlChiPhi = $('<div class="col-md-12 col-sm-12 col-xs-12 clearfix pl0 pr0 thong-ke-tb" />')
                .append('<h4>CHI PHÍ</h4>')
                .append(
            '<table class="table table-bordered list-ticket thong-ke chi-phi">' +
                '<tbody>' +
                    '<tr>' +
                        '<td style="width:22%;height:30px;">' +
                            '<div class="form-group col-md-12" style="margin:0;padding:0;">' +
                                '<label class="col-md-4 col-sm-4 control-label pl0 pr0" style="line-height:30px;" for="inputEmail3">Cầu đường:</label>' +
                                '<div class="col-md-8 col-sm-7 pl0 pr0 input-group">' +
                                    '<input name="TollFee" placeholder="" class="form-control input-sm" value="' + tInfo._tollFee.toMn() + '">' +
                                    '<div class="input-group-addon">đ</div>' +
                                '</div>' +
                            '</div>' +
                        '</td>' +
                        '<td style="width:22%;">' +
                            '<div class="form-group col-md-12" style="margin:0;padding:0;">' +
                                '<label class="col-md-4 col-sm-4 control-label pr0" style="line-height:30px;" for="inputEmail3">Rửa xe:</label>' +
                                '<div class="col-md-8 col-sm-7 pl0 pr0 input-group">' +
                                    '<input name="WashFee" placeholder="" class="form-control input-sm" value="' + tInfo._washFee.toMn() + '">' +
                                    '<div class="input-group-addon">đ</div>' +
                                '</div>' +
                            '</div>' +
                        '</td>' +
                        '<td colspan="2">' +
                            '<div class="form-group">' +
                                '<label class="col-sm-5 control-label" style="line-height:30px;" for="inputEmail3">Chi phí khác: <span name="TotalAnotherFee" data-total-another-fee="0">' + totalAnotherFee.toMn() + ' đ</span></label>' +
                            '</div>' +
                        '</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td style="width:22%;">' +
                            '<div class="form-group col-md-12" style="margin:0;padding:0;">' +
                                '<label class="col-md-4 col-sm-4 control-label pl0 pr0" style="line-height:30px;" for="inputEmail3">Tiền ăn:</label>' +
                                '<div class="col-md-8 col-sm-7 pl0 pr0 input-group">' +
                                    '<input name="EatFee" placeholder="" class="form-control input-sm" value="' + tInfo._eatFee.toMn() + '">' +
                                    '<div class="input-group-addon">đ</div>' +
                                '</div>' +
                            '</div>' +
                        '</td>' +
                        '<td>' +
                        '</td>' +
                        '<td class="another-fee">' +
                            '<div class="form-group col-md-6 pl0">' +
                                '<label class="col-sm-5 control-label pr0" style="line-height:30px;" for="inputEmail3">Tên chi phí:</label>' +
                                '<div class="col-sm-7 pl0 pr0">' +
                                    '<input name="NameAnotherFee" placeholder="" class="form-control input-sm" value="' + firstAnotherFee[0]._name + '">' +
                                '</div>' +
                            '</div>' +
                            '<div class="form-group col-md-5">' +
                                '<label class="col-sm-5 control-label pr0" style="line-height:30px;" for="inputEmail3">Số tiền:</label>' +
                                '<div class="col-sm-7 pl0 pr0 input-group">' +
                                    '<input name="MoneyAnotherFee" placeholder="" class="form-control input-sm" value="' + (firstAnotherFee[0]._money).toNum().toMn() + '">' +
                                    '<div class="input-group-addon">đ</div>' +
                                '</div>' +
                            '</div>' +
                            '<div class="col-md-1 pr0 pl0">' +
                                '<button name="AddMoreFee" type="button" class="btn btn-sm btn-default"><i class="glyphicon glyphicon-plus"></i></button>' +
                            '</div>' +
                        '</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td colspan="4">' +
                            '<h4>TỔNG CHÍ PHÍ: <span name="TotalFee" data-total-fee="' + totalFee + '">' + totalFee.toMn() + ' đ</span></h4>' +
                        '</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td colspan="4">' +
                            '<h3>TỔNG CỘNG: <span name="TotalTotal">' + totalTotal.toMn() + ' đ</span></h3>' +
                            '<button type="button" class="btn btn-md btn-success tk-save-trip"><i class="glyphicon glyphicon-save"></i>&nbsp;LƯU</button>&nbsp;' +
                            '<button type="button" class="btn btn-md btn-primary btn-chot-phoi">CHỐT PHƠI</button>' +
                        '</td>' +
                    '</tr>' +
                '</tbody>' +
            '</table>');

        $sheet.addClass('thong-ke-tb')
            .append(htmlTienKhach)
            .append(htmlTienHang)
            .append(htmlChiPhi);

        // tiền khách
        var totalTic = 0;
        var totalFare = 0;
        var tBodyTienKhach = $sheet.find('table.tien-khach tbody');
        if (typeof tInfo._tkNumPaidPerType != "undefined") {
            $.each(tInfo._tkNumPaidPerType, function (k, v) {
                var splitV = v.split("|");
                var branchCode = "";
                if (splitV[0] == "TX") {
                    branchCode = "Tài xế thu";
                } else if (splitV[0] == "VXR") {
                    branchCode = "VeXeRe";
                } else {
                    branchCode = splitV[0];
                }
                var dt = {
                    _branchCode: branchCode,
                    _numTic: splitV[1] + " vé",
                    _totalFare: parseInt(splitV[2]).toMn() + " đ"
                }
                var $tr = $(vtpl(_dict._tienKhachInput, dt));
                tBodyTienKhach.append($tr);
                totalTic += parseInt(splitV[1]);
                totalFare += parseInt(splitV[2]);
            });
        }
        tBodyTienKhach.append('<tr><td><h4>Tổng cộng</h4></td><td><h4>' + totalTic + ' vé</h4></td><td name="TotalFareTicket" data-fare="' + totalFare + '"><h4>' + totalFare.toMn() + " đ" + '</h4></td></tr>');
        tBodyTienKhach.append('<tr><td style="line-height:30px;">Doanh thu khác </td><td><input type="text" name="NameAnotherFareTienKhach" placeholder="Tên doanh thu" class="form-control input-bd0 input-sm" value="' + nameAnotherFareTienKhach + '"/></td><td class="col-md-4"><div class="input-group"><input type="text" placeholder="Tổng tiền doanh thu khác" class="form-control input-bd0 input-sm" name="AnotherFareTienKhach" value="' + anotherFareTienKhach.toMn() + '"><div class="input-group-addon">đ</div></div></td></tr>');
        tBodyTienKhach.append('<tr><td style="line-height:30px;">Chi phí văn phòng </td><td><input type="text" name="NameFeeTienKhach" placeholder="Tên chi phí" class="form-control input-bd0 input-sm" value="' + nameFeeTienKhach + '"/></td><td class="col-md-4"><div class="input-group"><input type="text" placeholder="Chi phí văn phòng" class="form-control input-bd0 input-sm" name="FeeTienKhach" value="' + feeTienKhach.toMn() + '"><div class="input-group-addon">đ</div></div></td></tr>');
        tBodyTienKhach.append('<tr><td colspan="2"><h4><b>Tổng</b></h4></td><td><h4 class="totalTienKhach" data-total-tien-khach="' + (totalFare + anotherFareTienKhach - feeTienKhach) + '" style="font-weight:bold;"><b>' + (totalFare + anotherFareTienKhach - feeTienKhach).toMn() + " đ" + '</b></h4></td></tr>');

        // tiền hàng
        var tBodyTienHang = $sheet.find('table.tien-hang tbody');
        if (typeof tInfo._branchProduct != "undefined" && tInfo._branchProduct.length > 0) {
            $.each(tInfo._branchProduct, function (v, b) {
                var dat = {
                    _branchCode: b._branchCode,
                    _numBranchProPaid: b._numBranchProPaid,
                    _moneyBranchProPaid: b._moneyBranchProPaid.toMn(),
                    _numBranchProNotPaid: b._numBranchProNotPaid,
                    _moneyBranchProNotPaid: b._moneyBranchProNotPaid.toMn(),
                    _totalMoneyBranchFormat: (b._moneyBranchProPaid + b._moneyBranchProNotPaid).toMn()
                }
                var $tt = $(vtpl(_dict._tienHangInput, dat));
                tBodyTienHang.append($tt);
            });
        } else {
            if (typeof tInfo._branchReceiveProduct != "undefined") {
                $.each(tInfo._branchReceiveProduct, function (va, ba) {
                    var dta = {
                        _branchCode: ba._code,
                        _numBranchProPaid: 0,
                        _moneyBranchProPaid: 0,
                        _numBranchProNotPaid: 0,
                        _moneyBranchProNotPaid: 0,
                        _totalMoneyBranchFormat: 0
                    }
                    var $tta = $(vtpl(_dict._tienHangInput, dta));
                    tBodyTienHang.append($tta);
                });
            }
        }

        tBodyTienHang.append('<tr><td style="line-height:30px;">Dọc đường</td>' +
                '<td><div class="input-group col-md-12"><input name="PickedPaid" type="text" placeholder="Đã TT" class="form-control input-bd0 input-sm" value="' + tInfo._moneyPickedProPaid.toMn() + '"><div class="input-group-addon">đ</div></div></td>' +
                '<td style="width:60px;"><input name="NumPickedPaid" type="text" placeholder="SL" class="form-control input-bd0 input-sm" value="' + tInfo._numPickedProPaid + '"></td>' +
                '<td><div class="input-group col-md-12"><input name="PickedNotPaid" type="text" placeholder="Chưa TT" class="form-control input-bd0 input-sm" value="' + tInfo._moneyPickedProNotPaid.toMn() + '"><div class="input-group-addon">đ</div></div></td>' +
                '<td style="width:60px;"><input name="NumPickedNotPaid" type="text" placeholder="SL" class="form-control input-bd0 input-sm" value="' + tInfo._numPickedProNotPaid + '"></td>' +
                '<td name="TotalFarePicked" style="line-height:30px;">' + (tInfo._moneyPickedProNotPaid + tInfo._moneyPickedProPaid).toMn() + ' đ</td>' +
            '</tr>');
        tBodyTienHang.append('<tr><td><h4>Tổng cộng</h4></td><td><h4 data-total-paid="' + totalMoneyPaid + '" class="totalPaid">' + totalMoneyPaid.toMn() + ' đ</h4></td><td><h4 class="totalCountPaid">' + totalNumPaid + '</h4></td><td><h4 data-total-not-paid="' + totalMoneyNotPaid + '" class="totalNotPaid">' + totalMoneyNotPaid.toMn() + ' đ</h4></td><td><h4 class="totalCountNotPaid">' + totalNumNotPaid + '</h4></td><td><h4 class="totalTienHangNotFee" data-total-tien-hang-not-fee="' + totalFareTienHangNotFee + '">' + totalFareTienHangNotFee.toMn() + ' đ</h4></td></tr>');
        tBodyTienHang.append('<tr><td style="line-height:30px;">Chi phí hàng</td><td colspan="4"><input name="NameFeeTienHang" type="text" class="form-control input-bd0 input-sm" placeholder="Tên chi phí" value="' + nameFeeTienHang + '"/></td><td><div class="input-group"><input name="FeeTienHang" type="text" class="form-control input-bd0 input-sm" value="' + feeTienHang.toMn() + '"><div class="input-group-addon">đ</div></div></td></tr>');
        tBodyTienHang.append('<tr><td colspan="5" style="line-height:30px;"><h4 style="font-weight:bold;">Tổng</h4></td><td><h4 style="font-weight:bold;" class="totalTienHang" data-total-tien-hang="' + totalFareTienHang + '">' + totalFareTienHang.toMn() + ' đ</h4></td></tr>');

        // chi phí khác
        if (moreAnotherFee.length > 0) {
            $.each(moreAnotherFee, function (fa, fs) {
                $sheet.find('td.another-fee').append('<div class="form-group col-md-6 pl0 mt10">' +
                        '<label class="col-sm-5 control-label pr0" style="line-height:30px;" for="inputEmail3">Tên chi phí:</label>' +
                        '<div class="col-sm-7 pl0 pr0">' +
                        '<input name="NameAnotherFee" placeholder="" class="form-control input-sm" value="' + fs._name + '">' +
                        '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-5 mt10">' +
                        '<label class="col-sm-5 control-label pr0" style="line-height:30px;" for="inputEmail3">Số tiền:</label>' +
                        '<div class="col-sm-7 pl0 pr0 input-group">' +
                            '<input name="MoneyAnotherFee" placeholder="" class="form-control input-sm" value="' + fs._money.toNum().toMn() + '">' +
                            '<div class="input-group-addon">đ</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="col-md-1 pr0 pl0 mt10">' +
                        '<button name="RemoveMoreFee" type="button" class="btn btn-sm btn-default"><i class="glyphicon glyphicon-remove"></i></button>' +
                    '</div>');
            });
        }
        var closedStatus = data.tData.Ts[data.tTime][0]['ClosedStatus'];
        if (closedStatus == 2 && app.rights.indexOf('5|10095|1') == -1) {
            $sheet.find('input,button').prop('disabled', 'disabled');
            $sheet.find('button.tk-save-trip,button.btn-chot-phoi').addClass('hidden');
        }

        me._bindEventTKTienKhach();
        me._bindEventTKTienHang(data);
        me._bindEventTKChiPhi(data);
    },
    _bindEventTKTienKhach: function () {
        var $sheet = $('.vbooking-sheet');
        var totalFareTicket = $sheet.find('td[name="TotalFareTicket"]').attr('data-fare').toNum();
        var totalTotal = 0;
        var totalFareTienKhach = 0;
        $sheet.find('input[name="AnotherFareTienKhach"]').on('change', function () {
            var feeTienKhach = $sheet.find('input[name="FeeTienKhach"]').val().replace(/\./g, '').toNum();
            var fare = $(this).val().replace(/\./g, '').toNum();
            if (fare < 10000) {
                fare = fare * 1000;
            }
            var totalFareTienHang = $sheet.find('h4.totalTienHang').attr('data-total-tien-hang').toNum();
            var totalFee = $sheet.find('span[name="TotalFee"]').attr('data-total-fee').toNum();
            if (fare > 0) {
                $(this).val(fare.toMn());
                totalFareTienKhach = fare + totalFareTicket - feeTienKhach;
            } else {
                $(this).val(0);
                totalFareTienKhach = totalFareTicket - feeTienKhach;
            }
            totalTotal = totalFareTienKhach + totalFareTienHang - totalFee;
            $sheet.find('h4.totalTienKhach').attr('data-total-tien-khach', totalFareTienKhach);
            $sheet.find('h4.totalTienKhach').text(totalFareTienKhach.toMn() + " đ");
            $sheet.find('span[name="TotalTotal"]').text(totalTotal.toMn() + " đ");
        }).focus(function () {
            $(this).select();
        }).mouseup(function (e) {
            e.preventDefault();
        });

        $sheet.find('input[name="FeeTienKhach"]').on('change', function () {
            var fee = $(this).val().replace(/\./g, '').toNum();
            var anotherFareTienKhach = $sheet.find('input[name="AnotherFareTienKhach"]').val().replace(/\./g, '').toNum();
            if (fee < 10000) {
                fee = fee * 1000;
            }
            totalFareTienKhach = $sheet.find('h4.totalTienKhach').attr('data-total-tien-khach').toNum();
            var totalFareTienHang = $sheet.find('h4.totalTienHang').attr('data-total-tien-hang').toNum();
            var totalFee = $sheet.find('span[name="TotalFee"]').attr('data-total-fee').toNum();
            if (fee > 0) {
                $(this).val(fee.toMn());
                totalFareTienKhach = totalFareTicket + anotherFareTienKhach - fee;
            } else {
                $(this).val(0);
                totalFareTienKhach = totalFareTicket + anotherFareTienKhach;
            }
            totalTotal = totalFareTienKhach + totalFareTienHang - totalFee;
            $sheet.find('h4.totalTienKhach').attr('data-total-tien-khach', totalFareTienKhach);
            $sheet.find('h4.totalTienKhach').text(totalFareTienKhach.toMn() + " đ");
            $sheet.find('span[name="TotalTotal"]').text(totalTotal.toMn() + " đ");
        }).focus(function () {
            $(this).select();
        }).mouseup(function (e) {
            e.preventDefault();
        });
    },
    _bindEventTKTienHang: function (data) {
        //var me = data;
        var $sheet = $('.vbooking-sheet');
        var branchNotPaid = 0;
        var branchPaid = 0;
        var totalFareBranch = 0;
        var pickedPaid = 0;
        var pickedNotPaid = 0;
        var totalFarePicked = 0;
        var totalNotPaid = 0;
        var totalPaid = 0;
        var feeTienHang = 0;
        var totalTienHangNotFee = 0;
        var totalTienHang = 0;
        var totalTotal = 0;
        $sheet.find('input[name="BranchNotPaid"]').on('change', function () {
            var that = $(this);
            var totalFareTienKhach = $sheet.find('h4.totalTienKhach').attr('data-total-tien-khach').toNum();
            var totalFee = $sheet.find('span[name="TotalFee"]').attr('data-total-fee').toNum();
            branchNotPaid = $(this).val().replace(/\./g, '').toNum();
            branchPaid = that.closest('tr').find('input[name="BranchPaid"]').val().replace(/\./g, '').toNum();
            pickedNotPaid = $sheet.find('input[name="PickedNotPaid"]').val().replace(/\./g, '').toNum();
            totalPaid = $sheet.find('h4.totalPaid').attr('data-total-paid').toNum();
            feeTienHang = $sheet.find('input[name="FeeTienHang"]').val().replace(/\./g, '').toNum();
            if (branchNotPaid < 10000) {
                branchNotPaid = branchNotPaid * 1000;
            }
            if (branchNotPaid > 0) {
                $(this).val(branchNotPaid.toMn());
                totalFareBranch = branchNotPaid + branchPaid;
            } else {
                $(this).val(0);
                totalFareBranch = branchPaid;
            }
            var totaNotPaid = 0;
            $.each($sheet.find('input[name="BranchNotPaid"]'), function (l, el) {
                var fa = $(el).val().replace(/\./g, '').toNum();
                totaNotPaid += fa;
            });
            totalNotPaid = totaNotPaid + pickedNotPaid;
            totalTienHangNotFee = totalNotPaid + totalPaid;
            totalTienHang = totalTienHangNotFee - feeTienHang;
            totalTotal = totalFareTienKhach + totalTienHang - totalFee;
            that.closest('tr').find('td[name="TotalFareBranch"]').text(totalFareBranch.toMn() + " đ");
            $sheet.find('h4.totalNotPaid').text(totalNotPaid.toMn() + " đ");
            $sheet.find('h4.totalNotPaid').attr('data-total-not-paid', totalNotPaid);
            $sheet.find('h4.totalTienHangNotFee').text(totalTienHangNotFee.toMn() + " đ");
            $sheet.find('h4.totalTienHangNotFee').attr('data-total-tien-hang-not-fee', totalTienHangNotFee);
            $sheet.find('h4.totalTienHang').text(totalTienHang.toMn() + " đ");
            $sheet.find('h4.totalTienHang').attr('data-total-tien-hang', totalTienHang);
            $sheet.find('span[name="TotalTotal"]').text(totalTotal.toMn() + " đ");
        }).focus(function () {
            $(this).select();
        }).mouseup(function (e) {
            e.preventDefault();
        });

        $sheet.find('input[name="BranchPaid"]').on('change', function () {
            var that = $(this);
            var totalFareTienKhach = $sheet.find('h4.totalTienKhach').attr('data-total-tien-khach').toNum();
            var totalFee = $sheet.find('span[name="TotalFee"]').attr('data-total-fee').toNum();
            branchPaid = $(this).val().replace(/\./g, '').toNum();
            branchNotPaid = that.closest('tr').find('input[name="BranchNotPaid"]').val().replace(/\./g, '').toNum();
            pickedPaid = $sheet.find('input[name="PickedPaid"]').val().replace(/\./g, '').toNum();
            totalNotPaid = $sheet.find('h4.totalNotPaid').attr('data-total-not-paid').toNum();
            feeTienHang = $sheet.find('input[name="FeeTienHang"]').val().replace(/\./g, '').toNum();
            if (branchPaid < 10000) {
                branchPaid = branchPaid * 1000;
            }
            if (branchPaid > 0) {
                $(this).val(branchPaid.toMn());
                totalFareBranch = branchNotPaid + branchPaid;
            } else {
                $(this).val(0);
                totalFareBranch = branchNotPaid;
            }
            var totaPaid = 0;
            $.each($sheet.find('input[name="BranchPaid"]'), function (l, el) {
                var fa = $(el).val().replace(/\./g, '').toNum();
                totaPaid += fa;
            });
            totalPaid = totaPaid + pickedPaid;
            totalTienHangNotFee = totalNotPaid + totalPaid;
            totalTienHang = totalTienHangNotFee - feeTienHang;
            totalTotal = totalFareTienKhach + totalTienHang - totalFee;
            that.closest('tr').find('td[name="TotalFareBranch"]').text(totalFareBranch.toMn() + " đ");
            $sheet.find('h4.totalPaid').text(totalPaid.toMn() + " đ");
            $sheet.find('h4.totalPaid').attr('data-total-paid', totalPaid);
            $sheet.find('h4.totalTienHangNotFee').text(totalTienHangNotFee.toMn() + " đ");
            $sheet.find('h4.totalTienHangNotFee').attr('data-total-tien-hang-not-fee', totalTienHangNotFee);
            $sheet.find('h4.totalTienHang').text(totalTienHang.toMn() + " đ");
            $sheet.find('h4.totalTienHang').attr('data-total-tien-hang', totalTienHang);
            $sheet.find('span[name="TotalTotal"]').text(totalTotal.toMn() + " đ");
        }).focus(function () {
            $(this).select();
        }).mouseup(function (e) {
            e.preventDefault();
        });

        $sheet.find('input[name="PickedPaid"]').on('change', function () {
            var totalFareTienKhach = $sheet.find('h4.totalTienKhach').attr('data-total-tien-khach').toNum();
            var totalFee = $sheet.find('span[name="TotalFee"]').attr('data-total-fee').toNum();
            pickedPaid = $(this).val().replace(/\./g, '').toNum();
            pickedNotPaid = $sheet.find('input[name="PickedNotPaid"]').val().replace(/\./g, '').toNum();
            totalNotPaid = $sheet.find('h4.totalNotPaid').attr('data-total-not-paid').toNum();
            feeTienHang = $sheet.find('input[name="FeeTienHang"]').val().replace(/\./g, '').toNum();
            if (pickedPaid < 10000) {
                pickedPaid = pickedPaid * 1000;
            }
            if (pickedPaid > 0) {
                $(this).val(pickedPaid.toMn());
                totalFarePicked = pickedNotPaid + pickedPaid;
            } else {
                $(this).val(0);
                totalFarePicked = pickedNotPaid;
            }
            var totaPaid = 0;
            $.each($sheet.find('input[name="BranchPaid"]'), function (lk, lj) {
                var fi = $(lj).val().replace(/\./g, '').toNum();
                totaPaid += fi;
            });
            totalPaid = pickedPaid + totaPaid;
            totalTienHangNotFee = totalNotPaid + totalPaid;
            totalTienHang = totalTienHangNotFee - feeTienHang;
            totalTotal = totalFareTienKhach + totalTienHang - totalFee;
            $sheet.find('td[name="TotalFarePicked"]').text(totalFarePicked.toMn() + " đ");
            $sheet.find('h4.totalPaid').text(totalPaid.toMn() + " đ");
            $sheet.find('h4.totalPaid').attr('data-total-paid', totalPaid);
            $sheet.find('h4.totalTienHangNotFee').text(totalTienHangNotFee.toMn() + " đ");
            $sheet.find('h4.totalTienHangNotFee').attr('data-total-tien-hang-not-fee', totalTienHangNotFee);
            $sheet.find('h4.totalTienHang').text(totalTienHang.toMn() + " đ");
            $sheet.find('h4.totalTienHang').attr('data-total-tien-hang', totalTienHang);
            $sheet.find('span[name="TotalTotal"]').text(totalTotal.toMn() + " đ");
        }).focus(function () {
            $(this).select();
        }).mouseup(function (e) {
            e.preventDefault();
        });

        $sheet.find('input[name="PickedNotPaid"]').on('change', function () {
            var totalFareTienKhach = $sheet.find('h4.totalTienKhach').attr('data-total-tien-khach').toNum();
            var totalFee = $sheet.find('span[name="TotalFee"]').attr('data-total-fee').toNum();
            pickedNotPaid = $(this).val().replace(/\./g, '').toNum();
            pickedPaid = $sheet.find('input[name="PickedPaid"]').val().replace(/\./g, '').toNum();
            totalPaid = $sheet.find('h4.totalPaid').attr('data-total-paid').toNum();
            feeTienHang = $sheet.find('input[name="FeeTienHang"]').val().replace(/\./g, '').toNum();
            if (pickedNotPaid < 10000) {
                pickedNotPaid = pickedNotPaid * 1000;
            }
            if (pickedNotPaid > 0) {
                $(this).val(pickedNotPaid.toMn());
                totalFarePicked = pickedNotPaid + pickedPaid;
            } else {
                $(this).val(0);
                totalFarePicked = pickedPaid;
            }
            var totaNotPaid = 0;
            $.each($sheet.find('input[name="BranchNotPaid"]'), function (ki, kl) {
                var fk = $(kl).val().replace(/\./g, '').toNum();
                totaNotPaid += fk;
            });
            totalNotPaid = pickedNotPaid + totaNotPaid;
            totalTienHangNotFee = totalNotPaid + totalPaid;
            totalTienHang = totalTienHangNotFee - feeTienHang;
            totalTotal = totalFareTienKhach + totalTienHang - totalFee;
            $sheet.find('td[name="TotalFarePicked"]').text(totalFarePicked.toMn() + " đ");
            $sheet.find('h4.totalNotPaid').attr('data-total-not-paid', totalNotPaid);
            $sheet.find('h4.totalNotPaid').text(totalNotPaid.toMn() + " đ");
            $sheet.find('h4.totalTienHangNotFee').text(totalTienHangNotFee.toMn() + " đ");
            $sheet.find('h4.totalTienHangNotFee').attr('data-total-tien-hang-not-fee', totalTienHangNotFee);
            $sheet.find('h4.totalTienHang').text(totalTienHang.toMn() + " đ");
            $sheet.find('h4.totalTienHang').attr('data-total-tien-hang', totalTienHang);
            $sheet.find('span[name="TotalTotal"]').text(totalTotal.toMn() + " đ");
        }).focus(function () {
            $(this).select();
        }).mouseup(function (e) {
            e.preventDefault();
        });

        $sheet.find('input[name="NumBranchNotPaid"]').on('change', function () {
            var totalNumBranchNotPaid = 0;
            $.each($sheet.find('input[name="NumBranchNotPaid"]'), function (kj, kl) {
                var ft = $(kl).val().toNum();
                totalNumBranchNotPaid += ft;
            });
            var numPickedNotPaid = $sheet.find('input[name="NumPickedNotPaid"]').val().toNum();
            $sheet.find('h4.totalCountNotPaid').text(totalNumBranchNotPaid + numPickedNotPaid);
        }).focus(function () {
            $(this).select();
        }).mouseup(function (e) {
            e.preventDefault();
        });

        $sheet.find('input[name="NumPickedNotPaid"]').on('change', function () {
            var totalNumBranchNotPaid = 0;
            $.each($sheet.find('input[name="NumBranchNotPaid"]'), function (kj, kl) {
                var ft = $(kl).val().toNum();
                totalNumBranchNotPaid += ft;
            });
            var numPickedNotPaid = $(this).val().toNum();
            $sheet.find('h4.totalCountNotPaid').text(totalNumBranchNotPaid + numPickedNotPaid);
        }).focus(function () {
            $(this).select();
        }).mouseup(function (e) {
            e.preventDefault();
        });

        $sheet.find('input[name="NumBranchPaid"]').on('change', function () {
            var totalNumBranchPaid = 0;
            $.each($sheet.find('input[name="NumBranchPaid"]'), function (kj, kl) {
                var ft = $(kl).val().toNum();
                totalNumBranchPaid += ft;
            });
            var numPickedPaid = $sheet.find('input[name="NumPickedPaid"]').val().toNum();
            $sheet.find('h4.totalCountPaid').text(totalNumBranchPaid + numPickedPaid);
        }).focus(function () {
            $(this).select();
        }).mouseup(function (e) {
            e.preventDefault();
        });

        $sheet.find('input[name="NumPickedPaid"]').on('change', function () {
            var totalNumBranchPaid = 0;
            $.each($sheet.find('input[name="NumBranchPaid"]'), function (kj, kl) {
                var ft = $(kl).val().toNum();
                totalNumBranchPaid += ft;
            });
            var numPickedPaid = $(this).val().toNum();
            $sheet.find('h4.totalCountPaid').text(totalNumBranchPaid + numPickedPaid);
        }).focus(function () {
            $(this).select();
        }).mouseup(function (e) {
            e.preventDefault();
        });

        $sheet.find('input[name="FeeTienHang"]').on('change', function () {
            var totalFareTienKhach = $sheet.find('h4.totalTienKhach').attr('data-total-tien-khach').toNum();
            var totalFee = $sheet.find('span[name="TotalFee"]').attr('data-total-fee').toNum();
            totalTienHangNotFee = $sheet.find('h4.totalTienHangNotFee').attr('data-total-tien-hang-not-fee').toNum();
            feeTienHang = $(this).val().replace(/\./g, '').toNum();
            if (feeTienHang < 10000) {
                feeTienHang = feeTienHang * 1000;
            }
            if (feeTienHang > 0) {
                $(this).val(feeTienHang.toMn());
                totalTienHang = totalTienHangNotFee - feeTienHang;
            } else {
                $(this).val(0);
                totalTienHang = totalTienHangNotFee;
            }
            totalTotal = totalFareTienKhach + totalTienHang - totalFee;
            $sheet.find('h4.totalTienHang').text(totalTienHang.toMn() + " đ");
            $sheet.find('h4.totalTienHang').attr('data-total-tien-hang', totalTienHang);
            $sheet.find('span[name="TotalTotal"]').text(totalTotal.toMn() + " đ");
        }).focus(function () {
            $(this).select();
        }).mouseup(function (e) {
            e.preventDefault();
        });
    },
    _bindEventTKChiPhi: function (data) {
        var me = this;
        var $sheet = $('.vbooking-sheet');
        var tollFee = 0;
        var washFee = 0;
        var eatFee = 0;
        var totalFee = 0;
        var totalTienKhach = 0;
        var totalTienHang = 0;
        var totalAnotherFee = 0;
        var totalTotal = 0;
        $sheet.find('input[name="TollFee"]').on('change', function () {
            tollFee = $(this).val().replace(/\./g, '').toNum();
            if (tollFee < 10000) {
                tollFee = tollFee * 1000;
            }
            washFee = $sheet.find('input[name="WashFee"]').val().replace(/\./g, '').toNum();
            eatFee = $sheet.find('input[name="EatFee"]').val().replace(/\./g, '').toNum();
            totalTienKhach = $sheet.find('h4.totalTienKhach').attr('data-total-tien-khach').toNum();
            totalTienHang = $sheet.find('h4.totalTienHang').attr('data-total-tien-hang').toNum();
            totalAnotherFee = $sheet.find('span[name="TotalAnotherFee"]').attr('data-total-another-fee').toNum();
            if (tollFee > 0) {
                $(this).val(tollFee.toMn());
            } else {
                $(this).val('');
            }
            totalFee = tollFee + washFee + eatFee + totalAnotherFee;
            totalTotal = totalTienKhach + totalTienHang - totalFee;
            $sheet.find('span[name="TotalFee"]').text(totalFee.toMn() + " đ");
            $sheet.find('span[name="TotalFee"]').attr('data-total-fee', totalFee);
            $sheet.find('span[name="TotalTotal"]').text(totalTotal.toMn() + " đ");
        }).focus(function () {
            $(this).select();
        }).mouseup(function (e) {
            e.preventDefault();
        });

        $sheet.find('input[name="WashFee"]').on('change', function () {
            washFee = $(this).val().replace(/\./g, '').toNum();
            if (washFee < 10000) {
                washFee = washFee * 1000;
            }
            tollFee = $sheet.find('input[name="TollFee"]').val().replace(/\./g, '').toNum();
            eatFee = $sheet.find('input[name="EatFee"]').val().replace(/\./g, '').toNum();
            totalTienKhach = $sheet.find('h4.totalTienKhach').attr('data-total-tien-khach').toNum();
            totalTienHang = $sheet.find('h4.totalTienHang').attr('data-total-tien-hang').toNum();
            totalAnotherFee = $sheet.find('span[name="TotalAnotherFee"]').attr('data-total-another-fee').toNum();
            if (washFee > 0) {
                $(this).val(washFee.toMn());
            } else {
                $(this).val('');
            }
            totalFee = tollFee + washFee + eatFee + totalAnotherFee;
            totalTotal = totalTienKhach + totalTienHang - totalFee;
            $sheet.find('span[name="TotalFee"]').text(totalFee.toMn() + " đ");
            $sheet.find('span[name="TotalFee"]').attr('data-total-fee', totalFee);
            $sheet.find('span[name="TotalTotal"]').text(totalTotal.toMn() + " đ");
        }).focus(function () {
            $(this).select();
        }).mouseup(function (e) {
            e.preventDefault();
        });

        $sheet.find('input[name="EatFee"]').on('change', function () {
            eatFee = $(this).val().replace(/\./g, '').toNum();
            if (eatFee < 10000) {
                eatFee = eatFee * 1000;
            }
            tollFee = $sheet.find('input[name="TollFee"]').val().replace(/\./g, '').toNum();
            washFee = $sheet.find('input[name="WashFee"]').val().replace(/\./g, '').toNum();
            totalTienKhach = $sheet.find('h4.totalTienKhach').attr('data-total-tien-khach').toNum();
            totalTienHang = $sheet.find('h4.totalTienHang').attr('data-total-tien-hang').toNum();
            totalAnotherFee = $sheet.find('span[name="TotalAnotherFee"]').attr('data-total-another-fee').toNum();
            if (eatFee > 0) {
                $(this).val(eatFee.toMn());
            } else {
                $(this).val('');
            }
            totalFee = tollFee + washFee + eatFee + totalAnotherFee;
            totalTotal = totalTienKhach + totalTienHang - totalFee;
            $sheet.find('span[name="TotalFee"]').text(totalFee.toMn() + " đ");
            $sheet.find('span[name="TotalFee"]').attr('data-total-fee', totalFee);
            $sheet.find('span[name="TotalTotal"]').text(totalTotal.toMn() + " đ");
        }).focus(function () {
            $(this).select();
        }).mouseup(function (e) {
            e.preventDefault();
        });

        $sheet.find('button[name="AddMoreFee"]').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var hasError = true;
            $.each($sheet.find('input[name="NameAnotherFee"]'), function (kb, kc) {
                if ($(kc).val() == '') {
                    hasError = false;
                    $(kc).closest('div').addClass('has-error');
                } else {
                    $(kc).closest('div').removeClass('has-error');
                }
            });
            $.each($sheet.find('input[name="MoneyAnotherFee"]'), function (kbb, kcc) {
                if ($(kcc).val().replace(/\./g, '').toNum() == 0) {
                    hasError = false;
                    $(kcc).closest('div').addClass('has-error');
                } else {
                    $(kcc).closest('div').removeClass('has-error');
                }
            });
            if (hasError) {
                $(this).closest('td.another-fee').append('<div class="form-group col-md-6 pl0 mt10">' +
                        '<label class="col-sm-5 control-label pr0" style="line-height:30px;" for="inputEmail3">Tên chi phí:</label>' +
                        '<div class="col-sm-7 pl0 pr0">' +
                        '<input name="NameAnotherFee" placeholder="" class="form-control input-sm">' +
                        '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-5 mt10">' +
                        '<label class="col-sm-5 control-label pr0" style="line-height:30px;" for="inputEmail3">Số tiền:</label>' +
                        '<div class="col-sm-7 pl0 pr0 input-group">' +
                            '<input name="MoneyAnotherFee" placeholder="" class="form-control input-sm" value="0">' +
                            '<div class="input-group-addon">đ</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="col-md-1 pr0 pl0 mt10">' +
                        '<button name="RemoveMoreFee" type="button" class="btn btn-sm btn-default"><i class="glyphicon glyphicon-remove"></i></button>' +
                    '</div>');
                me._bindEventAnotherFee(data);
            }
        });

        $sheet.find('button.tk-save-trip').unbind().on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            me._tkSaveTrip(data);
        });

        $sheet.find('button.btn-chot-phoi').unbind().on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var closedStatus = data.tData.Ts[data.tTime][0]['ClosedStatus'];
            var tInfo = FlatObj.cTripInfo;
            if (closedStatus != 1) {
                vbf('onShowPopModal', { msg: "Xe chưa xuất bến, không thể chốt phơi. Vui lòng kiểm tra lại." });
                return;
            }
            if (tInfo._numBooking > 0) {
                vbf('onShowPopModal', { msg: "Còn vé đặt chỗ, vui lòng chuyển thanh toán hoặc hủy rồi thực hiện chốt phơi lại." });
                return;
            }
            var tripDetailId = data.tData.Ts[data.tTime][0]['TripDetailId'];
            if (typeof tripDetailId == "undefined") {
                vbf('onShowPopModal', { msg: "Chuyến này chưa được đặt vé. Vui lòng kiểm tra lại." });
                return;
            }
            me._createChotPhoiDialogDiv(data);
        });

        me._bindEventAnotherFee();
    },
    _bindEventAnotherFee: function () {
        var $sheet = $('.vbooking-sheet');
        $sheet.find('input[name="MoneyAnotherFee"]').on('change', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var tollFee = $sheet.find('input[name="TollFee"]').val().replace(/\./g, '').toNum();
            var washFee = $sheet.find('input[name="WashFee"]').val().replace(/\./g, '').toNum();
            var eatFee = $sheet.find('input[name="EatFee"]').val().replace(/\./g, '').toNum();
            var totalTienKhach = $sheet.find('h4.totalTienKhach').attr('data-total-tien-khach').toNum();
            var totalTienHang = $sheet.find('h4.totalTienHang').attr('data-total-tien-hang').toNum();
            var fare = $(this).val().replace(/\./g, '').toNum();
            if (fare < 10000) {
                fare = fare * 1000;
            }
            if (fare > 0) {
                $(this).val(fare.toMn());
            } else {
                $(this).val('');
            }
            var totalAnotherFee = 0;
            $.each($sheet.find('input[name="MoneyAnotherFee"]'), function (kl, kj) {
                var fk = $(kj).val().replace(/\./g, '').toNum();
                totalAnotherFee += fk;
            });
            var totalFee = tollFee + washFee + eatFee + totalAnotherFee;
            var totalTotal = totalTienHang + totalTienKhach - totalFee;
            $sheet.find('span[name="TotalAnotherFee"]').text(totalAnotherFee.toMn() + " đ");
            $sheet.find('span[name="TotalAnotherFee"]').attr('data-total-another-fee', totalAnotherFee);
            $sheet.find('span[name="TotalFee"]').text(totalFee.toMn() + " đ");
            $sheet.find('span[name="TotalFee"]').attr('data-total-fee', totalFee);
            $sheet.find('span[name="TotalTotal"]').text(totalTotal.toMn() + " đ");
        }).focus(function () {
            $(this).select();
        }).mouseup(function (e) {
            e.preventDefault();
        });

        $sheet.find('button[name="RemoveMoreFee"]').on('click', function (e) {
            var that = $(this).closest('div');
            var preEle = that.prev();
            var preElest = preEle.prev();
            that.remove();
            preEle.remove();
            preElest.remove();
        });
    },
    _tkSaveTrip: function (data) {
        var me = this;
        var $sheet = $('.vbooking-sheet');
        var tripDetailId = data.tData.Ts[data.tTime][0]['TripDetailId'];
        var tInfo = FlatObj.cTripInfo;
        var d = {}
        var obj = {
            _a: "UpTrip",
            _c: { Id: tripDetailId }
        }

        // cột PassengerMoney: 1~Main|Another|Fee
        var mainPassengerMoney = tInfo._mainFareTienKhach;
        var anotherFareTienKhach = $sheet.find('input[name="AnotherFareTienKhach"]').val().replace(/\./g, '').toNum();
        var nameAnotherFareTienKhach = $sheet.find('input[name="NameAnotherFareTienKhach"]').val();
        var feeTienKhach = $sheet.find('input[name="FeeTienKhach"]').val().replace(/\./g, '').toNum();
        var nameFeeTienKhach = $sheet.find('input[name="NameFeeTienKhach"]').val();
        if (anotherFareTienKhach > 0) {
            if (nameAnotherFareTienKhach == '') {
                vbf('onShowPopModal', { msg: "Vui lòng nhập tên doanh thu khác." });
                return;
            }
        } else {
            if (nameAnotherFareTienKhach != '') {
                vbf('onShowPopModal', { msg: "Doanh thu " + nameAnotherFareTienKhach + " phải lớn hơn 0." });
                return;
            }
        }
        if (feeTienKhach > 0) {
            if (nameFeeTienKhach == '') {
                vbf('onShowPopModal', { msg: "Vui lòng nhập tên chi phí văn phòng." });
                return;
            }
        } else {
            if (nameFeeTienKhach != '') {
                vbf('onShowPopModal', { msg: "Chi phí " + nameFeeTienKhach + " phải lớn hơn 0." });
                return;
            }
        }
        d.PassengerMoney = "1~" + mainPassengerMoney + "|" + nameAnotherFareTienKhach + "##" + anotherFareTienKhach + "|" + nameFeeTienKhach + "##" + feeTienKhach;
        // cột ProductMoney: 1~BranchCode:NumPaid|MoneyPaid##NumNotPaid|MoneyNotPaid,BranchCode:NumPaid|MoneyPaid##NumNotPaid|MoneyNotPaid~NumPickedPaid|MoneyPickedPaid##NumPickedNotPaid|MoneyPickedNotPaid
        var branchProduct = [];
        $.each($sheet.find('table.thong-ke.tien-hang tbody tr.branch-pro'), function (ak, al) {
            var fa = $(al);
            var branchCode = fa.find('td[name="BranchCode"]').attr('data-branch-code');
            var branchNotPaid = fa.find('input[name="BranchNotPaid"]').val().replace(/\./g, '').toNum();
            var numBranchNotPaid = fa.find('input[name="NumBranchNotPaid"]').val();
            var branchPaid = fa.find('input[name="BranchPaid"]').val().replace(/\./g, '').toNum();
            var numBranchPaid = fa.find('input[name="NumBranchPaid"]').val();
            branchProduct.push(branchCode + ':' + numBranchPaid + "|" + branchPaid + "##" + numBranchNotPaid + "|" + branchNotPaid);
        });
        var pickedNotPaid = $sheet.find('input[name="PickedNotPaid"]').val().replace(/\./g, '').toNum();
        var numPickedNotPaid = $sheet.find('input[name="NumPickedNotPaid"]').val();
        var pickedPaid = $sheet.find('input[name="PickedPaid"]').val().replace(/\./g, '').toNum();
        var numPickedPaid = $sheet.find('input[name="NumPickedPaid"]').val();
        // chi phí tiền hàng
        var feeTienHang = $sheet.find('input[name="FeeTienHang"]').val().replace(/\./g, '').toNum();
        var nameFeeTienHang = $sheet.find('input[name="NameFeeTienHang"]').val();
        if (feeTienHang > 0) {
            if (nameFeeTienHang == '') {
                vbf('onShowPopModal', { msg: "Vui lòng nhập tên chi phí hàng hóa." });
                return;
            }
        } else {
            if (nameFeeTienHang != '') {
                vbf('onShowPopModal', { msg: "Chi phí " + nameFeeTienHang + " phải lớn hơn 0." });
                return;
            }
        }
        d.ProductMoney = "1~" + branchProduct.join(',') +
            "~" + numPickedPaid + "|" + pickedPaid + "##" + numPickedNotPaid + "|" + pickedNotPaid + '~' + nameFeeTienHang + "##" + feeTienHang;
        // cột FeeMoney: 1~TollFee|WashFee|EatFee|AnotherFee
        // AnotherFee: index|NameAnotherFee|MoneyAnotherFee##index|NameAnotherFee|MoneyAnotherFee
        var tollFee = $sheet.find('input[name="TollFee"]').val().replace(/\./g, '').toNum();
        var washFee = $sheet.find('input[name="WashFee"]').val().replace(/\./g, '').toNum();
        var eatFee = $sheet.find('input[name="EatFee"]').val().replace(/\./g, '').toNum();
        var anotherFee = [];
        var ind = 1;
        $.each($sheet.find('input[name="NameAnotherFee"]'), function (ku, km) {
            var fs = $(km);
            var index = ind;
            var name = fs.val();
            var money = fs.closest('div.form-group').next('div').find('input[name="MoneyAnotherFee"]').val().replace(/\./g, '').toNum();
            anotherFee.push(index + "|" + name + "|" + money);
            ind++;
        });
        d.FeeMoney = "1~" + tollFee + "~" + washFee + "~" + eatFee + "~" + anotherFee.join('##');
        obj._d = d;
        var completeRequest = function (u, r, l, t) {
            if (u == 1) vbf('onShowSuccessModal', { hdr: 'Thông báo', msg: "Lưu thành công." });
        };
        vRqs(obj, completeRequest);
    },
    _chotPhoi: function (data) {
        var $sheet = $('.vbooking-sheet');
        var $tripInfo = $('.vbooking-info');
        var tripDetailId = data.tData.Ts[data.tTime][0]['TripDetailId'];
        var tInfo = FlatObj.cTripInfo;
        var d = {};
        var obj = {
            _a: "UpTrip",
            _c: { Id: tripDetailId }
        }
        // cột PassengerMoney: 1~Main|Another|Fee
        var mainPassengerMoney = tInfo._mainFareTienKhach;
        var anotherFareTienKhach = $sheet.find('input[name="AnotherFareTienKhach"]').val().replace(/\./g, '').toNum();
        var feeTienKhach = $sheet.find('input[name="FeeTienKhach"]').val().replace(/\./g, '').toNum();
        d.PassengerMoney = "1~" + mainPassengerMoney + "|" + anotherFareTienKhach + "|" + feeTienKhach;
        // cột ProductMoney: 1~BranchCode:NumPaid|MoneyPaid##NumNotPaid|MoneyNotPaid,BranchCode:NumPaid|MoneyPaid##NumNotPaid|MoneyNotPaid~NumPickedPaid|MoneyPickedPaid##NumPickedNotPaid|MoneyPickedNotPaid
        var branchProduct = [];
        $.each($sheet.find('table.thong-ke.tien-hang tbody tr.branch-pro'), function (ak, al) {
            var fa = $(al);
            var branchCode = fa.find('td[name="BranchCode"]').attr('data-branch-code');
            var branchNotPaid = fa.find('input[name="BranchNotPaid"]').val().replace(/\./g, '').toNum();
            var numBranchNotPaid = fa.find('input[name="NumBranchNotPaid"]').val();
            var branchPaid = fa.find('input[name="BranchPaid"]').val().replace(/\./g, '').toNum();
            var numBranchPaid = fa.find('input[name="NumBranchPaid"]').val();
            branchProduct.push(branchCode + ':' + numBranchPaid + "|" + branchPaid + "##" + numBranchNotPaid + "|" + branchNotPaid);
        });
        var pickedNotPaid = $sheet.find('input[name="PickedNotPaid"]').val().replace(/\./g, '').toNum();
        var numPickedNotPaid = $sheet.find('input[name="NumPickedNotPaid"]').val();
        var pickedPaid = $sheet.find('input[name="PickedPaid"]').val().replace(/\./g, '').toNum();
        var numPickedPaid = $sheet.find('input[name="NumPickedPaid"]').val();
        // chi phí tiền hàng
        var feeTienHang = $sheet.find('input[name="FeeTienHang"]').val().replace(/\./g, '').toNum();
        d.ProductMoney = "1~" + branchProduct.join(',') +
            "~" + numPickedPaid + "|" + pickedPaid + "##" + numPickedNotPaid + "|" + pickedNotPaid + '~' + feeTienHang;
        // cột FeeMoney: 1~TollFee|WashFee|EatFee|AnotherFee
        // AnotherFee: index|NameAnotherFee|MoneyAnotherFee##index|NameAnotherFee|MoneyAnotherFee
        var tollFee = $sheet.find('input[name="TollFee"]').val().replace(/\./g, '').toNum();
        var washFee = $sheet.find('input[name="WashFee"]').val().replace(/\./g, '').toNum();
        var eatFee = $sheet.find('input[name="EatFee"]').val().replace(/\./g, '').toNum();
        var anotherFee = [];
        var ind = 1;
        $.each($sheet.find('input[name="NameAnotherFee"]'), function (ku, km) {
            var fs = $(km);
            var index = ind;
            var name = fs.val();
            var money = fs.closest('div.form-group').next('div').find('input[name="MoneyAnotherFee"]').val().replace(/\./g, '').toNum();
            anotherFee.push(index + "|" + name + "|" + money);
            ind++;
        });
        d.FeeMoney = "1~" + tollFee + "~" + washFee + "~" + eatFee + "~" + anotherFee.join('##');
        obj._d = d;
        var p = function (u, r, l, t) { //completeRequestSaveTrip
            if (u == 1) {
                var objC = {
                    _a: "UpTrip",
                    _c: { Id: tripDetailId },
                    _d: { ClosedStatus: 2 }
                };
                var p2 = function (u2, r2, l2, t2) { //completeRequest
                    if (u2 == 1) {
                        vbf('onRenderTripInfo', {});
                        var tripDate = $.trim(data.tDate.toFormatString('dd-mm-yyyy'));
                        var tripTime = $.trim(data.tTime);
                        var tripName = $.trim(data.tData.Name);
                        $tripInfo.append('<h4 style="font-size: 24px;text-align: center;">Thống kê theo chuyến ' + tripName + ' ngày ' + tripDate + ' lúc ' + tripTime + '</h4>');
                        if (app.rights.indexOf($.rights.bEdtAtCphoi.val) == -1) {
                            $sheet.find('input,button').prop('disabled', 'disabled');
                            $sheet.find('button.tk-save-trip,button.btn-chot-phoi').addClass('hidden');
                        }
                    }
                };
                vRqs(objC, p2);
            }
        }
        vRqs(obj, p);
    },
    _closeChotPhoiDialog: function () {
        this._$chotphoiModal.modal('hide');
    },
    _createChotPhoiDialogDiv: function (data) {
        var me = this;
        var $chotphoiBody = $('<div />').addClass('modal-body')
            .append($('<form />').attr('id', "ChotPhoiPopup")
                .append($('<table />').addClass('table no-border mb0 table-modal table-condensed')
                    .append($('<tr />')
                        .append($('<td style="border:0;" />').addClass('col-md-6')
                            .append($('<div />').addClass('form-group')
                                .append($('<p />').html("Khi bấm nút Chốt phơi, phơi được chốt sẽ không còn thay đổi thông tin được nữa. Đồng ý ?"))
                            )
                        )
                    )
                    .append($('<tr />')
                        .append($('<td />').addClass('col-md-12 list-btn').attr('colspan', 3)
                            .append($('<button />', { type: 'button' }).addClass('btn btn-danger').text('Đồng ý').css('float', 'left')
                                .click(function () {
                                    me._chotPhoi(data);
                                    me._closeChotPhoiDialog();
                                })
                            )
                            .append($('<button />', { type: 'button' }).addClass('btn btn-default').text('Không').css('float', 'left')
                                .click(function () {
                                    me._closeChotPhoiDialog();
                                })
                            )
                        )
                    )
                )
        );

        //Create a div for dialog and add to container element
        me._$chotphoiModal = $('<div />').addClass('modal fade').attr('id', 'chotphoi-popup')
            .attr('role', 'dialog')
            .attr('aria-hidden', 'true')
            .append(
                $('<div />').addClass('modal-dialog modal-md')
                .append($('<div />').addClass('modal-content')
                    .append($('<div />').addClass('modal-header bg-primary')
                        .append($('<h3 />').addClass('modal-title thin-1').html('Xác nhận'))
                    )
                    .append($chotphoiBody)
                )
            )
        .appendTo($('body'));
        //.appendTo(this.element);
        me._$chotphoiModal.modal('show');
    },
})