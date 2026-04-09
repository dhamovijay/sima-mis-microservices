package com.mis.feeder.vesselMonthlyReport;

public interface VesselMonthlyReportService {
    VesselMonthlyReportResultBean getVesselDetails();
    VesselMonthlyReportResultBean getVesselCosts(String vesselId);
}
