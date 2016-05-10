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
            holds : 30,
            cargo : {
                FuelOre : 5,
                Organics : 5,
                Equipment : 5
            }
        });
    }
};

inherits(Ships.MerchantCruiser, Ship);

module.exports = Ships;