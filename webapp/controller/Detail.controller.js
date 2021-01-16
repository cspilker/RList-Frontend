sap.ui.define([
    'sap/ui/core/Fragment',
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/SimpleType"
], function (Fragment, Controller, JSONModel, MessageBox, MessageToast, SimpleType) {
    "use strict";
    return Controller.extend("de.cspilker.rlist.controller.Detail", {

        onInit: function () {
            console.log("bre init");
            var oOwnerComponent = this.getOwnerComponent();
            this.oRouter = oOwnerComponent.getRouter();
            this.oModel = oOwnerComponent.getModel("restaurant");
            var oViewModel = new JSONModel();
            this.getView().setModel(oViewModel, "viewModel");


            //console.log(this.oMode.getData());
            this.oRouter.getRoute("master").attachPatternMatched(this._onEntryMatched, this);
            this.oRouter.getRoute("detail").attachPatternMatched(this._onEntryMatched, this);
            this.oRouter.getRoute("add").attachPatternMatched(this._onAddRouteMatched, this);
            this.i18n = oOwnerComponent.getModel("i18n").getResourceBundle();


        },

        _onAddRouteMatched: function () {



            var oModel = this.getView().getModel("restaurant");


            this.getView().unbindElement();
            this.getView().setBindingContext(oContext, "restaurant");
            this.getView().getModel("viewModel").setProperty('/notAddMode', false);
            this._showFormFragment("Edit");
            this.byId("detailEditFragmentTitle").setText(this.i18n.getText("Detail.Edit.Addtitle"));
            var oContext = this.oModel.createEntry("/RestaurantListEntrySet");

            console.log("Add Route matched");
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

        onPressDelete: function () {
            var oBindingContext = this.getView().getBindingContext("restaurant");
            var sPath = oBindingContext.getPath();
            var oEntity = oBindingContext.getObject();
            var oParameters = {
                success: function () {
                    MessageToast.show("Eintrag erfolgreich gelöscht", {closeOnBrowserNavigation: false});
                    this.oModel.refresh();
                    this.oRouter.navTo("master");
                }, error: function (oError) {
                    console.log("errrrrerrrrrrrrrrrrrrrrrr");
                    console.log(JSON.stringify(JSON.parse(oError.responseText).error.innererror.errordetails[0].message));
                    //let err = JSON.parse(oError.response.body);

                    //this.oModel.refresh();
                    MessageBox.show(JSON.stringify(JSON.parse(oError.responseText).error.innererror.errordetails[0].message), MessageBox.Icon.ERROR, "Eintrag konnte nicht gelöscht werden!");
                }
            };
            this.oModel.remove(sPath, oParameters);

        },

        onPressCancel: function () {
            let addMode = this.getView().getModel("viewModel").getProperty('/notAddMode');
            console.log("addMode:" + addMode);
            this.oModel.resetChanges();
            if (addMode) {
                this._showFormFragment("Display");

            } else {

                this.getView().getModel("viewModel").setProperty('/notAddMode', false);
                this.oRouter.navTo("master");
            }


            console.log("cancel");
        },

        onPressSave: function () {


            var oParameters = {
                success: function () {
                    MessageToast.show("Eintrag erfolgreich gelöscht", {closeOnBrowserNavigation: false});
                    this.oModel.refresh();
                    this.oRouter.navTo("master");
                }, error: function (oError) {
                    this.oModel.refresh();
                    MessageBox.show("Eintrag konnte nicht gelöscht werden", MessageBox.Icon.ERROR, "Fehler!");
                }
            };

            if(this._validateInput())
            this.oModel.submitChanges(oParameters);
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


        _showFormFragment: function (sFragmentName) {
            var oPage = this.byId("emptyPage");
            oPage.removeAllContent();
            oPage.insertContent(this._getFormFragment(sFragmentName));
            console.log("loaded fragment");
        },

        onNameChange: function(oEvent) {
            var oInput = oEvent.getSource();
            this._validateInput(oInput);
        },

        _validateInput: function (oInput) {
            var sValueState = "None";
            var bValidationError = false;
            var oBinding = oInput.getBinding("value");

            try {
                oBinding.getType().validateValue(oInput.getValue());
            } catch (oException) {
                sValueState = "Error";
                bValidationError = true;
            }

            oInput.setValueState(sValueState);

            return bValidationError;
        },

        /**
         * Custom model type for validating an E-Mail address
         * @class
         * @extends sap.ui.model.SimpleType
         */
        customEMailType: SimpleType.extend("email", {
            formatValue: function (oValue) {
                return oValue;
            },

            parseValue: function (oValue) {
                //parsing step takes place before validating step, value could be altered here
                return oValue;
            },

            validateValue: function (oValue) {
                // The following Regex is only used for demonstration purposes and does not cover all variations of email addresses.
                // It's always better to validate an address by simply sending an e-mail to it.
                var rexMail = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
                if (!oValue.match(rexMail)) {
                    throw new ValidateException("'" + oValue + "' is not a valid e-mail address");
                }
            }
        })
    });
});
