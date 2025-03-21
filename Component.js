sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "noman/resume/model/models",
    "sap/ui/model/json/JSONModel"
], function(UIComponent, Device, models, JSONModel) {
    "use strict";

    return UIComponent.extend("noman.resume.Component", {
        metadata: {
            manifest: "json"
        },

        /**
         * The component is initialized by UI5 automatically during the startup of the app
         * and calls the init method once.
         * @public
         * @override
         */
        init: function() {
            // Call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // Check if there's a stored language preference
            var sStoredLanguage = localStorage.getItem("ui5-resume-language");
            if (sStoredLanguage) {
                // Apply the stored language
                sap.ui.getCore().getConfiguration().setLanguage(sStoredLanguage);
            }

            // Set the device model
            this.setModel(models.createDeviceModel(), "device");

            // Create and set resume model
            this.setModel(models.createResumeModel(), "resume");
            
            // Set up language model
            var oLanguageModel = new JSONModel({
                current: sap.ui.getCore().getConfiguration().getLanguage().substring(0, 2) || "en",
                available: [
                    { key: "en", text: "English" },
                    { key: "de", text: "Deutsch" }
                ]
            });
            this.setModel(oLanguageModel, "language");
            
            // Process the about_me text in the resume model
            this._processAboutMeText();

            // Initialize the router
            this.getRouter().initialize();
        },
        
        /**
         * Process the about_me text to handle formatting
         * @private
         */
        _processAboutMeText: function() {
            var oModel = this.getModel("resume");
            var oData = oModel.getData();
            
            if (oData && oData.about_me) {
                // Process the text to convert literal newlines and markdown to HTML
                var processedText = oData.about_me
                    // First handle the literal newlines
                    .replace(/\\n\\n/g, "<br><br>")
                    .replace(/\\n/g, "<br>")
                    // Then handle bold markdown
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
                
                // Update the model data
                oData.about_me = processedText;
                oModel.setData(oData);
                console.log("Processed about_me text:", processedText);
            }
        },
        
        /**
         * This method can be used to determine whether to use cozy or compact mode
         * @public
         * @return {string} css class either "sapUiSizeCompact" or "sapUiSizeCozy"
         */
        getContentDensityClass: function() {
            if (this._sContentDensityClass === undefined) {
                // Check whether FLP has already set the content density class
                if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
                    this._sContentDensityClass = "";
                } else if (!Device.support.touch) {
                    // Apply compact mode if touch is not supported
                    this._sContentDensityClass = "sapUiSizeCompact";
                } else {
                    // Apply cozy mode in other cases
                    this._sContentDensityClass = "sapUiSizeCozy";
                }
            }
            return this._sContentDensityClass;
        }
    });
});