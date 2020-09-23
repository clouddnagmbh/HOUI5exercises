sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
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
		}
	});

});