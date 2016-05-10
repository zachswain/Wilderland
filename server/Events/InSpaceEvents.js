var Type = require("../Type.js");
var GameState = require("../GameState");

var InSpaceEvents = function(client) {
    this.client = client;
    
    this.handlers = {
        "move" : onMove.bind(this),
        "scan" : onScan.bind(this)
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

function onScan(data, fn) {
    if( this.client.state!=GameState.IN_SPACE ) {
        this.client.socket.emit("command_fail", {
            id : data.id,
            message : "You can't do that right now."
        });
    } else {
        console.log("scanning");
        console.log(data);
        var currentSector = this.client.universe.getSector(this.client.player.location.id);
        
        if( fn ) {
            fn(currentSector);
        }
        
        this.client.socket.emit("command_success", {
            id : data.id
        });
    }
}


module.exports = InSpaceEvents;