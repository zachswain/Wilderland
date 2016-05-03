var Ship = require("./Ship.js");
var inherits = require('util').inherits;

var Ships = {
    MerchantCruiser  : function() {
        Ship.call(this);
    }
};

inherits(Ships.MerchantCruiser, Ship);

module.exports = Ships;