package com.mis.feeder.customerThreeSixty;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feeder/customer360")
public class CustomerThreeSixtyController {

    @Autowired
    private CustomerThreeSixtyService service;

    @GetMapping("/customerDropDown")
    public CustomerThreeSixtyResultBean getCustomerDropDown() {
        return service.getCustomerDropDown();
    }

    @GetMapping("/portDropDown")
    public CustomerThreeSixtyResultBean getPortDropDown() {
        return service.getPortDropDown();
    }

    @PostMapping("/revenueRate")
    public CustomerThreeSixtyResultBean getCustomerRevenueRate(@RequestBody CustomerThreeSixtyBean bean) {
        return service.getCustomerRevenueRate(bean);
    }

    @PostMapping("/customerByRate")
    public CustomerThreeSixtyResultBean getCustomerByRate(@RequestBody CustomerThreeSixtyBean bean) {
        return service.getCustomerByRate(bean);
    }

    @PostMapping("/blendedRate")
    public CustomerThreeSixtyResultBean getBlendedRateList(@RequestBody CustomerThreeSixtyBean bean) {
        return service.getBlendedRateList(bean);
    }
}
