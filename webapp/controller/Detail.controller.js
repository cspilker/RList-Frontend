sap.ui.define([
    'sap/ui/core/Fragment',
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/SimpleType",
    'sap/f/library'
], function (Fragment, Controller, JSONModel, MessageBox, MessageToast, SimpleType, fioriLibrary) {
    "use strict";
    return Controller.extend("de.cspilker.rlist.controller.Detail", {

        onInit: function () {
            var oOwnerComponent = this.getOwnerComponent();
            this.oRouter = oOwnerComponent.getRouter();
            this.oModel = oOwnerComponent.getModel("restaurant");
            var oViewModel = new JSONModel();
            this.getView().setModel(oViewModel, "viewModel");


            this.oRouter.getRoute("master").attachPatternMatched(this._onEntryMatched, this);
            this.oRouter.getRoute("detail").attachPatternMatched(this._onEntryMatched, this);
            this.oRouter.getRoute("add").attachPatternMatched(this._onAddRouteMatched, this);
            this.i18n = oOwnerComponent.getModel("i18n").getResourceBundle();
        },

        _onAddRouteMatched: function (oEvent) {
            this._showFormFragment("Edit");

            var oModel = this.getView().getModel("restaurant");

            var oContext = oModel.createEntry("/RestaurantListEntrySet");

            var oForm = this.getView().byId("simplef");
            oForm.setBindingContext(oContext, "restaurant");


            this.getView().getModel("viewModel").setProperty('/notAddMode', false);
            this.byId("detailEditFragmentTitle").setText(this.i18n.getText("Detail.Edit.Addtitle"));

        },


        _onEntryMatched: function (oEvent) {
            this.getView().getModel("viewModel").setProperty('/notAddMode', true);

            console.log("selected");
            this._showFormFragment("Display");

            this._entry = oEvent.getParameter("arguments").entry || this._entry || "0";
            this.getView().bindElement({
                path: "/" + this._entry,
                model: "restaurant"
            });

        },

        _formFragments: {},

        onPressEdit: function () {
            this._showFormFragment("Edit");
        },


        onPressDelete: function () {
            var oBindingContext = this.getView().getBindingContext("restaurant");
            var sPath = oBindingContext.getPath();
            var oEntity = oBindingContext.getObject();
            var oParameters = {
                success: function () {

                    this.oModel.refresh();
                    this.oRouter.navTo("master", {layout: fioriLibrary.LayoutType.OneColumn});
                    MessageToast.show("Eintrag erfolgreich gelöscht", {closeOnBrowserNavigation: false});
                }, error: function (oError) {
                    console.log(JSON.stringify(JSON.parse(oError.responseText).error.innererror.errordetails[0].message));

                    MessageBox.show(JSON.stringify(JSON.parse(oError.responseText).error.innererror.errordetails[0].message), MessageBox.Icon.ERROR, "Eintrag konnte nicht gelöscht werden!");
                }
            };
            this.oModel.remove(sPath, oParameters);

        },

        onPressCancel: function () {
            let addMode = this.getView().getModel("viewModel").getProperty('/notAddMode');
            this.oModel.resetChanges();
            if (addMode) {
                this._showFormFragment("Display");

            } else {
                this.getView().getModel("viewModel").setProperty('/notAddMode', false);
                this.oRouter.navTo("master");
            }
        },

        onPressSave: function () {

            var oParameters = {
                success: function () {
                    MessageToast.show("Eintrag erfolgreich gespeichert!");
                }, error: function (oError) {
                    MessageToast.show("Ein Fehler ist aufgetreten!!");
                   // MessageBox.show("Eintrag konnte nicht gespeichert werden", MessageBox.Icon.ERROR, "Fehler!");

                }
            };
            this.oModel.submitChanges(oParameters);
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


        _showFormFragment: function (sFragmentName) {
            var oPage = this.byId("emptyPage");
            oPage.removeAllContent();
            oPage.insertContent(this._getFormFragment(sFragmentName));
            console.log("loaded fragment");
        }
    });
});
