sap.ui.define([
    'sap/ui/core/Fragment',
    "sap/ui/core/mvc/Controller"
], function (Fragment, Controller) {
    "use strict";
    return Controller.extend("de.cspilker.rlist.controller.Detail", {

        onInit: function () {
            console.log("bre init");
            var oOwnerComponent = this.getOwnerComponent();
            this.oRouter = oOwnerComponent.getRouter();
            this.oModel = oOwnerComponent.getModel();
            this.oRouter.getRoute("master").attachPatternMatched(this._onEntryMatched, this);
            this.oRouter.getRoute("detail").attachPatternMatched(this._onEntryMatched, this);
            this._showFormFragment("Display");
        },


        _onEntryMatched: function (oEvent) {
            console.log("selected");
            this._entry = oEvent.getParameter("arguments").entry || this._entry || "0";
            this.getView().bindElement({
                path: "/" + this._entry,
                model: "restaurant"});
        },


        onEditToggleButtonPress: function () {
            var oObjectPage = this.getView().byId("ObjectPageLayout");
            //  bCurrentShowFooterState = oObjectPage.getShowFooter();
            //oObjectPage.setShowFooter(!bCurrentShowFooterState);
        },


        onExit: function () {
            this.oRouter.getRoute("master").detachPatternMatched(this._onEntryMatched, this);
            this.oRouter.getRoute("detail").detachPatternMatched(this._onEntryMatched, this);
        },

        _formFragments: {},

        onPressEdit: function () {
            console.log("srer");
            this._showFormFragment("Edit");

        },

        onPressCancel: function() {
            this._showFormFragment("Display");
        },

        _getFormFragment: function (sFragmentName) {
            var oFormFragment = this._formFragments[sFragmentName];

            if (oFormFragment) {
                return oFormFragment;
            }

            oFormFragment = sap.ui.xmlfragment(this.getView().getId(), "de.cspilker.rlist.view." + sFragmentName, this);

            this._formFragments[sFragmentName] = oFormFragment;
            return this._formFragments[sFragmentName];
        },

        _showFormFragment : function (sFragmentName) {
            var oPage = this.byId("emptyPage");
            oPage.removeAllContent();
            oPage.insertContent(this._getFormFragment(sFragmentName));
            console.log("loaded fragment");
        }

    });
});
