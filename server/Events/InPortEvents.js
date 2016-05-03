var Type = require("../Type.js");
var GameState = require("../GameState");

var InPortEvents = function(client) {
    this.client = client;
    
    this.handlers = {
        "launch" : onLaunch.bind(this)
    }
}

function onLaunch(data) {
    if( this.client.state == GameState.IN_PORT ) {
        if( this.client.player.location.type==Type.PORT ) {
            var portId = this.client.player.location.id;
            var port = this.client.universe.getPort(portId);
            var location = port.location;
            
            this.client.setState(GameState.LEAVING_PORT, {
                "port" : port.buildForClient(this.client)
            });
            
            this.client.player.setLocation(location);
            
            if( location.type==Type.SECTOR ) {
                var sector = this.client.universe.getSector(location.id);
                
                this.client.setState(GameState.ENTERING_SECTOR, {
                    "sector" : sector.buildForClient(this.client),
                    "player" : this.client.player.buildForClient(this.client)
                });
                
                this.client.setState(GameState.IN_SPACE,  {
                    "sector" : sector.buildForClient(this.client),
                    "player" : this.client.player.buildForClient(this.client)
                });
                
                this.client.socket.emit("command_success", {
                    id : data.id
                });
            }
        } else {
            this.client.socket.emit("command_fail", {
                id : data.id,
                message : "You aren't in a port, no matter what your state says (?!)."
            });
        }
    } else {
        // let something else handle launch
    }
}

module.exports = InPortEvents;