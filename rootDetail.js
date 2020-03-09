var tempalteDayRoot = "";
var tempalteDayPath = "";
var templateDayRootStep = "";
var tempalteDayStepPath = "";
var templateDayRootStay = "";
var templatePrePay = "";
var templateStayDescInput = "";

var dragStartDay = -1;
var dragNowDay = -1;
var dragStartX = 0;
var dragStartY = 0;
var positionX = 0;
var positionY = 0;

$(document).ready(function() {
	
	getCurrencyData(function(){

	    $("[data-name='dayStepHour']").empty();
	    $("[data-name='dayStepMin']").empty();
	    for (var i=0; i<60; i++){
	    	var iStr = (i < 10) ? ("0" + i):("" + i);
	    	if (i < 24){
		    	$("[data-name='dayStepHour']").append("<option value='" + iStr + "'>" + iStr + "</option>");
	    	}
	    	$("[data-name='dayStepMin']").append("<option value='" + iStr + "'>" + iStr + "</option>");
	    }
		
		tempalteDayRoot = $("#tempalteDayRoot").html();
	    templateDayRootStep = $("#templateDayRootStep").html();
	    tempalteDayPath = $("#tempalteDayPath").html();
	    tempalteDayStepPath = $("#tempalteDayStepPath").html();
	    templateDayRootStay = $("#templateDayRootStay").html();
	    templatePrePay = $("#prePayTable tbody").html();
	    templateStayDescInput = $("[data-name='stayDescInput']").html();
	    
	    $("#tempalteDayRoot").remove();
	    $("#templateDayRootStep").remove();
	    $("#tempalteDayPath").remove();
	    $("#tempalteDayStepPath").remove();
	    $("#templateDayRootStay").remove();
	    
	    $("#travelStartDate").val(addDate(getToday("yyyy-mm-dd"), 0,1,"yyyy-mm-dd"));
	    
	    if (reqS == VALUE_BLANK){
	    	changeEditMode();
	    	removeEditBtn();
		}
	    
		setButtonEvent();
	});

});

function setButtonEvent(){
	$("#addBtn").unbind("click");
	$("#addBtn").bind("click", addDayItem);
	$("#delBtn").unbind("click");
	$("#delBtn").bind("click", delDayItems);
	$("#chgBtn").unbind("click");
    $("#chgBtn").bind("click", chgDayItems);
    $("#moveGb").unbind("change");
    $("#moveGb").bind("change", function(){
    	if ($("#moveGb").val() == "M05"){
    		$("#moveByAuto").show();
    	} else {
    		$("#moveByAuto").hide();
    	}
    });
	$("#saveBtn").unbind("click");
    $("#saveBtn").bind("click", saveRoot);
    $("#popupCloseBtn").unbind("click");
    $("#popupCloseBtn").bind("click", closeDayStepPopup);
    $("[name='currencyCombo']").unbind("change");
    $("[name='currencyCombo']").bind("change", setTotalDayPrice);
    $("[name='prePays']").unbind("blur");
    $("[name='prePays']").bind("blur", setTotalDayPrice);
    $("[name='stayCost']").unbind("blur");
    $("[name='stayCost']").bind("blur", setTotalDayPrice);
    $("[name='addCost']").unbind("blur");
    $("[name='addCost']").bind("blur", setTotalDayPrice);
    $("[name='dayItemPreCost']").unbind("blur");
    $("[name='dayItemPreCost']").bind("blur", setTotalDayPrice);
    $("[name='dayStepPathMoveCost']").unbind("blur");
    $("[name='dayStepPathMoveCost']").bind("blur", setTotalDayPrice);
    $("[name='dayPathMoveCost']").unbind("blur");
    $("[name='dayPathMoveCost']").bind("blur", setTotalDayPrice);
}

function initDragRoot() {
	if(navigator.platform){
		if(navigator.userAgent.toLowerCase().indexOf("mobile") != -1){
			initDragRootMobile();
		} else {
			initDragRootPc();
		}
	}
}

