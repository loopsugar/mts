<%@page import="java.util.Map"%>
<%@ page contentType="text/html; charset=utf-8" %>
<%
	@SuppressWarnings("unchecked")
	Map<String,Object> loginMapRoot = (Map<String,Object>)session.getAttribute("loginInfo");
%>

<!DOCTYPE html>
<html lang="ko">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="IE=Edge; chrome=1">
	<%@include file="/jsp/common/init.jsp"%>
	<script type="text/javascript" src="/js/common/calendar.js"></script>
	<script type="text/javascript" src="/js/biz/root/rootDetail.js"></script>
	<script>
		var reqS = "${s}";
	</script>
</head>
<body>

	<%@include file="/jsp/common/header.jsp"%>
	<div class="boxTypeMain" id="mainDiv">

		<div class="title" data-editmode="false"><span id="rootTitle"></span></div>
			
		<div class="boxType5" style="min-height:195px;">
			<div class="title">여행 준비 항목</div>
			<div class="desc" data-name="rootDesc" data-editmode="false">
				■ 여행시작 : <span>2020/01/05</span><br>
				■ 주이동수단 : <span id="rootMoveMethod">자동차 (연비 : 20km/l)</span><br>
				■ 총인원 : <span id="rootMemberCount">2명</span><br>
				■ 초기준비 : 
				<div class="prepay" id="rootPrepay">
					□ 항공권(대한항공 직항) 1,300.000원<br>
					□ 리스카(시트로엥/ 크로스백) 3,450유로<br>
					□ 블랙박스 250,000원<br>
					□ 교통비 300,000원<br>
					□ 페리(아이슬란드 - 덴마크) 1,700.000원<br>
					□ 밥솥 78,000원<br>
					□ 기타 680,000원
				</div>
			</div>
			<div data-name="rootDesc" data-editmode="true">
				<table class="tblInfoView">
					<colgroup>
						<col style="width:80px;"/>
						<col style="width:;"/>
					</colgroup>
					<tr>
						<th>제목</th>
						<td><input type="text" id="rootName" value="" maxlength="100" placeholder="여행 제목을 입력하세요."></td>
					</tr>
					<tr>
						<th>시작</th>
						<td><input type="text" id="travelStartDate" value="" readonly="readonly" onclick="javascript:drawCalendar($(this).attr('id'), setDayItemsAll);"></td>
					</tr>
					<tr>
						<th>이동</th>
						<td>
							<table class="tblInfoView">
								<colgroup>
									<col style="width:;"/>
									<col style="width:130px;"/>
								</colgroup>
								<tr>
									<td>
										<select id="moveGb" style="width:100%;">
											<option value="M05">자동차</option>
											<option value="M08">대중교통</option>
											<option value="M06">도보</option>
											<option value="M98">기타</option>
										</select>
									</td>
									<td id="moveByAuto">
										<input id="fuelEfficiency" type="text" placeHolder="연비" style="width:80px;" data-mask="price" maxlength="3"> km/l
									</td>
								</tr>
							</table>
						</td>
					</tr>
					<tr>
						<th>인원</th>
						<td><input type="text" id="memberCnt" maxlength="5" data-mask="price" placeholder="여행자 인원을 입력하세요" value="1"></td>
					</tr>
					<tr>
						<td colspan="2">
							<div class="title2">&nbsp;&nbsp;준비물</div>
							<table class="tblInfoView" id="prePayTable">
								<colgroup>
									<col style="width:;"/>
									<col style="width:;"/>
									<col style="width:70px;"/>
								</colgroup>
								<tbody>
									<tr>
										<td>
											<input type="text" style="width:100%;" id="preItems" name="preItems" maxlength="100" placeHolder="항목입력">
										</td>
										<td>
											<div class="currency">
												<input type="text" style="width:80px;" id="prePays" name="prePays" maxlength="12" placeHolder="비용입력" data-mask="price">
												<%@include file="/jsp/common/include/currency.jsp"%>
											</div>												
										</td>
										<td style="text-align:right;">
											<a href="javascript:;" id="addPrePayBtn" onclick="javascript:addPrePay(this);" class="buttonType" title="추가"><b>+</b></a>
											<a href="javascript:;" id="deletePrePayBtn" onclick="javascript:subPrePay(this);" class="buttonType" title="삭제"><b>-</b></a>
										</td>
									</tr>
								</tbody>
							</table>
						</td>
					</tr>
				</table>
			</div>
			<div class="btns">
				<a href="javascript:;" onclick="javascript:menoRoot(this);"><span>메모</span></a>
				<a href="javascript:;" onclick="javascript:bookmarkRoot(this);"><span>북마크</span></a>&nbsp;&nbsp;
			</div>
		</div>

	    <div class="root" id="root">
	    
	        <div class="start">여행시작</div>
	    
	        <div class="arrowDown" id="pathStart">▼</div>
	    
	        <div id="dayContents"></div>
	        
	        <div class="arrowDown" id="pathEnd" style="display:none;">▼</div>
	
	        <div class="end">여행종료</div>
	                    
	    </div>

		<div class="boxType6">
		초기비용합계: <b><span id="totalPricePre">0</span></b>원 / 예상비용합계: <b><span id="totalPriceExp">0</span></b>원<br>
		실제비용합계: <b><span id="totalPricePay">0</span></b>원
		</div>
	    	
		<%
			if (loginMapRoot != null){
		%>
		<div class="btns">
	        <a href="javascript:;" onclick="javascript:;" class="buttonType" id="chgBtn" data-editmode="true">바꾸기</a>
	        <a href="javascript:;" onclick="javascript:;" class="buttonType" id="delBtn" data-editmode="true">삭제</a>
	        <a href="javascript:;" onclick="javascript:;" class="buttonType" id="addBtn" data-editmode="true" title="일정추가">추가</a>
	        <a href="javascript:;" onclick="javascript:;" class="buttonType" id="saveBtn" data-editmode="true">저장</a>
		</div>
		<%
			}
		%>

	</div>
	<%@include file="/jsp/common/tail.jsp"%>

