package com.mis.feeder.voyagePerformanceTracker;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class voyagePerformanceTrackerServiceImpl implements voyagePerformanceTrackerService {

	@Autowired
	voyagePerformanceTrackerDao vptDao;
	
	@Override
	public voyagePerformanceTrackerResultBean getDropdowns() {
		return vptDao.getDropdowns();
	}

	@Override
	public voyagePerformanceTrackerResultBean getVesselsByService(String sectorId) {
		return vptDao.getVesselsByService(sectorId);
	}

	@Override
	public voyagePerformanceTrackerResultBean getChartData(voyagePerformanceTrackerBean vptBean) {
		return vptDao.getChartData(vptBean);
	}

	@Override
	public voyagePerformanceTrackerResultBean getSpeedometerData(voyagePerformanceTrackerBean vptBean) {
		return vptDao.getSpeedometerData(vptBean);
	}

	@Override
	public voyagePerformanceTrackerResultBean getScatterData(voyagePerformanceTrackerBean vptBean) {
		return vptDao.getScatterData(vptBean);
	}

}
