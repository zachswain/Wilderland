/* global Backbone */
(function($) {
    $.extend(true, window, {
        "Wilderland" : {
            "Client" : {
                "Views" : {
                    "MainView" : Backbone.View.extend({
                        model : new Backbone.Model(),
                        
                        template : _.template( $("#Wilderland-MainView-template").html() ),
                        
                        initialize : function() {
                            var self=this;
                            this.model = new Backbone.Model({
                                "input" : ""
                            })
                            this.listenTo(Wilderland.Client, "event_connect", this.onConnectionStatusChanged, this);
                            this.listenTo(Wilderland.Client, "event_disconnect", this.onConnectionStatusChanged, this);
                            this.listenTo(Wilderland.Client, "event_message", this.onMessage, this);
                            
                            $(document).keydown(function(e) {
                                if( e.which == 8 ) {
                                    e.preventDefault();
                                    self.onBackspace(e);
                                } else if( e.which == 13 ) {
                                    e.preventDefault();
                                    self.onEnter(e);
                                }
                            });
                            
                            $(document).keypress(function(e) {
                                e.preventDefault();
                                self.onKeyPressed(e);
                            });
                            
                            this.model.on("change:input", this.onInputChanged, this);
                        },
                        
                        render : function() {
                            var self=this;
                            this.$el.html(this.template({ model : this.model.toJSON() }) );
                            setTimeout(function() {
                                console.log("Wilderland.Client.Views.MainView: rendered");
                            })
                        },
                        
                        onConnectionStatusChanged : function() {
                            this.updateConnectionStatus();
                        },
                        
                        updateConnectionStatus : function() {
                            if( Wilderland.Client.isConnected() ) {
                                this.$el.find("[data-role=connectionStatusSpan]").html("Connected");
                            } else {
                                this.$el.find("[data-role=connectionStatusSpan]").html("Disconnected");
                            }
                        },
                        
                        onMessage : function(data) {
                            var self=this;
                            var $el = this.$el.find("[data-role=messagesDiv]");
                            
                            $el.append(
                                $("<div class='message'></div>").html(data)
                            );
                            
                            $el[0].scrollTop = $el[0].scrollHeight;
                        },
                        
                        onKeyPressed : function(e) {
                            var char = String.fromCharCode(e.keyCode);
                            if( char=="" ) {
                            } else {
                                var input = this.model.get("input");
                                input += char;
                                this.model.set({
                                    input : input
                                });
                            }
                        },
                        
                        onBackspace : function(e) {
                          var input = this.model.get("input");
                          input = input.slice(0,-1);
                          this.model.set({
                              input : input
                          });
                        },
                        
                        onEnter : function(e) {
                            var input = this.model.get("input");
                            
                            Wilderland.Client.trigger("user_input_received", {
                                input : input
                            });
                            
                            this.model.set({
                                input : ""
                            });
                        },
                        
                        onInputChanged : function() {
                            var input = this.model.get("input");
                            this.$el.find("[data-role=input]").html(input);
                        }
                    })
                }
            }
        }
    })
})(jQuery);