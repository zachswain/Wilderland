/* global jQuery, Wilderland */
(function($) {
    $.extend(true, window, {
       "Wilderland" : {
           "Client" : {
               "CommandInterpreters" : {
                   "InSpaceInterpreter" : $.extend(true, Wilderland.Client.CommandInterpreter, {
                       process : function(input) {
                            input = input.trim();
                            
                            var tokens = input.split(/[ ,]+/).filter(Boolean);
                            console.log(tokens);
                            
                            // If we have no tokenizable input, return
                            if( tokens.length==0 ) {
                                return {
                                    error : true,
                                    message : "No command",
                                    command : null
                                }
                            }
                            
                            // Input: <number>
                            // Move command
                            if( parseInt(tokens[0]) === input ) {
                                return {
                                    error : false,
                                    message : null,
                                    command : {
                                        action : "move",
                                        args : [ input ]
                                    }
                                };
                            }
                            
                            // Input: (move|m) <int>;
                            // Move command
                            if( tokens.length==2 &&
                                (tokens[0].toLowerCase()=="move" || tokens[0].toLowerCase()=="m") && 
                                parseInt(tokens[1])==tokens[1]
                            ) {
                                return {
                                    error : false,
                                    message : null,
                                    command : {
                                        action : "move",
                                        args : [ tokens[1] ]
                                    }
                                }    
                            }
                            
                            // Input: (p|port);
                            // Dock at a port
                            if( tokens.length==1 &&
                                (tokens[0].toLowerCase()=="p" || tokens[0].toLowerCase()=="port")
                            ) {
                                return {
                                    error : false,
                                    message : null,
                                    command : {
                                        action : "port"
                                    }
                                }
                            }
                       }
                   })
               }
           }
       } 
    });
})(jQuery);