function initDragRootPc() {
    
	$("[data-day]").off("dragstart").off("dragover").off("dragleave").off("drop");
	
    $("[data-day]").attr("draggable", "true");
    
    $("[data-day]").on("dragstart", function(e){
        dragStartDay = $(this).attr("data-day");
        $(this).addClass("selected");
    }).on("dragover", function(e){
        $("[data-day]").removeClass("dragover");
        if ($(this).attr("data-day") != dragStartDay){
            $(this).addClass("dragover");
        }
        e.preventDefault();
    }).on("dragleave", function(){
        $("[data-day]").removeClass("selected");
        $("[data-day]").removeClass("dragover");
    }).on("drop", function(e){
        $("[data-day]").removeClass("dragover");
        $("[data-day='" +dragStartDay + "']").removeClass("selected");
        if ($(e.currentTarget).attr("data-day") != undefined && $(e.currentTarget).attr("data-day") != dragStartDay) {
            changeDays(dragStartDay, $(e.currentTarget).attr("data-day"));
        }
    });
}

function initDragRootMobile() {
	$("[data-day]").off("touchstart").off("touchend");
	$("#root").off("touchmove");
	
	$("[data-day]").on("touchstart", function(e){
        dragStartDay = $(e.target).attr("data-day");
        if (dragStartDay == undefined){
        	return;
        }
        var tempDiv = $(e.target).clone();
        $(tempDiv).attr("id","tempDiv");
        $("body").append(tempDiv);
        
        positionX = $(e.target).offset().left;
        positionY = $(e.target).offset().top;
        
        $("#tempDiv").css("position", "absolute");
        $("#tempDiv").css("top", positionY);
        $("#tempDiv").css("left",  positionX);
        $("#tempDiv").css("background","rgba(0,0,0,0.5)");
        $("#tempDiv").css("z-index","999");
        $("#tempDiv").css("width",$(e.target).css("width"));
        $("#tempDiv").removeAttr("data-day");
        dragStartX = e.originalEvent.touches[0].pageX;
        dragStartY = e.originalEvent.touches[0].pageY;
    }).on("touchend", function(e){
        $("[data-day]").removeClass("dragover");
        $("#tempDiv").remove();
        if (dragStartDay != undefined && dragNowDay != undefined && dragStartDay != -1 && dragNowDay != -1 && dragStartDay != dragNowDay) {
        	changeDays(dragStartDay, dragNowDay);
        }
    });
    $("#root").on("touchmove", function(e){
        e.preventDefault();
        if (dragStartDay == undefined){
        	return;
        }
        var depthX = e.originalEvent.touches[0].pageX - dragStartX;
        var depthY = e.originalEvent.touches[0].pageY - dragStartY;
        $("#tempDiv").css("left", positionX + depthX);
        $("#tempDiv").css("top", positionY + depthY);
        dragNowDay = -1;
        $.each($("[data-day]"), function(idx, valObj){
        	var offsetDiv = $(valObj).offset();
        	var x1 = offsetDiv.left;
        	var y1 = offsetDiv.top;
        	var x2 = x1 + parseInt($(valObj).css("width").replace("px",""));
        	var y2 = y1 + parseInt($(valObj).css("height").replace("px",""));
        	
        	if (x1 <= e.originalEvent.touches[0].pageX && x2 >= e.originalEvent.touches[0].pageX &&
                y1 <= e.originalEvent.touches[0].pageY && y2 >= e.originalEvent.touches[0].pageY) {
        		dragNowDay = $(valObj).attr("data-day");
        		if (dragStartDay != dragNowDay) {
        			$(valObj).addClass("dragover");
        		}
        	} else {
        		$(valObj).removeClass("dragover");
        	}
        	
        });
    });
}

