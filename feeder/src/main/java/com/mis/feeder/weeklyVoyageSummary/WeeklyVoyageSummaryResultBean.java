package com.mis.feeder.weeklyVoyageSummary;

import java.util.ArrayList;
import java.util.List;

public class WeeklyVoyageSummaryResultBean {

	private boolean isSuccess;
	
	private List<WeeklyVoyageSummaryBean> yearDataList = new ArrayList<WeeklyVoyageSummaryBean>();
    private List<WeeklyVoyageSummaryBean> monthDataList = new ArrayList<WeeklyVoyageSummaryBean>();
    private List<WeeklyVoyageSummaryBean> weekDataList = new ArrayList<WeeklyVoyageSummaryBean>();
    
    private List<WeeklyVoyageSummaryBean>  tableList = new ArrayList<WeeklyVoyageSummaryBean>();
    private List<WeeklyVoyageSummaryBean>  tableList2 = new ArrayList<WeeklyVoyageSummaryBean>();
    
	public boolean isSuccess() {
		return isSuccess;
	}
	public void setSuccess(boolean isSuccess) {
		this.isSuccess = isSuccess;
	}
	public List<WeeklyVoyageSummaryBean> getYearDataList() {
		return yearDataList;
	}
	public void setYearDataList(List<WeeklyVoyageSummaryBean> yearDataList) {
		this.yearDataList = yearDataList;
	}
	public List<WeeklyVoyageSummaryBean> getMonthDataList() {
		return monthDataList;
	}
	public void setMonthDataList(List<WeeklyVoyageSummaryBean> monthDataList) {
		this.monthDataList = monthDataList;
	}
	public List<WeeklyVoyageSummaryBean> getWeekDataList() {
		return weekDataList;
	}
	public void setWeekDataList(List<WeeklyVoyageSummaryBean> weekDataList) {
		this.weekDataList = weekDataList;
	}
	public List<WeeklyVoyageSummaryBean> getTableList() {
		return tableList;
	}
	public void setTableList(List<WeeklyVoyageSummaryBean> tableList) {
		this.tableList = tableList;
	}
	public List<WeeklyVoyageSummaryBean> getTableList2() {
		return tableList2;
	}
	public void setTableList2(List<WeeklyVoyageSummaryBean> tableList2) {
		this.tableList2 = tableList2;
	}
    
    
    
}
