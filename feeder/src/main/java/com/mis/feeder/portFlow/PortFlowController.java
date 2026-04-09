package com.mis.feeder.portFlow;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feeder/portflow")
public class PortFlowController {

    @Autowired
    private PortFlowService service;

    @PostMapping("/header")
    public PortFlowResultBean getPortFlowHeader(@RequestBody PortFlowBean bean) {
        try {
            return service.getPortFlowHeader(bean);
        } catch (Exception e) {
            e.printStackTrace();
            PortFlowResultBean result = new PortFlowResultBean();
            result.setSuccess(false);
            return result;
        }
    }
}
