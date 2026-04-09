package com.mis.feeder.portFlow;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class PortFlowResultBean {
    private boolean success;
    private List<PortFlowBean> dataList = new ArrayList<>();
}
