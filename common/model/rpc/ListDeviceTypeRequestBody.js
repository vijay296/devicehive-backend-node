const Body = require(`../../../shim/Body.js`);
const Principal = require(`../../../shim/Principal.js`);

class ListDeviceTypeRequestBody extends Body {

    constructor({ name, namePattern, sortField, sortOrder, take, skip, principal, ...rest } = {}) {
        super({ name, namePattern, sortField, sortOrder, take, skip, principal, ...rest });

        const me = this;

        me.name = name;
        me.namePattern = namePattern;
        me.sortField = sortField;
        me.sortOrder = sortOrder;
        me.take = take;
        me.skip = skip;
        me.principal = principal ? new Principal(principal) : principal;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get namePattern() {
        return this._namePattern;
    }

    set namePattern(value) {
        this._namePattern = value;
    }

    get sortField() {
        return this._sortField;
    }

    set sortField(value) {
        this._sortField = value;
    }

    get sortOrder() {
        return this._sortOrder;
    }

    set sortOrder(value) {
        this._sortOrder = value;
    }

    get take() {
        return this._take;
    }

    set take(value) {
        this._take = value;
    }

    get skip() {
        return this._skip;
    }

    set skip(value) {
        this._skip = value;
    }

    get principal() {
        return this._principal;
    }

    set principal(value) {
        this._principal = value;
    }

    get rest() {
        return this._rest;
    }

    set rest(value) {
        this._rest = value;
    }
}


module.exports = ListDeviceTypeRequestBody;