package com.mis.feeder.vesselMonthlyReport;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feeder/vesselmonthly")
public class VesselMonthlyReportController {

    @Autowired
    private VesselMonthlyReportService service;

    @GetMapping("/vessels")
    public VesselMonthlyReportResultBean getVesselDetails() {
        return service.getVesselDetails();
    }

    @GetMapping("/costs")
    public VesselMonthlyReportResultBean getVesselCosts(@RequestParam("vesselId") String vesselId) {
        return service.getVesselCosts(vesselId);
    }
}
