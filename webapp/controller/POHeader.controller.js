sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], function(Controller, MessageBox, MessageToast, JSONModel) {
	"use strict";

	return Controller.extend("BinToBinClone.controller.POHeader", {

		onClick: function() {
			var sId = this.getView().byId("btnId").getValue();
			if (sId === "" || sId === undefined) {
				//MessageBox.error("Please Enter BARCODE Number ");XMSG_ENTER_BARCODE
				//"{i18n>title}"
				//this.getView().getModel("i18n").getResourceBundle().getText("notificationChangeAlert");
				var msg = this.getView().getModel("i18n").getResourceBundle().getText("XMSG_ENTER_BARCODE");
				MessageToast.show(msg, {
					width: "25rem"
				});
				$(".sapMMessageToast").addClass("sapMMessageToastDanger ");
			} else {
				var patt = /\([^)][01]\)+[0-9]+\([^)][0]\)+[0-9]*/g; //REGEX TO MATCH BARCODE
				if (patt.test(sId)) {
					var That = this;
					this.getOwnerComponent().getModel().read("/ZStockMovementCollection('" + sId + "')", {
						success: function(oData, oResponse) {
							var oModel = new JSONModel();
							oModel.setData(oData);
							That.getView().setModel(oModel, "oModel");
							That.getView().getModel("oModel").refresh();
							this.getView().byId("destLabel").setVisible(true);
							this.getView().byId("destNoInput").setVisible(true);
							jQuery.sap.delayedCall(200, this, function() {
								this.getView().byId("destNoInput").focus();
							});

							//this.getView().byId("destNoInput").focus();
							var res = oModel.getProperty("/Res");
							var quantity = oModel.getProperty("/Quantity");
							this.getView().byId("quan").setValue(quantity);
							if (res.length !== 0) {
								//MessageBox.error(res);
								MessageToast.show(res);
								$(".sapMMessageToast").addClass("sapMMessageToastDanger ");
								this.clearDetails();

							}

						}.bind(this),
						error: function(oError) {
							//MessageBox.error("INVALID BARCODE");
							var msg1 = this.getView().getModel("i18n").getResourceBundle().getText("XMSG_INVALID_BARCODE");
							MessageToast.show(msg1);
							$(".sapMMessageToast").addClass("sapMMessageToastDanger ");
						}.bind(this)
					});
				} else {
					//	MessageBox.error("INVALID BARCODE");
					var msg2 = this.getView().getModel("i18n").getResourceBundle().getText("XMSG_INVALID_BARCODE");
					MessageToast.show(msg2, {

					});
					$(".sapMMessageToast").addClass("sapMMessageToastDanger ");
				}

			}
		},
		onQuanChange: function() {
			var sId = this.getView().byId("btnId").getValue();

			var x = 0;
			var That = this;
			this.getOwnerComponent().getModel().read("/ZStockMovementCollection('" + sId + "')", {
				success: function(oData, oResponse) {
					var oModel = new JSONModel();
					oModel.setData(oData);

					var decimalSep = oModel.getProperty("/Decimal_sep");
					var thousandSep = oModel.getProperty("/Thousand_sep");

					var quantity = this.getView().byId("quan").getValue();
					this.getView().getModel("binModel").setProperty("/bin/quantity", quantity);
					jQuery.sap.require("sap.ui.core.format.NumberFormat");
					var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
						maxFractionDigits: 3,
						groupingEnabled: true,
						groupingSeparator: thousandSep,
						decimalSeparator: decimalSep
					});

					this.getView().byId("quan").setValue(oNumberFormat.format(quantity));
					var quanError = this.getView().byId("quan").getValue();
					
					if (quanError === "" || quanError === undefined) {
						var msg = this.getView().getModel("i18n").getResourceBundle().getText("XMSG_INVALID_QUAN");
						MessageToast.show(msg, {
							width: "15rem"
						});
						$(".sapMMessageToast").addClass("sapMMessageToastDanger ");
					}
					jQuery.sap.delayedCall(5, this, function() {
						this.getView().byId("destNoInput").focus();
					});

				}.bind(this),
				error: function(oError) {
					//MessageBox.error("INVALID BARCODE");
					var msg1 = this.getView().getModel("i18n").getResourceBundle().getText("XMSG_INVALID_BARCODE");
					MessageToast.show(msg1);
					$(".sapMMessageToast").addClass("sapMMessageToastDanger ");

				}.bind(this)

			});

		},
		clearDetails: function() {

			this.getView().byId("btnId").setValue("");
			this.getView().byId("stckCat").setValue("");
			this.getView().byId("splStk").setValue("");
			this.getView().byId("splSonum").setValue("");
			this.getView().byId("destNoInput").setValue("");
			this.getView().byId("quan").setValue("");
			this.getView().byId("destLabel").setVisible(false);
			this.getView().byId("destNoInput").setVisible(false);

			//this.getView().byId("DestRes").setVisible(false);
			this.getView().byId("strLoc").setText("");
			this.getView().byId("srcBin").setText("");
			this.getView().byId("matnr").setText("");
			this.getView().byId("batch").setText("");

			this.getView().byId("UOM").setText("");
			this.getView().byId("mesNo").setText("");
			//this.getView().byId("DestRes").setText("");
			this.getView().byId("img3").setVisible(false);
			this.getView().byId("idCreate").setVisible(true);
			this.getView().byId("idMover").setVisible(false);
			jQuery.sap.delayedCall(200, this, function() {
				this.getView().byId("btnId").focus();
			});
		},
		createDetails: function() {
			var sId = this.getView().byId("btnId").getValue();
			if (sId === "" || sId === undefined) {
				//MessageBox.error("Please Enter BARCODE Number ");
				var msg2 = this.getView().getModel("i18n").getResourceBundle().getText("XMSG_ENTER_BARCODE");
				MessageToast.show(msg2, {
					width: "30rem"
				});
				$(".sapMMessageToast").addClass("sapMMessageToastDanger ");
				return;
			}

			var sId4 = this.getView().byId("destNoInput").getValue();
			if (sId4 === "" || sId4 === undefined) {
				//	MessageBox.error("Please Enter DESTINATION Number ");
				var msg3 = this.getView().getModel("i18n").getResourceBundle().getText("XMSG_ENTER_DESTINATION_NUM");
				MessageToast.show(msg3, {
					width: "30rem"
				});
				$(".sapMMessageToast").addClass("sapMMessageToastDanger ");
				return;
			}

			var sId5 = this.getView().byId("srcBin").getText();
			if (sId5 === sId4) {
				//MessageBox.error("SOURCE AND DEST BIN SHOULD BE DIFFERENT");
				var msg4 = this.getView().getModel("i18n").getResourceBundle().getText("XMSG_SOURCE_DESTINATION_DIFF");
				MessageToast.show(msg4, {
					width: "30rem"
				});
				$(".sapMMessageToast").addClass("sapMMessageToastDanger ");
				return;
			}
			var That = this;
			this.getOwnerComponent().getModel().callFunction("/ZValidateBin", {

				method: "GET",
				urlParameters: {
					DestnNum: sId4
				},
				success: function(oData, oResponse) {
					var oModel = new JSONModel();
					oModel.setData(oData);

					var res = oModel.getProperty("/results/0/Valid_DestnNum_Result");
					//	this.getView().byId("DestRes").setText(res);
					//this.getView().byId("DestRes").setVisible(true);

					if (res === "VALID") {
						this.getView().byId("img3").setVisible(true);
						this.getView().byId("idCreate").setVisible(false);
						this.getView().byId("idMover").setVisible(true);
					}

				}.bind(this),
				error: function(oError) {

					var msg5 = this.getView().getModel("i18n").getResourceBundle().getText("XMSG_INVALID_DESTINATION_BIN");
					MessageToast.show(msg5);
					$(".sapMMessageToast").addClass("sapMMessageToastDanger ");
				}.bind(this)
			});
		},

		move: function() {
			var sId = this.getView().byId("btnId").getValue();
			var sId4 = this.getView().byId("destNoInput").getValue();
			var sId5 = this.getView().byId("stckCat").getValue();
			var that = this;
			//var sId6 = this.getView().byId("quan").getValue();
			//var quanTest = this.getView.getModel().getProperty("/quantity");
			//MessageBox.success(quanTest);
			var quan1;
			quan1 = this.getView().getModel("binModel").getProperty("/bin/quantity");

			//var ret = this.getView().byId("waste").getValue();
			jQuery.sap.require("sap.ui.core.format.NumberFormat");
			var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
				maxFractionDigits: 3,
				maxIntegerDigits: 10,
				groupingEnabled: false,

				decimalSeparator: "."
			});
			quan1 = oNumberFormat.format(quan1);
			MessageBox.success(quan1);
			//var sId9 = ret + "m";
			//MessageBox.success(sId9);
			var sId7 = this.getView().byId("splSonum").getValue();
			var sId8 = this.getView().byId("splStk").getValue();

			var payLoad = {
				"Barcode": sId,
				"DestnNum": sId4,
				"Category": sId5,
				"Quantity": quan1,
				"Sonum": sId7,
				"Sobkz": sId8
			};

			this.getOwnerComponent().getModel().create("/ZStockMovementCollection", payLoad, {
				success: function(odata, Response) {

					if (odata !== "" || odata !== undefined) {

						var oModel = new JSONModel();
						oModel.setData(odata);

						var res = oModel.getProperty("/Tanum");
						var msg6 = this.getView().getModel("i18n").getResourceBundle().getText("XMSG_TO") + res +
							this.getView().getModel("i18n").getResourceBundle().getText("XMSG_Created");
						MessageToast.show(msg6, {
							width: "25rem"
						});
						$(".sapMMessageToast").addClass("sapMMessageToastSuccess ");
						this.clearDetails();
					} else {
						var msg7 = 'NO TRANSFER ORDER';
						MessageToast.show(msg7, {
							width: "30rem"
						});
						$(".sapMMessageToast").addClass("sapMMessageToastDanger ");

					}
				}.bind(this),
				error: function(cc, vv) {
					var msg6 = 'Stock Movement Not Done';
					MessageToast.show(msg6, {
						width: "30rem"
					});
					$(".sapMMessageToast").addClass("sapMMessageToastDanger ");
				}.bind(this)
			});
		}

	});
});