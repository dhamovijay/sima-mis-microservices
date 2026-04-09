package com.mis.feeder.portPerformance;

import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class PortPerformanceResultBean {
    private boolean success;
    private List<PortPerformanceBean> dataList = new ArrayList<>();
    private List<PortPerformanceBean> loadingList = new ArrayList<>();
    private List<String> categories = new ArrayList<>();
}
