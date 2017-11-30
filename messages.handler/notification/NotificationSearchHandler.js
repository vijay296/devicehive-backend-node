const hazelcastService = require(`../../service/hazelcast/HazelcastService.js`);
const NotificationSearchRequestBody = require(`../../common/NotificationSearchRequestBody.js`);
const NotificationSearchResponseBody = require(`../../common/NotificationSearchResponseBody.js`);
const DeviceNotification = require(`../../common/DeviceNotification.js`);
const Response = require(`../../shim/Response.js`);


module.exports = async (request) => {
    const notificationSearchRequestBody = new NotificationSearchRequestBody(request.body);
    const response = new Response({ last: false });
    const notifications = notificationSearchRequestBody.id && notificationSearchRequestBody.deviceId ?
        searchSingleNotificationByDeviceAndId(notificationSearchRequestBody.id, notificationSearchRequestBody.deviceId) :
        searchMultipleNotifications(notificationSearchRequestBody);

    response.errorCode = 0;
    response.failed = false;
    response.withBody(new NotificationSearchResponseBody({
        notifications: notifications.map((deviceNotification) => deviceNotification.toObject())
    }));

    return response;
};


async function searchMultipleNotifications(notificationSearchRequestBody) {
    await hazelcastService.find(DeviceNotification.getClassName(), {
        deviceIds: notificationSearchRequestBody.deviceIds,
        names: notificationSearchRequestBody.names,
        limit: (notificationSearchRequestBody.take || 0) - (notificationSearchRequestBody.skip || 0),
        from: notificationSearchRequestBody.start,
        to: notificationSearchRequestBody.end,
        returnUpdated: false,
        status: null
    });
    //TODO
}


async function searchSingleNotificationByDeviceAndId(id, deviceId) {
    return (await hazelcastService.find(DeviceNotification.getClassName(), { id: id, deviceId: deviceId }));
        //.map((notification) => new DeviceNotification(notification));
}