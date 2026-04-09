package com.mis.feeder.voyagePerformanceTracker;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feeder/tracker")
public class voyagePerformanceTrackerController {
	
	@Autowired
	voyagePerformanceTrackerService vptService;
	
	@GetMapping("/dropdowns")
	public voyagePerformanceTrackerResultBean getDropdowns() {
		voyagePerformanceTrackerResultBean resultBean = new voyagePerformanceTrackerResultBean();
		try {
			resultBean = vptService.getDropdowns();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return resultBean;
	}

	@GetMapping("/vessels")
	public voyagePerformanceTrackerResultBean getVesselsByService(@RequestParam("sectorId") String sectorId) {
		voyagePerformanceTrackerResultBean resultBean = new voyagePerformanceTrackerResultBean();
		try {
			resultBean = vptService.getVesselsByService(sectorId);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return resultBean;
	}

	@PostMapping("/speedometerChartList")
	public voyagePerformanceTrackerResultBean getSpeedometerData(@RequestBody voyagePerformanceTrackerBean vptBean) {
		try { return vptService.getSpeedometerData(vptBean); }
		catch (Exception e) { e.printStackTrace(); return new voyagePerformanceTrackerResultBean(); }
	}

	@PostMapping("/scatterChartList")
	public voyagePerformanceTrackerResultBean getScatterData(@RequestBody voyagePerformanceTrackerBean vptBean) {
		try { return vptService.getScatterData(vptBean); }
		catch (Exception e) { e.printStackTrace(); return new voyagePerformanceTrackerResultBean(); }
	}

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
