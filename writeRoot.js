var templateDay;
var templateDayLine;
var templateDayItem;
var templatePrePay;
var indexDay = 0;
var indexSelect = 0;
var previewObject; 
var selectedObject;
var reportPage = "P1";

$(document).ready(function() {
	mapZoom = 6;
	initSrMap(undefined, undefined, false, true);
	mapZoom = 8;

	initValues();
	resizeMainContents();
	
	$("#addRootBtn").unbind("click");
	$("#addRootBtn").bind("click", function(){
		addRootDay();
	});
	$("#deleteRootBtn").unbind("click");
	$("#deleteRootBtn").bind("click", function(){
		deleteRootDay();
	});
	$("#changeRootBtn").unbind("click");
	$("#changeRootBtn").bind("click", function(){
		changeRootDay();
	});
	$("#addRootGroupBtn").unbind("click");
	$("#addRootGroupBtn").bind("click", function(){
		addRootGroup();
	});
	$("#tempSaveBtn").unbind("click");
	$("#tempSaveBtn").bind("click", function(){
		saveRoot("T");
	});
	$("#completeBtn").unbind("click");
	$("#completeBtn").bind("click", function(){
		saveRoot("S");
	});
	
	if (reqSeqCd != VALUE_BLANK){
		$("#pageTitleName").html("여행일정 수정");
		setDayRoot();
	}
});

/**
 * 초기값 설정
 */
function initValues(){
	
	for (var i=2015; i<2100; i++){
		$("#startYear").append("<option value='" + i + "'>" + i + "</option>");
	}
	for (var i=1; i<13; i++){
		$("#startMonth").append("<option value='" + (i<10 ? "0"+i:i) + "'>" + i + "</option>");
	}
	for (var i=1; i<32; i++){
		$("#startDay").append("<option value='" + (i<10 ? "0"+i:i) + "'>" + i + "</option>");
	}
	for (var i=0; i<24; i++){
		$("#selectHour").append("<option value='" + (i<10 ? "0"+i:i) + "'>" + i + "</option>");
	}
	for (var i=0; i<60; i++){
		$("#selectMinute").append("<option value='" + (i<10 ? "0"+i:i) + "'>" + i + "</option>");
	}
	templateDay = $("#templateDay").html();
	$("#templateDay").remove();
	templateDayLine = $("#templateDayLine").html();
	$("#templateDayLine").remove();
	templateDayItem = $("#templateItem").html();
	$("#templateItem").remove();
	templatePrePay = $("#prePayDiv").html();

	var today      = new Date(); 
    var todayd     = today.getDate() < 10 ? "0"+today.getDate():VALUE_BLANK+today.getDate(); 
    var todaym     = (today.getMonth() + 1 < 10) ? "0"+(today.getMonth() + 1):VALUE_BLANK+(today.getMonth() + 1); 
    var todayy     = today.getYear() < 1900 ? today.getYear() + 1900:today.getYear(); 
    $("#startYear").val(todayy);
    $("#startMonth").val(todaym);
    $("#startDay").val(todayd);
}

/**
 * 일정 추가
 */
function addRootDay(){
	var checkedDayCnt = $("#rootMainDiv div[name=dayDiv] #chkDayRoot:checked").length;
	
	if (checkedDayCnt > 1){
		MtsMessage.popup("MSG_3_014");
		return;
	} else if (checkedDayCnt == 0){
		if ($("div[name=dayRootContents]").length > 0) {
			$("#rootMainDiv").append(templateDayLine);
		}
		$("#rootMainDiv").append("<div name='dayDiv'>" + templateDay + "</div>");
	} else {
		$("#rootMainDiv div[name=dayDiv] #chkDayRoot:checked").parent().parent().parent().after("<div name='dayDiv'>" + templateDay + "</div>");
		$("#rootMainDiv div[name=dayDiv] #chkDayRoot:checked").parent().parent().parent().after(templateDayLine);
	}
	
	setRootDayAll();
	setSelectBoxAll();
	setMaskAll();
	calcTotalAmtAll();
	resizeMainContents();
}

/**
 * 일정 삭제
 */
function deleteRootDay(){
	var isCheckedDayRoot = false;
	
	for (var idx=0; idx<$("div[name=dayDiv]").length; idx++){
		if ($("#chkDayRoot", $("div[name=dayDiv]:eq(" + idx + ")")).attr("checked") != undefined 
			&& $("#chkDayRoot", $("div[name=dayDiv]:eq(" + idx + ")")).attr("checked") == "checked"){
			isCheckedDayRoot = true;
		}
	}
	
	if ($("div[name=dayDiv]").length == 0){
		MtsMessage.popup("MSG_2_007");
		return;
	}
	if (!isCheckedDayRoot){
		MtsMessage.popup("MSG_2_008");
		return;
	}
	
	MtsMessage.popup("MSG_4_001", function(){
		var realIndex = 0;
		var len = $("div[name=dayDiv]").length;
		
		for (var idx=0; idx<len; idx++){
			if ($("#chkDayRoot", $("div[name=dayDiv]:eq(" + realIndex + ")")).attr("checked") != undefined 
				&& $("#chkDayRoot", $("div[name=dayDiv]:eq(" + realIndex + ")")).attr("checked") == "checked"){
				$("div[name=dayDiv]:eq(" + realIndex + ")").detach();
				if (idx == len-1 && realIndex-1 >= 0){
					$("div[name=dayRootLine]:eq(" + (realIndex-1) + ")").detach();
				} else {
					$("div[name=dayRootLine]:eq(" + realIndex + ")").detach();
				}
			} else {
				realIndex++;
			}
		}
		
		setRootDayAll();
		setSelectBoxAll();
		calcTotalAmtAll();
		resizeMainContents();
		
	});
}

/**
 * 일정 순서 변경
 */
function changeRootDay(){
	var checkedDayCnt = $("#rootMainDiv div[name=dayDiv] #chkDayRoot:checked").length;
	var dayRootLine = $("#rootMainDiv div[name=dayDiv] #chkDayRoot:checked:eq(1)").parent().parent().parent().prev();
	
	if (checkedDayCnt != 2){
		MtsMessage.popup("MSG_3_015");
		return;
	}
	
	$("#rootMainDiv div[name=dayDiv] #chkDayRoot:checked:eq(0)").parent().parent().parent().after($("#rootMainDiv div[name=dayDiv] #chkDayRoot:checked:eq(1)").parent().parent().parent());
	$(dayRootLine).after($("#rootMainDiv div[name=dayDiv] #chkDayRoot:checked:eq(0)").parent().parent().parent());

	setRootDayAll();
	setSelectBoxAll();
	setMaskAll();
	calcTotalAmtAll();
	resizeMainContents();
	
}

/**
 * 작성된 루트 추가
 */
function addRootGroup(){
	var params = {
			"url":"selectRootPopup.do",
			"mode": POPUP_LAYER,
			"width": 640,
			"height": 500
	};
	openPopup(params);
}

/**
 * 일정 일차 자동 설정
 */
function setRootDayAll(){
	
	$.each($("span[name=dayText]"), function(idx, valObj){
		$(valObj).html((idx+1) + "일차");
	});
}

/**
 * 일정내 모든 select 이벤트 처리
 */
function setSelectBoxAll(){
	$.each($("div[name=dayDiv]"), function(idxDay, valObj1){
		$.each($("select[name=selectArea]", $(valObj1)), function(idx, valObj2){
			$(valObj2).unbind("change");
			$(valObj2).bind("change", function(){
				setNationCombo(idxDay, idx);
			});
		});
		$.each($("select[name=selectNation]", $(valObj1)), function(idx, valObj2){
			$(valObj2).unbind("change");
			$(valObj2).bind("change", function(){
				setCityCombo(idxDay, idx);
			});
		});
		$.each($("select[name=selectCity]", $(valObj1)), function(idx, valObj2){
			$(valObj2).unbind("change");
			$(valObj2).bind("change", function(){
				setSeeInfoCombo(idxDay, idx);
			});
		});
		$.each($("select[name=selectDest]", $(valObj1)), function(idx, valObj2){
			$(valObj2).unbind("change");
			$(valObj2).bind("change", function(){
				setAutoSetFeeBySeeInfoCombo(idxDay, idx);
			});
		});
		$("select[name=selectStayGubun]", $(valObj1)).unbind("change");
		$("select[name=selectStayGubun]", $(valObj1)).bind("change", function(){
			setStayInfoCombo(idxDay);
		});
	});
}

/**
 * 일정내 나라 combo 설정
 * @param idxDay
 * @param idxSelect
 */
function setNationCombo(idxDay, idxSelect){
	if ($("div[name=dayDiv]:eq(" + idxDay + ") select[name=selectArea]:eq(" + idxSelect +")").val() != VALUE_BLANK) {
		var params = {
			"url":"getNationList.do", 
			"callback":"setNationComboCallback", 
			"validate" : "false",
			"paramonly":"true", 
			"aCode":$("div[name=dayDiv]:eq(" + idxDay + ") select[name=selectArea]:eq(" + idxSelect +")").val()
		};
		indexDay = idxDay;
		indexSelect = idxSelect;
		doAjax(params);
	} else {
		$("div[name=dayDiv]:eq(" + idxDay + ") select[name=selectNation]:eq(" + idxSelect +")").html("<option value=\"\">▶ 나라선택</option>");
		$("div[name=dayDiv]:eq(" + idxDay + ") select[name=selectCity]:eq(" + idxSelect +")").html("<option value=\"\">▶ 도시선택</option>");
		$("div[name=dayDiv]:eq(" + idxDay + ") select[name=selectDest]:eq(" + idxSelect +")").html("<option value=\"\">▶ 볼거리 선택</option>");
	}

}

/**
 * 일정내 나라 combo callback
 * @param obj
 */
