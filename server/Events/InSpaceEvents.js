var Type = require("../Type.js");
var GameState = require("../GameState");

var InSpaceEvents = function(client) {
    this.client = client;
    
    this.handlers = {
        "move" : onMove.bind(this),
        "port" : onPort.bind(this)
    }
}

function onMove(data) {
    if( this.client.state!=GameState.IN_SPACE ) {
        this.client.socket.emit("command_fail", {
            id : data.id,
            message : "You can't do that right now."
        });
    } else {
        // move the player
        var destinationSector = this.client.universe.getSector(parseInt(data.args.destination));
        
        if( this.client.player.location!=null && this.client.player.location.type==Type.SECTOR ) {
            var currentSector = this.client.universe.getSector(this.client.player.location.id);
            
            if( currentSector.warps.indexOf(parseInt(data.args.destination))>=0 ) {
                this.client.setState(GameState.LEAVING_SECTOR);
                
                // TODO: check for stuff when leaving
                
                this.client.setState(GameState.MOVING, {
                    "source" : currentSector.buildForClient(this.client),
                    "destination" : destinationSector.buildForClient(this.client)
                });
                
                this.client.player.location.id = destinationSector.id;
                this.client.setState(GameState.ENTERING_SECTOR,  {
                    "sector" : destinationSector.buildForClient(this.client)
                });
                
                // TODO: check for stuff when entering a sector
                
                this.client.setState(GameState.IN_SPACE,  {
                    "sector" : destinationSector.buildForClient(this.client)
                });
                
                this.client.socket.emit("command_success", {
                    id : data.id,
                });
            } else {
                this.client.socket.emit("command_fail", {
                    id : data.id,
                    message : "No path to destination"
                });
            }
        } else {
            this.client.socket.emit("command_fail", {
                id : data.id,
                message : "No path to destination."
            });
        }
    }
}

function onPort(data) {
    if( this.client.state!=GameState.IN_SPACE ) {
        this.client.socket.emit("command_fail", {
            id : data.id,
            message : "You can't do that right now."
        });
    } else {
        var sector = this.client.universe.getSector(this.client.player.location.id);
        
        if( sector ) {
            if( sector.ports.length > 0 ) {
                var port = this.client.universe.getPort(sector.ports[0]);
                if( port ) {
                    this.client.setState(GameState.LEAVING_SECTOR);
                    this.client.setState(GameState.ENTERING_PORT, {
                        "port" : port.buildForClient()   
                    });
                    
                    this.client.player.setLocation({
                        type : Type.PORT,
                        id : port.getId()
                    })
                    
                    this.client.setState(GameState.IN_PORT, {
                        "port" : port.buildForClient(),
                        "player" : this.client.player.buildForClient(this.client)
                    });
                    
                    this.client.socket.emit("command_success", {
                        id : data.id
                    });
                } else {
                   this.client.socket.emit("command_fail", {
                        id : data.id,
                        message : "Bad sector data"
                    }); 
                }
            } else {
                this.client.socket.emit("command_fail", {
                    id : data.id,
                    message : "Bad sector data"
                });
            }
                
        } else {
            this.client.socket.emit("command_fail", {
                id : data.id,
                message : "Bad sector data"
            });   
        }
    }
}

module.exports = InSpaceEvents;