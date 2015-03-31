Add lexicographically sortable timestamps to objects

The following example places timestamps on objects.  The object will have a key named 'key' and its value will be a lexicographically sortable timestamp.

```js

var timestamp    = require('lexicographic-timestamp');
var timestamper  = timestamp.timestampStream(16, 9, 'key');
var JSONStream   = require('JSONStream');

var stringify    = JSONStream.stringify(false);

timestamper.pipe(stringify).pipe(process.stdout);

timestamper.write({value : 'hello wisconsin'});

```

Streams the following to stdout

```
{"value":"hello wisconsin","key":"0001427769510483.000000000"}
```

Notice the integer part has 16 characters with leading zeros and the fractional part has 9 characters.  This format would allow sortable references going back to the 1970s.