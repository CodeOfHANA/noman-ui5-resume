sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/theming/Parameters",
    "sap/m/MessageToast",
    "sap/ui/Device"
], function(Controller, UIComponent, JSONModel, Parameters, MessageToast, Device) {
    "use strict";

    return Controller.extend("noman.resume.controller.App", {
        onInit: function() {
            // Apply content density mode based on device
            this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
            
            // Create and set app view model for sidebar navigation
            var oViewModel = new JSONModel({
                selectedKey: "summary",
                currentTheme: sap.ui.getCore().getConfiguration().getTheme(),
                showIconsOnly: Device.system.phone // Set to true on mobile, false on desktop
            });
            this.getView().setModel(oViewModel, "appView");
            
            // Initialize the side navigation
            this._setToggleButtonTooltip();
            
            // Handle mobile/responsive behavior
            this._handleResponsiveLayout();
            
            // Add resize handler for responsive behavior
            Device.resize.attachHandler(this._handleResponsiveLayout, this);
        },
        
        /**
         * Handle responsive layout adjustments
         * @private
         */
        _handleResponsiveLayout: function() {
            var oToolPage = this.byId("toolPage");
            var oAppViewModel = this.getView().getModel("appView");
            
            // On phones, collapse the side navigation by default
            if (Device.system.phone) {
                oToolPage.setSideExpanded(false);
                // Set to show only icons on mobile
                oAppViewModel.setProperty("/showIconsOnly", true);
                
                // Make the side navigation narrower on mobile
                this._applySideNavMobileStyles(true);
            } else {
                // Show text with icons on desktop
                oAppViewModel.setProperty("/showIconsOnly", false);
                
                // Reset side navigation width for desktop
                this._applySideNavMobileStyles(false);
            }
        },
        
        /**
         * Apply or remove mobile-specific styles to the side navigation
         * @param {boolean} isMobile - Whether to apply mobile styles or remove them
         * @private
         */
        _applySideNavMobileStyles: function(isMobile) {
            var oSideNavigation = this.byId("sideNavigation");
            
            if (isMobile) {
                // Make the side navigation narrower in mobile mode
                if (!oSideNavigation.hasStyleClass("mobileNav")) {
                    oSideNavigation.addStyleClass("mobileNav");
                }
            } else {
                // Reset to default styles in desktop mode
                if (oSideNavigation.hasStyleClass("mobileNav")) {
                    oSideNavigation.removeStyleClass("mobileNav");
                }
            }
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
            
            // On mobile, collapse the side navigation after selection
            if (Device.system.phone) {
                this.byId("toolPage").setSideExpanded(false);
            }
        },
        
        onMenuButtonPressed: function() {
            var oToolPage = this.byId("toolPage");
            
            // Simply toggle the side expanded state
            oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
            
            // No need to change the showIconsOnly property - keep it always true on mobile
        },
        
        // Rest of your controller code remains the same
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
        
        _handleContact: function() {
            // Open contact dialog or navigate to contact page
            var sEmailSubject = this.getView().getModel("i18n").getResourceBundle().getText("contactMessage");
            
            sap.m.URLHelper.triggerEmail(
                this.getView().getModel("resume").getProperty("/personalInfo/email"),
                sEmailSubject
            );
        },
        
        _handleDownload: function() {
            // Check if we're on a mobile device
            var isMobile = Device.system.phone;
            var sResumeUrl = "docs/noman_resume.docx";
            
            if (isMobile) {
                // On mobile, we can't trigger download so easily, so open in new tab
                sap.m.URLHelper.redirect(sResumeUrl, true);
            } else {
                // On desktop, use the download attribute
                var link = document.createElement('a');
                link.href = sResumeUrl;
                link.download = "Noman_Hanif_Resume.docx"; 
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            
            // Show a success message
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