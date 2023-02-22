sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";
	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		createDataModel: function () {
			var oModel = new JSONModel("/users");
			return oModel;
		},
		
		createPostDataModel: function () {
			var oModel = new JSONModel("/posts");
			return oModel;
		} 
		
	};
});