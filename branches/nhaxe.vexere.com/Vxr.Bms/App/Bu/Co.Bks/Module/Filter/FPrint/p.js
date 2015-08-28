define({
    start: function (o) {
        $('body').on('fPrintStarted', function (e) {
            
        });

        $('body').on('fPrintExcuse', function (e, self) {
            var cb = function () {
                FlatObj.cTripInfo = null;
                self._printBKS();
            }
            if (app.oRights["StageEnable"]) {
                var fromPointId = ($("#FilterForm").find("select[name='FromPoint']").val());
                var toPointId = ($("#FilterForm").find("select[name='ToPoint']").val());
                var stopPoints = self._data[self._cTripIndex].StopPoints;
                if (stopPoints.data.length == 0 || (!$.isEmptyObject(stopPoints) && stopPoints.idx[fromPointId] == 0 && stopPoints.idx[toPointId] == stopPoints.data.length - 1)) {
                    $('button.btn-thong-ke').removeClass('active');
                    self._resetAll();
                    FlatObj.FTripGetTrip = false;
                    FlatObj.RBePrint = true;
                    self._reloadData(cb);
                } else {
                    self._showError(_dict._err[9]);
                }
            } else {
                $('button.btn-thong-ke').removeClass('active');
                self._resetAll();
                FlatObj.FTripGetTrip = false;
                FlatObj.RBePrint = true;
                self._reloadData(cb);
            }

        });
    }
});

$(document).ready(function () {
    $._bindEventOnFPrint = function (o) {
        
    }
});

