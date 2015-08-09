var object = require('./object');
var assign = object.assign;

assign(exports, object);
assign(exports, require('./debug'));
assign(exports, require('./lang'));
assign(exports, require('./collection'));
assign(exports, require('./helper'));
