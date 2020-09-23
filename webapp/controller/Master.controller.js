sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox"
], function (Controller, MessageBox) {
	"use strict";

	return Controller.extend("at.clouddna.training00.UI5Foundations.controller.Master", {

		onInit: function () {
			let oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			oRouter.getRoute("Master").attachPatternMatched(this._onPatternMatched, this);
		},

		_onPatternMatched: function () {

		},

		onCustomerPress: function (oEvent) {
			let oRouter = sap.ui.core.UIComponent.getRouterFor(this),
				sCustomerId = oEvent.getSource().getBindingContextPath().split("/")[2];

			oRouter.navTo("Customer", {
				customerid: sCustomerId
			}, false);
		},

		onNewCustomerPress: function (oEvent) {
			let oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			oRouter.navTo("Customer", {
				customerid: "create"
			}, false);
		},

		onDeleteCustomerPress: function (oEvent) {
			let i18nModel = this.getView().getModel("i18n").getResourceBundle(),
				iIdx = oEvent.getSource().getBindingContext().sPath.split("/")[2],
				aData = this.getView().getModel().getProperty("/Kunden");

			MessageBox.confirm(i18nModel.getText("dialog.delete"), {
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.OK) {
						data.splice(iIdx, 1);
						this.getView().getModel().refresh();
					}
				}.bind(this)
			});
		}
	});
});