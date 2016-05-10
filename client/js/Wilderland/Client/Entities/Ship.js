(function($) {
    $.extend(true, window, {
        "Wilderland" : {
            "Client" : {
                "Entities" : {
                    "Ship" : function(params) {
                        var defaults = {
                            holds : 0,
                            cargo : {
                                FuelOre : 0,
                                Organics : 0,
                                Equipment : 0
                            }
                        };
                        
                        $.extend(true, this, params);
                        
                        this.getEmptyCargoHolds = function() {
                            var cargo = 0;
                            for( var type in this.cargo ) {
                                cargo += this.cargo[type];
                            }
                            return this.holds - cargo;
                        }
                        
                        this.getFuelOre = function() {
                            return this.cargo.FuelOre;
                        };
                        
                        this.getOrganics = function() {
                            return this.cargo.Organics;
                        };
                        
                        this.getEquipment = function() {
                            return this.cargo.Equipment;
                        }
                    }
                }
            }
        }
    })
})(jQuery);