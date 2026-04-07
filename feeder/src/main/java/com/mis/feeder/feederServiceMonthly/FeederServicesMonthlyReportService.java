package com.mis.feeder.feederServiceMonthly;

public interface FeederServicesMonthlyReportService { 
	
	FeederServicesMonthlyReportResultBean getBasicChartData(FeederServicesMonthlyReportBean fsmBean) throws Exception;

	FeederServicesMonthlyReportResultBean getBreakupList(FeederServicesMonthlyReportBean fsmBean) throws Exception;

}
