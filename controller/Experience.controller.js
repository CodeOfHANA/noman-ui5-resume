sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
], function(Controller, UIComponent) {
    "use strict";

    return Controller.extend("noman.resume.controller.Experience", {
        onInit: function() {
            this.getRouter().getRoute("experience").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function(oEvent) {
            // Handle route matching if needed
        },
        
        getRouter: function() {
            return UIComponent.getRouterFor(this);
        },
        
        /**
         * Handle expanding/collapsing the projects section
         * @param {sap.ui.base.Event} oEvent The event object
         */
        onExpandExperience: function(oEvent) {
            // Get the button that was clicked
            var oButton = oEvent.getSource();
            
            // Get the parent FlexBox for this experience item
            var oParentFlexBox = oButton.getParent();
            
            // Find the projects container - it should be the next element after the button
            var aItems = oParentFlexBox.getItems();
            var iButtonIndex = aItems.indexOf(oButton);
            
            if (iButtonIndex !== -1 && iButtonIndex < aItems.length - 1) {
                // Get the next item after the button (which should be our projects container)
                var oProjectsContainer = aItems[iButtonIndex + 1];
                
                // If it's a VBox with the right class, toggle its visibility
                if (oProjectsContainer instanceof sap.m.VBox && 
                    oProjectsContainer.hasStyleClass("projectsContainer")) {
                    
                    // Toggle visibility
                    var bVisible = oProjectsContainer.getVisible();
                    oProjectsContainer.setVisible(!bVisible);
                    
                    // Update button text and icon
                    if (bVisible) {
                        oButton.setText("Show Projects");
                        oButton.setIcon("sap-icon://slim-arrow-down");
                    } else {
                        oButton.setText("Hide Projects");
                        oButton.setIcon("sap-icon://slim-arrow-up");
                    }
                }
            }
        }
    });
});