var Type = require("../Type.js");
var extend = require("util")._extend;

var Sector = function() {
    this.id = 0;
    this.warps = [];
    this.ports = [];
    this.players = [];
    
    this.buildForClient = function(client) {
        var sector = JSON.parse(JSON.stringify(this));
        
        for( var i=0 ; i<sector.ports.length ; i++ ) {
            sector.ports[i] = client.universe.getPort(sector.ports[i]).buildForClient(client);
        }
        
        return sector;
    }
};

module.exports = Sector;