var GameState = require("./GameState");
var extend = require("util")._extend;

var Client = function() {
    this.socket = null;
    this.player = null;
    this.universe = null;
    this.state = GameState.NO_STATE;
    
    this.setState = function(newState, parameters) {
        var oldState = this.state;
        console.log(parameters);
        parameters = parameters || {};
        
        // var data = {
        //     "oldState" : oldState,
        //     "newState" : newState
        // };
        
        //parameters = extend(data, parameters);
        parameters.oldState = oldState;
        parameters.newState = newState;
        
        this.state = newState;
        
        this.socket.emit("state_change", parameters);
    }
}

module.exports = Client;