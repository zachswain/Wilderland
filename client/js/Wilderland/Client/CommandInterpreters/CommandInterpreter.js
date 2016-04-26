/* global jQuery, Wilderland */
(function($) {
    $.extend(true, window, {
       "Wilderland" : {
           "Client" : {
               "CommandInterpreter" : {
                   parse : function(input) {
                       var inputs = input.split(";");
                       
                       if( inputs.length==1 ) {
                           return [ this.process(input) ];
                       } else {
                            var commands = [];
                           
                            $.each(inputs, function(index, input) {
                                commands.push(Wilderland.Client.CommandInterpreter.parse(input));
                            });
                           
                            return commands;
                       }
                   },
                   
                   process : function(input) {
                        input = input.trim().toLowerCase();
                        
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
                            (tokens[0]=="move" || tokens[0]=="m") && 
                            parseInt(tokens[1])==tokens[1]
                        ) {
                            return {
                                error : false,
                                message : null,
                            }    
                        }
                   }
               }
           }
       } 
    });
})(jQuery);