function initModel() {
	var sUrl = "/sap/opu/odata/sap/ZHOUI5_CUSTOMER_SRV/sap/opu/odata/sap/ZHOUI5_CUSTOMER_SRV/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}