function setNationComboCallback(obj) {
	
	var comboHtml = "<option value=\"\">▶ 나라선택</option>";

	$.each(obj.outData, function(idx, valObj){
		comboHtml += "<option value=\""+ valObj.nationCd + "\" style=\"color:"+ getDangerColor(valObj.dangerCd) +";\" title=\"" + getDangerText(valObj.dangerCd) + "\">" +  valObj.name + "</option>";
	});
	
	$("div[name=dayDiv]:eq(" + indexDay + ") select[name=selectNation]:eq(" + indexSelect +")").html(comboHtml);
	
	if ($("div[name=dayDiv]:eq(" + indexDay + ") select[name=selectArea]:eq(" + indexSelect +")").val() == "ANT" || $("div[name=dayDiv]:eq(" + indexDay + ") select[name=selectArea]:eq(" + indexSelect +")").val() == "ART") {
		$("div[name=dayDiv]:eq(" + indexDay + ") select[name=selectNation]:eq(" + indexSelect +")").attr("disabled","disabled");
		$("div[name=dayDiv]:eq(" + indexDay + ") select[name=selectCity]:eq(" + indexSelect +")").attr("disabled","disabled");
	} else {
		$("div[name=dayDiv]:eq(" + indexDay + ") select[name=selectNation]:eq(" + indexSelect +")").removeAttr("disabled");
		$("div[name=dayDiv]:eq(" + indexDay + ") select[name=selectCity]:eq(" + indexSelect +")").removeAttr("disabled");
	}

	setCityCombo(indexDay, indexSelect);
}

/**
 * 일정내 도시 combo 설정
 * @param idxDay
 * @param idxSelect
 */
function setCityCombo(idxDay, idxSelect){
	if ($("div[name=dayDiv]:eq(" + idxDay + ") select[name=selectNation]:eq(" + idxSelect +")").val() != VALUE_BLANK) {
		var params = {
			"url":"getCityList.do", 
			"callback":"setCityComboCallback", 
			"validate" : "false",
			"paramonly":"true", 
			"aCode":$("div[name=dayDiv]:eq(" + idxDay + ") select[name=selectArea]:eq(" + idxSelect +")").val(), 
			"nCode":$("div[name=dayDiv]:eq(" + idxDay + ") select[name=selectNation]:eq(" + idxSelect +")").val()
		};
		indexDay = idxDay;
		indexSelect = idxSelect;
		doAjax(params);
	} else {
		$("div[name=dayDiv]:eq(" + idxDay + ") select[name=selectCity]:eq(" + idxSelect +")").html("<option value=\"\">▶ 도시선택</option>");
		$("div[name=dayDiv]:eq(" + idxDay + ") select[name=selectDest]:eq(" + idxSelect +")").html("<option value=\"\">▶ 볼거리 선택</option>");
	}
}

/**
 * 일정내 도시 combo callback
 * @param obj
 */
function setCityComboCallback(obj) {
	
	var comboHtml = "<option value=\"\">▶ 도시선택</option>";

	$.each(obj.outData, function(idx, valObj){
		comboHtml += "<option value=\""+ valObj.cityCd + "\" lat=\"" + valObj.lat + "\" lng=\"" + valObj.lng + "\">" +  valObj.name + " ("+ valObj.ename+ ")</option>";
	});
	
	$("div[name=dayDiv]:eq(" + indexDay + ") select[name=selectCity]:eq(" + indexSelect +")").html(comboHtml);
	
	setSeeInfoCombo(indexDay, indexSelect);
}

/**
 * 일정내 볼거리 combo 설정
 * @param idxDay
 * @param idxSelect
 */
function setSeeInfoCombo(idxDay, idxSelect){
	if ($("div[name=dayDiv]:eq(" + idxDay + ") select[name=selectCity]:eq(" + idxSelect +")").val() != VALUE_BLANK) {
		var params = {
			"url":"getSeeAndFoodCombo.do", 
			"callback":"setSeeInfoComboCallback", 
			"validate" : "false",
			"paramonly":"true", 
			"aCode":$("div[name=dayDiv]:eq(" + idxDay + ") select[name=selectArea]:eq(" + idxSelect +")").val(), 
			"nCode":$("div[name=dayDiv]:eq(" + idxDay + ") select[name=selectNation]:eq(" + idxSelect +")").val(),
			"cCode":$("div[name=dayDiv]:eq(" + idxDay + ") select[name=selectCity]:eq(" + idxSelect +")").val(),
			"inGubun":VALUE_BLANK,
			"inText":VALUE_BLANK,
			"pageNo":1,
			"pageSize":99999,
			"onlyMyself":"N"
		};
		indexDay = idxDay;
		indexSelect = idxSelect;
		doAjax(params);
	} else {
		$("div[name=dayDiv]:eq(" + idxDay + ") select[name=selectDest]:eq(" + idxSelect +")").html("<option value=\"\">▶ 볼거리 선택</option>");
	}
}

/**
 * 일정내 볼거리/먹거리 combo callback
 * @param obj
 */
function setSeeInfoComboCallback(obj) {
	
	var comboHtml = "<option value=\"\" style=\"color:#0000ff;\">▶ 볼거리 선택</option>";
	
	$.each(obj.outData, function(idx, valObj){
		comboHtml += "<option value=\""+ valObj.seqCd + "\" gubunDest=\"LI\" lat=\"" + valObj.lat + "\" lng=\"" + valObj.lng + "\" feeAmt=\"" + (valObj.feeAmt ==null ? VALUE_BLANK:valObj.feeAmt) + "\" feeCurrency=\"" + valObj.feeCurrency + "\">" +  valObj.seeName + "</option>";
	});
	
	if (obj.outDataFood != undefined && obj.outDataFood.length > 0) {
		comboHtml += "<option value=\"\" style=\"color:#0000ff;\">▶ 먹거리 선택</option>";
		$.each(obj.outDataFood, function(idx, valObj){
			comboHtml += "<option value=\""+ valObj.seqCd + "\" gubunDest=\"FI\" lat=\"" + valObj.lat + "\" lng=\"" + valObj.lng + "\" feeAmt=\"\" feeCurrency=\"" + userCurrency + "\">" +  valObj.foodName + "(" + valObj.shopName + ")" + "</option>";
		});
	}

	$("div[name=dayDiv]:eq(" + indexDay + ") select[name=selectDest]:eq(" + indexSelect +")").html(comboHtml);

	var lastIndexOfPath = $("div[name=dayDiv]:eq(" + indexDay + ") select[name=selectCity]").length;

	if (lastIndexOfPath-1 == indexSelect){
		setStayInfoCombo(indexDay);
	}
}

/**
 * 볼거리 설정시 입장료 자동 세팅
 * @param idxDay
 * @param idxSelect
 */
function setAutoSetFeeBySeeInfoCombo(idxDay, idxSelect){

	if ($("div[name=dayDiv]:eq(" + idxDay + ") table[name=pathTable]:eq(" + idxSelect + ") #selectDest option:selected").attr("feeAmt") != undefined &&
		$("div[name=dayDiv]:eq(" + idxDay + ") table[name=pathTable]:eq(" + idxSelect + ") #selectDest option:selected").attr("feeAmt") != VALUE_BLANK) {
		$("div[name=dayDiv]:eq(" + idxDay + ") table[name=pathTable]:eq(" + idxSelect + ") #seePay").val($("div[name=dayDiv]:eq(" + idxDay + ") table[name=pathTable]:eq(" + idxSelect + ") #selectDest option:selected").attr("feeAmt"));
		$("div[name=dayDiv]:eq(" + idxDay + ") table[name=pathTable]:eq(" + idxSelect + ") #currencyCombo").val($("div[name=dayDiv]:eq(" + idxDay + ") table[name=pathTable]:eq(" + idxSelect + ") #selectDest option:selected").attr("feeCurrency"));
	} else {
		$("div[name=dayDiv]:eq(" + idxDay + ") table[name=pathTable]:eq(" + idxSelect + ") #seePay").val(VALUE_BLANK);
		$("div[name=dayDiv]:eq(" + idxDay + ") table[name=pathTable]:eq(" + idxSelect + ") #currencyCombo").val(userCurrency);
	}
	if ($("div[name=dayDiv]:eq(" + idxDay + ") table[name=pathTable]:eq(" + idxSelect + ") #selectDest").val() != VALUE_BLANK && idxSelect > 0){
		calcMovePath($("div[name=dayDiv]:eq(" + idxDay + ") div[name=dayItemRoot]:eq(" + (idxSelect-1) + ") #moveCheckBtnItem"));
	}
	calcTotalAmtAll();
}

/**
 * 일정내 숙소 combo 설정
 * @param idxDay
 * @param idxSelect
 */
function setStayInfoCombo(idxDay, idxSelect){
	
	closeStayInfoPopup($("div[name=dayDiv]:eq(" + idxDay + ") a[name=stayPreviewBtn]:eq(1)"));
	
	if ($("div[name=dayDiv]:eq(" + idxDay + ") select[name=selectStayGubun]").val() != VALUE_BLANK) {

		var stayCode = VALUE_BLANK;
		
		$.each($("div[name=dayDiv]:eq(" + idxDay + ") select[name=selectCity]"), function(idx, valObj){
			stayCode += 
				$("div[name=dayDiv]:eq(" + idxDay + ") select[name=selectArea]:eq(" + idx + ")").val()
				+$("div[name=dayDiv]:eq(" + idxDay + ") select[name=selectNation]:eq(" + idx + ")").val()
				+$("div[name=dayDiv]:eq(" + idxDay + ") select[name=selectCity]:eq(" + idx + ")").val()
				+",";
		});
		
		if ($("div[name=dayDiv]").length > idxDay + 1){
			$.each($("div[name=dayDiv]:eq(" + (idxDay+1) + ") select[name=selectCity]"), function(idx, valObj){
				stayCode += 
					$("div[name=dayDiv]:eq(" + (idxDay+1) + ") select[name=selectArea]:eq(" + idx + ")").val()
					+$("div[name=dayDiv]:eq(" + (idxDay+1) + ") select[name=selectNation]:eq(" + idx + ")").val()
					+$("div[name=dayDiv]:eq(" + (idxDay+1) + ") select[name=selectCity]:eq(" + idx + ")").val()
					+",";
			});
		}
		
		if (stayCode.length > 0){
			stayCode = stayCode.substring(0, stayCode.length - 1);
		}
		
		var params = {
			"url":"getInfoStayListRootCombo.do",
			"callback":"setStayInfoComboCallback",
			"validate" : "false",
			"paramonly":"true",
			"stayCode":stayCode, 
			"stayGubun":$("div[name=dayDiv]:eq(" + idxDay + ") select[name=selectStayGubun]").val(),
			"inGubun":VALUE_BLANK,
			"inText":VALUE_BLANK,
			"pageNo":1,
			"pageSize":99999,
			"onlyMyself":"N"
		};
		indexDay = idxDay;
		doAjax(params);

	} else {
		$("div[name=dayDiv]:eq(" + idxDay + ") select[name=selectStay]").html("<option value=\"\">▶ 숙박업체 선택</option>");
	}
}

