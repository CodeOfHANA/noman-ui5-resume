sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
], function(Controller, UIComponent) {
    "use strict";

    return Controller.extend("noman.resume.controller.Summary", {
        onInit: function() {
            this.getRouter().getRoute("summary").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function(oEvent) {
            // Handle route matching if needed
        },
        
        getRouter: function() {
            return UIComponent.getRouterFor(this);
        },
        
        navToExperience: function() {
            this.getRouter().navTo("experience");
        },

        /**
         * Get the appropriate text for the current language
         * @param {object} oTextObj - Object with language keys (e.g. {en: "Text", de: "Text"})
         * @return {string} Text for current language or fallback to English
         */
        getLanguageText: function(oTextObj) {
            if (!oTextObj) return "";
            
            // If it's already a string, just return it (for backward compatibility)
            if (typeof oTextObj === "string") return oTextObj;
            
            var sCurrentLanguage = sap.ui.getCore().getConfiguration().getLanguage().substring(0, 2);
            
            // Return text for current language or fall back to English
            return oTextObj[sCurrentLanguage] || oTextObj["en"] || "";
        },

        /**
         * Format text to convert markdown-style bold indicators to HTML and handle newlines
         * @param {string|object} text - Text with ** markdown for bold and literal \n\n for newlines,
         *                              or object with language keys
         * @return {string} HTML formatted text with <strong> tags and <br> for newlines
         */
        formatBoldText: function(text) {
            if (!text) return "";
            
            // First get the right language text if it's an object
            var formattedText = typeof text === "object" ? this.getLanguageText(text) : text;
            
            // Step 1: Handle literal backslash + n sequences
            // Replace literal "\n\n" with paragraph breaks
            formattedText = formattedText.replace(/\\n\\n/g, "<br><br>");
            
            // Also handle single literal "\n" cases
            formattedText = formattedText.replace(/\\n/g, "<br>");
            
            // Step 2: Handle actual newline characters (just in case)
            formattedText = formattedText.replace(/\n\n/g, "<br><br>");
            formattedText = formattedText.replace(/\n/g, "<br>");
            
            // Step 3: Convert bold markdown to HTML
            formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
            
            return formattedText;
        }
    });
});