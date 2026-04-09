package com.mis.feeder.vesselMonthlyReport;

public interface VesselMonthlyReportDao {
    VesselMonthlyReportResultBean getVesselDetails();
    VesselMonthlyReportResultBean getVesselCosts(String vesselId);
}