/**
 * 일정내 숙소 combo callback
 * @param obj
 */
function setStayInfoComboCallback(obj) {
	var comboHtml = "<option value=\"\">▶ 숙박업체 선택</option>";

	$.each(obj.outData, function(idx, valObj){
		comboHtml += "<option areaCd=\""+ valObj.areaCd + "\" nationCd=\""+ valObj.nationCd + "\" cityCd=\""+ valObj.cityCd + "\" lat=\"" + valObj.lat + "\" lng=\"" + valObj.lng + "\" value=\""+ valObj.seqCd + "\">" +  valObj.stayName + " (" + valObj.cityName + ")</option>";
	});
	$("div[name=dayDiv]:eq(" + indexDay + ") select[name=selectStay]").html(comboHtml);
	
	$("div[name=dayDiv]:eq(" + indexDay + ") select[name=selectStay]").unbind("change");
	$("div[name=dayDiv]:eq(" + indexDay + ") select[name=selectStay]").bind("change", function(){
		if ($("div[name=dayDiv]:eq(" + indexDay + ") a[name=stayPreviewBtn]:eq(1)").css("display") != "none"){
			openStayInfoPopup($("div[name=dayDiv]:eq(" + indexDay + ") a[name=stayPreviewBtn]:eq(0)"));
		} else {
			closeStayInfoPopup($("div[name=dayDiv]:eq(" + indexDay + ") a[name=stayPreviewBtn]:eq(1)"));
		}
	});
	
}

/**
 * 일정내 경로 위와 변경
 * @param obj
 */
function upDayItem(obj){
	var tableArray = $("table",$(obj).parent().parent().parent().parent().parent());
	var idx = $(tableArray).index($(obj).parent().parent().parent().parent());
	
	if (idx > 0){
		$("table:eq("+(idx-1)+")",$(obj).parent().parent().parent().parent().parent()).after($("table:eq("+idx+")",$(obj).parent().parent().parent().parent().parent()));
		$("div[name=dayItemRoot]:eq("+(idx-1)+")",$(obj).parent().parent().parent().parent().parent()).after($("table:eq("+(idx-1)+")",$(obj).parent().parent().parent().parent().parent()));
		setSelectBoxAll();
	}
}

/**
 * 일정내 경로 아래와 변경
 * @param obj
 */
function downDayItem(obj){
	var tableArray = $("table",$(obj).parent().parent().parent().parent().parent());
	var idx = $(tableArray).index($(obj).parent().parent().parent().parent());
	
	if (idx < tableArray.length -1){
		$("table:eq("+idx+")",$(obj).parent().parent().parent().parent().parent()).after($("table:eq("+(idx+1)+")",$(obj).parent().parent().parent().parent().parent()));
		$("div[name=dayItemRoot]:eq("+idx+")",$(obj).parent().parent().parent().parent().parent()).after($("table:eq("+idx+")",$(obj).parent().parent().parent().parent().parent()));
		setSelectBoxAll();
	}
}

/**
 * 일정내 경로 추가
 * @param obj
 */
function addDayItem(obj){
	var tableArray = $("table",$(obj).parent().parent().parent().parent().parent());
	var idx = $(tableArray).index($(obj).parent().parent().parent().parent());
	var tempHtml = $("table:eq(0)",$(templateDay));
	
	if (tableArray.length >= 50){
		MtsMessage.popup("MSG_3_002");
		return;
	}
	
	$(tempHtml).insertAfter($("table:eq("+idx+")",$(obj).parent().parent().parent().parent().parent()));
	$(templateDayItem).insertAfter($("table:eq("+idx+")",$(obj).parent().parent().parent().parent().parent()));
	
	// 카피source 설정값 세팅 start
	var hourSelectedValue = $("table:eq("+idx+") #selectHour option:selected",$(obj).parent().parent().parent().parent().parent()).val();
	var minuteSelectedValue = $("table:eq("+idx+") #selectMinute option:selected",$(obj).parent().parent().parent().parent().parent()).val();
	var selectAreaValue = $("table:eq("+idx+") #selectArea option:selected",$(obj).parent().parent().parent().parent().parent()).val();
	var selectNationValue = $("table:eq("+idx+") #selectNation option:selected",$(obj).parent().parent().parent().parent().parent()).val();
	var selectCityValue = $("table:eq("+idx+") #selectCity option:selected",$(obj).parent().parent().parent().parent().parent()).val();
	var currencyValue = $("table:eq("+idx+") #currencyCombo option:selected",$(obj).parent().parent().parent().parent().parent()).val();
	$("table:eq("+(idx+1)+") #selectHour",$(obj).parent().parent().parent().parent().parent()).val(hourSelectedValue);
	$("table:eq("+(idx+1)+") #selectMinute",$(obj).parent().parent().parent().parent().parent()).val(minuteSelectedValue);
	$("table:eq("+(idx+1)+") #selectArea",$(obj).parent().parent().parent().parent().parent()).val(selectAreaValue);
	$("table:eq("+(idx+1)+") #selectNation",$(obj).parent().parent().parent().parent().parent()).html(
		$("table:eq("+idx+") #selectNation",$(obj).parent().parent().parent().parent().parent()).html()
	);
	$("table:eq("+(idx+1)+") #selectNation",$(obj).parent().parent().parent().parent().parent()).val(selectNationValue);
	$("table:eq("+(idx+1)+") #selectCity",$(obj).parent().parent().parent().parent().parent()).html(
		$("table:eq("+idx+") #selectCity",$(obj).parent().parent().parent().parent().parent()).html()
	);
	$("table:eq("+(idx+1)+") #selectCity",$(obj).parent().parent().parent().parent().parent()).val(selectCityValue);
	$("table:eq("+(idx+1)+") #selectDest",$(obj).parent().parent().parent().parent().parent()).html(
		$("table:eq("+idx+") #selectDest",$(obj).parent().parent().parent().parent().parent()).html()
	);
	$("table:eq("+(idx+1)+") #currencyCombo",$(obj).parent().parent().parent().parent().parent()).val(currencyValue);
	// 카피source 설정값 세팅 end
	
	setSelectBoxAll();
	setMaskAll();
	calcTotalAmtAll();
	resizeMainContents();
}

/**
 * 일정내 경로 삭제
 * @param obj
 */
function deleteDayItem(obj){
	var tableArray = $("table",$(obj).parent().parent().parent().parent().parent());
	var idx = $(tableArray).index($(obj).parent().parent().parent().parent());
	
	if (tableArray.length > 1 || idx > 0){
		if (idx == 0){
			$("div[name=dayItemRoot]:eq("+idx+")",$(obj).parent().parent().parent().parent().parent()).detach();
		} else {
			$("div[name=dayItemRoot]:eq("+(idx-1)+")",$(obj).parent().parent().parent().parent().parent()).detach();
			if ($("div[name=dayItemRoot]:eq("+(idx-1)+")",$(obj).parent().parent().parent().parent().parent()).html() != undefined){
				$("div[name=dayItemRoot]:eq("+(idx-1)+") #selectMoveGubunItem option:eq(5)",$(obj).parent().parent().parent().parent().parent()).attr("selected","selected");
				$("div[name=dayItemRoot]:eq("+(idx-1)+") #moveDistanceItem",$(obj).parent().parent().parent().parent().parent()).val("");
				$("div[name=dayItemRoot]:eq("+(idx-1)+") #moveDistanceGubunItem option:eq(1)",$(obj).parent().parent().parent().parent().parent()).attr("selected","selected");
				$("div[name=dayItemRoot]:eq("+(idx-1)+") #moveHourItem",$(obj).parent().parent().parent().parent().parent()).val("");
				$("div[name=dayItemRoot]:eq("+(idx-1)+") #moveMinuteItem",$(obj).parent().parent().parent().parent().parent()).val("");
				$("div[name=dayItemRoot]:eq("+(idx-1)+") #movePayItem",$(obj).parent().parent().parent().parent().parent()).val("");
				$("div[name=dayItemRoot]:eq("+(idx-1)+") #currencyCombo",$(obj).parent().parent().parent().parent().parent()).val(userCurrency);
			}
		}
		$("table:eq("+idx+")",$(obj).parent().parent().parent().parent().parent()).detach();
		setSelectBoxAll();
		calcTotalAmtAll();
		resizeMainContents();
	}
}

/**
 * 준비물 추가
 * @param obj
 */
function addPrePay(obj){
	var tableArray = $("table",$(obj).parent().parent().parent().parent().parent());
	var idx = $(tableArray).index($(obj).parent().parent().parent().parent());
	
	if($("input[name=preItems]").length >= 30){
		MtsMessage.popup("MSG_3_001");
		return;
	}
	
	$(templatePrePay).insertAfter($("table:eq("+idx+")",$(obj).parent().parent().parent().parent().parent()));
	
	setMaskAll();
	calcTotalAmtAll();
	resizeMainContents();
}