function changeDays(dayNum1, dayNum2) {
	var dayTemp1 = $("[data-day='" + dayNum1 + "']").clone(true);
    var dayTemp2 = $("[data-day='" + dayNum2 + "']").clone(true);
    var dayOrg1  = $("[data-day='" + dayNum1 + "']");
    var dayOrg2  = $("[data-day='" + dayNum2 + "']");
    
    $(dayTemp1).insertAfter($(dayOrg2));
    $(dayTemp2).insertAfter($(dayOrg1));
    // select는 clone() 버그로 개별 세팅해야함
    $.each($("select", $(dayTemp1)), function(idx, valObj){
        $(valObj).val($("select:eq(" + idx + ")", $(dayOrg1)).val());
    });
    $.each($("select", $(dayTemp2)), function(idx, valObj){
        $(valObj).val($("select:eq(" + idx + ")", $(dayOrg2)).val());
    });
    
    $(dayOrg1).remove();
    $(dayOrg2).remove();
    
    setDayItemsAll();
}

function getMaxDay() {
	var maxDay = 1;
	
	$.each($("[data-day]"), function(idx, valObj){
	    if (maxDay <= $(valObj).attr("data-day")) {
	    	maxDay = parseInt($(valObj).attr("data-day")) + 1;
	    }
	});
	
	return maxDay;
}

function addDayItem(){
	var maxDay = getMaxDay();
	var insertDay = -1;
	
	if ($("input[name='dayCheck']:checked").length == 1 && parseInt($("input[name='dayCheck']:checked").parent().parent().parent().attr("data-day"))+1 != maxDay){
	    insertDay = parseInt($("input[name='dayCheck']:checked").parent().parent().parent().attr("data-day")) + 1;
	    $("#dayContents").append(tempalteDayRoot);
	    $("#dayContents [data-name='dayItem']:last").insertBefore($("[data-day='" + insertDay + "'"));
	    $("#dayContents").append(tempalteDayPath);
	    $("#dayContents [data-name='dayPath']:last").insertBefore($("[data-day='" + insertDay + "'"));
	} else if ($("input[name='dayCheck']:checked").length > 1){
		MtsMessage.popup("MSG_3_012");
		return;
	} else {
        insertDay = getMaxDay();
		if (insertDay > 1){
            $("#dayContents").append(tempalteDayPath);
            $("#dayContents [data-name='dayPath']:last").attr("data-daypath", (insertDay-1));
        }
        $("#dayContents").append(tempalteDayRoot);
        $("#pathEnd").show();
	}
	setDayItemsAll();
	if (insertDay != -1){
        $("[data-day='" + insertDay + "']").append(templateDayRootStep);
        $("[data-day='" + insertDay + "']").append(templateDayRootStay);
        
	}
	setEditMode();
	initDragRoot();
	setMaskAll();
	setButtonEvent();
}

function delDayItems() {
	if ($("input[name='dayCheck']:checked").length == 0){
		MtsMessage.popup("MSG_3_010");
		return;
	}
	MtsMessage.popup("MSG_4_007", function(){
	    $.each($("input[name='dayCheck']:checked"), function(idx, valObj){
	    	var day = $(valObj).parent().parent().parent().attr("data-day");
	    	$("[data-day='" + day + "']").remove();
	        $("[data-daypath='" + day + "']").remove();
	    });
	    if ($("[data-day]")[0] == undefined) {
	    	$("#pathEnd").hide();
	    } else if ($("[data-day]").length == 1) {
	    	$("[data-daypath]").remove();
	    }
	    setDayItemsAll();
	    setTotalDayPrice();
	});
}

function chgDayItems(){
    if ($("input[name='dayCheck']:checked").length != 2){
		MtsMessage.popup("MSG_3_011");
        return;
    }
    changeDays($("input[name='dayCheck']:checked:eq(0)").parent().parent().parent().attr("data-day"), $("input[name='dayCheck']:checked:eq(1)").parent().parent().parent().attr("data-day"));
}

