/*
 * (C) 2015 Seth Lakowske
 */

var through    = require('through');
var sprintf    = require('sprintf-js').sprintf;

/*
 * Create a timestamp and store it on the object with the given keyName.
 * The timestamp is a string in milliseconds with given number of decimalPlaces.
 * When run in the browser and multiple objects are received in a single
 * millisecond, the decimal place counts up (e.g. 1.001,
 * 1.002, 1.003, etc...)
 * When run on a server, the decimal places are filled with values from the more precise clock.
 */
function timestampStream(decimalPlaces, keyName) {

    var lastMillisecond = Date.now();
    var counter         = 0;

    return through(function(object) {
        var now = Date.now();

        if (now === lastMillisecond) {
            counter++;
        } else {
            counter = 0;
        }

        lastMillisecond = now;

        var lexTimestamp = constructTimestamp(now, counter, decimalPlaces);

        object[keyName] = lexTimestamp;

        this.queue(object);
    })

}

function lexicographicTimestamp(decimalPlaces, keyName, time) {

    var lastMillisecond = Date.now();
    var counter         = 0;

    return function(object) {
        var now = time();

        if (now === lastMillisecond) {
            counter++;
        } else {
            counter = 0;
        }

        lastMillisecond = now;

        var lexTimestamp = constructTimestamp(now, counter, decimalPlaces);

        object[keyName] = lexTimestamp;

        return object;
    }

}

/*
 * Construct a string timestamp of the form 'millis.fraction' where fraction is
 * padded with the given number of decimal places.
 */
function constructTimestamp(millis, fraction, decimalPlaces) {
    var fractionStr = sprintf('%0' + decimalPlaces + 'i', fraction);

    return millis + '.' + fractionStr;
}

module.exports.timestampStream        = timestampStream;
module.exports.lexicographicTimestamp = lexicographicTimestamp;
module.exports.constructTimestamp     = constructTimestamp;
