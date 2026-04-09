package com.mis.feeder.vesselMonthlyReport;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VesselMonthlyReportServiceImpl implements VesselMonthlyReportService {
    @Autowired
    private VesselMonthlyReportDao dao;

    @Override
    public VesselMonthlyReportResultBean getVesselDetails() { return dao.getVesselDetails(); }
    @Override
    public VesselMonthlyReportResultBean getVesselCosts(String vesselId) { return dao.getVesselCosts(vesselId); }
}
