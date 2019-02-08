
function dispatchRequest(config) {
    var request = config.createRequest;
    return request(config).then(function (response) {
        return response;
    }, function (reason) {
        if (reason) {
            return reason;
        }
    })
}

export default dispatchRequest;