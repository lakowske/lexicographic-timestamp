/*
 * (C) 2015 Seth Lakowske
 */

var test         = require('tape');
var lexTimestamp = require('./');

test('can construct timestamps from values', function(t) {
    var stamp = lexTimestamp.constructTimestamp(1, 1, 3);

    t.equal(stamp, '1.001');

    var stamp = lexTimestamp.constructTimestamp(2, 1, 5);

    t.equal(stamp, '2.00001');

    var stamp = lexTimestamp.constructTimestamp(3, 0, 5);

    t.equal(stamp, '3.00000');

    t.end();
})

test('can mock the time', function(t) {

    var i = 0;
    var times = [0, 1, 1, 3];
    var mockTime = function() {

        return times[i++];

    }

    var timestamper = lexTimestamp.lexicographicTimestamp(3, 'key', mockTime);

    var result = timestamper({value:'hi'});

    t.equal(result.key, '0.000');

    var result = timestamper({value:'bye'});

    t.equal(result.key, '1.000');

    var result = timestamper({value:'same'});

    t.equal(result.key, '1.001');

    var result = timestamper({value:'different'});

    t.equal(result.key, '3.000');

    t.end();
})
