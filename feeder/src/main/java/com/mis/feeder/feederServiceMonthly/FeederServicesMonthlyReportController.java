package com.mis.feeder.feederServiceMonthly;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/feeder/monthly")
public class FeederServicesMonthlyReportController {

	@Autowired
	private FeederServicesMonthlyReportService fsmService;
	
	@PostMapping("/getBasicChart")
	public @ResponseBody FeederServicesMonthlyReportResultBean getBasicChartData(@RequestBody FeederServicesMonthlyReportBean fsmBean) {
		FeederServicesMonthlyReportResultBean resultBean = new FeederServicesMonthlyReportResultBean();
		try {
			resultBean=fsmService.getBasicChartData(fsmBean);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return resultBean;
	}
	
	
	@PostMapping("/synchronizeChartList")
	public FeederServicesMonthlyReportResultBean getBreakupList(@RequestBody FeederServicesMonthlyReportBean fsmBean) {
		
		FeederServicesMonthlyReportResultBean resultBean = new FeederServicesMonthlyReportResultBean();

		try {
			resultBean=fsmService.getBreakupList(fsmBean);
		} catch (Exception e) {
 			e.printStackTrace();
		}

		return resultBean;
	}
	
}
