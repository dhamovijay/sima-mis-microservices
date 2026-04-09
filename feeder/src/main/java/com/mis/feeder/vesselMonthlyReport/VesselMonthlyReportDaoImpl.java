package com.mis.feeder.vesselMonthlyReport;

import java.util.List;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class VesselMonthlyReportDaoImpl implements VesselMonthlyReportDao {

    @Autowired
    private DataSource dataSource;

    @Override
    public VesselMonthlyReportResultBean getVesselDetails() {
        VesselMonthlyReportResultBean result = new VesselMonthlyReportResultBean();
        try {
            JdbcTemplate jdbc = new JdbcTemplate(dataSource);
            String query = "select vessel_code as vesselCode, vessel_name as vesselName, sector_id as service, " +
                "year_place_build as build, to_char(round(purchaseprice), 'FM9,999,999,999') as purchasePrice, " +
                "to_char(round(bookvalue), 'FM9,999,999,999') as bookValue, flagofficial_no as flag, " +
                "vessel_capacity as vesselCapacity, nominal_teus as nominalTeus, " +
                "to_char(round(marketvalue), 'FM9,999,999,999') as marketValue, " +
                "to_char(round(loanoutstanding), 'FM9,999,999,999') as loanOutstanding, " +
                "to_char(loanoutstandingdate,'dd/mm/yyyy')::text as loanDate, " +
                "case when marketvalue !=0 then round(abs((loanoutstanding/marketvalue::float)*100)::numeric,2) else 0 end as ltvPercentage " +
                "from vessel_information";
            List<VesselMonthlyReportBean> list = jdbc.query(query, new BeanPropertyRowMapper<>(VesselMonthlyReportBean.class));
            result.setVesselList(list);
            result.setSuccess(true);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    @Override
    public VesselMonthlyReportResultBean getVesselCosts(String vesselId) {
        VesselMonthlyReportResultBean result = new VesselMonthlyReportResultBean();
        try {
            JdbcTemplate jdbc = new JdbcTemplate(dataSource);
            String[] categories = {"CREW EXPENSES", "Other expenses", "Commercial, ISM and legal",
                "Insurance", "Repairs and upgrades", "Lubricants, chemicals, gases"};

            result.setCostTable1(queryCost(jdbc, vesselId, categories[0]));
            result.setCostTable2(queryCost(jdbc, vesselId, categories[1]));
            result.setCostTable3(queryCost(jdbc, vesselId, categories[2]));
            result.setCostTable4(queryCost(jdbc, vesselId, categories[3]));
            result.setCostTable5(queryCost(jdbc, vesselId, categories[4]));
            result.setCostTable6(queryCost(jdbc, vesselId, categories[5]));
            result.setSuccess(true);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    private List<VesselMonthlyReportBean> queryCost(JdbcTemplate jdbc, String vesselId, String category) {
        String query = "select * from vw_get_vessel_detailed_cost(?, ?)";
        return jdbc.query(query, new Object[]{vesselId, category}, new BeanPropertyRowMapper<>(VesselMonthlyReportBean.class));
    }
}
