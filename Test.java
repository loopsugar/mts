package com.sugar.test;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.InputStreamReader;

public class Test {

	//private final static String SEARCH_URL = "https://www.google.com/search?q=dolomiti&source=lnms&tbm=isch";
	private static final String IMAGE_EXT_LIST = "|JPG|JPEG|GIF|PNG|SVG|";
	private static final String GOOGLE_IMAGE_START1 = "[\"http";
	private static final String GOOGLE_IMAGE_START2 = "\",\"http";
	private static final String GOOGLE_IMAGE_END = "\"";
	
	public static void main(String args[]) throws Exception {

		FileInputStream file = new FileInputStream("D:/Project/develope/workspace/ZDocs/temp/google.txt");
		InputStreamReader inputStreamReader = new InputStreamReader(file, "UTF-8");
		BufferedReader buf = new BufferedReader(inputStreamReader);
		String htmlStr = "";
		String readLine = ""; 
		int startIndex = 0;
		int endIndex = 0;
		while((readLine = buf.readLine()) != null){
			htmlStr += readLine;
		}
		buf.close();
		inputStreamReader.close();
		file.close();

		while (htmlStr.indexOf(GOOGLE_IMAGE_START1) != -1) {
			startIndex = htmlStr.indexOf(GOOGLE_IMAGE_START1) + 2;
			endIndex = htmlStr.indexOf(GOOGLE_IMAGE_END, startIndex);

			String imageUrl = htmlStr.substring(startIndex, endIndex);
			htmlStr = htmlStr.substring(endIndex);
			
			if (isImageUrl(imageUrl)) {
				startIndex = htmlStr.indexOf(GOOGLE_IMAGE_START2, endIndex) + 3;
				endIndex = htmlStr.indexOf(GOOGLE_IMAGE_END, startIndex);
				if (startIndex >= 3 && endIndex >= 0) {
					String linkUrl = htmlStr.substring(startIndex, endIndex);
					htmlStr = htmlStr.substring(endIndex);

					System.out.println(">> " + startIndex + "," + endIndex + " >> " + imageUrl + " , " + linkUrl);
				}
			}
		}
		
	}
	
	private static boolean isImageUrl(String url) {
		boolean retb = false;
		
		if (url.lastIndexOf(".") != -1) {
			String extStr = url.substring(url.lastIndexOf(".")+1).toUpperCase();
			if (IMAGE_EXT_LIST.indexOf(extStr) != -1) {
				retb = true;
			}
		}
		
		return retb;
	}
}
