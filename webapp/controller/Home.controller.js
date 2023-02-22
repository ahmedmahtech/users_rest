sap.ui.define([
	"./AppController",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("ahmed_malik_rest.users_rest.controller.Home", {
		onInit: function () {
		var oViewmodel;
			oViewmodel = new JSONModel();
			this.setModel(oViewmodel, "homeView");
		}
	});
});