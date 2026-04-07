package com.mis.feeder.feederServiceMonthly;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FeederServicesMonthlyReportServiceImpl implements FeederServicesMonthlyReportService{
	
	@Autowired
	FeederServicesMonthlyReportDao fsmDao;

	@Override
	public FeederServicesMonthlyReportResultBean getBasicChartData(FeederServicesMonthlyReportBean fsmBean) throws Exception {
 		return fsmDao.getBasicChartData(fsmBean);
	}

	@Override
	public FeederServicesMonthlyReportResultBean getBreakupList(FeederServicesMonthlyReportBean fsmBean) throws Exception {
 		return fsmDao.getBreakupList(fsmBean);
	}

	 

}
