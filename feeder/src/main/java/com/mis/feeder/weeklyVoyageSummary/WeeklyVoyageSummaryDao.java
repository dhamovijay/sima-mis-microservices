package com.mis.feeder.weeklyVoyageSummary;

public interface WeeklyVoyageSummaryDao {

	WeeklyVoyageSummaryResultBean getInitialChart();

	WeeklyVoyageSummaryResultBean getTableList(String value);

}
