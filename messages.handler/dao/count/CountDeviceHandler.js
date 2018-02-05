const db = require(`../../../db/index`);
const Response = require(`../../../shim/Response`);
const CountDeviceRequestBody = require(`../../../common/model/rpc/CountDeviceRequestBody`);
const CountResponseBody = require(`../../../common/model/rpc/CountResponseBody`);
const ErrorResponseBody = require(`../../../common/model/rpc/ErrorResponseBody`);


module.exports = async (request) => {
    const countDeviceRequestBody = new CountDeviceRequestBody(request.body);
    const response = new Response();

    try {
        const count = await countDevices(countDeviceRequestBody);

        response.errorCode = 0;
        response.failed = false;
        response.withBody(new CountResponseBody({ count: count }));
    } catch (err) {
        response.errorCode = 500;
        response.failed = true;
        response.withBody(new ErrorResponseBody());
    }

    return response;
};


async function countDevices (countDeviceRequestBody) {
    const models = await db.getModels();
    const deviceDAO = models[`Device`];
    const networkDAO = models[`Network`];
    const userNetworkDAO = models[`UserNetwork`];
    const deviceFilterObject = {};
    const principal = countDeviceRequestBody.principal;


    if (countDeviceRequestBody.namePattern) {
        deviceFilterObject.name = { like: countDeviceRequestBody.namePattern };
    }

    if (countDeviceRequestBody.name) {
        deviceFilterObject.name = countDeviceRequestBody.name;
    }

    if (countDeviceRequestBody.networkId) {
        deviceFilterObject.networkId = { inq: [ countDeviceRequestBody.networkId ] };
    }

    if (countDeviceRequestBody.networkName) {
        const networkFilterObject = { where: { name: countDeviceRequestBody.networkName } };
        let networks;

        if (countDeviceRequestBody.networkId) {
            networkFilterObject.where.id = countDeviceRequestBody.networkId;
        }

        networks = await networkDAO.find(networkFilterObject);

        deviceFilterObject.networkId = { inq: networks.map(network => parseInt(network.id)) };
    }

    if (principal) {
        const user = principal.getUser();

        if (user && !user.isAdmin()) {
            if (deviceFilterObject.networkId) {
                const userNetworks = await userNetworkDAO.find({where: {userId: user.id}});
                const userNetworkIds = userNetworks.map(userNetwork => parseInt(userNetwork.networkId));

                const filteredNetworkIds = deviceFilterObject.networkId.inq.filter(networkId => {
                    return userNetworkIds.includes(networkId);
                });

                deviceFilterObject.networkId = { inq: filteredNetworkIds };
            }
        }

        if (principal.networkIds) {
            deviceFilterObject.networkId = { inq: principal.networkIds };
        }

        if (principal.deviceTypeIds) {
            deviceFilterObject.deviceTypeId = { inq: principal.deviceTypeIds };
        }
    }


    return await deviceDAO.count(deviceFilterObject);
}
