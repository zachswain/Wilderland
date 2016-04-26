/* global Backbone */
(function($) {
    $.extend(true, window, {
       "Wilderland" : {
           "Client" : {
                "Router" : Backbone.Router.extend({
                   "routes" : {
                       "*path" : "defaultRoute",
                   },
                   
                   initialize : function() {
                       console.log("Wilderland.Client.Router: initialized");
                   },
                   
                   start : function() {
                       Backbone.history.start({
                           pushState : true,
                           root : "/"
                       });
                       
                       console.log("Wilderland.Client.Router: started");
                   },
                   
                   defaultRoute : function() {
                       console.log("Wilderland.Client.Router: default route");
                       this.currentView = new Wilderland.Client.Views.MainView();
                       $("body").append(this.currentView.$el);
                       this.currentView.render();
                   }
               })
           }
       } 
    });
})(jQuery);