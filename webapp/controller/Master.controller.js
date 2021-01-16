sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/model/Sorter',
    'sap/m/MessageBox',
    'sap/f/library'
], function (JSONModel, Controller, Filter, FilterOperator, Sorter, MessageBox, fioriLibrary) {
    "use strict";
    return Controller.extend("de.cspilker.rlist.controller.Master", {


        onInit: function () {
            this.oRouter = this.getOwnerComponent().getRouter();
        },


        onSearch: function (oEvent) {
            var aFilter = [],
                sQuery = oEvent.getParameter("query");
            var oList = this.getView().byId("RListEntries");
            var oBinding = oList.getBinding( "items" );
            if (sQuery && sQuery.length > 0) {
                aFilter.push(new Filter("Username", FilterOperator.Contains, sQuery));
            }
            oBinding.filter(aFilter);
        },


        onPressAdd: function (oEvent) {
            //MessageBox.information("Working on it!", {title: "Aw, Snap!"});
            var oModel = this.getView().getModel("restaurant");
            sap.ui.core.UIComponent.getRouterFor(this).navTo("add", {layout: fioriLibrary.LayoutType.TwoColumnsMidExpanded});
            console.log("add");
        },


        onListItemPress: function (oEvent) {
            var entryPath = oEvent.getSource().getBindingContext("restaurant").getPath(),
                entry = entryPath.split("/").slice(-1).pop();
            console.log("pressed");
            this.oRouter.navTo("detail", {layout: fioriLibrary.LayoutType.TwoColumnsMidExpanded, entry: entry});
        }
    });
});