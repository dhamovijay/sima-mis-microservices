package com.mis.feeder.portPerformance;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feeder/portperformance")
public class PortPerformanceController {

    @Autowired
    private PortPerformanceService service;

    @GetMapping("/chart")
    public PortPerformanceResultBean getPortPerformance(@RequestParam("voyageId") String voyageId) {
        try {
            return service.getPortPerformance(voyageId);
        } catch (Exception e) {
            e.printStackTrace();
            PortPerformanceResultBean result = new PortPerformanceResultBean();
            result.setSuccess(false);
            return result;
        }
    }
}
