/* global Backbone, _, jQuery, io, Wilderland */
(function($) {
    $.extend(true, window, {
       "Wilderland" : {
           "Client" : $.extend(true, Backbone.Events, {
                start : function() {
                    this.router = new Wilderland.Client.Router();
                    this.router.start();
                    
                    this.player = null;
                    this.currentLocation = null;
                    
                    this.currentState = Wilderland.Client.GameState.NO_STATE;
                    
                    this.currentCommand = null;
                    this.commandQueue = new Backbone.Model({
                        counter : 0,
                        commands : []    
                    });
                    this.listenTo(this.commandQueue, "enqueue", this.onCommandQueued, this);
                    
                    this.defaultInput = null;
                    this.inputQueue = new Backbone.Model({
                        inputs : []
                    });
                    this.listenTo(this.inputQueue, "enqueue", this.onInputQueued, this);
                    
                    this.listenTo(this, "event_state_change", this.onStateChange, this);
                    this.listenTo(this, "user_input_received", this.onUserInputReceived, this);
                    this.listenTo(this, "event_command_success", this.onCommandSuccess, this);
                    this.listenTo(this, "event_command_fail", this.onCommandFail, this);
                    this.connect();
                },
                
                connect : function() {
                    var self=this;
                    
                    if( this.isConnected() ) {
                        this.disconnect();
                    }
                    
                    this.socket = io.connect(window.location.protocol + "//" + window.location.hostname + ":8080", { "force new connection" : true });
                    
                    this.socket.on("disconnect", function() {
                        self.trigger("event_disconnect");
                    });
                    
                    this.socket.on("connect", function() {
                        self.trigger("event_connect");
                    });
                    
                    this.socket.on("player", function(data) {
                        self.player = new Wilderland.Client.Entities.Player(data);
                        console.log(data);
                        self.trigger("event_player", data);
                    });
                    
                    this.socket.on("message", function(data) {
                        self.trigger("event_message", data);
                    });
                    
                    this.socket.on("state_change", function(data) {
                        self.trigger("event_state_change", data);
                    });
                    
                    this.socket.on("command_success", function(data) {
                        self.trigger("event_command_success", data);
                    });
                    
                    this.socket.on("command_fail", function(data) {
                        self.trigger("event_command_fail", data);
                    });
                },
                
                disconnect : function() {
                    this.socket.disconnect();  
                },
                
                isConnected : function() {
                    if( !this.socket || !this.socket.socket ) return false;
                    return this.socket.socket.connected;
                },
                
                onStateChange : function(data) {
                    this.currentState = data.newState;
                    
                    if( data.newState == "entering_sector" ) {
                        this.sector = data.sector;
                    }
                    
                    if( data.newState == "moving" ) {
                        this.trigger("event_message", "You fire up your engines and head for the warp lane.");
                    }
                    
                    if( data.newState == "entering_sector" ) {
                        this.sector = new Wilderland.Client.Entities.Sector(data.sector);
                        this.displaySector(this.sector);
                        this.processNextCommand();
                    }
                    
                    if( data.newState == "entering_port" ) {
                        this.currentLocation = new Wilderland.Client.Entities.Port(data.port);
                        this.displayPort(this.currentLocation);
                    }
                    
                    if( data.newState == Wilderland.Client.GameState.IN_PORT ) {
                        this.inPort(data);
                    }
                },
                
                inPort : function(data) {
                    console.log("processing in port");
                  
                    this.sellingOre(data);  
                },
                
                sellingOre : function(data) {
                    var port = new Wilderland.Client.Entities.Port(data.port);
                    if( port.isBuyingFuelOre() ) {
                        var self = this;
                        console.log("selling ore");
                        console.log(data);
                        var defaultAmount = (data.player.ship.cargo.FuelOre < data.port.inventory.FuelOre.current) ? data.player.ship.cargo.FuelOre : data.port.inventory.FuelOre.current;
                        
                        this.displayMessage("How much Fuel Ore do you want to sell? [" + defaultAmount + "]");
                        
                        this.onInput(function(input) {
                            var amount;
                            if( input=="" ) {
                                amount = defaultAmount;
                            } else {
                                amount = parseInt(input);
                            }
                            
                            if( amount==0 ) {
                                setTimeout(function() {
                                    self.sellingOrganics(data);
                                }, 0);
                            } else if( amount<=defaultAmount && amount>0 ) {
                                self.displayMessage("Great, " + amount + " ore it is.");
                                self.haggleWithPlayerSelling({
                                    offer : amount * 2,
                                    ideal : amount * 2.2,
                                    isSelling : false,
                                    success : function(result) {
                                        self.displayMessage("Thanks!");
                                        setTimeout(function() {
                                            self.sellingOrganics(data);
                                        },0);
                                    },
                                    failure : function() {
                                        
                                    }
                                });
                            } else {
                                self.displayMessage("Didn't quite catch that.");
                                setTimeout(function() {
                                    self.sellingOre(data);    
                                }, 0);
                            }
                        });
                    } else {
                        setTimeout(function() {
                            self.sellingOrganics(data);
                        }, 0);
                    }
                },
                
                sellingOrganics : function(data) {
                    var self = this;
                    var port = new Wilderland.Client.Entities.Port(data.port);
                    if( port.isBuyingOrganics() ) {
                        console.log("selling organics");
                        console.log(data);
                        var defaultAmount = (data.player.ship.cargo.Organics < data.port.inventory.Organics.current) ? data.player.ship.cargo.Organics : data.port.inventory.Organics.current;
                        
                        this.displayMessage("How many Organics do you want to sell? [" + defaultAmount + "]");
                        
                        this.onInput(function(input) {
                            var amount;
                            if( input=="" ) {
                                amount = defaultAmount;
                            } else {
                                amount = parseInt(input);
                            }
                            
                            if( amount==0 ) {
                                setTimeout(function() {
                                    self.sellingEquipment();    
                                }, 0);
                            } else if( amount<=defaultAmount && amount>0 ) {
                                self.displayMessage("Great, " + amount + " ore it is.");
                                self.haggleWithPlayerSelling({
                                    playerIsSelling : true,
                                    success : function(result) {
                                        console.log("Selling " + amount + " ore for " + result.price + " credits");
                                        self.displayMessage("Thanks!");
                                        setTimeout(function() {
                                            self.sellingEquipment(data);
                                        },0);
                                    },
                                    failure : function() {
                                        
                                    }
                                });
                            } else {
                                self.displayMessage("Didn't quite catch that.");
                                setTimeout(function() {
                                    self.sellingEquipment(data);
                                }, 0);
                            }
                        });
                    } else {
                        console.log("not selling organics");
                        setTimeout(function() {
                            self.sellingEquipment(data);
                        }, 0);
                    }
                },
                
                /* Port wants to buy low */
                haggleWithPlayerSelling : function(parameters) {
                    console.log("haggling");
                    var self=this;
                    self.displayMessage("How about " + parameters.offer + "?");
                    self.onInput(function(input) {
                        if( input=="" ) {
                            self.queueCommand({
                                command : "sellCommodity",
                                args : {
                                },
                                callback : function(result) {
                                    console.log("haggling callback");
                                    parameters.success({});
                                }
                            });
                        } else {
                            var amount = parseInt(input);
                        }
                    });
                },
                
                sellingEquipment : function(data) {
                    console.log("selling equipment");
                },
                
                onInput : function(fn) {
                    if( this.inputQueue.get("inputs").length>0 ) {
                        var input = this.inputQueue.get("inputs").splice(0,1)[0].trim();
                        fn(input);
                    } else {
                        this.listenToOnce(this.inputQueue, "enqueue", function() {
                            var input = this.inputQueue.get("inputs").splice(0,1)[0].trim();
                            fn(input);
                        }, this);
                    }
                },
                
                displaySector : function(sector) {
                    var template = _.template( $("#Wilderland-Sector-template").html() );
                    var msg = template({ player : this.player, sector : sector });
                    this.trigger("event_message", msg);
                },
                
                displayPort : function(port) {
                    console.log(port);
                    var template = _.template( $("#Wilderland-Port-template").html() );
                    console.log(this.player);
                    var msg = template({ player : this.player, port : port });
                    this.trigger("event_message", msg);
                },
                
                onUserInputReceived : function(event) {
                    console.log("Wilderland.Client: " + event.input);
                    
                    this.inputQueue.get("inputs").push(event.input);
                    console.log("Wilderland.Client: input queued");
                    this.inputQueue.trigger("enqueue");
                },
                
                processNextInput : function() {
                    console.log("processing next input");
                    if( this.currentCommand==null && this.inputQueue.get("inputs").length>0 ) {
                        var input = this.inputQueue.get("inputs").splice(0,1)[0].trim();
                        var tokens = this.tokenize(input);
                        
                        if( this.currentState == Wilderland.Client.GameState.IN_SPACE ) {
                            this.processInSpaceCommands(input, tokens);
                        }
                    }
                },
                
                tokenize : function(input) {
                    return input.split(/[ ,]+/).filter(Boolean);
                },
                
                displayMessage : function(message) {
                   this.trigger("event_message", message);
                },
                
                processInSpaceCommands : function(input, tokens) {
                    var self=this;
                    
                    // Input: <int>
                    // Move
                    if( tokens.length==1 && parseInt(tokens[0])==tokens[0] ) {
                        this.queueCommand({
                            command : "move",
                            args : {
                                "destination" : tokens[0]
                            }
                        });
                        return;
                    }
                    
                    // Input: (move|m) <int>
                    // Move
                    if( tokens.length==2 && 
                        (tokens[0].toLowerCase()=="m" || tokens[0].toLowerCase()=="move") &&
                        parseInt(tokens[1])==tokens[1]
                    ) {
                        this.queueCommand({
                            command : "move",
                            args : {
                                "destination" : tokens[1]
                            }
                        });
                        return;
                    }
                    
                    // Input: (p|port);
                    // Dock at a port
                    if( tokens.length==1 &&
                        (tokens[0].toLowerCase()=="p" || tokens[0].toLowerCase()=="port")
                    ) {
                        this.queueCommand({
                            command : "port"
                        });
                        return;
                    }
                    
                    // Input: (s|scan)
                    // Scan the sector
                    if( tokens.length==1 &&
                        (tokens[0].toLowerCase()=="s" || tokens[0].toLowerCase()=="scan")
                    ) {
                        this.displayMessage("Scanning...");
                        this.queueCommand({
                            command : "scan",
                            args : {},
                            callback : function(sector) {
                                self.displaySector(sector);
                            }
                        });
                        return;
                    }
                    
                    this.displayMessage("Unknown command");
                    this.processNextCommand();
                },
                
                queueCommand : function(command) {
                    var counter = this.commandQueue.get("counter");
                    var commands = _.clone(this.commandQueue.get("commands"));
                    
                    command.id = counter++;
                    commands.push(command);
                    
                    this.commandQueue.set({
                        counter : counter,
                        commands : commands
                    });
                    
                    //console.log("Wilderland.Client: Command " + command.id + " queued");
                    
                    //this.commandQueue.trigger("enqueue");
                    
                    this.processNextCommand();
                },
                
                onCommandQueued : function() {
                    //this.processNextCommand();
                },
                
                onInputQueued : function() {
                    //this.processNextInput();
                },
                
                processNextCommand : function() {
                    if( this.currentCommand!=null ) return;
                    
                    if( this.commandQueue.get("commands").length>0 ) {
                        var commands = this.commandQueue.get("commands");
                        var command = commands.splice(0,1)[0];
                        this.sendCommand(command);
                    } else if( this.inputQueue.get("inputs").length>0 ) {
                        this.processNextInput();
                    } else {
                        console.log("Wilderland.Client: No more inputs, waiting");
                        this.listenToOnce(this.inputQueue, "enqueue", this.processNextInput, this);
                    }
                },
                
                onCommandSuccess : function(data) {
                    //console.log(data);
                    //console.log(this.currentCommand);
                    if( data.id==this.currentCommand.id ) {
                        console.log("Wilderland.Client: Command " + this.currentCommand.id + " success");
                        this.currentCommand = null;
                        this.processNextCommand();
                    }  
                },
                
                onCommandFail : function(data) {
                    if( data.id==this.currentCommand.id ) {
                        console.log("Wilderland.Client: Command " + this.currentCommand.id + " fail");
                        if( data.message ) {
                            this.displayMessage(data.message);
                        }
                        this.currentCommand = null;
                        this.processNextCommand();
                    }  
                },
                
                sendCommand : function(command) {
                    console.log("Wilderland.Client: Sending command '" + command.command +"'");
                    this.currentCommand = command;
                    if( command.callback ) {
                        this.socket.emit(command.command, command, command.callback);
                    } else {
                        this.socket.emit(command.command, command);
                    }
                }
           })
       } 
    });
})(jQuery);