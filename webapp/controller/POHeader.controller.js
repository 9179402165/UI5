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
				//MessageBox.error("Please Enter BARCODE Number ");
				var msg = 'Please Enter Barcode Number';
				MessageToast.show(msg);
				$(".sapMMessageToast").addClass("sapMMessageToastDanger ");
			} else {
				var patt = /\([^)][01]\)+[0-9]+\([^)][0]\)+[0-9]*/g; //REGEX TO MATCH BARCODE
				if (patt.test(sId)) {
					var That = this;
					this.getOwnerComponent().getModel().read("/BinToBinSet('" + sId + "')", {
						success: function(oData1, oResponse1) {
							var oModel_EMPUpdate = new JSONModel();
							oModel_EMPUpdate.setData(oData1);
							That.getView().setModel(oModel_EMPUpdate, "oModel_EMPUpdate");
							That.getView().getModel("oModel_EMPUpdate").refresh();
							this.getView().byId("destLabel").setVisible(true);
							this.getView().byId("destNoInput").setVisible(true);
							jQuery.sap.delayedCall(200, this, function() {
								this.getView().byId("destNoInput").focus();
							});

							this.getView().byId("destNoInput").focus();
							var res = oModel_EMPUpdate.getProperty("/Res");
							if (res.length !== 0) {
								//MessageBox.error(res);
								MessageToast.show(res);
								$(".sapMMessageToast").addClass("sapMMessageToastDanger ");
								this.clearDetails();

							}

						}.bind(this),
						error: function(oError) {
							//MessageBox.error("INVALID BARCODE");
							var msg1 = 'INVALID BARCODE';
							MessageToast.show(msg1);
							$(".sapMMessageToast").addClass("sapMMessageToastDanger ");
						}.bind(this)
					});
				} else {
					//	MessageBox.error("INVALID BARCODE");
					var msg2 = 'INVALID BARCODE';
					MessageToast.show(msg2, {

					});
					$(".sapMMessageToast").addClass("sapMMessageToastDanger ");
				}

			}
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
				var msg2 = 'Please Enter BARCODE Number';
				MessageToast.show(msg2, {
					width: "30rem"
				});
				$(".sapMMessageToast").addClass("sapMMessageToastDanger ");
				return;
			}

			var sId4 = this.getView().byId("destNoInput").getValue();
			if (sId4 === "" || sId4 === undefined) {
				//	MessageBox.error("Please Enter DESTINATION Number ");
				var msg3 = 'Please Enter DESTINATION Number';
				MessageToast.show(msg3, {
					width: "30rem"
				});
				$(".sapMMessageToast").addClass("sapMMessageToastDanger ");
				return;
			}

			var sId5 = this.getView().byId("srcBin").getText();
			if (sId5 === sId4) {
				//MessageBox.error("SOURCE AND DEST BIN SHOULD BE DIFFERENT");
				var msg4 = 'SOURCE AND DESTINATION BIN SHOULD BE DIFFERENT';
				MessageToast.show(msg4, {
					width: "30rem"
				});
				$(".sapMMessageToast").addClass("sapMMessageToastDanger ");
				return;
			}
			var That = this;
			this.getOwnerComponent().getModel().callFunction("/ValidateDestinationBin", {

				method: "GET",
				urlParameters: {
					DestnNum: sId4
				},
				success: function(oData2, oResponse2) {
					var oModel_EMPUpdate1 = new JSONModel();
					oModel_EMPUpdate1.setData(oData2);
					
					var res = oModel_EMPUpdate1.getProperty("/results/0/Result");
					//	this.getView().byId("DestRes").setText(res);
					//this.getView().byId("DestRes").setVisible(true);
				    
					if (res === "VALID") {
						this.getView().byId("img3").setVisible(true);
						this.getView().byId("idCreate").setVisible(false);
						this.getView().byId("idMover").setVisible(true);
					}

				}.bind(this),
				error: function(oError) {

					var msg5 = 'INVALID DEST NUM';
					MessageToast.show(msg5);
					$(".sapMMessageToast").addClass("sapMMessageToastDanger ");
				}.bind(this)
			});
		},
		move: function() {
			var sId = this.getView().byId("btnId").getValue();
			var sId4 = this.getView().byId("destNoInput").getValue();
			var sId5 = this.getView().byId("stckCat").getValue();
			var sId6 = this.getView().byId("quan").getValue();
			var sId9 = sId6 + 'm';

			var sId7 = this.getView().byId("splSonum").getValue();
			var sId8 = this.getView().byId("splStk").getValue();

			var That = this;
			this.getOwnerComponent().getModel().read("/StockMovementSet(Barcode='" + sId + "',DestnNum='" + sId4 + "',Category='" + sId5 +
				"',Quantity=1.000m,Sonum='" + sId7 + "',Sobkz='" + sId8 + "')", {
					success: function(oData3, oResponse3) {
						var oModel_EMPUpdate = new JSONModel();
						oModel_EMPUpdate.setData(oData3);

						var res = oModel_EMPUpdate.getProperty("/Tanum");
						//MessageBox.success("TRANSFER ORDER " + res + " CREATED");
						var msg6 = 'TRANSFER ORDER ' + res + ' CREATED';
						MessageToast.show(msg6, {
							width: "25rem"
						});
						$(".sapMMessageToast").addClass("sapMMessageToastSuccess ");
						this.clearDetails();
					}.bind(this),
					error: function(oError) {
						//MessageBox.error("Stock Movement Not Done");
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