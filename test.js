/*
 * (C) 2015 Seth Lakowske
 */

var test         = require('tape');
var lexTimestamp = require('./');

test('can construct timestamps from values', function(t) {
    var stamp = lexTimestamp.constructTimestamp(1, 1, 2, 3);

    t.equal(stamp, '01.001');

    var stamp = lexTimestamp.constructTimestamp(2, 1, 3, 5);

    t.equal(stamp, '002.00001');

    var stamp = lexTimestamp.constructTimestamp(3, 0, 1, 5);

    t.equal(stamp, '3.00000');

    var stamp = lexTimestamp.constructTimestamp(300, 0, 2, 5);

    t.equal(stamp, '300.00000');

    t.end();
})

test('can mock the time', function(t) {

    var i = 0;
    var times = [0, 1, 1, 3];
    var mockTime = function() {

        return times[i++];

    }

    var timestamper = lexTimestamp.lexicographicTimestamp(2, 3, 'key', mockTime);

    var result = timestamper({value:'hi'});

    t.equal(result.key, '00.000');

    var result = timestamper({value:'bye'});

    t.equal(result.key, '01.000');

    var result = timestamper({value:'same'});

    t.equal(result.key, '01.001');

    var result = timestamper({value:'different'});

    t.equal(result.key, '03.000');

    t.end();
})

test('verify assumptions about lexicographic comparison', function(t) {
    t.ok('1.001' > '1.000')
    t.notOk('1.000' > '1.000')
    t.ok('2.000' > '1.000');
    t.ok('1.000' > '0.000');
    t.ok('10' > '09.000');
    t.notOk('10' > '9.000');

    t.end();
})
