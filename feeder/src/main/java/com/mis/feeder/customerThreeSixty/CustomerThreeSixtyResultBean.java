package com.mis.feeder.customerThreeSixty;

import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CustomerThreeSixtyResultBean {
    private boolean success;
    private List<CustomerThreeSixtyBean> dataList = new ArrayList<>();
    private List<CustomerThreeSixtyBean> tuesList = new ArrayList<>();
    private List<CustomerThreeSixtyBean> rateList = new ArrayList<>();
    private List<CustomerThreeSixtyBean> graphList = new ArrayList<>();
    private List<CustomerThreeSixtyBean> tableList = new ArrayList<>();
}
