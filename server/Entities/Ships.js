var Ship = require("./Ship.js");
var inherits = require('util').inherits;

var Ships = {
    EscapePod : function() {
        this.type = "Escape Pod";
        Ship.call(this, {
            holds : 5
        });
    },
    MerchantCruiser  : function() {
        this.type = "Merchant Cruiser";
        Ship.call(this, {
            holds : 30
        });
    }
};

inherits(Ships.MerchantCruiser, Ship);

module.exports = Ships;