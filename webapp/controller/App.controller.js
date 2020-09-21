sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment"
], function (Controller, JSONModel, MessageBox, Fragment) {
	"use strict";

	return Controller.extend("at.clouddna.training00.UI5Foundations.controller.App", {
		_fragmentList: [],

		onInit: function () {
			let editModel = new JSONModel({
				editmode: false
			});

			this.getView().setModel(editModel, "editModel");
			this._showCustomerFragment("DisplayCustomer");
		},

		_toggleEdit: function (bEditMode) {
			let oEditModel = this.getView().getModel("editModel");

			oEditModel.setProperty("/editmode", bEditMode);

			this._showCustomerFragment(bEditMode ? "EditCustomer" : "DisplayCustomer");
		},

		_showCustomerFragment: function (sFragmentName) {
			let oPage = this.getView().byId("page");

			oPage.removeAllContent();

			if (this._fragmentList[sFragmentName]) {
				oPage.insertContent(this._fragmentList[sFragmentName]);
			} else {
				Fragment.load({
					id: this.getView().createId(sFragmentName),
					name: "at.clouddna.training00.UI5Foundations.view." + sFragmentName,
					controller: this
				}).then(function (oFragment) {
					this._fragmentList[sFragmentName] = oFragment;
					oPage.insertContent(this._fragmentList[sFragmentName]);
				}.bind(this));
			}
		},

		onEditPress: function (oEvent) {
			this._toggleEdit(true);
		},

		onSavePress: function (oEvent) {
			let oCustomer = this.getView().getModel().getProperty("/");

			this._toggleEdit(false);
			MessageBox.information(JSON.stringify(oCustomer));
		}
	});
});