/**
 * 준비물 삭제
 * @param obj
 */
function deletePrePay(obj){
	var tableArray = $("table",$(obj).parent().parent().parent().parent().parent());
	var idx = $(tableArray).index($(obj).parent().parent().parent().parent());
	
	if (tableArray.length > 1 || idx > 0){
		$("table:eq("+idx+")",$(obj).parent().parent().parent().parent().parent()).detach();
	}
	resizeMainContents();
}

/**
 * 루트 임시저장(T) / 완료(S)
 * @param inStatus
 */
function saveRoot(inStatus){

	// 임시저장, 루트완성 동시체크 항목
	if ($("#rootName").val() == VALUE_BLANK){
		MtsMessage.popup("MSG_2_000","루트명", function(){
			$("#rootName").focus();
		});
		return;
	}

	if (stringLength($("#rootName").val()) > $("#rootName").attr("maxlength")){
		MtsMessage.popup("MSG_2_004","루트명", $("#rootName").attr("maxlength"), stringLength($("#rootName").val()), function(){
			$("#rootName").focus();
		});
		return;
	}
	
	// 루트완성 처리시 체크 사항
	if (inStatus == "S" && !validateRoot()){
		return;
	}
	
	MtsMessage.popup("MSG_4_002", function(){
		var params = {
			"url"             : "saveRootInfo.do",
			"callback"        : "saveRootCallback",
			"paramonly"       : "true",
			"reqUserId"       : reqUserId,
			"reqSeqCd"        : reqSeqCd,
			"rootName"        : $("#rootName").val(),
			"startDate"       : ($("#startYear").val() + $("#startMonth").val() + $("#startDay").val()),
			"memberCnt"       : getUnformattedValue($("#memberCnt").val(), $("#memberCnt").attr("mask")),
			"status"          : inStatus,
			"prepareList"     : getPrepareList(),
			"dayItemList"     : getDayItemList(),
			"dayItemRootList" : getDayItemRootList()
		};
		doAjax(params);		
	});
	
}

/**
 * saveRoot callback
 * @param obj
 */
function saveRootCallback(obj){

	if (obj.status == "S"){
		MtsMessage.popup("MSG_5_003", function(){
			if (obj.outDataLogin != undefined) {
				top.setUserInfo(obj);
				top.animatePoint(parseInt(obj.score), linkListRoot);
			} else {
				linkListRoot();
			}
		});
	} else {
		MtsMessage.popup("MSG_5_000", function(){
			if (obj.outDataLogin != undefined) {
				top.setUserInfo(obj);
				top.animatePoint(parseInt(obj.score), linkListRoot);
			} else {
				//linkListRoot();
			}
		});
	}

}

function linkListRoot(){
	showMainContents("listRoot.do");
}

function validateRoot(){
	var errorFlag = false;

	// 여행 인원수 체크
	if ($("#memberCnt").val() == VALUE_BLANK){
		MtsMessage.popup("MSG_2_010", function(){
			$("#memberCnt").focus();
		});
		return false;
	}

	// 준비물 항목만 입력한 경우 에러처리
	$.each($("input[name=preItems]"), function(idx, valObj){
		if (!errorFlag && $(valObj).val() != VALUE_BLANK && $("input[name=preIPays]:eq(" + idx + ")").val() == VALUE_BLANK){
			MtsMessage.popup("MSG_2_011", function(){
				$("input[name=preIPays]:eq(" + idx + ")").focus();
			});
			errorFlag = true;
		}
		if (!errorFlag && $(valObj).val() != VALUE_BLANK && stringLength($(valObj).val()) > $(valObj).attr("maxlength")){
			MtsMessage.popup("MSG_2_004",$("td:eq(0)", $(valObj).parent().parent()).text(), $(valObj).attr("maxlength"), stringLength($(valObj).val()), function(){
				$(valObj).focus();
			});
			errorFlag = true;
		}
	});
	$.each($("table[name=pathTable]"), function(idx, valObj){
		if (!errorFlag && $("#selectArea", $(valObj)).val() != VALUE_BLANK){
			if (!errorFlag && $("#selectNation", $(valObj)).val() == VALUE_BLANK){
				MtsMessage.popup("MSG_2_013","나라", function(){
					$("#selectNation", $(valObj)).focus();
				});
				errorFlag = true;
			}
			if (!errorFlag && $("#selectCity", $(valObj)).val() == VALUE_BLANK){
				MtsMessage.popup("MSG_2_013","도시", function(){
					$("#selectCity", $(valObj)).focus();
				});
				errorFlag = true;
			}
			if (!errorFlag && $("#selectDest", $(valObj)).val() == VALUE_BLANK){
				MtsMessage.popup("MSG_2_013","볼거리/먹거리", function(){
					$("#selectDest", $(valObj)).focus();
				});
				errorFlag = true;
			}
		}
	});
	$.each($("input[name=moveDistanceDay]"), function(idx, valObj){
		if (!errorFlag && $(valObj).val() != VALUE_BLANK && stringLength($(valObj).val()) > $(valObj).attr("maxlength")){
			MtsMessage.popup("MSG_2_004","이동거리",$(valObj).attr("maxlength"), stringLength($(valObj).val()), function(){
				$(valObj).focus();
			});
			errorFlag = true;
		}
	});
	$.each($("input[name=moveDistanceItem]"), function(idx, valObj){
		if (!errorFlag && $(valObj).val() != VALUE_BLANK && stringLength($(valObj).val()) > $(valObj).attr("maxlength")){
			MtsMessage.popup("MSG_2_004","이동거리",$(valObj).attr("maxlength"), stringLength($(valObj).val()), function(){
				$(valObj).focus();
			});
			errorFlag = true;
		}
	});
	
	if (errorFlag){
		return false;
	}
	
	// 최소 1일 이상의 일정을 추가해야한다.
	if ($("div[name=dayDiv]").length < 1){
		MtsMessage.popup("MSG_2_012");
		return false;
	}
	
	return true;
}
/**
 * 준비물 리스트 조합
 * @returns
 */
function getPrepareList(){
	var rets = VALUE_BLANK;
	
	$.each($("input[name=preItems]"), function(idx, valObj){
		rets += $(valObj).val() + _colSep;
		rets += getUnformattedValue($("input[name=preIPays]:eq(" + idx + ")").val(), $("input[name=preIPays]:eq(" + idx + ")").attr("mask")) + _colSep;
		rets += $("select[name=currencyCombo]:eq(" + idx + ")").val() + _rowSep;
	});
	
	if (rets.length > 0){
		rets = rets.substring(0,rets.length - 3);
	}
	
	return rets;
}

function getDayItemList(){
	var rets = VALUE_BLANK;

	$.each($("div[name=dayRootContents]"), function(idx, valObj){
		rets += (idx + 1) + _colSep;
		rets += ($("#selectStay option:selected", $(valObj)).attr("areaCd") == undefined ? VALUE_BLANK:$("#selectStay option:selected", $(valObj)).attr("areaCd")) + _colSep;
		rets += ($("#selectStay option:selected", $(valObj)).attr("nationCd") == undefined ? VALUE_BLANK:$("#selectStay option:selected", $(valObj)).attr("nationCd")) + _colSep;
		rets += ($("#selectStay option:selected", $(valObj)).attr("cityCd") == undefined ? VALUE_BLANK:$("#selectStay option:selected", $(valObj)).attr("cityCd")) + _colSep;
		rets += $("#selectStay option:selected", $(valObj)).val() + _colSep;
		rets += getUnformattedValue($("#stayPay", $(valObj)).val(), $("#stayPay", $(valObj)).attr("mask")) + _colSep;
		rets += $("#dayItemDetail select[name=currencyCombo]:eq(0)", $(valObj)).val() + _colSep;
		rets += $("#dayItemDetail #addPayText", $(valObj)).val() + _colSep;
		rets += getUnformattedValue($("#dayItemDetail #addPay", $(valObj)).val(), $("#dayItemDetail #addPay", $(valObj)).attr("mask")) + _colSep;
		rets += $("#dayItemDetail select[name=currencyCombo]:eq(1)", $(valObj)).val() + _colSep;
		
		if (idx < $("div[name=dayRootLine]").length){
			rets += $("div[name=dayRootLine]:eq(" + idx + ") #selectMoveGubunDay").val() + _colSep;
			rets += $("div[name=dayRootLine]:eq(" + idx + ") #moveDistanceDay").val() + _colSep;
			rets += $("div[name=dayRootLine]:eq(" + idx + ") #moveDistanceGubunDay").val() + _colSep;
			rets += $("div[name=dayRootLine]:eq(" + idx + ") #moveHourDay").val() + _colSep;
			rets += $("div[name=dayRootLine]:eq(" + idx + ") #moveMinuteDay").val() + _colSep;
			rets += getUnformattedValue($("div[name=dayRootLine]:eq(" + idx + ") #movePayDay").val(), $("div[name=dayRootLine]:eq(" + idx + ") #movePayDay").attr("mask")) + _colSep;
			rets += $("div[name=dayRootLine]:eq(" + idx + ") select[name=currencyCombo]:eq(0)").val() + _rowSep;
		} else {
			rets += VALUE_BLANK + _colSep;
			rets += VALUE_BLANK + _colSep;
			rets += VALUE_BLANK + _colSep;
			rets += VALUE_BLANK + _colSep;
			rets += VALUE_BLANK + _colSep;
			rets += VALUE_BLANK + _colSep;
			rets += VALUE_BLANK + _rowSep;
		}
	});

	if (rets.length > 0){
		rets = rets.substring(0,rets.length - 3);
	}

	return rets;
}

