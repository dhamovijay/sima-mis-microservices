package com.mis.feeder.feederServiceMonthly;

import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class FeederServicesMonthlyReportDaoImpl implements FeederServicesMonthlyReportDao {

    @Autowired
    private DataSource dataSource; 

	@SuppressWarnings("deprecation")
	@Override
	public FeederServicesMonthlyReportResultBean getBasicChartData(FeederServicesMonthlyReportBean fsmBean) {
		FeederServicesMonthlyReportResultBean resBean = new FeederServicesMonthlyReportResultBean();
		List <FeederServicesMonthlyReportBean> dataList = new ArrayList<FeederServicesMonthlyReportBean>();
 		JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
		
         try {
        	 
        	 String Query="select * from vw_get_feeder_services_monthly_leftside_graph_dtl('"+fsmBean.getYear()+"','"+fsmBean.getMonth()+"')";
			
        	 dataList = jdbcTemplate.query(Query,new Object[] {}, new BeanPropertyRowMapper<FeederServicesMonthlyReportBean>(FeederServicesMonthlyReportBean.class));

		
			resBean.setDataList(dataList);
			
			resBean.setSuccess(true);

		} catch (Exception e) {
			resBean.setSuccess(false);
			e.printStackTrace();
			
		}
				
		return resBean;
	}

	@SuppressWarnings("deprecation")
	@Override
	public FeederServicesMonthlyReportResultBean getBreakupList(FeederServicesMonthlyReportBean fsmBean) 
			throws Exception { 
		FeederServicesMonthlyReportResultBean resultBean = new FeederServicesMonthlyReportResultBean();
		    
		    try {
		        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
		        String query = "select * from vw_get_feeder_services_monthly_rightside_graph_dtl(?)";
		        
		        List<FeederServicesMonthlyReportBean> list = jdbcTemplate.query(
		            query, 
		            new Object[]{fsmBean.getService()}, 
		            new BeanPropertyRowMapper<>(FeederServicesMonthlyReportBean.class)
		        );

		        FeederServicesMonthlyReportBean chartBean = new FeederServicesMonthlyReportBean();
		        
		        if (!list.isEmpty()) {
		            for (FeederServicesMonthlyReportBean Bean : list) {
		                chartBean.addMonthListValues(Bean.getMonth());
		                chartBean.addTeusListValues(Bean.getTotalTeus());
		                chartBean.addRevenueListValues(Bean.getTotalRevenue());
		                chartBean.addBlendedListValues(Bean.getTotalBlended());
		            }
		        }
		        
		        resultBean.setBean(chartBean);
		        
		    } catch (Exception e) {
		        e.printStackTrace();
		    }

		    return resultBean;}
}
