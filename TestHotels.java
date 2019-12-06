package com.sugar.test;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class TestHotels {

	private static final String HOTELS_CONTENTS_START = "<li class=\"hotel\"";
	private static final String HOTELS_CONTENTS_END = "</li>";
	
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
				System.out.println(map.get("imageUrl") + " , " + map.get("score") + " , " + map.get("linkUrl") + " , " + map.get("stayName") + "," + map.get("stayDesc"));
			}
		}
	}
	
	public static List<Map<String, Object>> getStayInfoList(String htmlStr){
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		
		if (htmlStr.indexOf(HOTELS_CONTENTS_START) != -1) {
			int sidx = htmlStr.indexOf(HOTELS_CONTENTS_START);
			int eidx = htmlStr.indexOf(HOTELS_CONTENTS_END, sidx) + HOTELS_CONTENTS_END.length();
			String contents = htmlStr.substring(sidx, eidx);
			System.out.println(contents);
		}
		
		return list;
	}
}
