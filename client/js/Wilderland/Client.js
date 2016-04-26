/* global Backbone, _, jQuery, io, Wilderland */
(function($) {
    $.extend(true, window, {
       "Wilderland" : {
           "Client" : $.extend(true, Backbone.Events, {
                start : function() {
                    this.router = new Wilderland.Client.Router();
                    this.router.start();
                    
                    this.player = null;
                    this.sector = null;
                    
                    this.currentCommand = null;
                    this.commandQueue = new Backbone.Model({
                        counter : 0,
                        commands : []    
                    });
                    this.listenTo(this.commandQueue, "enqueue", this.onCommandQueued, this);
                    
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
                    console.log(data);
                    if( data.newState == "entering_sector" ) {
                        this.sector = data.sector;
                    }
                    
                    if( data.newState == "moving" ) {
                        
                    }
                    
                    if( data.oldState == "entering_sector" && data.newState == "in_space") {
                        this.displaySector();
                    }
                },
                
                displaySector : function() {
                    var template = _.template( $("#Wilderland-Sector-template").html() );
                    var msg = template({ sector : this.sector });
                    this.trigger("event_message", msg);
                },
                
                onUserInputReceived : function(event) {
                    console.log("Wilderland.Client: " + event.input);
                    
                    var input = event.input.trim();
                    var tokens = input.split(/[ ,]+/).filter(Boolean);
                    
                    if( tokens.length==0 ) {
                        return null;
                    }
                    
                    // Input: <int>
                    // Move
                    if( tokens.length==1 && parseInt(tokens[0])==tokens[0] ) {
                        this.queueCommand({
                            command : "move",
                            args : {
                                "destination" : tokens[0]
                            }
                        });
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
                    }
                    
                    // Input: (p|port);
                    // Dock at a port
                    if( tokens.length==1 &&
                        (tokens[0].toLowerCase()=="p" || tokens[0].toLowerCase()=="port")
                    ) {
                        this.queueCommand({
                            command : "port"
                        });
                    }
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
                    
                    console.log("Wilderland.Client: Command " + command.id + " queued");
                    
                    this.commandQueue.trigger("enqueue");
                },
                
                onCommandQueued : function() {
                    this.processNextCommand();
                },
                
                processNextCommand : function() {
                    if( this.currentCommand==null && this.commandQueue.get("commands").length>0 ) {
                        var commands = this.commandQueue.get("commands");
                        this.currentCommand = commands.splice(0,1)[0];
                        this.sendCommand(this.currentCommand);
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
                        //console.log(data);
                        this.currentCommand = null;
                        this.processNextCommand();
                    }  
                },
                
                sendCommand : function(command) {
                    console.log("Wilderland.Client: Sending command '" + command.command +"'");
                    //console.log(command);
                    this.currentCommand = command;
                    this.socket.emit(command.command, command);
                }
           })
       } 
    });
})(jQuery);