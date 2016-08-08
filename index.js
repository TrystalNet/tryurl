"use strict";
(function (Views) {
    Views[Views["edit"] = 1] = "edit";
    Views[Views["published"] = 2] = "published";
})(exports.Views || (exports.Views = {}));
var Views = exports.Views;
function Parse(url) {
    const wip = {
        url,
        lineId: null,
        view: Views.published,
        isRO: true
    };
    let checkForLineId = (wip) => {
        const { url } = wip;
        const rgx = /#([a-z0-9]+)$/i;
        const matches = rgx.exec(url);
        wip.lineId = matches ? matches[1] : null;
        if (matches)
            wip.url = url.replace(rgx, '');
    };
    const checkForRender = (wip) => {
        function strToView(s) {
            switch (s.toLowerCase()) {
                case 'edit': return Views.edit;
            }
            return Views.published;
        }
        const { url } = wip;
        const rgx = /\/(published|edit)$/i;
        const matches = rgx.exec(url);
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
    const re = /^trystal:\/\/([^\/]{2,20})\/([^\/]{3,50})$/i;
    const matches = re.exec(wip.url);
    if (!matches)
        return null;
    const userId = matches[1];
    const trystId = matches[2];
    const { view, lineId, isRO } = wip;
    return new TryUrl(userId, trystId, view, lineId, isRO);
}
exports.Parse = Parse;
class TryUrl {
    constructor(userId, filename, view = Views.published, lineId = null, isRO = true) {
        this.userId = userId;
        this.filename = filename;
        this.view = view;
        this.lineId = lineId;
        this.isRO = isRO;
    }
    get url() {
        const bits = [this.userId, this.filename];
        if (this.view)
            bits.push(Views[this.view]);
        if (this.lineId)
            bits.push(`#${this.lineId}`);
        return `trystal://${bits.join('/')}`;
    }
    get isValid() {
        if (!this.userId)
            return false;
        if (!this.filename)
            return false;
        return true;
    }
    static simple(userId, filename, perm) {
        if (!filename)
            return null;
        return new TryUrl(userId, filename, Views.edit, null, perm !== 'rw');
    }
}
exports.TryUrl = TryUrl;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TryUrl;
