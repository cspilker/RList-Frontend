sap.ui.define([
    'sap/ui/core/UIComponent',
    'sap/ui/model/json/JSONModel',
    'sap/f/library',
    'sap/ui/model/resource/ResourceModel'
], function(UIComponent, JSONModel, fioriLibrary, ResourceModel) {
    'use strict';
    return UIComponent.extend('de.cspilker.rlist.Component', {
        metadata: {
            manifest: 'json'
        },


        init: function () {
            var oModel,
                oRouter;
            UIComponent.prototype.init.apply(this, arguments);
            oModel = new JSONModel();
            this.setModel(oModel);
            oRouter = this.getRouter();
            oRouter.attachBeforeRouteMatched(this._onBeforeRouteMatched, this);
            oRouter.initialize();


            var i18nModel = new ResourceModel({
                bundleName:"de.cspilker.rlist.i18n.i18n"
            });
            this.setModel(i18nModel, "i18n");


        },


        _onBeforeRouteMatched: function(oEvent) {
            var oModel = this.getModel(),
                sLayout = oEvent.getParameters().arguments.layout;
            // If there is no layout parameter, set a default layout (normally OneColumn)
            if (!sLayout) {
                sLayout = fioriLibrary.LayoutType.OneColumn;
            }
            oModel.setProperty("/layout", sLayout);
        }
    });
});