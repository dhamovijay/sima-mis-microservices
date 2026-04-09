package com.mis.feeder.portPerformance;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PortPerformanceServiceImpl implements PortPerformanceService {
    @Autowired
    private PortPerformanceDao dao;

    @Override
    public PortPerformanceResultBean getPortPerformance(String voyageId) {
        return dao.getPortPerformance(voyageId);
    }
}
