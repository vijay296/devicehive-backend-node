const Body = require(`../../../shim/Body`);
const Action = require(`../../../shim/Action`);
const DeviceNotification = require(`../DeviceNotification`);

class NotificationSearchResponseBody extends Body {

    constructor({ notifications, ...rest } = {}) {
        super({ action: Action.NOTIFICATION_SEARCH_RESPONSE, notifications, ...rest });

        const me = this;

        me.notifications = notifications;
    }

    get notifications() {
        const me = this;

        return me._notifications;
    }

    set notifications(value) {
        const me = this;

        me._notifications = value.map((notification) => notification ? new DeviceNotification(notification) : notification);
    }
}


module.exports = NotificationSearchResponseBody;
