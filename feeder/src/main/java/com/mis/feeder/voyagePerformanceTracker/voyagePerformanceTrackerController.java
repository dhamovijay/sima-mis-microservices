package com.mis.feeder.voyagePerformanceTracker;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/feeder/tracker")
public class voyagePerformanceTrackerController {
	
	@Autowired
	voyagePerformanceTrackerService vptService;
	
	@PostMapping("/getChartData")
	public @ResponseBody voyagePerformanceTrackerResultBean getChartData(@RequestBody voyagePerformanceTrackerBean vptBean) throws Exception {
		voyagePerformanceTrackerResultBean resultBean = new voyagePerformanceTrackerResultBean();
		try {
			resultBean=vptService.getChartData(vptBean);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return resultBean;
	}

}