<div id="tempalteDayRoot" style="display:none;">
	<div class="boxType1" data-name="dayItem">
        <div class="date">
        	<span data-editmode="true" style="display:none;"><input type="checkbox" name="dayCheck"></span><span data-editmode="false">&nbsp;&nbsp;</span><span data-name="title"></span>
        </div>
	    
	</div>
</div>

<div id="templateDayRootStep" style="display:none;">
	<div data-name="dayStep" class="path">
		<div class="dayContents">
	       <div class="time" data-editmode="false">10:00</div>
	       <div class="type1" data-editmode="false">볼</div>
	       <div class="area" data-editmode="false"><span>유럽/이탈리아/돌로미티</span>-트리티메치메 <span>(<b>20유로</b>)</span></div>
	       <div data-editmode="true">
				<select data-name="dayStepHour" style="width:60px;"></select>:<select data-name="dayStepMin" style="width:60px;"></select>
				<select data-name="dayStepSelect" onchange="javascript:setDayStepSelect(this);" style="width:100px;">
					<option value="">일정선택</option>
					<option value="A">숙소출발</option>
					<option value="Z">숙소도착</option>
					<option value="C">이동중</option>
					<option value="S">볼거리/먹거리</option>
				</select>
				<input type="text" name="dayItemPreCost" placeholder="예상금액" data-mask="price" style="width:80px; height:24px; border:none;">
				<%@include file="/jsp/common/include/currency.jsp"%>
	       </div>
		   <div class="btns" data-editmode="true">
		       <a href="javascript:;" onclick="javascript:upDayStep(this);" class="buttonType" data-editmode="true" title="위로">▲</a>
		       <a href="javascript:;" onclick="javascript:downDayStep(this);" class="buttonType" data-editmode="true" title="아래로">▼</a>
		       <a href="javascript:;" onclick="javascript:addDayStep(this);" class="buttonType" data-editmode="true" title="추가">+</a>
		       <a href="javascript:;" onclick="javascript:subDayStep(this);" class="buttonType" data-editmode="true" title="삭제">-</a>
		   </div>
		</div>
		<div data-name="areaSelect" class="boxType3" style="display:none;">
			<select data-name="searchArea" title="지역" style="width:20%;" onchange="javascript:setNationCombo(this);">
				<option value="">▶ 대륙선택</option>
				<option value="ASI">아시아 (Asia)</option>
				<option value="EUR">유럽 (Euroup)</option>
				<option value="NAM">북아메리카 (North America)</option>
				<option value="SAM">남아메리카 (South America)</option>
				<option value="OCA">오세아니아 (Oceania)</option>
				<option value="AFR">아프리카 (Africa)</option>
			</select>
			<select data-name="searchNation" title="나라명" style="width:20%;" onchange="javascript:setCityCombo(this);">
				<option value="">▶ 나라선택</option>
			</select>
			<select data-name="searchCity" title="도시명" style="width:20%;" onchange="javascript:setSeeFoodCombo(this);">
				<option value="">▶ 도시선택</option>
			</select>
			<select data-name="searchSeeFood" style="width:30%;" onchange="javascript:setSeeFoodInfoSelected(this);">
				<option value="">▶ 장소선택</option>
			</select>
		</div>
	</div>
</div>

