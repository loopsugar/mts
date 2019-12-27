package com.sugar.test;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TestCamping {

	private static final String CAMPING_URL = "https://www.campingcard.co.uk";
	private static final String CAMPING_SEARCH_URL = "https://www.campingcard.co.uk/search/specific/?query=paris";
	private static final String CAMPING_TYPE_START = "<ul class=\"search-region-list\">";
	private static final String CAMPING_TYPE_END = "</ul>";
	private static final String CAMPING_ITEM_START = "<li class=\"search-region-list__item\">";
	private static final String CAMPING_ITEM_END = "</li>";
	private static final String CAMPING_ITEM_LINK_START = "<a href=\"";
	private static final String CAMPING_ITEM_LINK_END = "\"";
	private static final String CAMPING_ITEM_TITLE_START = "<span class=\"search-region-list__item-title";
	private static final String CAMPING_ITEM_TITLE_START_SEP = "\">";
	private static final String CAMPING_ITEM_TITLE_END = "</span>";
	private static final String CAMPING_ITEM_DESC_START = "<span class=\"search-region-list__item-region";
	private static final String CAMPING_ITEM_DESC_START_SEP = "\">";
	private static final String CAMPING_ITEM_DESC_END = "</span>";
	
	public static void main(String args[]) throws Exception {
		
		FileInputStream file = new FileInputStream("D:/Project/develope/workspace/ZDocs/temp/temp.html");
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
		
		List<Map<String, Object>> list = getCampingInfoList(htmlStr);
	
		if (!list.isEmpty()) {
			for (Map<String, Object> map : list) {
				System.out.println(map.get("type") + " , " + map.get("title") + " , " + map.get("linkUrl") + " , " + map.get("desc"));
			}
		}
	}
	
	public static List<Map<String, Object>> getCampingInfoList(String htmlStr){
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();

		String contents = htmlStr;
		int idx = 0;
		
		while (contents.indexOf(CAMPING_TYPE_START) != -1 && idx < 2) {
			
			int sidx = contents.indexOf(CAMPING_TYPE_START);
			int eidx = contents.indexOf(CAMPING_TYPE_END, sidx) + CAMPING_TYPE_END.length();
			
			String campingStr = contents.substring(sidx, eidx);
			contents = contents.substring(eidx);
			
			while (campingStr.indexOf(CAMPING_ITEM_START) != -1) {
				sidx = campingStr.indexOf(CAMPING_ITEM_START);
				eidx = campingStr.indexOf(CAMPING_ITEM_END, sidx) + CAMPING_ITEM_END.length();
				
				String item = campingStr.substring(sidx, eidx);
				campingStr = campingStr.substring(eidx);
				
				Map<String, Object> map = new HashMap<String,Object>();
				map.put("type", (idx==0) ? "town":"name");
				map.put("title", getInnerText(item, CAMPING_ITEM_TITLE_START, CAMPING_ITEM_TITLE_START_SEP, CAMPING_ITEM_TITLE_END));
				map.put("desc", getInnerText(item, CAMPING_ITEM_DESC_START, CAMPING_ITEM_DESC_START_SEP, CAMPING_ITEM_DESC_END));
				map.put("linkUrl", CAMPING_URL + getInnerText(item, CAMPING_ITEM_LINK_START, null, CAMPING_ITEM_LINK_END));
				list.add(map);
				
			}

			idx++;
		}
		
		
		return list;
	}

	private static String getInnerText(String htmlStr, String startText, String startTextSep, String endText) {
		String retStr = "";
		
		int sidx = htmlStr.indexOf(startText) + startText.length();
		if (startTextSep != null) {
			sidx = htmlStr.indexOf(startTextSep, sidx) + CAMPING_ITEM_TITLE_START_SEP.length();
		}
		int eidx = htmlStr.indexOf(endText, sidx + 1);
		if (sidx != -1 && eidx != -1) {
			retStr = htmlStr.substring(sidx, eidx);
		}
		return retStr;
	}
}
