sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/Device"
], function(Controller, UIComponent, Device) {
    "use strict";

    return Controller.extend("noman.resume.controller.Certifications", {
        onInit: function() {
            this.getRouter().getRoute("certifications").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function(oEvent) {
            // Apply responsive layout adjustments
            this._adjustLayoutForMobile();
            
            // Add resize handler to adjust layout on screen size changes
            Device.resize.attachHandler(this._adjustLayoutForMobile, this);
        },
        
        /**
         * Adjust layout based on device
         * @private
         */
        _adjustLayoutForMobile: function() {
            var bIsMobile = Device.system.phone;
            
            // Get elements from the view
            var oList = this.getView().byId("certificationsPage").getContent()[0].getItems()[2];
            
            if (oList && oList instanceof sap.m.List) {
                // Apply mobile-specific styling to list items if needed
                if (bIsMobile) {
                    if (!oList.hasStyleClass("certificationsMobileList")) {
                        oList.addStyleClass("certificationsMobileList");
                    }
                } else {
                    if (oList.hasStyleClass("certificationsMobileList")) {
                        oList.removeStyleClass("certificationsMobileList");
                    }
                }
            }
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
        },
        
        onExit: function () {
            // Clean up the resize handler when this controller is destroyed
            Device.resize.detachHandler(this._adjustLayoutForMobile, this);
        }
    });
});