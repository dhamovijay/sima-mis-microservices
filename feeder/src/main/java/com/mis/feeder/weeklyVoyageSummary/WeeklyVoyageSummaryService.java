package com.mis.feeder.weeklyVoyageSummary;

public interface WeeklyVoyageSummaryService {

	WeeklyVoyageSummaryResultBean getInitialChart();

	WeeklyVoyageSummaryResultBean getTableList(String value);

}
