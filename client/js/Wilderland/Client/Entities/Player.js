(function($) {
    $.extend(true, window, {
        "Wilderland" : {
            "Client" : {
                "Entities" : {
                    "Player" : function(params) {
                        this.credits = 0;
                        this.ship = {
                                
                        };
                        
                        $.extend(true, this, params);
                        
                        this.getCredits = function() {
                            return this.credits;
                        }
                        
                        this.setCredits = function(credits) {
                            this.credits = parseInt(credits);
                        }
                        
                        this.addCredits = function(credits) {
                            this.credits += parseInt(credits);
                        }
                        
                        this.getEmptyCargoHolds = function() {
                            return 1;
                        }
                    }
                }
            }
        }
    })
})(jQuery);