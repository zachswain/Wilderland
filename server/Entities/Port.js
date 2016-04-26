var Type = require("../Type.js");
var extend = require("util")._extend;

var Port = function() {
    this.id = null;
    
    this.initialize = function() {
        this.name = "A port";
        this.class = 0;
    },
    
    this.buildForClient = function(client) {
        var port = JSON.parse(JSON.stringify(this));
        return port;
    }
}

module.exports = Port;