(function($) {
    $.extend(true, window, {
        "Wilderland" : {
            "Client" : {
                "GameState" : {
                    NO_STATE : null,
                    ENTERING_SECTOR : "entering_sector",
                    LEAVING_SECTOR : "leaving_sector",
                    IN_SPACE : "in_space",
                    MOVING : "moving",
                    
                    ENTERING_PORT : "entering_port",
                    IN_PORT : "in_port",
                    BUYING_COMMODITY : "buying_commodity",
                    SELLING_COMMODITY : "selling_commodity",
                    LEAVING_PORT : "leaving_port",
                }
            }
        }
    });
})(jQuery);