function getDayItemRootList(){
	var rets = VALUE_BLANK;
	
	$.each($("div[name=dayRootContents]"), function(idx, valObj){
		$.each($("table[name=pathTable]", $(valObj)), function(idx2, valObj2){
			rets += (idx + 1) + _colSep;
			rets += (idx2 + 1) + _colSep;
			rets += $("#selectHour", $(valObj2)).val() + _colSep;
			rets += $("#selectMinute", $(valObj2)).val() + _colSep;
			rets += $("#selectArea", $(valObj2)).val() + _colSep;
			rets += $("#selectNation", $(valObj2)).val() + _colSep;
			rets += $("#selectCity", $(valObj2)).val() + _colSep;
			rets += $("#selectDest", $(valObj2)).val() + _colSep;
			rets += getUnformattedValue($("#seePay", $(valObj2)).val(), $("#seePay", $(valObj2)).attr("mask")) + _colSep;
			rets += $("select[name=currencyCombo]:eq(0)", $(valObj2)).val() + _colSep;
			rets += ($("#selectDest option:selected", $(valObj2)).attr("gubunDest") == undefined ? VALUE_BLANK:$("#selectDest option:selected", $(valObj2)).attr("gubunDest")) + _colSep;
			
			if (idx2 < $("div[name=dayItemRoot]", $(valObj)).length){
				rets += $("div[name=dayItemRoot]:eq(" + idx2 + ") #selectMoveGubunItem", $(valObj)).val() + _colSep;
				rets += $("div[name=dayItemRoot]:eq(" + idx2 + ") #moveDistanceItem", $(valObj)).val() + _colSep;
				rets += $("div[name=dayItemRoot]:eq(" + idx2 + ") #moveDistanceGubunItem", $(valObj)).val() + _colSep;
				rets += $("div[name=dayItemRoot]:eq(" + idx2 + ") #moveHourItem", $(valObj)).val() + _colSep;
				rets += $("div[name=dayItemRoot]:eq(" + idx2 + ") #moveMinuteItem", $(valObj)).val() + _colSep;
				rets += getUnformattedValue($("div[name=dayItemRoot]:eq(" + idx2 + ") #movePayItem", $(valObj)).val(), $("div[name=dayItemRoot]:eq(" + idx2 + ") #movePayItem").attr("mask")) + _colSep;
				rets += $("div[name=dayItemRoot]:eq(" + idx2 + ") select[name=currencyCombo]:eq(0)", $(valObj)).val() + _rowSep;
			} else {
				rets += VALUE_BLANK + _colSep;
				rets += VALUE_BLANK + _colSep;
				rets += VALUE_BLANK + _colSep;
				rets += VALUE_BLANK + _colSep;
				rets += VALUE_BLANK + _colSep;
				rets += VALUE_BLANK + _colSep;
				rets += VALUE_BLANK + _rowSep;				
			}
			
		});
	});
	
	if (rets.length > 0){
		rets = rets.substring(0,rets.length - 3);
	}
	
	return rets;
}

function openStayInfoPopup(obj){

	var selectedAreaCd = $("#selectStay option:selected", $(obj).parent()).attr("areaCd");
	var selectedNationCd = $("#selectStay option:selected", $(obj).parent()).attr("nationCd");
	var selectedCityCd = $("#selectStay option:selected", $(obj).parent()).attr("cityCd");
	var selectedSeqCd = $("#selectStay", $(obj).parent()).val();
	
	if (selectedSeqCd == VALUE_BLANK){
		return;
	}
	previewObject = obj;
	$("#rootStayInfoFrame", $(obj).parent()).attr("src", "detailInfoStay.do?wf=root&aCode="+selectedAreaCd+"&nCode="+selectedNationCd+"&cCode="+selectedCityCd+"&seqCd="+selectedSeqCd);

	$(obj).hide();
	$("#stayPreviewCloseBtn", $(obj).parent()).show();
}

function closeStayInfoPopup(obj){
	$("#rootStayInfoFrame", $(obj).parent()).removeAttr("src");
	$("#rootStayInfoFrame", $(obj).parent()).css("height","1px");
	
	$(obj).hide();
	$("#stayPreviewBtn", $(obj).parent()).show();
	
	resizeMainContents();
}

/**
 * 일정 수정전 저장된 일정 세팅
 */
function setDayRoot(){
	var params = {
		"url":"getRootDetail.do",
		"callback":"setDayRootCallback",
		"paramonly":"true",
		"validate":"false",
		"modifyFlag" : "true",
		"reqUserId":reqUserId,
		"reqSeqCd":reqSeqCd
	};
	doAjax(params);
}

/**
 * @param obj
 */
