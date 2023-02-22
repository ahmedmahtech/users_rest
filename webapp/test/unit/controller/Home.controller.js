/*global QUnit*/

sap.ui.define([
	"ahmed_malik_rest/users_rest/controller/Home.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Home Controller");

	QUnit.test("I should test the Home controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});