sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"sap/ui/core/routing/History"
], function (Controller, JSONModel, MessageBox, Fragment, History) {
	"use strict";

	return Controller.extend("at.clouddna.training00.UI5Foundations.controller.Customer", {

		_fragmentList: [],
		_sMode: "",
		_oBackupData: null,

		onInit: function () {
			let oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			oRouter.getRoute("Customer").attachPatternMatched(this._onPatternMatched, this);
		},

		_onPatternMatched: function (oEvent) {
			let editModel = new JSONModel({
					editmode: false
				}),
				oView = this.getView(),
				sCustomerId = oEvent.getParameter("arguments").customerid;

			oView.setModel(editModel, "editModel");

			if (sCustomerId !== "create") {
				this._sMode = "display";

				this._showCustomerFragment("DisplayCustomer");
				oView.bindElement("/Kunden/" + sCustomerId);
			} else {
				let createModel = new JSONModel({
					Kundennummer: "",
					Vorname: "",
					Nachname: "",
					Titel: "",
					Geschlecht: "",
					EMail: "",
					Telefon: "",
					Website: ""
				});

				this._sMode = "create";

				this._showCustomerFragment("CreateCustomer");
				oView.setModel(createModel, "createModel");
				editModel.setProperty("/editmode", true);
			}
		},

		_toggleEdit: function (bEditMode) {
			let oEditModel = this.getView().getModel("editModel");

			oEditModel.setProperty("/editmode", bEditMode);

			this._showCustomerFragment(bEditMode ? "EditCustomer" : "DisplayCustomer");
		},

		_showCustomerFragment: function (sFragmentName) {
			let oPage = this.getView().byId("customer_page");

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

			this._oBackupData = JSON.parse(JSON.stringify(this.getView().getBindingContext().getObject()));
		},

		onCancelPress: function (oEvent) {
			if (this._sMode === "create") {
				this.onNavBack();
			} else {
				let iIdx = this.getView().getBindingContext().sPath.split("/")[2];
				this.getView().getModel().setProperty("/Kunden/" + iIdx, this._oBackupData);
				this._toggleEdit(false);

			}
		},

		onSavePress: function (oEvent) {
			let oView = this.getView(),
				sMessage = "";

			if (this._sMode === "create") {
				let oCreateData = oView.getModel("createModel").getData(),
					oModelData = oView.getModel().getData();

				oModelData.Kunden.push(oCreateData);
				sMessage = JSON.stringify(oCreateData);

				oView.getModel().setData(oModelData);
				oView.bindElement("/Kunden/" + (oView.getModel().getData().Kunden.length - 1));

				this._sMode = "display";
			} else {
				let oCustomer = this.getView().getBindingContext().getObject();

				sMessage = JSON.stringify(oCustomer);
			}

			this._toggleEdit(false);
			MessageBox.information(sMessage);
		},

		onNavBack: function (oEvent) {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("Master", true);
			}
		},
	});
});