function setDayItemsAll() {
	var week = ["<font color='red'>일요일</font>", "월요일", "화요일", "수요일", "목요일", "금요일", "<font color='blue'>토요일</font>"];
	var travelStartDate = getUnformattedValue($("#travelStartDate").val(), "date", "yyyy-mm-dd");
	var tDate = new Date(parseInt(travelStartDate.substring(0,4)), parseInt(travelStartDate.substring(4,6))-1, parseInt(travelStartDate.substring(6,8)));
	$.each($("[data-name='dayItem']"), function(idx, valObj){
		$(valObj).attr("data-day", idx + 1);
		
		var titleHtml = (idx+1) + "일차 (";
		titleHtml += tDate.getFullYear() + "-";
		titleHtml += (tDate.getMonth() + 1 < 10 ? ("0" + (tDate.getMonth() + 1)):("" + (tDate.getMonth() + 1))) + "-";
		titleHtml += (tDate.getDate() < 10 ? ("0" + tDate.getDate()):("" + tDate.getDate())) + " ";
		titleHtml += week[tDate.getDay()];
		titleHtml += ")";
		tDate.setDate(tDate.getDate() + 1);
		$("[data-name='title']", $(valObj)).html(titleHtml);
	});
	
}

function changeDayStep(day, stepNum1, stepNum2) {
    var dayTemp1 = $("[data-day='" + day + "'] [data-name='dayStep']:eq(" + stepNum1 + ")").clone(true);
    var dayTemp2 = $("[data-day='" + day + "'] [data-name='dayStep']:eq(" + stepNum2 + ")").clone(true);
    var dayOrg1  = $("[data-day='" + day + "'] [data-name='dayStep']:eq(" + stepNum1 + ")");
    var dayOrg2  = $("[data-day='" + day + "'] [data-name='dayStep']:eq(" + stepNum2 + ")");
    
    $(dayTemp1).insertAfter($(dayOrg2));
    $(dayTemp2).insertAfter($(dayOrg1));
    // select는 clone() 버그로 개별 세팅해야함
    $.each($("select", $(dayTemp1)), function(idx, valObj){
        $(valObj).val($("select:eq(" + idx + ")", $(dayOrg1)).val());
    });
    $.each($("select", $(dayTemp2)), function(idx, valObj){
        $(valObj).val($("select:eq(" + idx + ")", $(dayOrg2)).val());
    });
    
    $(dayOrg1).remove();
    $(dayOrg2).remove();
    
}

function setDayStepSelect(obj){
	var day = $(obj).parent().parent().parent().parent().attr("data-day");
	var idx = $("[data-day='" + day + "'] [data-name='dayStep']").index($(obj).parent().parent().parent());
	var selectedValue = $("[data-day='" + day + "'] [data-name='dayStep']:eq(" + idx + ") [data-name='dayStepSelect']").val();

	if (selectedValue == "S"){
		$("[data-day='" + day + "'] [data-name='dayStep']:eq(" + idx + ") [data-name='areaSelect']").show();
	} else {
		$("[data-day='" + day + "'] [data-name='dayStep']:eq(" + idx + ") [data-name='areaSelect']").hide();
	}
	
}

function closeDayStepPopup(){
	var day = $("#dayStepPopup").attr("data-day");
	var idx = $("#dayStepPopup").attr("data-idx");
	
	$("[data-day='" + day + "'] [data-name='dayStep']:eq(" + idx + ") [data-name='dayStepSelect']").val(VALUE_BLANK);
	
	$("#searchArea").val(VALUE_BLANK);
	$("#searchNation").val(VALUE_BLANK);
	$("#searchCity").val(VALUE_BLANK);
	$("#searchSeeFood").val(VALUE_BLANK);
	$("#dayStepPopup").hide();

}

function upDayStep(obj){
	var day = $(obj).parent().parent().parent().parent().attr("data-day");
	var idx = $("[data-day='" + day + "'] [data-name='dayStep']").index($(obj).parent().parent().parent());

	if ($("[data-day='" + day + "'] [data-name='dayStep']").length == 1 || idx == 0){
        return;
    }
	
	changeDayStep(day, idx, idx-1);
}