<div id="tempalteDayPath" style="display:none;">
    <div data-name="dayPath" style="width:100%;">
		<div class="arrowDown">▼</div>
        <div class="boxType2" data-editmode="false">▼ By Car (298km / 9＄) ▼</div>
        <div class="boxType2" data-editmode="true" style="display:none;">
            <select data-name="dayPathMoveBy" style="width:120px;">
                <option value="M01">페리</option>
                <option value="M02">비행기</option>
                <option value="M03">기차</option>
                <option value="M04">버스</option>
                <option value="M05">자동차</option>
                <option value="M06">도보</option>
                <option value="M07">기타</option>
                <option value="M99" selected>이동없음</option>
            </select>
            <input type="text" name="dayPathMoveDist" style="width:60px; border:none;" placeHolder="거리" data-mask="price">
            <select data-name="dayPathMoveDistGb" style="width:80px;">
                <option value="" selected>Km</option>
                <option value="">m</option>
            </select>
            <input type="text" name="dayPathMoveCost" style="width:60px; border:none;" placeHolder="예상비용" data-mask="price">
            <%@include file="/jsp/common/include/currency.jsp"%>
        </div>
		<div class="arrowDown">▼</div>
    </div>
</div>

<div id="tempalteDayStepPath" style="display:none;">
    <div data-name="dayStepPath" style="width:100%;">
		<div class="arrowDown">▼</div>
        <div  class="boxType2" data-editmode="false">▼ By Car (298km / 9＄) ▼</div>
        <div class="boxType2" style="display:none;" data-editmode="true">
            <select data-name="dayPathMoveBy" style="width:120px;">
                <option value="M01">페리</option>
                <option value="M02">비행기</option>
                <option value="M03">기차</option>
                <option value="M04">버스</option>
                <option value="M05">자동차</option>
                <option value="M06" selected>도보</option>
                <option value="M07">기타</option>
                <option value="M99">이동없음</option>
            </select>
            <input type="text" name="dayStepPathMoveDist" style="width:60px;" placeHolder="거리" data-mask="price">
            <select data-name="dayStepPathMoveDistGb" style="width:80px;">
                <option value="">Km</option>
                <option value="" selected>m</option>
            </select>
            <input type="text" name="dayStepPathMoveCost" style="width:60px;" placeHolder="예상비용" data-mask="price">
			<%@include file="/jsp/common/include/currency.jsp"%>
        </div>
		<div class="arrowDown">▼</div>
    </div>
</div>

<div id="templateDayRootStay" style="display:none;">
	<div class="boxType5">
		<div data-name="stayList">
			<div data-name="stayDescInput" data-editmode="true">
				<table class="tblInfoView">
					<colgroup>
						<col style="width:;"/>
						<col style="width:200px;"/>
					</colgroup>
					<tbody>
						<tr>
							<td><input type="text" name="stayName" placeHolder="숙소명" maxlength="100"></td>
							<td rowspan="3">
								<div class="currency">
									<input type="text" style="width:80px;" name="stayCost" maxlength="12" placeHolder="예상비용입력" data-mask="price">
									<%@include file="/jsp/common/include/currency.jsp"%>
								</div>												
							</td>
						</tr>
						<tr>
							<td><input type="text" name="stayLinkUrl" placeHolder="관련링크" maxlength=""></td>
						</tr>							
						<tr>
							<td><input type="text" name="stayAddress" placeHolder="주소" maxlength="200"></td>
						</tr>							
					</tbody>
				</table>
			</div>
			<div data-editmode="true">
				<table class="tblInfoView">
					<colgroup>
						<col style="width:;"/>
						<col style="width:200px;"/>
					</colgroup>
					<tbody>
						<tr>
							<td><input type="text" name="etcCost" placeHolder="기타예상 비용 항목"></td>
							<td>
								<div class="currency">
									<input type="text" style="width:80px;" name="addCost" maxlength="12" placeHolder="예상비용입력" data-mask="price">
									<%@include file="/jsp/common/include/currency.jsp"%>
								</div>												
							</td>
						</tr>
					</tbody>
				</table>
			</div>				
			<div class="btns" data-editmode="true">
				<a href="javascript:;" onclick="javascript:addStay(this);" class="buttonType" title="숙소추가">숙소추가</a>
				<a href="javascript:;" onclick="javascript:subStay(this);" class="buttonType" title="숙소삭제">숙소삭제</a>
				<br><br>
			</div>
			<div data-name="stayDesc" data-editmode="false">
				숙소 : 파리 빠리조아 펜션(민박,게스트하우스)<br>
				전화 : 예약후 확인가능<br>
				주소 : 17 Rue d'Estienne d'Orves, 94110 Arcueil, 프랑스<br>
				숙소예상비용 : 60유로 / 기타예상비용 : 30유로<br>
			</div>
		</div>
		<div class="line"></div>
		<div class="sum">
		하루예상: <span data-name="dayCostExp">0</span>원 / 실제사용: <span class="pricePlus" data-name="dayCostPay">0</span>원<br>
		누적예상: <span data-name="dayCostExpSum">0</span>원 / 누적사용: <span class="pricePlus" data-name="dayCostPaySum">0</span>원
		</div>
		<div class="btns">
			<a href="javascript:;" onclick="javascript:menoDay(this);"><span>메모</span></a>
			<a href="javascript:;" onclick="javascript:bookmarkDay(this);"><span>북마크</span></a>
		</div>
	</div>
</div>

</body>
</html>