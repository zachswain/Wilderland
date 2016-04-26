var Sector = require("./Sector");
var Port = require("./Port");
var Type = require("../Type");

var Universe = function(parameters) {
    this.sectors = {};
    this.ports = {};
    
    this.initialize = function() {
        console.log("Universe: initializing");
        
        // Sector 1
        var sector = new Sector();
        sector = new Sector();
        sector.id = 1;
        sector.warps = [2,3,4];
        var port = new Port();
        port.initialize();
        port.id = 1;
        port.location = {
            type : Type.SECTOR,
            id : 1
        };
        this.ports[port.id] = port;
        sector.ports = [ port.id ];
        this.sectors[sector.id] = sector;
        
        sector = new Sector();
        sector.id = 2;
        sector.warps = [1];
        this.sectors[sector.id] = sector;
        
        sector = new Sector();
        sector.id = 3;
        sector.warps = [1,4];
        this.sectors[sector.id] = sector;
        
        sector = new Sector();
        sector.id = 4;
        sector.warps = [1,3,4];
        this.sectors[sector.id] = sector;
        
        console.log("Universe: initialized " + Object.keys(this.sectors).length + " sectors");
    },
    
    this.getSector = function(sectorId) {
        if( this.sectors[sectorId] ) {
            return this.sectors[sectorId];
        } else {
            return null;
        }
    },
    
    this.getPort = function(portId) {
        if( this.ports[portId] ) {
            return this.ports[portId];
        } else {
            return null;
        }
    }
}

module.exports = Universe;