function downDayStep(obj){
    var day = $(obj).parent().parent().parent().parent().attr("data-day");
    var idx = $("[data-day='" + day + "'] [data-name='dayStep']").index($(obj).parent().parent().parent());

    if ($("[data-day='" + day + "'] [data-name='dayStep']").length == 1 || $("[data-day='" + day + "'] [data-name='dayStep']").length == idx + 1){
        return;
    }
    changeDayStep(day, idx, idx+1);
}

function addDayStep(obj){
    var day = $(obj).parent().parent().parent().parent().attr("data-day");
    
    $("[data-day='" + day + "']").append(tempalteDayStepPath);
    $("[data-day='" + day + "']").append(templateDayRootStep);
    
    $("[data-day='" + day + "'] [data-name='dayStep']:last").insertAfter($(obj).parent().parent().parent());
    $("[data-day='" + day + "'] [data-name='dayStepPath']:last").insertAfter($(obj).parent().parent().parent());
    
    setEditMode();
	setMaskAll();
	setButtonEvent();
}

function subDayStep(obj){
	var day = $(obj).parent().parent().parent().parent().attr("data-day");
	var idx = $("[data-day='" + day + "'] [data-name='dayStep']").index($(obj).parent().parent().parent());
	
	if ($("[data-day='" + day + "'] [data-name='dayStep']").length == 1){
		return;
	}
	
	$("[data-day='" + day + "'] [data-name='dayStep']:eq(" + idx + ")").remove();
	if ($("[data-day='" + day + "'] [data-name='dayStepPath']").length == idx) {
        $("[data-day='" + day + "'] [data-name='dayStepPath']:last").remove();
	} else {
        $("[data-day='" + day + "'] [data-name='dayStepPath']:eq(" + idx + ")").remove();
	}
	
	setTotalDayPrice();
}

function addPrePay(obj){
	$("#prePayTable").append(templatePrePay);
	$("#prePayTable tr:last").insertAfter($(obj).parent().parent());
	setMaskAll();
	setButtonEvent();
}

function subPrePay(obj){
	if ($("#prePayTable tr").length == 1){
		return;
	}
	$(obj).parent().parent().remove();
	setTotalDayPrice();
}

function addStay(){
	$("[data-name='stayDescInput']").append(templateStayDescInput);
	setMaskAll();
	setButtonEvent();
}

function subStay(){
	if ($("[data-name='stayDescInput'] table").length == 1) {
		return;
	}
	$("[data-name='stayDescInput'] table:last").remove();
	setTotalDayPrice();
}

function setNationCombo(obj){
	var day = $(obj).parent().parent().parent().attr("data-day");
	var idx = $("[data-day='" + day + "'] [data-name='dayStep']").index($(obj).parent().parent());
	
	if ($(obj).val() != VALUE_BLANK) {
		var params = {
			"url"      :"getNationCombo.do", 
			"callback" :"setNationComboCallback", 
			"paramonly":"true", 
			"validate" :"false", 
			"aCode"    :$(obj).val(),
			"day"      :day,
			"idx"      :idx
		};
		doAjax(params);
	} else {
		$("[data-day='" + day + "'] [data-name='dayStep']:eq(" + idx + ") [data-name='searchNation']").html("<option value=\"\">▶ 나라선택</option>");
		$("[data-day='" + day + "'] [data-name='dayStep']:eq(" + idx + ") [data-name='searchCity']").html("<option value=\"\">▶ 도시선택</option>");
		$("[data-day='" + day + "'] [data-name='dayStep']:eq(" + idx + ") [data-name='searchSeeFood']").html("<option value=\"\">▶ 장소선택</option>");
	}
	
}

function setNationComboCallback(obj) {
	var daySelected = obj.day;
	var idxSelected = obj.idx;
	
	var comboHtml = "<option value=\"\">▶ 나라선택</option>";

	$.each(obj.outData, function(idx, valObj){
		comboHtml += "<option value=\""+ valObj.nationCd + "\" style=\"color:"+ getDangerColor(valObj.dangerCd) +";\" title=\"" + getDangerText(valObj.dangerCd) + "\" lat=\"" + valObj.lat+ "\" lng=\"" + valObj.lng+ "\">" +  valObj.name + " ("+ valObj.ename+ ")</option>";
	});
	
	$("[data-day='" + daySelected + "'] [data-name='dayStep']:eq(" + idxSelected + ") [data-name='searchNation']").html(comboHtml);

	setCityCombo($("[data-day='" + daySelected + "'] [data-name='dayStep']:eq(" + idxSelected + ") [data-name='searchNation']"));
}

