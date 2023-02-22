sap.ui.define([
	"./AppController"
], function (AppController) {
	"use strict";

	return AppController.extend("ahmed_malik_rest.users_rest.controller.PostObject", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ahmed_malik_rest.users_rest.view.PostObject
		 */
		onInit: function () {
			var oViewModel = new sap.ui.model.json.JSONModel({
				worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
				tableNoDataText: this.getResourceBundle().getText("tableNoDataText")
			});
			this.getRouter().getRoute("PostObject").attachPatternMatched(this._onObjectMatched, this);
			this.setModel(oViewModel, "PostObjectView");
		},
		_onObjectMatched: function (oEvent) {
			var oList = this.getOwnerComponent().getModel("PostDataModel").getData();
			var sObjectId = oEvent.getParameter("arguments").objectId;
			var oPost = this.getOwnerComponent().getModel("PostDataModel").getData()[sObjectId - 1];
			var oPostModel = new sap.ui.model.json.JSONModel(oPost);
			this.setModel(oPostModel, "PostDataModel");
			this.getView().setModel(oPostModel, "PostObjectView");
		},

		_bindView: function (sObjectPath) {
			var oViewModel = this.getModel("PostObjectView");
			this.getView().bindElement({
				model: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
				}
			});
		},
		_onBindingChange: function () {
			var oView = this.getView(),
				oViewModel = this.getModel("PostObjectView"),
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
		_updatePost: function (sTitle, sBody) {
			var oData = {
				id: this.getModel("PostDataModel").getData().id,
				userId: this.getModel("PostDataModel").getData().userId,
				title: sTitle,
				body: sBody
			};
			jQuery.ajax({
				type: "PUT",
				contentType: "application/json",
				url: "/posts/" + this.getModel("PostDataModel").getData().id,
				dataType: "json",
				data: JSON.stringify(oData),
				async: false,
				success: function (data, textStatus, jqXHR) {
					alert("success  to update the post");

				},
				error: function (jqXHR, textStatus, errorThrown) {
					// Handle the error response
					alert("failed to update the post");
				}
			});
		},
		_createPost: function (sTitle, sBody) {
			var oData = {
				userId: this.getModel("PostDataModel").getData().userId,
				title: sTitle,
				body: sBody
			};
			jQuery.ajax({
				type: "POST",
				contentType: "application/json",
				url: "/posts",
				dataType: "json",
				data: JSON.stringify(oData),
				async: false,
				success: function (data, textStatus, jqXHR) {
					alert("success  to save the new post");

				},
				error: function (jqXHR, textStatus, errorThrown) {
					// Handle the error response
					alert("failed to save the new post");
				}
			});
		},
		onSave: function () {
			var sTitle = this.getView().byId("title").getValue(),
				sBody = this.getView().byId("body").getValue();
			if (!sTitle || !sBody) {
				alert("Enter all data");
			} else if (!this.getModel("PostDataModel").getData().id) {
				this._createPost(sTitle, sBody);
			} else {
				this._updatePost(sTitle, sBody);
			}

		}

	});

});