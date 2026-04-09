package com.mis.feeder.vesselMonthlyReport;

import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class VesselMonthlyReportResultBean {
    private boolean success;
    private List<VesselMonthlyReportBean> vesselList = new ArrayList<>();
    private List<VesselMonthlyReportBean> costTable1 = new ArrayList<>();
    private List<VesselMonthlyReportBean> costTable2 = new ArrayList<>();
    private List<VesselMonthlyReportBean> costTable3 = new ArrayList<>();
    private List<VesselMonthlyReportBean> costTable4 = new ArrayList<>();
    private List<VesselMonthlyReportBean> costTable5 = new ArrayList<>();
    private List<VesselMonthlyReportBean> costTable6 = new ArrayList<>();
}
