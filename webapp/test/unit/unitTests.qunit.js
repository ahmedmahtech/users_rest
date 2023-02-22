/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"ahmed_malik_rest/users_rest/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});