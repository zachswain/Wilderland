(function($) {
    $.extend(true, window, {
        "Wilderland" : {
            "Client" : {
                "Entities" : {
                    "Port" : function(params) {
                        this.id = null;
                        this.location = null;
                        this.name = null;
                        this.class = null;
                        this.inventory = {
                            FuelOre : {
                                current : 0,
                                max : 0
                            },
                            Organics : {
                                current : 0,
                                max : 0
                            },
                            Equipment : {
                                current : 0,
                                max : 0
                            }
                        };
    
                        $.extend(true, this, params);
                        
                        this.getId = function() {
                            return this.id;
                        }
                        
                        this.getLocation = function() {
                            return this.location;
                        }
                        
                        this.isBuyingFuelOre = function() {
                            return (this.class & (1<<0)) > 0;
                        }
                        
                        this.isBuyingOrganics = function() {
                            return (this.class & (1<<1)) > 0;
                        }
                        
                        this.isBuyingEquipment = function() {
                            return (this.class & (1<<2)) > 0;
                        }
                        
                        this.getFuelOre = function() {
                            return this.inventory.FuelOre;
                        }
                        
                        this.getOrganics = function() {
                            return this.inventory.Organics;
                        }
                        
                        this.getEquipment = function() {
                            return this.inventory.Equipment;
                        }
                    }
                }
            }
        }
    })
})(jQuery);