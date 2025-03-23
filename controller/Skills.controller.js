sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "sap/m/MessageToast"
], function(Controller, UIComponent, Device, MessageToast) {
    "use strict";

    return Controller.extend("noman.resume.controller.Skills", {
        onInit: function() {
            this.getRouter().getRoute("skills").attachPatternMatched(this._onRouteMatched, this);
            
            // Initialize tech icon tooltips
            this._initTechIcons();
        },

        _onRouteMatched: function(oEvent) {
            // Handle responsive adjustments if needed
            this._adjustLayoutForDevice();
            
            // Add resize handler
            if (!this._bResizeAttached) {
                Device.resize.attachHandler(this._adjustLayoutForDevice, this);
                this._bResizeAttached = true;
            }
        },
        
        /**
         * Initialize technology icons with enhanced tooltips and click handlers
         * @private
         */
        _initTechIcons: function() {
            var aIcons = this.getView().getDomRef() ? 
                this.getView().$().find(".techIcon") : 
                null;
                
            if (!aIcons) {
                // If DOM is not ready, try again later
                jQuery.sap.delayedCall(500, this, this._initTechIcons);
                return;
            }
            
            // Add click handlers to the tech icons once DOM is ready
            this.getView().$().find(".techIcon").on("click", function(oEvent) {
                var sTooltip = jQuery(oEvent.currentTarget).attr("title") || 
                              jQuery(oEvent.currentTarget).attr("alt") || 
                              "Technology";
                              
                MessageToast.show(sTooltip + " is one of my key skills");
            });
        },
        
        /**
         * Adjust layout based on device type
         * @private
         */
        _adjustLayoutForDevice: function() {
            // Any specific adjustments for different device types can be added here
            if (Device.system.phone) {
                // Mobile specific adjustments
            } else if (Device.system.tablet) {
                // Tablet specific adjustments
            } else {
                // Desktop specific adjustments
            }
        },
        
        /**
         * Clean up when controller is destroyed
         * @public
         */
        onExit: function() {
            // Detach the resize handler to prevent memory leaks
            if (this._bResizeAttached) {
                Device.resize.detachHandler(this._adjustLayoutForDevice, this);
                this._bResizeAttached = false;
            }
            
            // Remove any event handlers
            var aIcons = this.getView().getDomRef() ? 
                this.getView().$().find(".techIcon") : 
                null;
                
            if (aIcons) {
                aIcons.off("click");
            }
        },
        
        getRouter: function() {
            return UIComponent.getRouterFor(this);
        }
    });
});