sap.ui.define([
	"sap/m/MessageToast",
	"sap/m/ViewSettingsItem",
	"sap/ui/core/CustomData",
	"sap/ui/core/Fragment",
	"./AppController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (MessageToast, ViewSettingsItem, CustomData, Fragment, AppController, Filter, FilterOperator) {
	"use strict";

	return AppController.extend("ahmed_malik_rest.users_rest.controller.UsersList", {
		onInit: function () {
			var oViewModel,
				oTable = this.byId("table");
			this._aTableSearchState = [];
			this._mDialogs = {};

			var oModel = new sap.ui.model.json.JSONModel(),
				oViewModel = new sap.ui.model.json.JSONModel({
					worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
					tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
				});
			this.setModel(oViewModel, "UsersListView");
			oTable.setModel(oModel);
			this.addHistoryEntry({
				title: this.getResourceBundle().getText("worklistViewTitle"),
				icon: "sap-icon://table-view",
				intent: "#test_posts-display"
			}, true);
		},

		_openDialog: function (sName, sPage, fInit) {
			var oView = this.getView();
			// creates requested dialog if not yet created
			if (!this._mDialogs[sName]) {
				this._mDialogs[sName] = Fragment.load({
					id: oView.getId(),
					name: "ahmed_malik_rest.users_rest.Fragments." + sName,
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					if (fInit) {
						fInit(oDialog);
					}
					return oDialog;
				});
			}
			this._mDialogs[sName].then(function (oDialog) {
				// opens the requested dialog
				oDialog.open();
			});
		},
		// Opens View Settings Dialog
		handleOpenDialog: function () {
			this._openDialog("Dialog");
		},

		handleConfirm: function (oEvent) {
			var oView = this.getView(),
				oTable = oView.byId("table"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				bDescending = mParams.sortDescending,
				aSorters = [],
				sPath;
			if (mParams.sortItem.getKey() == "name") {
				sPath = mParams.sortItem.getKey();
				bDescending = mParams.sortDescending;
				aSorters.push(new sap.ui.model.Sorter("name", bDescending));
				oBinding.sort(aSorters);
			}
		},
		onPress: function (oEvent) {
			this._showObject(oEvent.getSource());
		},
		onSearch: function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				this.onRefresh();
			} else {
				var aTableSearchState = [];
				var sQuery = oEvent.getParameter("query");
				if (sQuery && sQuery.length > 0) {
					aTableSearchState = [new Filter("name", FilterOperator.Contains, sQuery)];
				}
				this._applySearch(aTableSearchState);
			}
		},
		onRefresh: function () {
			var oTable = this.byId("table");
			oTable.getBinding("items").refresh();
		},
		_showObject: function (oItem) {
			this.getRouter().navTo("UserObject", {
				objectId: oItem.getBindingContextPath().replace("/", "")
			});
		},
		_applySearch: function (aTableSearchState) {
			var oTable = this.byId("table"),
				oViewModel = this.getModel("UsersListView");
			oTable.getBinding("items").filter(aTableSearchState, "Application");
			if (aTableSearchState.length !== 0) {
				oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
			}
		}

	});

});