function setDayRootCallback(obj){

	$("#rootName").val(obj.outData[0].rootName);
	$("#startYear").val(obj.outData[0].startDate.substring(0,4));
	$("#startMonth").val(obj.outData[0].startDate.substring(4,6));
	$("#startDay").val(obj.outData[0].startDate.substring(6,8));
	$("#memberCnt").val(obj.outData[0].memberCnt);
	
	$("#prePayDiv").html(VALUE_BLANK);
	$.each(obj.outDataPre, function(idx, valObj){
		$("#prePayDiv").append(templatePrePay);
		$("#prePayDiv table:eq(" + idx + ") #preItems").val(valObj.itemName);
		$("#prePayDiv table:eq(" + idx + ") #preIPays").val(valObj.itemAmt);
		$("#prePayDiv table:eq(" + idx + ") select[name=currencyCombo]:eq(0)").val(valObj.itemCurrency);
	});

	$.each(obj.outDataDay, function(idx, valObj){
		addRootDay();
		$("div[name=dayRootContents]:eq(" + idx + ") #selectStayGubun").val(valObj.stayGubun);
		$("div[name=dayRootContents]:eq(" + idx + ") #dayItemDetail #stayPay").val(valObj.stayAmt);
		$("div[name=dayRootContents]:eq(" + idx + ") #dayItemDetail select[name=currencyCombo]:eq(0)").val(valObj.stayAmtCur);
		$("div[name=dayRootContents]:eq(" + idx + ") #dayItemDetail #addPayText").val(valObj.addpayName);
		$("div[name=dayRootContents]:eq(" + idx + ") #dayItemDetail #addPay").val(valObj.addpayAmt);
		$("div[name=dayRootContents]:eq(" + idx + ") #dayItemDetail select[name=currencyCombo]:eq(1)").val(valObj.addpayAmtCur);
		$("div[name=dayRootContents]:eq(" + idx + ") #dayItemDetail #dayTotalPay").val(valObj.totalAmt);
		$("div[name=dayRootContents]:eq(" + idx + ") #dayItemDetail select[name=currencyCombo]:eq(2)").val(valObj.totalAmtCur);
	});
	
	$.each(obj.outDataDay, function(idx, valObj){
		if (valObj.moveGubun != null && valObj.moveGubun != VALUE_BLANK){
			$("div[name=dayRootLine]:eq(" + idx + ") #selectMoveGubunDay").val(valObj.moveGubun);
			$("div[name=dayRootLine]:eq(" + idx + ") #moveDistanceDay").val(valObj.moveDist);
			$("div[name=dayRootLine]:eq(" + idx + ") #moveDistanceGubunDay").val(valObj.moveDistGubun);
			$("div[name=dayRootLine]:eq(" + idx + ") #moveHourDay").val(valObj.moveHour);
			$("div[name=dayRootLine]:eq(" + idx + ") #moveMinuteDay").val(valObj.moveMin);
			$("div[name=dayRootLine]:eq(" + idx + ") #movePayDay").val(valObj.moveAmt);
			$("div[name=dayRootLine]:eq(" + idx + ") select[name=currencyCombo]:eq(0)").val(valObj.moveAmtCur);
		}
	});

	$.each(obj.outDataDPath, function(idx, valObj){
		if (idx < obj.outDataDPath.length -1 && obj.outDataDPath[idx+1].daySeq == valObj.daySeq){
			addDayItem($("div[name=dayRootContents]:eq(" + (parseInt(valObj.daySeq) - 1) + ") #addItemBtn"));
		}
	});

	$.each(obj.outDataNation, function(idx, valObj){
		var comboHtml = "<option value=\""+ valObj.nationCd + "\" style=\"color:"+ getDangerColor(valObj.dangerCd) +";\" title=\"" + getDangerText(valObj.dangerCd) + "\">" +  valObj.name + "</option>";
		$("div[name=dayRootContents]:eq(" + (parseInt(valObj.daySeq) - 1) + ") table[name=pathTable]:eq(" + (parseInt(valObj.pathSeq) - 1) + ") #selectNation").append(comboHtml);
		
	});

	$.each(obj.outDataCity, function(idx, valObj){
		var comboHtml = "<option value=\""+ valObj.cityCd + "\" lat=\"" + valObj.lat + "\" lng=\"" + valObj.lng + "\">" +  valObj.name + " ("+ valObj.ename+ ")</option>";
		$("div[name=dayRootContents]:eq(" + (parseInt(valObj.daySeq) - 1) + ") table[name=pathTable]:eq(" + (parseInt(valObj.pathSeq) - 1) + ") #selectCity").append(comboHtml);
		
	});

	$.each(obj.outDataSeeInfo, function(idx, valObj){
		$("div[name=dayRootContents]:eq(" + (parseInt(valObj.daySeq) - 1) + ") table[name=pathTable]:eq(" + (parseInt(valObj.pathSeq) - 1) + ") #selectDest option:eq(0)").css("color","#0000ff");
		var comboHtml = "<option value=\""+ valObj.seqCd + "\" gubunDest=\"LI\" lat=\"" + valObj.lat + "\" lng=\"" + valObj.lng + "\" feeAmt=\"" + (valObj.feeAmt ==null ? VALUE_BLANK:valObj.feeAmt) + "\" feeCurrency=\"" + valObj.feeCurrency + "\">" +  valObj.name + "</option>";
		$("div[name=dayRootContents]:eq(" + (parseInt(valObj.daySeq) - 1) + ") table[name=pathTable]:eq(" + (parseInt(valObj.pathSeq) - 1) + ") #selectDest").append(comboHtml);
	});

	$.each(obj.outDataFoodInfo, function(idx, valObj){
		if ($("div[name=dayRootContents]:eq(" + (parseInt(valObj.daySeq) - 1) + ") table[name=pathTable]:eq(" + (parseInt(valObj.pathSeq) - 1) + ") #selectDest option[gubunDest='FI']").length == 0){
			$("div[name=dayRootContents]:eq(" + (parseInt(valObj.daySeq) - 1) + ") table[name=pathTable]:eq(" + (parseInt(valObj.pathSeq) - 1) + ") #selectDest").append("<option value=\"\" style=\"color:#0000ff;\">▶ 먹거리 선택</option>");
		}
		var comboHtml = "<option value=\""+ valObj.seqCd + "\" gubunDest=\"FI\" lat=\"" + valObj.lat + "\" lng=\"" + valObj.lng + "\" feeAmt=\"\" feeCurrency=\"" + userCurrency + "\">" +  valObj.name + "</option>";
		$("div[name=dayRootContents]:eq(" + (parseInt(valObj.daySeq) - 1) + ") table[name=pathTable]:eq(" + (parseInt(valObj.pathSeq) - 1) + ") #selectDest").append(comboHtml);
	});

	// 날짜별 숙소 combo setting
	$.each(obj.outDataStayInfo, function(idx, valObj){
		var comboHtml = "<option areaCd=\""+ valObj.areaCd + "\" nationCd=\""+ valObj.nationCd + "\" cityCd=\""+ valObj.cityCd + "\" lat=\"" + valObj.lat + "\" lng=\"" + valObj.lng + "\" value=\""+ valObj.seqCd + "\">" +  valObj.stayName + "</option>";
		$("div[name=dayRootContents]:eq(" + (parseInt(valObj.daySeq) - 1) + ") #selectStay").append(comboHtml);
		
		$("div[name=dayRootContents]:eq(" + (parseInt(valObj.daySeq) - 1) + ") #selectStay").unbind("change");
		$("div[name=dayRootContents]:eq(" + (parseInt(valObj.daySeq) - 1) + ") #selectStay").bind("change", function(){
			if ($("div[name=dayRootContents]:eq(" + (parseInt(valObj.daySeq) - 1) + ") a[name=stayPreviewBtn]:eq(1)").css("display") != "none"){
				openStayInfoPopup($("div[name=dayRootContents]:eq(" + (parseInt(valObj.daySeq) - 1) + ") a[name=stayPreviewBtn]:eq(0)"));
			} else {
				closeStayInfoPopup($("div[name=dayRootContents]:eq(" + (parseInt(valObj.daySeq) - 1) + ") a[name=stayPreviewBtn]:eq(1)"));
			}
		});
		
	});
	$.each(obj.outDataDay, function(idx, valObj){
		$("div[name=dayRootContents]:eq(" + idx + ") #selectStay").val(valObj.staySeqCd);
	});
	
	// 일정내의 이동경로및 볼거리 setting
	var idxPath = 0;
	$.each(obj.outDataDPath, function(idx, valObj){
		$("table[name=pathTable]:eq(" + idx + ") #selectHour").val(valObj.pathHour);
		$("table[name=pathTable]:eq(" + idx + ") #selectMinute").val(valObj.pathMin);
		$("table[name=pathTable]:eq(" + idx + ") #selectArea").val(valObj.seeAreaCd);
		$("table[name=pathTable]:eq(" + idx + ") #selectNation").val(valObj.seeNationCd);
		$("table[name=pathTable]:eq(" + idx + ") #selectCity").val(valObj.seeCityCd);
		$("table[name=pathTable]:eq(" + idx + ") #selectDest option:eq(" + indexOfDayPath(idx, valObj.seeSeqCd, valObj.seeGubun) + ")").attr("selected","selected");
		$("table[name=pathTable]:eq(" + idx + ") #seePay").val(valObj.payAmt);
		$("table[name=pathTable]:eq(" + idx + ") select[name=currencyCombo]:eq(0)").val(valObj.payAmtCur);
		
		if (valObj.moveGubun != null && valObj.moveGubun != VALUE_BLANK){
			$("div[name=dayItemRoot]:eq(" + idxPath + ") #selectMoveGubunItem").val(valObj.moveGubun);
			$("div[name=dayItemRoot]:eq(" + idxPath + ") #moveDistanceItem").val(valObj.moveDist);
			$("div[name=dayItemRoot]:eq(" + idxPath + ") #moveDistanceGubunItem").val(valObj.moveDistGubun);
			$("div[name=dayItemRoot]:eq(" + idxPath + ") #moveHourItem").val(valObj.moveHour);
			$("div[name=dayItemRoot]:eq(" + idxPath + ") #moveMinuteItem").val(valObj.moveMin);
			$("div[name=dayItemRoot]:eq(" + idxPath + ") #movePayItem").val(valObj.moveAmt);
			$("div[name=dayItemRoot]:eq(" + idxPath + ") select[name=currencyCombo]:eq(0)").val(valObj.moveAmtCur);
			idxPath++;
		}
	});
	
	if (obj.outData[0].status == "S"){
		$("#tempSaveBtn").remove();
	}
	
	setRootDayAll();
	calcTotalAmtAll();
	resizeMainContents();
	
}

/**
 * 일정 수정전 저장된 일정 세팅
 */
function addDayRootByPopup(obj){
	var params = {
		"url":"getRootDetail.do",
		"callback":"addDayRootByPopupCallback",
		"paramonly":"true",
		"validate":"false",
		"modifyFlag" : "true",
		"reqUserId":obj.userId,
		"reqSeqCd":obj.seqCd
	};
	doAjax(params);
}

/**
 * @param obj
 */
