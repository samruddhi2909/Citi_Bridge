package com.citi.trade.stock;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import com.citi.trade.constant.TradeApplicationConstants;
import com.citi.trade.dao.StockDAO;

public class SaveStockServlet extends HttpServlet {
	private static final String INSERT_STOCK_QUERY = "insert into user_saved_stock values(?,?,?,?,?)";

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		System.out.println("In SaveStockServlet");
		response.setContentType(TradeApplicationConstants.JSON_CONTENT_TYPE);
		PrintWriter out = response.getWriter();
		String selectedStocks = request.getParameter("selectedStocks");
		String lineContent;
		System.out.println("selectedStocks:" + selectedStocks);
		StringBuilder sb = new StringBuilder();
		BufferedReader br = request.getReader();
		while ((lineContent = br.readLine()) != null) {
			sb.append(lineContent);
			System.out.println("sb:" + sb);
		}

		JSONParser parser = new JSONParser();
		Object obj = null;
		try {
			obj = parser.parse(sb.toString());
		} catch (ParseException e1) {
			e1.printStackTrace();
		}
		JSONObject jsonObject = (JSONObject) obj;
		JSONArray selectedStockJSONArray = (JSONArray) jsonObject.get("selectedStocks");

		StockDAO stockDAO = new StockDAO();
		boolean isSuccessful = stockDAO.saveStocks("1", selectedStockJSONArray);
		if (isSuccessful) {
		} else {
			response.setStatus(400);
		}

	}

}
