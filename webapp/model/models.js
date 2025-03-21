sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], function(JSONModel, Device) {
    "use strict";

    return {
        createDeviceModel: function() {
            var oModel = new JSONModel(Device);
            oModel.setDefaultBindingMode("OneWay");
            return oModel;
        },

        createResumeModel: function() {
            var oResumeModel = new JSONModel();
            
            // Load the resume data from the JSON file
            oResumeModel.loadData("model/mockdata/resume.json");
            
            // Add post-processing for language-specific texts after the model loads
            oResumeModel.attachRequestCompleted(function() {
                this._processResumeData(oResumeModel);
            }.bind(this));
            
            // Error handling - optional but recommended
            oResumeModel.attachRequestFailed(function() {
                console.error("Could not load resume data from models/mockdata/resume.json");
            });
            
            return oResumeModel;
        },
        
        /**
         * Process resume data to handle language-specific texts
         * @private
         * @param {sap.ui.model.json.JSONModel} oModel - The resume model to process
         */
        _processResumeData: function(oModel) {
            var oData = oModel.getData();
            if (!oData) return;
            
            // Get current language
            var sCurrentLanguage = sap.ui.getCore().getConfiguration().getLanguage().substring(0, 2);
            
            // Set fallback
            if (["en", "de"].indexOf(sCurrentLanguage) === -1) {
                sCurrentLanguage = "en";
            }
            
            // Process the data to set appropriate language values
            this._processLanguageTexts(oData, sCurrentLanguage);
            
            // Update the model
            oModel.setData(oData);
        },
        
        /**
         * Recursively process all language-specific texts in the resume data
         * @private
         * @param {object} oData - The data object to process
         * @param {string} sLanguage - The current language (en or de)
         */
        _processLanguageTexts: function(oData, sLanguage) {
            if (!oData || typeof oData !== 'object') return;
            
            // Process arrays
            if (Array.isArray(oData)) {
                oData.forEach(function(item) {
                    this._processLanguageTexts(item, sLanguage);
                }.bind(this));
                return;
            }
            
            // Process object properties
            Object.keys(oData).forEach(function(sKey) {
                var vValue = oData[sKey];
                
                if (vValue && typeof vValue === 'object') {
                    // If it's a language object with en/de keys
                    if (vValue.en !== undefined && vValue.de !== undefined) {
                        // Replace with the appropriate language value
                        oData[sKey] = vValue[sLanguage] || vValue.en;
                    } else {
                        // Recursively process nested objects
                        this._processLanguageTexts(vValue, sLanguage);
                    }
                }
            }.bind(this));
        }
    };
});