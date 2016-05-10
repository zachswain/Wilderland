var Type = require("../Type.js");
var extend = require("util")._extend;

var Port = function() {
    this.id = null;
    this.location = null;
    this.name = null;
    this.class = null;
    this.inventory = {};
    
    this.initialize = function() {
        this.name = "A port";
        this.class = 1;
        this.inventory = {
            FuelOre : {
                current : 20,
                max : 200
            },
            Organics : {
                current : 30,
                max : 300
            },
            Equipment : {
                current : 40,
                max : 400
            }
        };
    };
    
    this.buildForClient = function(client) {
        var port = JSON.parse(JSON.stringify(this));
        return port;
    };
    
    this.getId = function() {
        return this.id;
    }
    
    this.getLocation = function() {
        return this.location;
    }
    
    this.isBuyingFuelOre = function() {
        return (this.class & (1<<0)) > 0;
    }
    
    this.isBuyingOrganics = function() {
        return (this.class & (1<<1)) > 0;
    }
    
    this.isBuyingEquipment = function() {
        var buying = (this.class & (1<<2)) > 0;
        return buying;
    }
    
    this.getFuelOre = function() {
        return this.inventory.FuelOre;
    }
    
    this.getOrganics = function() {
        return this.inventory.Organics;
    }
    
    this.getEquipment = function() {
        return this.inventory.Equipment;
    }
}

module.exports = Port;