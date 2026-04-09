package com.mis.feeder.voyagePerformanceTracker;

import java.util.ArrayList;
import java.util.List;

public class voyagePerformanceTrackerResultBean {

	private boolean isSuccess;

	 private List<voyagePerformanceTrackerBean> serviceList = new ArrayList<>();
	 private List<voyagePerformanceTrackerBean> vesselList = new ArrayList<>();
	 private List<voyagePerformanceTrackerBean> voyageDtlList; 
	 private List<voyagePerformanceTrackerBean> utilisationList; 
	 private List<voyagePerformanceTrackerBean> customerList;
	 private List<voyagePerformanceTrackerBean> customerVoyageList;
	 private List<voyagePerformanceTrackerBean> customerVoyageValueList;
	 
	 private voyagePerformanceTrackerBean bean;
	    
	 private voyagePerformanceTrackerBean bean1;
	    
	 private voyagePerformanceTrackerBean bean2;
	    
	 private voyagePerformanceTrackerBean bean3;
	    
	 private voyagePerformanceTrackerBean bean4;
	 
	 
	public List<voyagePerformanceTrackerBean> getVoyageDtlList() {
		return voyageDtlList;
	}
	public void setVoyageDtlList(List<voyagePerformanceTrackerBean> voyageDtlList) {
		this.voyageDtlList = voyageDtlList;
	}
	public List<voyagePerformanceTrackerBean> getUtilisationList() {
		return utilisationList;
	}
	public void setUtilisationList(List<voyagePerformanceTrackerBean> utilisationList) {
		this.utilisationList = utilisationList;
	}
	public List<voyagePerformanceTrackerBean> getCustomerList() {
		return customerList;
	}
	public void setCustomerList(List<voyagePerformanceTrackerBean> customerList) {
		this.customerList = customerList;
	}
	public List<voyagePerformanceTrackerBean> getCustomerVoyageList() {
		return customerVoyageList;
	}
	public void setCustomerVoyageList(List<voyagePerformanceTrackerBean> customerVoyageList) {
		this.customerVoyageList = customerVoyageList;
	}
	public List<voyagePerformanceTrackerBean> getCustomerVoyageValueList() {
		return customerVoyageValueList;
	}
	public void setCustomerVoyageValueList(List<voyagePerformanceTrackerBean> customerVoyageValueList) {
		this.customerVoyageValueList = customerVoyageValueList;
	}
	 private List<voyagePerformanceTrackerBean> voyageWeightList = new ArrayList<>();
	 private List<voyagePerformanceTrackerBean> mloScatterPlotList = new ArrayList<>();
	 private List<voyagePerformanceTrackerBean> agentScatterPlotList = new ArrayList<>();
	 private List<voyagePerformanceTrackerBean> nvoccScatterPlotList = new ArrayList<>();
	 private List<voyagePerformanceTrackerBean> jvScatterPlotList = new ArrayList<>();

	public List<voyagePerformanceTrackerBean> getVoyageWeightList() { return voyageWeightList; }
	public void setVoyageWeightList(List<voyagePerformanceTrackerBean> voyageWeightList) { this.voyageWeightList = voyageWeightList; }
	public List<voyagePerformanceTrackerBean> getMloScatterPlotList() { return mloScatterPlotList; }
	public void setMloScatterPlotList(List<voyagePerformanceTrackerBean> mloScatterPlotList) { this.mloScatterPlotList = mloScatterPlotList; }
	public List<voyagePerformanceTrackerBean> getAgentScatterPlotList() { return agentScatterPlotList; }
	public void setAgentScatterPlotList(List<voyagePerformanceTrackerBean> agentScatterPlotList) { this.agentScatterPlotList = agentScatterPlotList; }
	public List<voyagePerformanceTrackerBean> getNvoccScatterPlotList() { return nvoccScatterPlotList; }
	public void setNvoccScatterPlotList(List<voyagePerformanceTrackerBean> nvoccScatterPlotList) { this.nvoccScatterPlotList = nvoccScatterPlotList; }
	public List<voyagePerformanceTrackerBean> getJvScatterPlotList() { return jvScatterPlotList; }
	public void setJvScatterPlotList(List<voyagePerformanceTrackerBean> jvScatterPlotList) { this.jvScatterPlotList = jvScatterPlotList; }

	public List<voyagePerformanceTrackerBean> getServiceList() { return serviceList; }
	public void setServiceList(List<voyagePerformanceTrackerBean> serviceList) { this.serviceList = serviceList; }
	public List<voyagePerformanceTrackerBean> getVesselList() { return vesselList; }
	public void setVesselList(List<voyagePerformanceTrackerBean> vesselList) { this.vesselList = vesselList; }

	public boolean isSuccess() {
		return isSuccess;
	}
	public void setSuccess(boolean isSuccess) {
		this.isSuccess = isSuccess;
	}
	public voyagePerformanceTrackerBean getBean() {
		return bean;
	}
	public void setBean(voyagePerformanceTrackerBean bean) {
		this.bean = bean;
	}
	public voyagePerformanceTrackerBean getBean1() {
		return bean1;
	}
	public void setBean1(voyagePerformanceTrackerBean bean1) {
		this.bean1 = bean1;
	}
	public voyagePerformanceTrackerBean getBean2() {
		return bean2;
	}
	public void setBean2(voyagePerformanceTrackerBean bean2) {
		this.bean2 = bean2;
	}
	public voyagePerformanceTrackerBean getBean3() {
		return bean3;
	}
	public void setBean3(voyagePerformanceTrackerBean bean3) {
		this.bean3 = bean3;
	}
	public voyagePerformanceTrackerBean getBean4() {
		return bean4;
	}
	public void setBean4(voyagePerformanceTrackerBean bean4) {
		this.bean4 = bean4;
	}
	 
	 
}
