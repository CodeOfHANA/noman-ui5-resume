sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
], function(Controller, UIComponent) {
    "use strict";

    return Controller.extend("noman.resume.controller.Skills", {
        onInit: function() {
            this.getRouter().getRoute("skills").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function(oEvent) {
            // Handle route matching if needed
        },
        
        getRouter: function() {
            return UIComponent.getRouterFor(this);
        }
    });
});