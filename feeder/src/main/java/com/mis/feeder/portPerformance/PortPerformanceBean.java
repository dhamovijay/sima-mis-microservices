package com.mis.feeder.portPerformance;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter @Setter @NoArgsConstructor
public class PortPerformanceBean {
    private String voyageId;
    private String pol;
    private String pod;
    private Double loadedteus;
    private Double dischargedteus;
    private Double onboardteus;
    private Double averageutilization;
}