function addDayRootByPopupCallback(obj){

	var dayLength         = $("div[name=dayRootContents]").length;
	var pathLength        = $("table[name=pathTable]").length;
	var dayItemRootLength = $("div[name=dayItemRoot]").length;
	
	$.each(obj.outDataDay, function(idx, valObj){
		addRootDay();
		$("div[name=dayRootContents]:eq(" + (dayLength+idx) + ") #selectStayGubun").val(valObj.stayGubun);
		$("div[name=dayRootContents]:eq(" + (dayLength+idx) + ") #dayItemDetail #stayPay").val(valObj.stayAmt);
		$("div[name=dayRootContents]:eq(" + (dayLength+idx) + ") #dayItemDetail select[name=currencyCombo]:eq(0)").val(valObj.stayAmtCur);
		$("div[name=dayRootContents]:eq(" + (dayLength+idx) + ") #dayItemDetail #addPayText").val(valObj.addpayName);
		$("div[name=dayRootContents]:eq(" + (dayLength+idx) + ") #dayItemDetail #addPay").val(valObj.addpayAmt);
		$("div[name=dayRootContents]:eq(" + (dayLength+idx) + ") #dayItemDetail select[name=currencyCombo]:eq(1)").val(valObj.addpayAmtCur);
		$("div[name=dayRootContents]:eq(" + (dayLength+idx) + ") #dayItemDetail #dayTotalPay").val(valObj.totalAmt);
		$("div[name=dayRootContents]:eq(" + (dayLength+idx) + ") #dayItemDetail select[name=currencyCombo]:eq(2)").val(valObj.totalAmtCur);
	});
	
	$.each(obj.outDataDay, function(idx, valObj){
		if (valObj.moveGubun != null && valObj.moveGubun != VALUE_BLANK){
			$("div[name=dayRootLine]:eq(" + (dayLength+idx) + ") #selectMoveGubunDay").val(valObj.moveGubun);
			$("div[name=dayRootLine]:eq(" + (dayLength+idx) + ") #moveDistanceDay").val(valObj.moveDist);
			$("div[name=dayRootLine]:eq(" + (dayLength+idx) + ") #moveDistanceGubunDay").val(valObj.moveDistGubun);
			$("div[name=dayRootLine]:eq(" + (dayLength+idx) + ") #moveHourDay").val(valObj.moveHour);
			$("div[name=dayRootLine]:eq(" + (dayLength+idx) + ") #moveMinuteDay").val(valObj.moveMin);
			$("div[name=dayRootLine]:eq(" + (dayLength+idx) + ") #movePayDay").val(valObj.moveAmt);
			$("div[name=dayRootLine]:eq(" + (dayLength+idx) + ") select[name=currencyCombo]:eq(0)").val(valObj.moveAmtCur);
		}
	});

	$.each(obj.outDataDPath, function(idx, valObj){
		if (idx < obj.outDataDPath.length -1 && obj.outDataDPath[idx+1].daySeq == valObj.daySeq){
			addDayItem($("div[name=dayRootContents]:eq(" + (dayLength + parseInt(valObj.daySeq) - 1) + ") #addItemBtn"));
		}
	});

	$.each(obj.outDataNation, function(idx, valObj){
		var comboHtml = "<option value=\""+ valObj.nationCd + "\" style=\"color:"+ getDangerColor(valObj.dangerCd) +";\" title=\"" + getDangerText(valObj.dangerCd) + "\">" +  valObj.name + "</option>";
		$("div[name=dayRootContents]:eq(" + (dayLength + parseInt(valObj.daySeq) - 1) + ") table[name=pathTable]:eq(" + (parseInt(valObj.pathSeq) - 1) + ") #selectNation").append(comboHtml);
		
	});

	$.each(obj.outDataCity, function(idx, valObj){
		var comboHtml = "<option value=\""+ valObj.cityCd + "\" lat=\"" + valObj.lat + "\" lng=\"" + valObj.lng + "\">" +  valObj.name + " ("+ valObj.ename+ ")</option>";
		$("div[name=dayRootContents]:eq(" + (dayLength + parseInt(valObj.daySeq) - 1) + ") table[name=pathTable]:eq(" + (parseInt(valObj.pathSeq) - 1) + ") #selectCity").append(comboHtml);
		
	});

	$.each(obj.outDataSeeInfo, function(idx, valObj){
		$("div[name=dayRootContents]:eq(" + (dayLength + parseInt(valObj.daySeq) - 1) + ") table[name=pathTable]:eq(" + (parseInt(valObj.pathSeq) - 1) + ") #selectDest option:eq(0)").css("color","#0000ff");
		var comboHtml = "<option value=\""+ valObj.seqCd + "\" gubunDest=\"LI\" lat=\"" + valObj.lat + "\" lng=\"" + valObj.lng + "\" feeAmt=\"" + (valObj.feeAmt ==null ? VALUE_BLANK:valObj.feeAmt) + "\" feeCurrency=\"" + valObj.feeCurrency + "\">" +  valObj.name + "</option>";
		$("div[name=dayRootContents]:eq(" + (dayLength + parseInt(valObj.daySeq) - 1) + ") table[name=pathTable]:eq(" + (parseInt(valObj.pathSeq) - 1) + ") #selectDest").append(comboHtml);
	});

	$.each(obj.outDataFoodInfo, function(idx, valObj){
		if ($("div[name=dayRootContents]:eq(" + (dayLength + parseInt(valObj.daySeq) - 1) + ") table[name=pathTable]:eq(" + (parseInt(valObj.pathSeq) - 1) + ") #selectDest option[gubunDest='FI']").length == 0){
			$("div[name=dayRootContents]:eq(" + (dayLength + parseInt(valObj.daySeq) - 1) + ") table[name=pathTable]:eq(" + (parseInt(valObj.pathSeq) - 1) + ") #selectDest").append("<option value=\"\" style=\"color:#0000ff;\">▶ 먹거리 선택</option>");
		}
		var comboHtml = "<option value=\""+ valObj.seqCd + "\" gubunDest=\"FI\" lat=\"" + valObj.lat + "\" lng=\"" + valObj.lng + "\" feeAmt=\"\" feeCurrency=\"" + userCurrency + "\">" +  valObj.name + "</option>";
		$("div[name=dayRootContents]:eq(" + (dayLength + parseInt(valObj.daySeq) - 1) + ") table[name=pathTable]:eq(" + (parseInt(valObj.pathSeq) - 1) + ") #selectDest").append(comboHtml);
	});

	// 날짜별 숙소 combo setting
	$.each(obj.outDataStayInfo, function(idx, valObj){
		var comboHtml = "<option areaCd=\""+ valObj.areaCd + "\" nationCd=\""+ valObj.nationCd + "\" cityCd=\""+ valObj.cityCd + "\" lat=\"" + valObj.lat + "\" lng=\"" + valObj.lng + "\" value=\""+ valObj.seqCd + "\">" +  valObj.stayName + "</option>";
		$("div[name=dayRootContents]:eq(" + (dayLength + parseInt(valObj.daySeq) - 1) + ") #selectStay").append(comboHtml);
		
		$("div[name=dayRootContents]:eq(" + (dayLength + parseInt(valObj.daySeq) - 1) + ") #selectStay").unbind("change");
		$("div[name=dayRootContents]:eq(" + (dayLength + parseInt(valObj.daySeq) - 1) + ") #selectStay").bind("change", function(){
			if ($("div[name=dayRootContents]:eq(" + (dayLength + parseInt(valObj.daySeq) - 1) + ") a[name=stayPreviewBtn]:eq(1)").css("display") != "none"){
				openStayInfoPopup($("div[name=dayRootContents]:eq(" + (dayLength + parseInt(valObj.daySeq) - 1) + ") a[name=stayPreviewBtn]:eq(0)"));
			} else {
				closeStayInfoPopup($("div[name=dayRootContents]:eq(" + (dayLength + parseInt(valObj.daySeq) - 1) + ") a[name=stayPreviewBtn]:eq(1)"));
			}
		});
		
	});
	$.each(obj.outDataDay, function(idx, valObj){
		$("div[name=dayRootContents]:eq(" + (dayLength+idx) + ") #selectStay").val(valObj.staySeqCd);
	});
	

	// 일정내의 이동경로및 볼거리 setting
	var idxPath = 0;
	$.each(obj.outDataDPath, function(idx, valObj){
		$("table[name=pathTable]:eq(" + (pathLength+idx) + ") #selectHour").val(valObj.pathHour);
		$("table[name=pathTable]:eq(" + (pathLength+idx) + ") #selectMinute").val(valObj.pathMin);
		$("table[name=pathTable]:eq(" + (pathLength+idx) + ") #selectArea").val(valObj.seeAreaCd);
		$("table[name=pathTable]:eq(" + (pathLength+idx) + ") #selectNation").val(valObj.seeNationCd);
		$("table[name=pathTable]:eq(" + (pathLength+idx) + ") #selectCity").val(valObj.seeCityCd);
		$("table[name=pathTable]:eq(" + (pathLength+idx) + ") #selectDest option:eq(" + indexOfDayPath(idx, valObj.seeSeqCd, valObj.seeGubun, pathLength) + ")").attr("selected","selected");
		$("table[name=pathTable]:eq(" + (pathLength+idx) + ") #seePay").val(valObj.payAmt);
		$("table[name=pathTable]:eq(" + (pathLength+idx) + ") select[name=currencyCombo]:eq(0)").val(valObj.payAmtCur);
		
		if (valObj.moveGubun != null && valObj.moveGubun != VALUE_BLANK){
			$("div[name=dayItemRoot]:eq(" + (dayItemRootLength+idxPath) + ") #selectMoveGubunItem").val(valObj.moveGubun);
			$("div[name=dayItemRoot]:eq(" + (dayItemRootLength+idxPath) + ") #moveDistanceItem").val(valObj.moveDist);
			$("div[name=dayItemRoot]:eq(" + (dayItemRootLength+idxPath) + ") #moveDistanceGubunItem").val(valObj.moveDistGubun);
			$("div[name=dayItemRoot]:eq(" + (dayItemRootLength+idxPath) + ") #moveHourItem").val(valObj.moveHour);
			$("div[name=dayItemRoot]:eq(" + (dayItemRootLength+idxPath) + ") #moveMinuteItem").val(valObj.moveMin);
			$("div[name=dayItemRoot]:eq(" + (dayItemRootLength+idxPath) + ") #movePayItem").val(valObj.moveAmt);
			$("div[name=dayItemRoot]:eq(" + (dayItemRootLength+idxPath) + ") select[name=currencyCombo]:eq(0)").val(valObj.moveAmtCur);
			idxPath++;
		}
	});

	setRootDayAll();
	calcTotalAmtAll();
	resizeMainContents();
	
}

/**
 * 먹거리, 볼거리 콤보 위치 찾기
 * @param seeSeqCd
 * @param checkObj
 * @returns {Number}
 */
function indexOfDayPath(indexDay, seeSeqCd, seeGubun, pathLength){
	var retIndex = 0;
	$.each($("table[name=pathTable]:eq(" + (pathLength != undefined ? (pathLength+indexDay):indexDay) + ") #selectDest option"), function(idx, valObj){
		if ($(valObj).val() == seeSeqCd && $(valObj).attr("gubunDest") == seeGubun){
			retIndex = idx;
		}
	});
	return retIndex;
}

/**
 * @param obj
 */
function calcMovePath(obj){
	var moveGubun = $("#selectMoveGubunItem", $(obj).parent()).val();
	var divIndex = $("div[name=dayItemRoot]",$(obj).parent().parent().parent()).index($(obj).parent().parent());
	
	if (moveGubun == "M00" || moveGubun == "M01" || moveGubun == "M02" || moveGubun == "M07"){
		MtsMessage.popup("MSG_3_004");
		return;
	}
	if ($("table[name=pathTable]:eq(" + divIndex + ") #selectDest", $(obj).parent().parent().parent()).val() == VALUE_BLANK){
		MtsMessage.popup("MSG_2_013", "이동전 볼거리", function(){
			$("table[name=pathTable]:eq(" + divIndex + ") #selectDest", $(obj).parent().parent().parent()).focus();
		});
		return;
	}
	if ($("table[name=pathTable]:eq(" + (divIndex+1) + ") #selectDest", $(obj).parent().parent().parent()).val() == VALUE_BLANK){
		MtsMessage.popup("MSG_2_013", "이동후 볼거리", function(){
			$("table[name=pathTable]:eq(" + (divIndex+1) + ") #selectDest", $(obj).parent().parent().parent()).focus();
		});
		return;
	}
	var latStart = $("table[name=pathTable]:eq(" + divIndex + ") #selectDest option:selected", $(obj).parent().parent().parent()).attr("lat");
	var lngStart = $("table[name=pathTable]:eq(" + divIndex + ") #selectDest option:selected", $(obj).parent().parent().parent()).attr("lng");
	var latEnd = $("table[name=pathTable]:eq(" + (divIndex+1) + ") #selectDest option:selected", $(obj).parent().parent().parent()).attr("lat");
	var lngEnd = $("table[name=pathTable]:eq(" + (divIndex+1) + ") #selectDest option:selected", $(obj).parent().parent().parent()).attr("lng");
	
	var startMap = new google.maps.LatLng(latStart, lngStart);
	var endMap = new google.maps.LatLng(latEnd, lngEnd);
	var service = new google.maps.DistanceMatrixService();
	
	selectedObject = obj;
	
	if (moveGubun == "M06"){
		service.getDistanceMatrix(
		  {
		    origins: [startMap],
		    destinations: [endMap],
		    travelMode: google.maps.TravelMode.WALKING,
		    avoidHighways: true,
		    avoidTolls: true
		  }, calcMovePathCallback);		
	} else {
		service.getDistanceMatrix(
		  {
		    origins: [startMap],
		    destinations: [endMap],
		    travelMode: google.maps.TravelMode.DRIVING,
		    avoidHighways: true,
		    avoidTolls: true
		  }, calcMovePathCallback);
	}
}

