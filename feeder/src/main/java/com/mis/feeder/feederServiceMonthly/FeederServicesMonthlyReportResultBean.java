package com.mis.feeder.feederServiceMonthly;

import java.util.ArrayList;
import java.util.List;

public class FeederServicesMonthlyReportResultBean {

	private List<FeederServicesMonthlyReportBean> dataList = new ArrayList<FeederServicesMonthlyReportBean>();
	private boolean success;
	 private FeederServicesMonthlyReportBean bean;
	
	

	public boolean isSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

	public List<FeederServicesMonthlyReportBean> getDataList() {
		return dataList;
	}

	public void setDataList(List<FeederServicesMonthlyReportBean> dataList) {
		this.dataList = dataList;
	}

	public FeederServicesMonthlyReportBean getBean() {
		return bean;
	}

	public void setBean(FeederServicesMonthlyReportBean bean) {
		this.bean = bean;
	}
	
	
}
