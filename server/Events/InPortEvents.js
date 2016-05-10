var Type = require("../Type.js");
var GameState = require("../GameState");

var InPortEvents = function(client) {
    this.client = client;
    
    this.handlers = {
        "port" : onPort.bind(this),
        "launch" : onLaunch.bind(this)
    };
    
    this.leavePort = leavePort.bind(this);
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
                var player = this.client.player;
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
                        "player" : player.buildForClient(this.client)
                    });
                    
                    // Check player inventory, buy things first before trying to
                    // sell to them.  If nothing to buy or sell, take off.
                    /*
                    if( port.isBuyingFuelOre() && player.ship.getFuelOre()>0 ) {
                        console.log(port);
                        this.client.setState(GameState.SELLING_COMMODITY, {
                            port : port.getFuelOre(),
                            player : player.ship.getFuelOre(),
                            commodity : "FuelOre"
                        });
                    } else {
                        // Take off
                        this.leavePort();
                        
                        this.client.socket.emit("command_success", {
                            id : data.id
                        });
                    }
                    */
                    
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

function leavePort() {
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