/**
 * @param response
 * @param status
 */
function calcMovePathCallback(response, status) {
	
	if (response.rows[0].elements[0].status == google.maps.DistanceMatrixStatus.OK){
		var distanceText = response.rows[0].elements[0].distance.text;
		var timeText = response.rows[0].elements[0].duration.text;
		var distanceSplit = distanceText.split(" ");
		var timeTextSplit = getUnformattedTimeText(timeText);
		
		$("#moveDistanceItem", $(selectedObject).parent()).val(distanceSplit[0]);
		$("#moveDistanceGubunItem", $(selectedObject).parent()).val(distanceSplit[1] == "km" ? "K":"M");
		$("#moveHourItem", $(selectedObject).parent()).val(timeTextSplit[0]);
		$("#moveMinuteItem", $(selectedObject).parent()).val(timeTextSplit[1]);
		
	} else {
		MtsMessage.popup("MSG_3_005");
	}
}

/**
 * @param obj
 */
function calcMoveDay(obj){
	var moveGubun = $("#selectMoveGubunDay", $(obj).parent()).val();
	var divIndex = $("div[name=dayRootLine]",$(obj).parent().parent().parent()).index($(obj).parent().parent());
	
	if (moveGubun == "M00" || moveGubun == "M01" || moveGubun == "M02" || moveGubun == "M07"){
		MtsMessage.popup("MSG_3_004");
		return;
	}
	
	if ($("div[name=dayRootContents]:eq(" + divIndex + ") #selectStay").val() == VALUE_BLANK){
		MtsMessage.popup("MSG_2_013", "당일 숙소", function(){
			$("div[name=dayRootContents]:eq(" + divIndex + ") #selectStay").focus();
		});
		return;
	}
	
	if ($("div[name=dayRootContents]:eq(" + (divIndex+1) + ") #selectStay").val() == VALUE_BLANK){
		MtsMessage.popup("MSG_2_013", "다음날 숙소", function(){
			$("div[name=dayRootContents]:eq(" + (divIndex+1) + ") #selectStay").focus();
		});
		return;
	}
	
	var latStart = $("div[name=dayRootContents]:eq(" + divIndex + ") #selectStay option:selected", $(obj).parent().parent().parent()).attr("lat");
	var lngStart = $("div[name=dayRootContents]:eq(" + divIndex + ") #selectStay option:selected", $(obj).parent().parent().parent()).attr("lng");
	var latEnd = $("div[name=dayRootContents]:eq(" + (divIndex+1) + ") #selectStay option:selected", $(obj).parent().parent().parent()).attr("lat");
	var lngEnd = $("div[name=dayRootContents]:eq(" + (divIndex+1) + ") #selectStay option:selected", $(obj).parent().parent().parent()).attr("lng");
	
	var startMap = new google.maps.LatLng(latStart, lngStart);
	var endMap = new google.maps.LatLng(latEnd, lngEnd);
	var service = new google.maps.DistanceMatrixService();
	
	selectedObject = obj;
	
	if (moveGubun == "M06"){
		service.getDistanceMatrix(
		  {
		    origins: [startMap],
		    destinations: [endMap],
		    travelMode: google.maps.TravelMode.WALKING,
		    avoidHighways: true,
		    avoidTolls: true
		  }, calcMoveDayCallback);		
	} else {
		service.getDistanceMatrix(
		  {
		    origins: [startMap],
		    destinations: [endMap],
		    travelMode: google.maps.TravelMode.DRIVING,
		    avoidHighways: true,
		    avoidTolls: true
		  }, calcMoveDayCallback);
	}
	
}

/**
 * @param response
 * @param status
 */
function calcMoveDayCallback(response, status) {
	
	if (response.rows[0].elements[0].status == google.maps.DistanceMatrixStatus.OK){
		var distanceText = response.rows[0].elements[0].distance.text;
		var timeText = response.rows[0].elements[0].duration.text;
		var distanceSplit = distanceText.split(" ");
		var timeTextSplit = getUnformattedTimeText(timeText);
		
		$("#moveDistanceDay", $(selectedObject).parent()).val(distanceSplit[0]);
		$("#moveDistanceGubunDay", $(selectedObject).parent()).val(distanceSplit[1] == "km" ? "K":"M");
		$("#moveHourDay", $(selectedObject).parent()).val(timeTextSplit[0]);
		$("#moveMinuteDay", $(selectedObject).parent()).val(timeTextSplit[1]);
		
	} else {
		MtsMessage.popup("MSG_3_005");
	}
}

/**
 * @param timeText
 * @returns
 */
function getUnformattedTimeText(timeText){
	var rets = timeText.split(" ");
	
	if (rets[0].indexOf("일") != -1){
		rets[0] = rets[0].replace("일",VALUE_BLANK);
		rets[1] = rets[1].replace("시간", VALUE_BLANK);
		rets[0] = VALUE_BLANK + (parseInt(rets[0]) * 24 + parseInt(rets[1]));
		rets[1] = "0";
	} else if (rets[0].indexOf("시간") != -1){
		rets[0] = rets[0].replace("시간",VALUE_BLANK);
		rets[1] = rets[1].replace("분", VALUE_BLANK);
	} else if (rets[0].indexOf("분") != -1){
		rets[1] = rets[0].replace("분", VALUE_BLANK); 
		rets[0] = "0";
	}
	
	return rets;
}

function calcTotalAmtAll(){
	
	var totalAmt = 0;
	
	$.each($("div[name=dayRootContents]"), function(idx, valObj){
		var totalDayAmt = 0;
		$.each($("input[autoCalc='true']", $(valObj)), function(idx2, valObj2){
			if ($(valObj2).val() != null && $(valObj2).val() != VALUE_BLANK){
				totalDayAmt += getCurrencyRateForWon($("select[name=currencyCombo]:eq(0)", $(valObj2).parent()).val()) * parseFloat(getUnformattedValue($(valObj2).val(), "price"));
			}
			$(valObj2).unbind("keyup");
			$(valObj2).bind("keyup", calcTotalAmtAll);
			$("select[name=currencyCombo]:eq(0)", $(valObj2).parent()).unbind("change");
			$("select[name=currencyCombo]:eq(0)", $(valObj2).parent()).bind("change", calcTotalAmtAll);
		});
		
		if (idx < $("div[name=dayRootContents]").length-1){
			$.each($("div[name=dayRootLine]:eq(" + idx + ") input[autoCalc='true']"), function(idx2, valObj2){
				if ($(valObj2).val() != null && $(valObj2).val() != VALUE_BLANK){
					totalDayAmt += getCurrencyRateForWon($("select[name=currencyCombo]:eq(0)", $(valObj2).parent()).val()) * parseFloat(getUnformattedValue($(valObj2).val(), "price"));
				}
				$(valObj2).unbind("keyup");
				$(valObj2).bind("keyup", calcTotalAmtAll);
				$("select[name=currencyCombo]:eq(0)", $(valObj2).parent()).unbind("change");
				$("select[name=currencyCombo]:eq(0)", $(valObj2).parent()).bind("change", calcTotalAmtAll);
			});
		}
		
		$("#dayTotalPay", $(valObj)).val(parseInt(totalDayAmt));
		totalAmt += totalDayAmt;
	});
	
	$("#totalPay").val(parseInt(totalAmt));
	setMaskAll();
}

var mapOpen = false;

function selectAreaByMap(obj){
	
	if (mapOpen){
		return;
	}
	var position = getBounds($("#selectArea", $(obj).parent()));
	
	if ($("#selectArea", $(obj).parent()).val() == VALUE_BLANK){
		MtsMessage.popup("MSG_3_016", function(){
			$("#selectArea", $(obj).parent()).focus();
		});
		return;
	}
	if ($("#selectNation", $(obj).parent()).val() == VALUE_BLANK) {
		MtsMessage.popup("MSG_3_017", function(){
			$("#selectNation", $(obj).parent()).focus();
		});
		return;
	}
	
	if ($("#selectDest option", $(obj).parent()).length > 1) {
		setMarkRoot($("#selectDest option", $(obj).parent()), callbackSelectAreaByMap);
	} else if ($("#selectCity option", $(obj).parent()).length > 1) {
		setMarkRoot($("#selectCity option", $(obj).parent()), callbackSelectAreaByMap);
	} else {
		MtsMessage.popup("MSG_3_018");
		return;
	}
	
	mapOpen = true;
	
	$("#mapViewDiv").css("top", position.top + 30);
	$("#mapViewDiv").css("right","-640px");
	$("#mapViewDiv").animate({
	    right: "+=640",
	}, 800, function() {
	});
	
}

function closeMap(){
	$("#mapViewDiv").css("right","0px");
	$("#mapViewDiv").animate({
		right: "-=640",
	}, 800, function() {
		mapOpen = false;
	});
}

function callbackSelectAreaByMap(optionObj, selectedIndex){
	
	var idxDay = $("div[name=dayDiv]",$(optionObj).parent().parent().parent().parent().parent().parent().parent().parent().parent()).index($(optionObj).parent().parent().parent().parent().parent().parent().parent().parent());
	var idxSelect = $("table",$(optionObj).parent().parent().parent().parent().parent().parent()).index($(optionObj).parent().parent().parent().parent().parent());

	closeMap();
	$("option:eq(" + selectedIndex + ")", $(optionObj).parent()).attr("selected","selected"); //$(optionObj).parent().val(selectedValue);

	if ($("#selectDest option", $(optionObj).parent().parent()).length == 1) {
		setSeeInfoCombo(idxDay, idxSelect);
	} else {
		setAutoSetFeeBySeeInfoCombo(idxDay, idxSelect);
	}
	
}
