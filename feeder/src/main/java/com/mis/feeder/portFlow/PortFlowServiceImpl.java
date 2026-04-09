package com.mis.feeder.portFlow;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PortFlowServiceImpl implements PortFlowService {

    @Autowired
    private PortFlowDao dao;

    @Override
    public PortFlowResultBean getPortFlowHeader(PortFlowBean bean) {
        return dao.getPortFlowHeader(bean);
    }
}
