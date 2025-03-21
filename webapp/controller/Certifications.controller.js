sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
], function(Controller, UIComponent) {
    "use strict";

    return Controller.extend("noman.resume.controller.Certifications", {
        onInit: function() {
            this.getRouter().getRoute("certifications").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function(oEvent) {
            // Handle route matching if needed
        },
        
        getRouter: function() {
            return UIComponent.getRouterFor(this);
        },

        onCertificatePress: function (oEvent) {
            // Get the link from the custom data
            var sLink = oEvent.getSource().data("link");
            
            // Open link in a new tab
            if (sLink) {
                sap.m.URLHelper.redirect(sLink, true);
            }
        }
    });
});