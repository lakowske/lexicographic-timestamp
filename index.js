/*
 * (C) 2015 Seth Lakowske
 */

var through    = require('through');
var sprintf    = require('sprintf-js').sprintf;

function timestampStream(numberPlaces, decimalPlaces, keyName) {

    var stamper = lexicographicTimestamp(numberPlaces, decimalPlaces, keyName, Date.now);

    return through(function(object) {

        stamper(object);

        this.queue(object);
    })

}

/*
 * Create a timestamp and store it on the object with the given keyName.
 * The timestamp is a string in milliseconds with given number of decimalPlaces.
 * Padding the number with leading zeros is necessary when referencing times in the 1970s.
 *
 * When run in the browser and multiple objects are received in a single
 * millisecond, the decimal place counts up (e.g. 1.001, 1.002, 1.003, etc...)
 * When run on a server, the decimal places are filled with values from the more precise clock.
 */
function lexicographicTimestamp(numberPlaces, decimalPlaces, keyName, time) {

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

        var lexTimestamp = constructTimestamp(now, counter, numberPlaces, decimalPlaces);

        object[keyName] = lexTimestamp;

        return object;
    }

}

/*
 * Construct a string timestamp of the form 'millis.fraction' where millis and fraction is
 * padded with the given number of places.
 */
function constructTimestamp(millis, fraction, numberPlaces, decimalPlaces) {
    var fractionStr = sprintf('%0' + decimalPlaces + 'i', fraction);
    var millisStr   = sprintf('%0' + numberPlaces  + 'i', millis);

    return millisStr + '.' + fractionStr;
}

module.exports.timestampStream        = timestampStream;
module.exports.lexicographicTimestamp = lexicographicTimestamp;
module.exports.constructTimestamp     = constructTimestamp;
