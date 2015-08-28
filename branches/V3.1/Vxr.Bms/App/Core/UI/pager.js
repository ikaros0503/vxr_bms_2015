function Pager(total, itemsPerPage, container, numberOfPageToBeShown, onPageChanged){
    Pager.prototype.totalRecords = total;
    Pager.prototype.totalPage = Math.ceil(total/itemsPerPage);
	Pager.prototype.itemsPerPage=itemsPerPage;
	Pager.prototype.currentPage=1;
	Pager.prototype.container=container;
	Pager.prototype.numberOfPageToBeShown=numberOfPageToBeShown;
	Pager.prototype.onPageChanged = onPageChanged;
	var startButton = (1 - numberOfPageToBeShown / 2) > 0 ? (1 - numberOfPageToBeShown / 2) : 1;
	Pager.prototype.startButton = startButton;
	Pager.prototype.endButton = (startButton + numberOfPageToBeShown <= total) ? (startButton + numberOfPageToBeShown) : total;
}

Pager.prototype.updateInfo = function (totalRecords, currentPage) {
    var self = this;
    self.totalRecords = totalRecords;
    self.totalPage = Math.ceil(totalRecords / self.itemsPerPage);
    self.currentPage = currentPage;
    self.startButton = (1 - self.numberOfPageToBeShown / 2) > 0 ? (1 - self.numberOfPageToBeShown / 2) : 1;
    self.endButton = (self.startButton + self.numberOfPageToBeShown <= self.totalRecords) ? (self.startButton + self.numberOfPageToBeShown) : self.totalRecords;
    if (this.onPageChanged != null) {
        this.onPageChanged();
    }
    return this;
}
Pager.prototype.render= function() {
    var self = this;
    var update = function() {
        $(self.container).html(pageTemplate);
        var $ul = $(self.container + " ul.pages");
        $ul.append(vtpl(pageButton, { type: 'first', disabled: self.currentPage > 1 ? '' : 'disabled', value: 1, icon: 'glyphicon-fast-backward' }));
        $ul.append(vtpl(pageButton, { type: 'previous', disabled: self.currentPage > 1 ? '' : 'disabled', value: self.currentPage - 1, icon: 'glyphicon-backward' }));

        self.startButton = (self.currentPage - Math.floor(self.numberOfPageToBeShown / 2)) > 0 ? (self.currentPage - Math.floor(self.numberOfPageToBeShown / 2)) : 1;
        self.endButton = (self.startButton + self.numberOfPageToBeShown - 1 <= self.totalPage) ? (self.startButton + self.numberOfPageToBeShown - 1) : self.totalPage;
        

        var isLeftCommonButtonRendered = false, isRightCommonButtonRendered = false;
        $(self.container + " .allPages").html('');
        for (var i = 1; i <= self.totalPage; i++) {

            $(self.container + " .allPages").append(vtpl(selectPagesOption, { value: i }));
            var tmp = 0;
            if (i >= self.startButton && i <= self.endButton) {
                $ul.append(vtpl(pageButtonNumber, { value: i, active: i == self.currentPage ? 'active' : '' }));
            } else if (isLeftCommonButtonRendered == false && i < self.startButton) {
                tmp = self.startButton - Math.floor(self.numberOfPageToBeShown / 2);
                $ul.append(vtpl(pageButtonNumber, {
                    value: '...',
                    pageToShow: tmp > 0 ? tmp : 1
                }));
                isLeftCommonButtonRendered = true;
            } else if (isRightCommonButtonRendered == false && i > self.endButton) {
                tmp = self.endButton + Math.floor(self.numberOfPageToBeShown / 2);
                $ul.append(vtpl(pageButtonNumber, {
                    value: '...',
                    pageToShow: tmp < self.totalPage ? tmp : self.totalPage
                }));
                isRightCommonButtonRendered = true;
            }
        }

        $ul.append(vtpl(pageButton, { type: 'next', disabled: self.currentPage < self.totalPage ? '' : 'disabled', value: self.currentPage + 1, icon: 'glyphicon-forward' }));
        $ul.append(vtpl(pageButton, { type: 'last', disabled: self.currentPage < self.totalPage ? '' : 'disabled', value: self.totalPage, icon: 'glyphicon-fast-forward' }));
    };
    update();

    vev(self.container + " ul.pages li a", "click", function() {
        var index = $(this).attr('data-index');
        if ($(this).hasClass('disabled')) {
            return;
        } else if ($(this).attr('data-index') == '...') {
            ////recalculate startButton and endButton
            //var pageToShow = $(this).attr('data-pagetoshow');
            //if (pageToShow > self.currentPage) {
            //    self.endButton = pageToShow;
            //    self.startButton = (pageToShow-self.numberOfPageToBeShown)>0?(pageToShow-self.numberOfPageToBeShown):1;
            //} else {
            //    self.startButton = pageToShow;
            //    self.endButton = (pageToShow + self.numberOfPageToBeShown) > self.totalPage ? (pageToShow + self.numberOfPageToBeShown) : self.totalPage;;
            //}
            //self.render();
        } else if ($(this).attr('data-index') != null) {
            self.currentPage = $(this).attr('data-index');
            self.render();
            if (self.onPageChanged != null) {
                self.onPageChanged();
            }
        }

    });

    $(self.container + " div.pager-info select.allPages").val(self.currentPage);
    var fromRecord = (self.currentPage - 1) * self.itemsPerPage;
    var summaryObj = {
        from: fromRecord + 1,
        to: (fromRecord + self.itemsPerPage > self.totalRecords ? self.totalRecords : (fromRecord + self.itemsPerPage)),
        total: self.totalRecords
    };
    $(self.container + " div.pager-info span.summary").html(vtpl(summary, summaryObj));
    vev(self.container + " div.pager-info select.allPages", "change", function () {
		self.currentPage=$(this).val();
	    self.render();
		if (self.onPageChanged!=null){
			self.onPageChanged();
		}
	});

    $(self.container + " div.pager-info select.itemsPerPage").val(self.itemsPerPage);
    vev(self.container + " div.pager-info select.itemsPerPage", "change", function () {
	    self.currentPage = 1;
	    self.itemsPerPage = $(this).val();
	    self.totalPage = Math.ceil(self.totalRecords / self.itemsPerPage);
	    self.render();
		if (self.onPageChanged!=null){
			self.onPageChanged();
		}
    });
    return this;
}

