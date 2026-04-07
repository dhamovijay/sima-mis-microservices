package com.mis.feeder.feederServiceMonthly;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FeederServicesMonthlyReportBean {
 
	 
	
	private String id;
    private String text;
    private String service;
    private String serviceShortCode;
    private Double totalTeus;
    private Double totalRevenue;
    private Double totalBlended;
    private String month;
    private String year;
    
    private List<Double> totalTeusList = new ArrayList<Double>();
    private List<Double> totalRevenueList = new ArrayList<Double>();
    private List<Double> totalBlendedList = new ArrayList<Double>();
    private List<String> monthList = new ArrayList<String>(); 
    
    
    
    public void addTeusListValues(Double value) {
    	totalTeusList.add(value);
	}
    
    public void addRevenueListValues(Double value) {
    	totalRevenueList.add(value);
	}
    
    public void addBlendedListValues(Double value) {
    	totalBlendedList.add(value);
	}
    
    public void addMonthListValues(String value) {
    	monthList.add(value);
	}
    
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public String getService() {
		return service;
	}
	public void setService(String service) {
		this.service = service;
	}
	public String getServiceShortCode() {
		return serviceShortCode;
	}
	public void setServiceShortCode(String serviceShortCode) {
		this.serviceShortCode = serviceShortCode;
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
	public Double getTotalBlended() {
		return totalBlended;
	}
	public void setTotalBlended(Double totalBlended) {
		this.totalBlended = totalBlended;
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
	public List<String> getMonthList() {
		return monthList;
	}
	public void setMonthList(List<String> monthList) {
		this.monthList = monthList;
	}
	public String getYear() {
		return year;
	}
	public void setYear(String year) {
		this.year = year;
	}
	public String getMonth() {
		return month;
	}
	public void setMonth(String month) {
		this.month = month;
	}
	 
	  
	
}
