package com.mis.feeder.voyagePerformanceTracker;

import java.util.ArrayList;
import java.util.List;

public class voyagePerformanceTrackerBean {

	private String id;
    private String text;
    private String vesselId;
    private String sectorId;
    private String voyageId;
    
    private Double totalWeight;
    private Double totalCapacity;
    private String closedate;
    private Double totalTeus;
    private Double totalRevenue;
    private Double totalProformaVoyDays;
    private Double totalActualDays;
    private Double totalBlended;
    private String customer;
    private Double totalCustValue;
    private String customerShotCode;
    private String vesselName;
    
    private List<Double> totalTeusList = new ArrayList<Double>();
    private List<Double> totalRevenueList = new ArrayList<Double>();
    private List<Double> totalBlendedList = new ArrayList<Double>();
     
    private List<String> voyageList = new ArrayList<String>();
    private List<Double> totalProformaList = new ArrayList<Double>();
    private List<Double> totalActualList = new ArrayList<Double>();
    private List<String> monthList = new ArrayList<String>();
    
    
	public String getId() { return id; }
	public void setId(String id) { this.id = id; }
	public String getText() { return text; }
	public void setText(String text) { this.text = text; }
	public String getCustomer() { return customer; }
	public void setCustomer(String customer) { this.customer = customer; }
	public Double getTotalCustValue() { return totalCustValue; }
	public void setTotalCustValue(Double totalCustValue) { this.totalCustValue = totalCustValue; }
	public String getCustomerShotCode() { return customerShotCode; }
	public void setCustomerShotCode(String customerShotCode) { this.customerShotCode = customerShotCode; }
	public String getVesselName() { return vesselName; }
	public void setVesselName(String vesselName) { this.vesselName = vesselName; }

	public String getVesselId() {
		return vesselId;
	}
	public void setVesselId(String vesselId) {
		this.vesselId = vesselId;
	}
	public String getSectorId() {
		return sectorId;
	}
	public void setSectorId(String sectorId) {
		this.sectorId = sectorId;
	}
	public String getVoyageId() {
		return voyageId;
	}
	public void setVoyageId(String voyageId) {
		this.voyageId = voyageId;
	}
	public Double getTotalWeight() {
		return totalWeight;
	}
	public void setTotalWeight(Double totalWeight) {
		this.totalWeight = totalWeight;
	}
	public Double getTotalCapacity() {
		return totalCapacity;
	}
	public void setTotalCapacity(Double totalCapacity) {
		this.totalCapacity = totalCapacity;
	}
	public String getClosedate() {
		return closedate;
	}
	public void setClosedate(String closedate) {
		this.closedate = closedate;
	}
	public List<Double> getTotalTeusList() {
		return totalTeusList;
	}
	public void setTotalTeusList(List<Double> totalTeusList) {
		this.totalTeusList = totalTeusList;
	}
	public List<Double> getTotalRevenueList() {
		return totalRevenueList;
	}
	public void setTotalRevenueList(List<Double> totalRevenueList) {
		this.totalRevenueList = totalRevenueList;
	} 
	
	public List<Double> getTotalBlendedList() {
		return totalBlendedList;
	}
	public void setTotalBlendedList(List<Double> totalBlendedList) {
		this.totalBlendedList = totalBlendedList;
	}
	
	public List<String> getVoyageList() {
		return voyageList;
	}
	public void setVoyageList(List<String> voyageList) {
		this.voyageList = voyageList;
	}
	public List<Double> getTotalProformaList() {
		return totalProformaList;
	}
	public void setTotalProformaList(List<Double> totalProformaList) {
		this.totalProformaList = totalProformaList;
	}
	public List<Double> getTotalActualList() {
		return totalActualList;
	}
	public void setTotalActualList(List<Double> totalActualList) {
		this.totalActualList = totalActualList;
	}
	public List<String> getMonthList() {
		return monthList;
	}
	public void setMonthList(List<String> monthList) {
		this.monthList = monthList;
	}
	public Double getTotalTeus() {
		return totalTeus;
	}
	public void setTotalTeus(Double totalTeus) {
		this.totalTeus = totalTeus;
	}
	public Double getTotalRevenue() {
		return totalRevenue;
	}
	public void setTotalRevenue(Double totalRevenue) {
		this.totalRevenue = totalRevenue;
	}
	public Double getTotalProformaVoyDays() {
		return totalProformaVoyDays;
	}
	public void setTotalProformaVoyDays(Double totalProformaVoyDays) {
		this.totalProformaVoyDays = totalProformaVoyDays;
	}
	public Double getTotalActualDays() {
		return totalActualDays;
	}
	public void setTotalActualDays(Double totalActualDays) {
		this.totalActualDays = totalActualDays;
	}
	public Double getTotalBlended() {
		return totalBlended;
	}
	public void setTotalBlended(Double totalBlended) {
		this.totalBlended = totalBlended;
	}
    
	
	//////////////////////////////////////////
	
	public void addMonthListValues(String value) {
    	monthList.add(value);
	}
	public void addTeusListValues(Double value) {
    	totalTeusList.add(value);
	}
    
    public void addRevenueListValues(Double value) {
    	totalRevenueList.add(value);
	}
    
    public void addBlendedListValues(Double value) {
    	totalBlendedList.add(value);
	}
     
    public void addVoyageListValues(String value) {
    	voyageList.add(value);
	}
    
    public void addProformaListValues(Double value) {
    	totalProformaList.add(value);
	}
    
    public void addActualListValues(Double value) {
    	totalActualList.add(value);
	}
    
}
