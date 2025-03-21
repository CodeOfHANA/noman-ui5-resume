sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/theming/Parameters",
    "sap/m/MessageToast"
], function(Controller, UIComponent, JSONModel, Parameters, MessageToast) {
    "use strict";

    return Controller.extend("noman.resume.controller.App", {
        onInit: function() {
            // Apply content density mode based on device
            this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
            
            // Create and set app view model for sidebar navigation
            var oViewModel = new JSONModel({
                selectedKey: "summary",
                currentTheme: sap.ui.getCore().getConfiguration().getTheme()
            });
            this.getView().setModel(oViewModel, "appView");
            
            // Initialize the side navigation
            this._setToggleButtonTooltip();
        },
        
        _setToggleButtonTooltip: function() {
            var oSideNavigation = this.byId("sideNavigation");
            var bExpanded = oSideNavigation.getExpanded();
            
            oSideNavigation.setExpanded(bExpanded);
        },
        
        onItemSelect: function(oEvent) {
            var oItem = oEvent.getParameter("item");
            var sKey = oItem.getKey();
            
            // Update the selected key in the model
            this.getView().getModel("appView").setProperty("/selectedKey", sKey);
            
            // Special handling for contact and download
            if (sKey === "contact") {
                this._handleContact();
                return;
            } else if (sKey === "download") {
                this._handleDownload();
                return;
            } else if (sKey === "toggle") {
                this._toggleTheme();
                return;
            }
            
            // Navigate to the selected route
            this.getRouter().navTo(sKey);
        },
        
        onMenuItemSelected: function(oEvent) {
            var oItem = oEvent.getParameter("item");
            var sItemText = oItem.getText();
            
            switch(sItemText) {
                case "Download Resume":
                case "Lebenslauf herunterladen":
                    this._handleDownload();
                    break;
                case "Contact":
                case "Kontakt":
                    this._handleContact();
                    break;
                case "Toggle Theme":
                case "Design wechseln":
                    this._toggleTheme();
                    break;
                default:
                    // Do nothing
            }
        },
        
        _toggleTheme: function() {
            // Get current theme
            var sCurrentTheme = sap.ui.getCore().getConfiguration().getTheme();
            var sNewTheme;
            
            // Toggle between dark and light theme
            if (sCurrentTheme === "sap_belize_plus") {
                sNewTheme = "sap_fiori_3_dark";
                MessageToast.show("Switching to High Contrast White");
            } else {
                sNewTheme = "sap_belize_plus";
                MessageToast.show("Switching to Belize Deep");
            }
            
            // Apply new theme
            sap.ui.getCore().applyTheme(sNewTheme);
            
            // Update theme in model
            this.getView().getModel("appView").setProperty("/currentTheme", sNewTheme);
        },
        
        onMenuButtonPressed: function() {
            var oToolPage = this.byId("toolPage");
            oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
        },
        
        _handleContact: function() {
            // Open contact dialog or navigate to contact page
            var sEmailSubject = this.getView().getModel("i18n").getResourceBundle().getText("contactMessage");
            
            sap.m.URLHelper.triggerEmail(
                this.getView().getModel("resume").getProperty("/personalInfo/email"),
                sEmailSubject
            );
        },
        
        _handleDownload: function() {
            // Handle resume download
            var sMessage = this.getView().getModel("i18n").getResourceBundle().getText("downloadMessage");
            sap.m.MessageToast.show(sMessage);
        },
        
        onLanguageChange: function(oEvent) {
            var sLanguage = oEvent.getParameter("selectedItem").getKey();
            
            // Store the selected language in the browser's localStorage
            localStorage.setItem("ui5-resume-language", sLanguage);
            
            // Change the language and reload the application
            sap.ui.getCore().getConfiguration().setLanguage(sLanguage);
            
            // Reload to apply language changes
            window.location.reload();
        },
        
        getRouter: function() {
            return UIComponent.getRouterFor(this);
        }
    });
});