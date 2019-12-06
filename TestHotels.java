package com.sugar.test;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TestHotels {

	private static final String HOTELS_URL = "https://kr.hotels.com";
	private static final String HOTELS_CONTENTS_START = "<ol";
	private static final String HOTELS_CONTENTS_END = "</ol>";
	private static final String HOTELS_STAY_INFO_SEP = "<li class=\"hotel\"";
	private static final String HOTELS_STAY_NAME_START = "data-title=\"";
	private static final String HOTELS_STAY_NAME_END = "\"";
	private static final String HOTELS_IMAGE_URL_START = "background-image:url('";
	private static final String HOTELS_IMAGE_URL_END = "?impolicy=";
	private static final String HOTELS_SCORE_START = "<strong class=\"guest-reviews-badge";
	private static final String HOTELS_SCORE_END = "</strong>";
	private static final String HOTELS_PRICE_START = "<div class=\"price\">";
	private static final String HOTELS_PRICE_END = "</strong>";
	private static final String HOTELS_PRICE_START_INS = "<ins >";
	private static final String HOTELS_PRICE_END_INS = "</ins>";
	private static final String HOTELS_LINK_URL_START = "<h3 class=\"p-name\"><a href=\"";
	private static final String HOTELS_LINK_URL_END = "\"";
	private static final String HOTELS_STAY_DESC_START_1 = "<ul class=\"property-landmarks\">";
	private static final String HOTELS_STAY_DESC_END_1 = "</ul>";
	private static final String HOTELS_STAY_DESC_START_2 = "parkingOptions\">";
	private static final String HOTELS_STAY_DESC_END_2 = "</li>";
	private static final String HOTELS_STAY_DESC_START_3 = "aircondition\">";
	private static final String HOTELS_STAY_DESC_END_3 = "</li>";
	
	public static void main(String args[]) throws Exception {
		
		FileInputStream file = new FileInputStream("D:/Project/develope/workspace/ZDocs/webapps/html/hotels.html");
		InputStreamReader inputStreamReader = new InputStreamReader(file, "UTF-8");
		BufferedReader buf = new BufferedReader(inputStreamReader);
		String htmlStr = "";
		String readLine = ""; 
		
		while((readLine = buf.readLine()) != null){
			htmlStr += readLine;
		}
		buf.close();
		inputStreamReader.close();
		file.close();
		
		List<Map<String, Object>> list = getStayInfoList(htmlStr);
	
		if (list != null) {
			for (Map<String, Object> map : list) {
				System.out.println(map.get("stayName") + " , " + map.get("imageUrl") + " , " + map.get("price") + " , " + map.get("score") + " , " + map.get("linkUrl") + " , " + map.get("stayDesc"));
			}
		}
	}
	
	public static List<Map<String, Object>> getStayInfoList(String htmlStr){
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		
		if (htmlStr.indexOf(HOTELS_CONTENTS_START) != -1) {
			int sidx = htmlStr.indexOf(HOTELS_CONTENTS_START);
			int eidx = htmlStr.indexOf(HOTELS_CONTENTS_END, sidx) + HOTELS_CONTENTS_END.length();
			String contents = htmlStr.substring(sidx, eidx);
			
			while (contents.indexOf(HOTELS_STAY_INFO_SEP) != -1) {

				sidx = contents.indexOf(HOTELS_STAY_INFO_SEP);
				eidx = contents.indexOf(HOTELS_STAY_INFO_SEP, sidx + HOTELS_STAY_INFO_SEP.length());

				if (sidx != -1 && eidx == -1) {
					eidx = contents.length();
				}
				if (sidx == -1 || eidx == -1) {
					continue;
				}
				String item = contents.substring(sidx, eidx);
				contents = contents.substring(eidx);

				Map<String, Object> itemMap = new HashMap<String, Object>();

				// stayName
				itemMap.put("stayName", getInnerText(item, HOTELS_STAY_NAME_START, HOTELS_STAY_NAME_END));
				
				// imageUtl
				itemMap.put("imageUrl", getInnerText(item, HOTELS_IMAGE_URL_START, HOTELS_IMAGE_URL_END));
				
				// score
				String score = getInnerText(item, HOTELS_SCORE_START, HOTELS_SCORE_END);
				if (score.indexOf(">") != -1) {
					score = score.substring(score.indexOf(">") + 1);
				}
				itemMap.put("score", score);
				
				// price
				String price = "";
				if (item.indexOf(HOTELS_PRICE_START_INS) != -1) {
					price = getInnerText(item, HOTELS_PRICE_START_INS, HOTELS_PRICE_END_INS);
				} else {
					price = getInnerText(item, HOTELS_PRICE_START, HOTELS_PRICE_END);
					if (price.indexOf("<strong") != -1) {
						int idx = price.indexOf(">", price.indexOf("<strong")) + 1;
						price = price.substring(idx);
					}
				}
				itemMap.put("price", price);

				// linkUrl
				String linkUrl = HOTELS_URL + getInnerText(item, HOTELS_LINK_URL_START, HOTELS_LINK_URL_END);
				itemMap.put("linkUrl", linkUrl);
				
				// stayDesc
				String stayDesc = getInnerText(item, HOTELS_STAY_DESC_START_1, HOTELS_STAY_DESC_END_1);
				stayDesc = stayDesc.replaceAll("</li><li>", ", ");
				stayDesc = stayDesc.replaceAll("<li>", "");
				stayDesc = stayDesc.replaceAll("</li>", "");
				String parking = getInnerText(item, HOTELS_STAY_DESC_START_2, HOTELS_STAY_DESC_END_2);
				stayDesc = ("".contentEquals(parking)) ? stayDesc:(stayDesc + " / " + parking);
				String aircondition = getInnerText(item, HOTELS_STAY_DESC_START_3, HOTELS_STAY_DESC_END_3);
				stayDesc = ("".contentEquals(aircondition)) ? stayDesc:(stayDesc + " / " + aircondition);
				itemMap.put("stayDesc", stayDesc);

				list.add(itemMap);
				
			}
			
			
		}
		
		return list;
	}

	private static String getInnerText(String htmlStr, String startText, String endText) {
		String retStr = "";
		
		int sidx = htmlStr.indexOf(startText) + startText.length();
		int eidx = htmlStr.indexOf(endText, sidx + 1);
		if (sidx != -1 && eidx != -1) {
			retStr = htmlStr.substring(sidx, eidx);
		}
		return retStr;
	}
}