function setCityCombo(obj){
	var day = $(obj).parent().parent().parent().attr("data-day");
	var idx = $("[data-day='" + day + "'] [data-name='dayStep']").index($(obj).parent().parent());

	if ($(obj).val() != VALUE_BLANK) {
		var params = {
			"url"      :"getCityCombo.do", 
			"callback" :"setCityComboCallback", 
			"paramonly":"true", 
			"validate" :"false", 
			"aCode"    :$("[data-day='" + day + "'] [data-name='dayStep']:eq(" + idx + ") [data-name='searchArea']").val(), 
			"nCode"    :$(obj).val(),
			"day"      :day,
			"idx"      :idx
		};
		doAjax(params);
	} else {
		$("[data-day='" + day + "'] [data-name='dayStep']:eq(" + idx + ") [data-name='searchCity']").html("<option value=\"\">▶ 도시선택</option>");
		$("[data-day='" + day + "'] [data-name='dayStep']:eq(" + idx + ") [data-name='searchSeeFood']").html("<option value=\"\">▶ 장소선택</option>");
	}
}

function setCityComboCallback(obj) {
	var daySelected = obj.day;
	var idxSelected = obj.idx;
	
	var comboHtml = "<option value=\"\">▶ 도시선택</option>";

	$.each(obj.outData, function(idx, valObj){
		comboHtml += "<option value=\""+ valObj.cityCd + "\" lat=\"" + valObj.lat+ "\" lng=\"" + valObj.lng + "\">" +  valObj.name + " ("+ valObj.ename+ ")</option>";
	});
	
	$("[data-day='" + daySelected + "'] [data-name='dayStep']:eq(" + idxSelected + ") [data-name='searchCity']").html(comboHtml);
	
}

function setSeeFoodCombo(obj){
	var day = $(obj).parent().parent().parent().attr("data-day");
	var idx = $("[data-day='" + day + "'] [data-name='dayStep']").index($(obj).parent().parent());

	if ($(obj).val() != VALUE_BLANK) {
		var params = {
			"url"      :"getSeeFoodCombo.do", 
			"callback" :"setSeeFoodComboCallback", 
			"paramonly":"true", 
			"validate" :"false", 
			"aCode"    :$("[data-day='" + day + "'] [data-name='dayStep']:eq(" + idx + ") [data-name='searchArea']").val(), 
			"nCode"    :$("[data-day='" + day + "'] [data-name='dayStep']:eq(" + idx + ") [data-name='searchNation']").val(), 
			"cCode"    :$(obj).val(),
			"day"      :day,
			"idx"      :idx
		};
		doAjax(params);
	} else {
		$("[data-day='" + day + "'] [data-name='dayStep']:eq(" + idx + ") [data-name='searchSeeFood']").html("<option value=\"\">▶ 장소선택</option>");
	}
}

function setSeeFoodComboCallback(obj) {
	var daySelected = obj.day;
	var idxSelected = obj.idx;
	
	var comboHtml = "<option value=\"\">▶ 장소선택</option>";

	$.each(obj.outDataSee, function(idx, valObj){
		comboHtml += "<option value=\""+ valObj.seqCd + "\" data-type=\"see\" data-feeamt=\"" + replaceNull(valObj.feeAmt) + "\" data-feecurrency=\"" + replaceNull(valObj.feeCurrency) + "\" data-lat=\"" + valObj.lat+ "\" data-lng=\"" + valObj.lng + "\">🏰" +  valObj.seeName + "</option>";
	});
	$.each(obj.outDataFood, function(idx, valObj){
		comboHtml += "<option value=\""+ valObj.seqCd + "\" data-type=\"food\" data-feeamt=\"" + replaceNull(valObj.feeAmt) + "\" data-feecurrency=\"" + replaceNull(valObj.feeCurrency) + "\" data-lat=\"" + valObj.lat+ "\" data-lng=\"" + valObj.lng + "\">🍕" +  valObj.shopName + "(" + valObj.foodName + ")</option>";
	});
	
	$("[data-day='" + daySelected + "'] [data-name='dayStep']:eq(" + idxSelected + ") [data-name='searchSeeFood']").html(comboHtml);
	
}

