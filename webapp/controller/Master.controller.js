sap.ui.define([
	"at/clouddna/training00/UI5Foundations/controller/BaseController",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/ListItem"
], function (BaseController, MessageBox, Fragment, Filter, FilterOperator, ListItem) {
	"use strict";

	return BaseController.extend("at.clouddna.training00.UI5Foundations.controller.Master", {
		_oTableSortDialog: null,

		onInit: function () {
			this.getRouter().getRoute("Master").attachPatternMatched(this._onPatternMatched, this);
		},

		onAfterRendering: function () {
			let oFilterSelect = this.getView().byId("master_filterbar_select");

			oFilterSelect.insertItem(new ListItem({
				key: "",
				text: ""
			}), 0);
			oFilterSelect.setSelectedKey("");
		},

		_onPatternMatched: function () {

		},

		onTableSortPress: function (oEvent) {
			if (this._oTableSortDialog === null) {
				Fragment.load({
					id: this.getView().createId("master_dialog_tablesettings"),
					name: "at.clouddna.training00.UI5Foundations.view.TableSettingsDialog",
					controller: this
				}).then(function (oFragment) {
					this._oTableSortDialog = oFragment;

					this.getView().addDependent(this._oTableSortDialog);
					this._oTableSortDialog.open();
					this.logInfo("Fragment 'TableSettingsDialog' loaded");
				}.bind(this));
			} else {
				this._oTableSortDialog.open();
			}
		},

		onTableFilter: function (oEvent) {
			let aEnteredFilters = oEvent.getParameters().selectionSet,
				aColumnNames = ["Firstname", "Lastname", "Gender", "Email"],
				oTable = this.getView().byId("master_table"),
				oBindings = oTable.getBinding("items"),
				aFilters = [];

			for (let h = 0; h < aEnteredFilters.length; h++) {
				if (aEnteredFilters[h].hasOwnProperty("_lastValue")) {
					if (aEnteredFilters[h]._lastValue !== "") {
						aFilters.push(new Filter(aColumnNames[h], FilterOperator.Contains,
							aEnteredFilters[h]._lastValue));
					}
				} else {
					if (aEnteredFilters[h].getProperty("selectedKey") !== "") {
						aFilters.push(new Filter(aColumnNames[h], FilterOperator.Contains,
							aEnteredFilters[h].getProperty("selectedKey")));
					}
				}
			}
			oBindings.filter(aFilters);
		},

		onSortDialogConfirm: function (oEvent) {
			let oTable = this.getView().byId("master_table"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				sPath,
				bDescending,
				aSorters = [];

			sPath = mParams.sortItem.getKey();
			bDescending = mParams.sortDescending;
			aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));

			oBinding.sort(aSorters);
		},

		onCustomerPress: function (oEvent) {
			let oRouter = this.getRouter(),
				sCustomerId = oEvent.getSource().getBindingContextPath().split("'")[1];

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
			let sCustomerPath = oEvent.getSource().getBindingContext().sPath,
				oModel = this.getModel();

			MessageBox.confirm(this.geti18nText("dialog.delete"), {
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.OK) {
						oModel.remove(sCustomerPath, {
							success: function (oData, response) {
								this.logInfo("Delete Customer - success");
								MessageBox.success(this.geti18nText("dialog.delete.success"));
							}.bind(this),
							error: function (oError) {
								this.logError("Delete Customer - error");
								MessageBox.error(oError.message);
							}.bind(this)
						});
					}
				}.bind(this)
			});
		}
	});
});