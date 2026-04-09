package com.mis.feeder.portFlow;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class PortFlowBean {
    private String year;
    private String month;
    private String type;
    private String pol;
    private String pod;
    private String sector;
    private Double teus;
    private String convertteus;
}