function setSeeFoodInfoSelected(obj){
	var day = $(obj).parent().parent().parent().attr("data-day");
	var idx = $("[data-day='" + day + "'] [data-name='dayStep']").index($(obj).parent().parent());
	var feeAmt = $("[data-day='" + day + "'] [data-name='dayStep']:eq(" + idx + ") [data-name='searchSeeFood'] option:selected").attr("data-feeamt");
	var feeCurrency = $("[data-day='" + day + "'] [data-name='dayStep']:eq(" + idx + ") [data-name='searchSeeFood'] option:selected").attr("data-feecurrency");
	
	$("[data-day='" + day + "'] [data-name='dayStep']:eq(" + idx + ") [data-name='dayItemPreCost']").val(getFormattedValue(feeAmt,"price"));
	$("[data-day='" + day + "'] [data-name='dayStep']:eq(" + idx + ") [name=currencyCombo]:eq(0)").val(feeCurrency);
}

function setTotalDayPrice(){

	var totalPricePre = 0;
	var totalPriceExp = 0;
	//var totalPricePay = 0;
	
	$.each($("[name='prePays']"), function(idx, valObj){
		var prePayPre = isNull($(valObj).val()) ? 0:parseInt(getUnformattedValue($(valObj).val(), "price"));
		var prePayPreCurrency = $("[name='currencyCombo']", $(valObj).parent()).val();
		
		totalPricePre += parseInt(prePayPre * getCurrencyRateForWon(prePayPreCurrency));
		
	});
	
	totalPriceExp += totalPricePre;
	
	$.each($("[data-day]"), function(idx, valObj){
		
		var dayCostExp = 0;
		
		$.each($("[name='stayCost']", $(valObj)), function(idx2, valObj2){
			var amt = isNull($(valObj2).val()) ? 0:parseInt(getUnformattedValue($(valObj2).val(), "price"));
			var currency = $("[name='currencyCombo']", $(valObj2).parent()).val();
			dayCostExp += parseInt(amt * getCurrencyRateForWon(currency));
		});
		$.each($("[name='addCost']", $(valObj)), function(idx2, valObj2){
			var amt = isNull($(valObj2).val()) ? 0:parseInt(getUnformattedValue($(valObj2).val(), "price"));
			var currency = $("[name='currencyCombo']", $(valObj2).parent()).val();
			dayCostExp += parseInt(amt * getCurrencyRateForWon(currency));
		});
		$.each($("[name='dayItemPreCost']", $(valObj)), function(idx2, valObj2){
			var amt = isNull($(valObj2).val()) ? 0:parseInt(getUnformattedValue($(valObj2).val(), "price"));
			var currency = $("[name='currencyCombo']", $(valObj2).parent()).val();
			dayCostExp += parseInt(amt * getCurrencyRateForWon(currency));
		});

		$.each($("[name='dayStepPathMoveCost']", $(valObj)), function(idx2, valObj2){
			var amt = isNull($(valObj2).val()) ? 0:parseInt(getUnformattedValue($(valObj2).val(), "price"));
			var currency = $("[name='currencyCombo']", $(valObj2).parent()).val();
			dayCostExp += parseInt(amt * getCurrencyRateForWon(currency));
		});

		if (idx < $("[data-day]").length-1) {
			var amt = isNull($("[name='dayPathMoveCost']:eq(" + idx + ")").val()) ? 0:parseInt(getUnformattedValue($("[name='dayPathMoveCost']:eq(" + idx + ")").val(), "price"));
			var currency = $("[name='currencyCombo']", $("[name='dayPathMoveCost']:eq(" + idx + ")").parent()).val();
			dayCostExp += parseInt(amt * getCurrencyRateForWon(currency));
		}
		
		totalPriceExp += dayCostExp;

		$("[data-name='dayCostExp']", $(valObj)).html(getFormattedValue(dayCostExp+"","price"));
		$("[data-name='dayCostExpSum']", $(valObj)).html(getFormattedValue((totalPriceExp-totalPricePre)+"","price"));

	});
	
	$("#totalPricePre").html(getFormattedValue(totalPricePre+"","price"));
	$("#totalPriceExp").html(getFormattedValue(totalPriceExp+"","price"));
}

