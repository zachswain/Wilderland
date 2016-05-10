(function($) {
    $.extend(true, window, {
        "Wilderland" : {
            "Client" : {
                "Entities" : {
                    "Player" : function(params) {
                        this.credits = 0;
                        
                        $.extend(true, this, params);
                        
                        this.ship = new Wilderland.Client.Entities.Ship(params.ship);
                        
                        this.getCredits = function() {
                            return this.credits;
                        }
                        
                        this.setCredits = function(credits) {
                            this.credits = parseInt(credits);
                        }
                        
                        this.addCredits = function(credits) {
                            this.credits += parseInt(credits);
                        }
                    }
                }
            }
        }
    })
})(jQuery);