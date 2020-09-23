sap.ui.define([
	"at/clouddna/training00/UI5Foundations/controller/BaseController",
	"sap/m/MessageBox"
], function (BaseController, MessageBox) {
	"use strict";

	return BaseController.extend("at.clouddna.training00.UI5Foundations.controller.Master", {

		onInit: function () {
			this.getRouter().getRoute("Master").attachPatternMatched(this._onPatternMatched, this);
		},

		_onPatternMatched: function () {

		},

		onCustomerPress: function (oEvent) {
			let oRouter = this.getRouter(),
				sCustomerId = oEvent.getSource().getBindingContextPath().split("/")[2];

			oRouter.navTo("Customer", {
				customerid: sCustomerId
			}, false);
		},

		onNewCustomerPress: function (oEvent) {
			let oRouter = this.getRouter();

			oRouter.navTo("Customer", {
				customerid: "create"
			}, false);
		},

		onDeleteCustomerPress: function (oEvent) {
			let iIdx = oEvent.getSource().getBindingContext().sPath.split("/")[2],
				aData = this.getModel().getProperty("/Kunden");

			MessageBox.confirm(this.geti18nText("dialog.delete"), {
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.OK) {
						aData.splice(iIdx, 1);
						this.getModel().refresh();
						this.logInfo("Delete Customer " + iIdx);
					}
				}.bind(this)
			});
		}
	});
});