sap.ui.define([
	"at/clouddna/training00/UI5Foundations/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"sap/ui/core/routing/History"
], function (BaseController, JSONModel, MessageBox, Fragment, History) {
	"use strict";

	return BaseController.extend("at.clouddna.training00.UI5Foundations.controller.Customer", {

		_fragmentList: [],
		_sMode: "",
		_oBackupData: null,

		onInit: function () {
			this.getRouter().getRoute("Customer").attachPatternMatched(this._onPatternMatched, this);
		},

		_onPatternMatched: function (oEvent) {
			let editModel = new JSONModel({
					editmode: false
				}),
				oView = this.getView(),
				sCustomerId = oEvent.getParameter("arguments").customerid;

			this.setModel(editModel, "editModel");

			if (sCustomerId !== "create") {
				this._sMode = "display";

				this._showCustomerFragment("DisplayCustomer");
				oView.bindElement("/Kunden/" + sCustomerId);
				this.logInfo("Display Customer " + sCustomerId);
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
				this.setModel(createModel, "createModel");
				editModel.setProperty("/editmode", true);

				this.logInfo("Create Customer - start");
			}
		},

		_toggleEdit: function (bEditMode) {
			let oEditModel = this.getModel("editModel");

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
					this.logInfo("Fragment '" + sFragmentName + "' loaded");
				}.bind(this));
			}
		},

		onEditPress: function (oEvent) {
			this._toggleEdit(true);

			this._oBackupData = JSON.parse(JSON.stringify(this.getView().getBindingContext().getObject()));
			this.logInfo("Edit Customer - started");
		},

		onCancelPress: function (oEvent) {
			if (this._sMode === "create") {
				this.logInfo("Create Customer - canceled");
				this.onNavBack();
			} else {
				let sIdx = this.getView().getBindingContext().sPath;
				this.getModel().setProperty(sIdx, this._oBackupData);
				this._toggleEdit(false);
				this.logInfo("Edit Customer - canceled");
			}
		},

		onSavePress: function (oEvent) {
			let oView = this.getView(),
				sMessage = "";

			if (this._sMode === "create") {
				let oCreateData = this.getModel("createModel").getData(),
					oModelData = this.getModel().getData();

				oModelData.Kunden.push(oCreateData);
				sMessage = JSON.stringify(oCreateData);

				this.getModel().setData(oModelData);
				oView.bindElement("/Kunden/" + (this.getModel().getData().Kunden.length - 1));

				this._sMode = "display";
				this.logInfo("Create Customer - created");
			} else {
				let oCustomer = this.getView().getBindingContext().getObject();

				sMessage = JSON.stringify(oCustomer);
				this.logInfo("Edit Customer - updated");
			}

			this._toggleEdit(false);
			MessageBox.information(sMessage);
		}
	});
});