package com.mis.feeder.weeklyVoyageSummary;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WeeklyVoyageSummaryServiceImpl implements WeeklyVoyageSummaryService{

	@Autowired
	WeeklyVoyageSummaryDao wvsDao;
	
	@Override
	public WeeklyVoyageSummaryResultBean getInitialChart() {
 		return wvsDao.getInitialChart();
	}

	@Override
	public WeeklyVoyageSummaryResultBean getTableList(String value) {
		return wvsDao.getTableList(value);
	}

}