function saveRoot(){

	var errorFlag = false;
	
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
	
	if ($("#memberCnt").val() == VALUE_BLANK){
		MtsMessage.popup("MSG_3_013", function(){
			$("#memberCnt").focus();
		});
		return;
	}

	if ($("#moveGb").val() != VALUE_BLANK && isNull($("#fuelEfficiency").val())){
		MtsMessage.popup("MSG_3_014", function(){
			$("#fuelEfficiency").focus();
		});
		return;
	}

	// 준비물 항목만 입력한 경우 에러처리
	$.each($("input[name=preItems]"), function(idx, valObj){
		if (!errorFlag && !isNull($(valObj).val()) && isNull($("input[name=prePays]:eq(" + idx + ")").val())){
			MtsMessage.popup("MSG_3_015", function(){
				$("input[name=prePays]:eq(" + idx + ")").focus();
			});
			errorFlag = true;
		}
		if (!errorFlag && !isNull($(valObj).val()) && stringLength($(valObj).val()) > $(valObj).attr("maxlength")){
			MtsMessage.popup("MSG_2_004", "준비물항목", $(valObj).attr("maxlength"), stringLength($(valObj).val()), function(){
				$(valObj).focus();
			});
			errorFlag = true;
		}
	});

	if (errorFlag){
		return;
	}
	
	MtsMessage.popup("MSG_4_003", function(){
		var params = {
			"url"             : "saveRootInfo.do",
			"callback"        : "saveRootCallback",
			"paramonly"       : "true",
			"reqSeqCd"        : reqS,
			"rootName"        : $("#rootName").val(),
			"moveGb"          : $("#moveGb").val(),
			"fuelEfficiency"  : getUnformattedValue($("#fuelEfficiency").val(), "price"),
			"startDate"       : getUnformattedValue($("#travelStartDate").val(), "date"),
			"memberCnt"       : getUnformattedValue($("#memberCnt").val(), "price"),
			"status"          : inStatus,
			"prepareList"     : getPrepareList(),
			"dayItemList"     : getDayItemList(),
			"dayItemStayList" : getDayItemStayList(),
			"dayItemPathList" : getDayItemPathList()
		};
		doAjax(params);		
	});
	
}

function getPrepareList(){
	var rets = VALUE_BLANK;
	
	$.each($("[name=preItems]"), function(idx, valObj){
		rets += $(valObj).val() + _colSep;
		rets += getUnformattedValue($("[name=prePays]", $(valObj).parent().parent()).val(), "price") + _colSep;
		rets += $("[name=currencyCombo]", $(valObj).parent().parent()).val() + _rowSep;
	});
	
	if (rets.length > 0){
		rets = rets.substring(0,rets.length - 3);
	}
	
	return rets;
}

function getDayItemList(){
	var rets = VALUE_BLANK;

	$.each($("[name='dayItem']"), function(idx, valObj){

	});
	
	return rets;
}

function getDayItemStayList(){
	var rets = VALUE_BLANK;

	$.each($("[name='dayItem']"), function(idx, valObj){

	});

	return rets;
}

function getDayItemPathList(){
	var rets = VALUE_BLANK;

	$.each($("[name='dayItem']"), function(idx, valObj){

	});

	return rets;
}