Pager.prototype.setVisible=function(isVisible){
	isVisible?$(this.container).show():$(this.container).hide();
}

var pageButtonNumber = '<li style="float:left; " class="{active} pageButton"><a href="javascript:;" data-pageToShow="{pageToShow}"  data-index="{value}">{value}</a></li>';
var summary = "{from}-{to} trên tổng số {total} dòng";
var pageButton=
'<li class="{disabled} {type}">' +
    '<a href="javascript:;" data-index="{value}"><i class="glyphicon {icon}"></i></a>' +
'</li>';
var selectPagesOption = '<option value="{value}">{value}</option>';
var pageTemplate =
'<ul class="pages pagination pagination-sm mt0 fl" style="display: block;  padding: 5px;">' +
'</ul>'+
'<div class="pager-info">' +
    '<span style="float:left;margin-top:10px">Tới trang: </span>' +
        '<select class="allPages form-control input-sm" style="max-width:80px;float:left;">' +
        '</select>'+
    '<span style="float:left;margin-top:10px">Số bản ghi:</span>' +
    '<select class="itemsPerPage form-control  input-sm" style="max-width:80px;float:left;">' +
        '<option value="10">10</option>' +
        '<option value="20">20</option>' +
        '<option value="30">30</option>' +
        '<option value="40">40</option>' +
        '<option value="50">50</option>' +
    '</select>' +
    '<span style="float:left;margin-top:10px" class="summary"></span>' +
'</div>'
;
