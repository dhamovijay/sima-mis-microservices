package com.mis.feeder.vesselMonthlyReport;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter @Setter @NoArgsConstructor
public class VesselMonthlyReportBean {
    private String vesselCode;
    private String vesselName;
    private String build;
    private String flag;
    private String service;
    private String normalCapacity;
    private String effectiveCapacity;
    private String purchasePrice;
    private String bookValue;
    private String marketValue;
    private String loanOutstanding;
    private String loanDate;
    private Double ltvPercentage;
    private String nominalTeus;
    private String vesselCapacity;
    // Cost detail fields
    private String expenseType;
    private String expenseName;
    private Double amount;
    private String costCategory;
    private String costName;
    private String costPeriod;
    private Double totalAmount;
}
