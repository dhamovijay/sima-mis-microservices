package com.mis.feeder.voyagePerformanceTracker;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class voyagePerformanceTrackerServiceImpl implements voyagePerformanceTrackerService {

	@Autowired
	voyagePerformanceTrackerDao vptDao;
	
	@Override
	public voyagePerformanceTrackerResultBean getChartData(voyagePerformanceTrackerBean vptBean) {
		// TODO Auto-generated method stub
		return vptDao.getChartData(vptBean);
	}

}
