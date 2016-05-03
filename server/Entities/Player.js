var Type = require("../Type.js");
var Ships = require("./Ships.js");

var Player = function() {
    this.credits = 0;
    this.location = null;
    this.ship = null;
    
    this.initialize = function() {
        this.ship = new Ships.MerchantCruiser();
    }
    
    this.setCredits = function(credits) {
        this.credits = credits;
    }
    
    this.getCredits = function() {
        return this.credits;
    }
    
    this.setLocation = function(location) {
        this.location = location;
    }
    
    this.getLocation = function() {
        return this.location;
    }
    
    this.buildForClient = function(client) {
        var player = JSON.parse(JSON.stringify(this));
        
        return player;
    }
}

module.exports = Player;