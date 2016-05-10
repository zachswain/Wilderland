var extend = require("util")._extend;

var Ship = function(options) {
    var defaults = {
        holds : 0,
        cargo : {
            FuelOre : 0,
            Organics : 0,
            Equipment : 0
        }
    };
    
    var values = extend(defaults, options);
    
    this.holds = values.holds;
    this.cargo = values.cargo;
    
    this.getFuelOre = function() {
        return this.cargo.FuelOre;
    };
    
    this.getOrganics = function() {
        return this.cargo.Organics;
    };
    
    this.getEquipment = function() {
        return this.cargo.Equipment;
    }
}

module.exports = Ship;