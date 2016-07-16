"use strict";
(function (Views) {
    Views[Views["edit"] = 1] = "edit";
    Views[Views["published"] = 2] = "published";
})(exports.Views || (exports.Views = {}));
var Views = exports.Views;
function Parse(url) {
    var wip = {
        url: url,
        lineId: null,
        view: Views.published,
        isRO: true
    };
    var checkForLineId = function (wip) {
        var url = wip.url;
        var rgx = /#([a-z0-9]+)$/i;
        var matches = rgx.exec(url);
        wip.lineId = matches ? matches[1] : null;
        if (matches)
            wip.url = url.replace(rgx, '');
    };
    var checkForRender = function (wip) {
        function strToView(s) {
            switch (s.toLowerCase()) {
                case 'edit': return Views.edit;
            }
            return Views.published;
        }
        var url = wip.url;
        var rgx = /\/(published|edit)$/i;
        var matches = rgx.exec(url);
        if (matches) {
            wip.view = strToView(matches[1]);
            wip.isRO = false;
            wip.url = url.replace(rgx, '');
        }
        else {
            wip.view = Views.published;
            wip.isRO = true;
        }
    };
    checkForLineId(wip);
    checkForRender(wip);
    var re = /^trystal:\/\/([^\/]{2,20})\/([^\/]{3,50})$/i;
    var matches = re.exec(wip.url);
    if (!matches)
        return null;
    var uid = matches[1];
    var filename = matches[2];
    var view = wip.view, lineId = wip.lineId, isRO = wip.isRO;
    return new TryUrl(uid, filename, view, lineId, isRO);
}
exports.Parse = Parse;
var TryUrl = (function () {
    function TryUrl(uid, filename, view, lineId, isRO) {
        if (view === void 0) { view = Views.published; }
        if (lineId === void 0) { lineId = null; }
        if (isRO === void 0) { isRO = true; }
        this.uid = uid;
        this.filename = filename;
        this.view = view;
        this.lineId = lineId;
        this.isRO = isRO;
    }
    Object.defineProperty(TryUrl.prototype, "url", {
        get: function () {
            var bits = [this.uid, this.filename];
            if (this.view)
                bits.push(Views[this.view]);
            if (this.lineId)
                bits.push("#" + this.lineId);
            return "trystal://" + bits.join('/');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TryUrl.prototype, "isValid", {
        get: function () {
            if (!this.uid)
                return false;
            if (!this.filename)
                return false;
            return true;
        },
        enumerable: true,
        configurable: true
    });
    TryUrl.simple = function (owner, filename, perm) {
        if (!filename)
            return null;
        return new TryUrl(owner, filename, Views.edit, null, perm !== 'rw');
    };
    return TryUrl;
}());
exports.TryUrl = TryUrl;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TryUrl;
