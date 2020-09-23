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

		onInit: function () {
			this.getRouter().getRoute("Customer").attachPatternMatched(this._onPatternMatched, this);
		},

		_onPatternMatched: function (oEvent) {
			let editModel = new JSONModel({
					editmode: false
				}),
				oImageModel = new JSONModel({
					image: null
				}),
				oView = this.getView(),
				sCustomerId = oEvent.getParameter("arguments").customerid;

			this.setModel(editModel, "editModel");
			this.setModel(oImageModel, "imageModel");

			if (sCustomerId !== "create") {
				this._sMode = "display";

				this._showCustomerFragment("DisplayCustomer");
				oView.bindElement("/CustomerSet(guid'" + sCustomerId + "')");

				this.getModel().read("/CustomerSet(guid'" + sCustomerId + "')/Documents", {
					success: function (oData, response) {
						let oImageEntity = oData.results.find(function (oElement) {
							return oElement.DocumentType === "image/png";
						});

						if (oImageEntity) {
							oImageModel.setProperty("/image", oImageEntity);
							this.logInfo("Display Customer - image loaded");
						} else {
							this.logInfo("Display Customer - no image");
						}

					}.bind(this),
					error: function (oError) {
						this.logError("Display Customer - " + oError.message);
					}.bind(this)
				});

				this.logInfo("Display Customer " + sCustomerId);

			} else {
				let createModel = new JSONModel({
					Firstname: "",
					Lastname: "",
					AcademicTitle: "",
					Gender: "",
					Email: "",
					Phone: "",
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
			this.logInfo("Edit Customer - started");
		},

		onCancelPress: function (oEvent) {
			MessageBox.confirm(this.geti18nText("dialog.cancel"), {
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.OK) {
						if (this._sMode === "create") {
							this.logInfo("Create Customer - canceled");
							this.onNavBack();
						} else {
							if (this.getModel().hasPendingChanges()) {
								this.getModel().resetChanges();
							}
							this._toggleEdit(false);
							this.logInfo("Edit Customer - canceled");
						}
					}
				}.bind(this)
			});
		},

		onSavePress: function (oEvent) {
			if (this._sMode === "create") {
				let oModel = this.getModel(),
					oCreateData = this.getModel("createModel").getData();

				oModel.create("/CustomerSet", oCreateData, {
					success: function (oData, response) {
						this.logInfo("Create Customer - success");
						MessageBox.information(this.geti18nText("dialog.create.success"), {
							onClose: function (sAction) {
								this.onNavBack();
							}.bind(this)
						});
					}.bind(this),
					error: function (oError) {
						this.logError("Create Customer - error");
						MessageBox.error(oError.message, {
							onClose: function (sAction) {
								this.onNavBack();
							}.bind(this)
						});
					}.bind(this)
				});
			} else {
				if (this.getModel().hasPendingChanges()) {
					this.getModel().submitChanges();
					MessageBox.information(this.geti18nText("dialog.update.success"));
					this.logInfo("Edit Customer - updated");
				} else {
					this.logInfo("Edit Customer - no changes found");
				}
				this._toggleEdit(false);
			}
		}
	});
});