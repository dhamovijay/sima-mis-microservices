package com.mis.feeder.weeklyVoyageSummary;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/feeder/weekly")
public class WeeklyVoyageSummaryController {

	@Autowired
	WeeklyVoyageSummaryService 	wvsService;
	
	@RequestMapping("/getInitialChart")
	public @ResponseBody WeeklyVoyageSummaryResultBean getInitialChart() throws Exception {
		WeeklyVoyageSummaryResultBean resultBean = new WeeklyVoyageSummaryResultBean();
		try {
			resultBean=wvsService.getInitialChart();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return resultBean;
	}
	
	@PostMapping("/tableList")
	public WeeklyVoyageSummaryResultBean getTableList(@RequestParam("value")String value) throws Exception { 
		WeeklyVoyageSummaryResultBean resultBean = new WeeklyVoyageSummaryResultBean(); 
		try {
		resultBean=wvsService.getTableList(value); 
		} catch (Exception e) {
			e.printStackTrace();
		}
		return resultBean;
	}
	
}
