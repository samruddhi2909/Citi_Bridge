package com.citi.trade.stock;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.Reader;
import java.net.URL;
import java.nio.charset.Charset;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;

import com.citi.trade.constant.TradeApplicationConstants;

public class RecommendedStockServlet extends HttpServlet {

	private static final String LARGE_CAP_URL = "http://query.yahooapis.com/v1/public/yql?q=select%20Name,symbol,Ask,MarketCapitalization,PEGRatio%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22HSBC%22,%22HCA%22,%22HAL%22,%22HPQ%22,%22IBM%22,%22HSBA.L%22,%22MSFT%22,%22AAPL%22,%22GOOGL%22,%22INFY%22,%22HES%22)%20limit%205|sort(field=%22PEGRatio%22,descending=%22true%22)&format=json&env=store://datatables.org/alltableswithkeys";
	private static final String MID_CAP_URL = "http://query.yahooapis.com/v1/public/yql?q=select%20Name,symbol,Ask,MarketCapitalization,PEGRatio%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22TSS%22,%22FFIN%22,%22HP%22,%22MBI%22,%22CVI%22,%22DPM%22,%22XL%22,%22KW%22,%22STL%22,%22VAC%22)%20limit%205|sort(field=%22PEGRatio%22,descending=%22true%22)&format=json&env=store://datatables.org/alltableswithkeys";
	private static final String SMALL_CAP_URL = "http://query.yahooapis.com/v1/public/yql?q=select%20Name,symbol,Ask,MarketCapitalization,PEGRatio%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22MNKD%22,%22SJW%22,%22PLAB%22,%22RDCM%22,%22SHLD%22,%22VDSI%22,%22TCS%22,%22IIN%22,%22RAFI%22)%20limit%205|sort(field=%22PEGRatio%22,descending=%22true%22)&format=json&env=store://datatables.org/alltableswithkeys";

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		System.out.println("In RecommendedStockServlet");
		response.setContentType(TradeApplicationConstants.JSON_CONTENT_TYPE);

		String marketCap = (String) request.getParameter("selectedCap");
		System.out.println("request parameters:" + request.getParameter("selectedCap"));
		System.out.println("marketCap:" + marketCap);
		JSONObject json = null;
		switch (marketCap) {
		case "SmallCap":
			json = readJsonFromUrl(SMALL_CAP_URL);
			break;
		case "MiddleCap":
			json = readJsonFromUrl(MID_CAP_URL);
			break;
		case "LargeCap":
			json = readJsonFromUrl(LARGE_CAP_URL);
			break;
		}
		if (null != json)
			System.out.println(json);

		PrintWriter out = response.getWriter();
		out.println(json);
	}

	public static JSONObject readJsonFromUrl(String url) throws IOException, JSONException {
		InputStream is = new URL(url).openStream();
		try {
			BufferedReader rd = new BufferedReader(new InputStreamReader(is, Charset.forName("UTF-8")));
			String jsonText = readAll(rd);
			JSONObject json = new JSONObject(jsonText);
			return json;
		} finally {
			is.close();
		}
	}

	private static String readAll(Reader rd) throws IOException {
		StringBuilder sb = new StringBuilder();
		int cp;
		while ((cp = rd.read()) != -1) {
			sb.append((char) cp);
		}
		return sb.toString();
	}
}