sap.ui.define([
	"./AppController"
], function (AppController) {
	"use strict";

	return AppController.extend("ahmed_malik_rest.users_rest.controller.UserObject", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf test_posts.test_posts.view.PostObject
		 */
		onInit: function () {

			var oViewModel = new sap.ui.model.json.JSONModel({
				worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
				tableNoDataText: this.getResourceBundle().getText("tableNoDataText")
			});
			this.getRouter().getRoute("UserObject").attachPatternMatched(this._onObjectMatched, this);
			this.setModel(oViewModel, "UserObjectView");
		},
		_callAjaxPosts: function (userID) {
			var oTable = this.byId("table");
			var oModel = new sap.ui.model.json.JSONModel();
			jQuery.ajax({
				type: "GET",
				contentType: "application/json",
				data: {
					userId: userID,
				},
				url: "/posts",
				dataType: "json",
				async: false,
				success: function (data, textStatus, jqXHR) {
					oModel.setData(data);
					oTable.setModel(oModel);

				},
				error: function (jqXHR, textStatus, errorThrown) {
					// Handle the error response
					alert("failed to get the posts");
				}
			});

		},
		_onObjectMatched: function (oEvent) {
			var sObjectId = oEvent.getParameter("arguments").objectId;
			var sPath = "/" + sObjectId;
			this._callAjaxPosts(this.getOwnerComponent().getModel("DataModel").getProperty(sPath).id);
			this._bindView(sPath);
		},

		_bindView: function (sObjectPath) {
			var oViewModel = this.getModel("UserObjectView");
			this.getView().bindElement({
				path: sObjectPath,
				model: "DataModel",
				events: {
					change: this._onBindingChange.bind(this),
				}
			});
		},

		_onBindingChange: function () {
			var oView = this.getView(),
				oViewModel = this.getModel("UserObjectView"),
				oElementBinding = oView.getElementBinding();
			var oResourceBundle = this.getResourceBundle(),
				oObject = oView.getBindingContext().getObject(),
				sObjectId = oObject.id,
				sObjectName = oObject.name;

			this.addHistoryEntry({
				title: this.getResourceBundle().getText("objectTitle") + " - " + sObjectName,
				icon: "sap-icon://enter-more",
				intent: "#test_posts-display&/Users/" + sObjectId
			});

		},
		onAddPost: function () {
			this.getRouter().navTo("PostObject");
		},

		onDeletePost: function () {
			var sSelectedPostId = this._getSelectedItemId();
			var sUrl = "/posts/" + sSelectedPostId;
			if (!sSelectedPostId) {
				alert("Select post to delete");
			} else {
				sap.m.MessageBox.show("Are you sure you want to delete the selected row?", {
					title: "Confirm Deletion",
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function (oAction) {
						if (oAction === sap.m.MessageBox.Action.YES) {
							jQuery.ajax({
								type: "DELETE",
								url: sUrl,
								dataType: "json",
								async: false,
								success: function (data, textStatus, jqXHR) {
									alert("success  to delete the post");
									this._onRefresh();

								},
								error: function (jqXHR, textStatus, errorThrown) {
									// Handle the error response
									alert("failed to  delete the post");
								}
							});
						}

					}
				});

			}
		},

		_getSelectedItemId: function () {
			var oTable = this.getView().byId("table");
			var sId;
			var aSelectedItems = oTable.getSelectedItems();
			aSelectedItems.forEach(function (oSelectedItem) {
				var sIndex = oSelectedItem.getBindingContextPath().replace("/", "");
				sId = oTable.getModel().getData()[sIndex].id;
			});
			return sId;
		},

		_onRefresh: function () {
			var oTable = this.byId("table");
			oTable.getBinding("items").refresh();
		},
		onPress: function (oEvent) {
			this._showObject(oEvent.getSource());
		},
		_showObject: function (oItem) {
			this.getRouter().navTo("PostObject", {
				objectId: oItem.getBindingContext().getProperty("id")
			});
		},
	});

});