var currentPage = 1;
var pagePerRows = 4;
var totalPage = 0;

$(document).ready(function() {

	$("#searchButton").unbind("click");
	$("#searchButton").bind("click", function(){
		getListRoot(1);
	});
	$("#closeBtn").unbind("click");
	$("#closeBtn").bind("click", function(){
		closePopup(POPUP_LAYER);
	});
	
	getListRoot();
});

function getListRoot(pageNum){

	if (pageNum != undefined) {
		currentPage = pageNum;
	} else {
		currentPage = 1;
	}
	var params = {
		"url":"getRootList.do",
		"callback":"getListRootCallback",
		"paramonly":"true",
		"inGubun":$("#searchTitleGubun").val(),
		"inText":$("#searchDetailName").val(),
		"pageNo":currentPage,
		"pageSize":pagePerRows,
		"onlyMyself":($("#myInfoCheck").attr("checked") == "checked" ? "Y":"N")
	};
	doAjax(params);
}

function getListRootCallback(obj){

	clearTableRows("tblListRoot");
	addTableRows("tblListRoot", obj.outData);
	
	totalPage = obj.totalCnt;
	$("#totalListDiv").html(getFormattedValue(totalPage,"price"));

	var params = {"viewid":"pagingDiv", "function":"getListRoot", "currentpage":currentPage, "rows":pagePerRows, "total": totalPage, "noresize": "false"};
	drawPaging(params);

}

function setRootParent(tableId, idx) {
	MtsMessage.popup("MSG_4_007", function(){
		var selectedUserId = getTableData(tableId, idx, "userId");
		var selectedSeqCd = getTableData(tableId, idx, "seqCd");
		var params = {"userId": selectedUserId, "seqCd":selectedSeqCd};
			
		top.mainContentsFrame.contentWindow.addDayRootByPopup(params);
		closePopup(POPUP_LAYER);
	});
}