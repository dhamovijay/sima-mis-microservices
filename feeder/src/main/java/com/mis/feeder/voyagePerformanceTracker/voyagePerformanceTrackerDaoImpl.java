package com.mis.feeder.voyagePerformanceTracker;

import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class voyagePerformanceTrackerDaoImpl implements voyagePerformanceTrackerDao{
	
	@Autowired
	DataSource dataSource;

	@Override
	public voyagePerformanceTrackerResultBean getDropdowns() {
		voyagePerformanceTrackerResultBean resBean = new voyagePerformanceTrackerResultBean();
		JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
		try {
			String serviceQuery = "select distinct sector_code as id, sector_code as text from vessel_service_teus_weight_dtls where sector_code in (select distinct sector_id from voyage_gfs where sch_start_date::date >= now()::date - 720) order by 1";
			List<voyagePerformanceTrackerBean> serviceList = jdbcTemplate.query(serviceQuery, new BeanPropertyRowMapper<>(voyagePerformanceTrackerBean.class));
			resBean.setServiceList(serviceList);
			resBean.setSuccess(true);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return resBean;
	}

	public voyagePerformanceTrackerResultBean getVesselsByService(String sectorId) {
		voyagePerformanceTrackerResultBean resBean = new voyagePerformanceTrackerResultBean();
		JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
		try {
			String vesselQuery = "select distinct vessel_name as id, vessel_name as text from vessel_service_teus_weight_dtls where vessel_code in (select distinct vessel_id from voyage_gfs where sch_start_date::date >= now()::date - 720) and sector_code = ? order by 1";
			List<voyagePerformanceTrackerBean> vesselList = jdbcTemplate.query(vesselQuery, new Object[]{sectorId}, new BeanPropertyRowMapper<>(voyagePerformanceTrackerBean.class));
			resBean.setVesselList(vesselList);
			resBean.setSuccess(true);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return resBean;
	}

	@SuppressWarnings("deprecation")
	@Override
	public voyagePerformanceTrackerResultBean getChartData(voyagePerformanceTrackerBean vptBean) {
		voyagePerformanceTrackerResultBean resBean = new voyagePerformanceTrackerResultBean();
		List <voyagePerformanceTrackerBean> voyageDtlList = new ArrayList<voyagePerformanceTrackerBean>();
		
		List <voyagePerformanceTrackerBean> utilisationList = new ArrayList<voyagePerformanceTrackerBean>();
		
		List <voyagePerformanceTrackerBean> revenueList = new ArrayList<voyagePerformanceTrackerBean>();
		
		List <voyagePerformanceTrackerBean> marginList = new ArrayList<voyagePerformanceTrackerBean>();
		
		List <voyagePerformanceTrackerBean> customerList = new ArrayList<voyagePerformanceTrackerBean>();
		
		List <voyagePerformanceTrackerBean> customerVoyageList = new ArrayList<voyagePerformanceTrackerBean>();
		
		List <voyagePerformanceTrackerBean> customerVoyageValueList = new ArrayList<voyagePerformanceTrackerBean>();
		
		voyagePerformanceTrackerBean chartBean = new voyagePerformanceTrackerBean();
		voyagePerformanceTrackerBean chartBean1 = new voyagePerformanceTrackerBean();
		voyagePerformanceTrackerBean chartBean2 = new voyagePerformanceTrackerBean();
		voyagePerformanceTrackerBean chartBean3 = new voyagePerformanceTrackerBean();
		voyagePerformanceTrackerBean chartBean4 = new voyagePerformanceTrackerBean();
		
		List <voyagePerformanceTrackerBean> marginVoyageList = new ArrayList<voyagePerformanceTrackerBean>();
		
		List <voyagePerformanceTrackerBean> loadingUtilTeusList = new ArrayList<voyagePerformanceTrackerBean>();
		
		
		JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
         try {
			
				//start queries 
        	 
        	   String voyageDurationQuery="select * from vw_get_voyage_performance_voyage_duration_graph('"+vptBean.getSectorId()+"','"+vptBean.getVesselId()+"')";
        	   
        	   String loadingsQuery="select * from vw_get_voyage_performance_loadings_graph('"+vptBean.getSectorId()+"','"+vptBean.getVesselId()+"')";

        	   String revenueQuery="select * from vw_get_voyage_performance_revenues_graph('"+vptBean.getSectorId()+"','"+vptBean.getVesselId()+"')";
        	   
        	   String contributionMarginQuery="select * from vw_get_voyage_performance_contribution_margin_graph('"+vptBean.getSectorId()+"','"+vptBean.getVesselId()+"')";

        	 
        	   //end queries
				
				
				voyageDtlList=jdbcTemplate.query(voyageDurationQuery,new Object[] {}, new BeanPropertyRowMapper<voyagePerformanceTrackerBean>(voyagePerformanceTrackerBean.class));
				
				utilisationList = jdbcTemplate.query(loadingsQuery,new Object[] {}, new BeanPropertyRowMapper<voyagePerformanceTrackerBean>(voyagePerformanceTrackerBean.class));
				
				revenueList = jdbcTemplate.query(revenueQuery,new Object[] {}, new BeanPropertyRowMapper<voyagePerformanceTrackerBean>(voyagePerformanceTrackerBean.class));

				marginList = jdbcTemplate.query(contributionMarginQuery,new Object[] {}, new BeanPropertyRowMapper<voyagePerformanceTrackerBean>(voyagePerformanceTrackerBean.class));

				
				for(voyagePerformanceTrackerBean bean : utilisationList) {
					
					String query="select * from vw_get_voyage_performance_loadings_graph_prevoyage('"+bean.getVoyageId()+"')";
					
                    voyagePerformanceTrackerBean blog = new voyagePerformanceTrackerBean();
					
    				Double utilTeus = jdbcTemplate.queryForObject(query,new Object[] {},(Double.class));

					blog.setTotalWeight(utilTeus);
					blog.setClosedate(bean.getClosedate());
					
					loadingUtilTeusList.add(blog);
					
				}
				
				
				//stacked chart
				String GET_CUSTOMER_MONTHWISE_REVENUE_LIST = "select * from vw_get_voyage_performance_tracker_stacked_graph_customer_distin(?,?)";

				String GET_VOYAGE_CUSTOMER_MONTHWISE_REVENUE_LIST = "select * from vw_get_voyage_performance_tracker_stacked_graph_voyage_distinct(?,?)";

				String GET_VOYAGE_CUSTOMER_VALUE_MONTHWISE_REVENUE_LIST = "select * from vw_get_voyage_performance_tracker_stacked_graph_values(?,?)";

				customerList = jdbcTemplate.query(GET_CUSTOMER_MONTHWISE_REVENUE_LIST,new Object[] {vptBean.getSectorId(),vptBean.getVesselId()}, new BeanPropertyRowMapper<voyagePerformanceTrackerBean>(voyagePerformanceTrackerBean.class));

				customerVoyageList = jdbcTemplate.query(GET_VOYAGE_CUSTOMER_MONTHWISE_REVENUE_LIST,new Object[] {vptBean.getSectorId(),vptBean.getVesselId()}, new BeanPropertyRowMapper<voyagePerformanceTrackerBean>(voyagePerformanceTrackerBean.class));

				customerVoyageValueList = jdbcTemplate.query(GET_VOYAGE_CUSTOMER_VALUE_MONTHWISE_REVENUE_LIST,new Object[] {vptBean.getSectorId(),vptBean.getVesselId()}, new BeanPropertyRowMapper<voyagePerformanceTrackerBean>(voyagePerformanceTrackerBean.class));

				
				//stacked chart ends
				
				
				resBean.setVoyageDtlList(voyageDtlList);
				resBean.setUtilisationList(utilisationList);
				resBean.setCustomerList(customerList);
				resBean.setCustomerVoyageList(customerVoyageList);
				resBean.setCustomerVoyageValueList(customerVoyageValueList);

				if (!voyageDtlList.isEmpty()) {
					chartBean = getValuesDays(voyageDtlList);
				}
				
				if (!utilisationList.isEmpty()) {
					chartBean1 = getValuesUtilisationList(utilisationList);
				}
				
				if (!loadingUtilTeusList.isEmpty()) {
					chartBean4 = getValuesUtilisationTeusList(loadingUtilTeusList);
				}
				
				if (!revenueList.isEmpty()) {
					chartBean2 = getValues(revenueList);
				}
				
				if (!marginList.isEmpty()) {
					chartBean3 = getValuesMarginList(marginList);
				}
				
				resBean.setBean(chartBean);
				resBean.setBean1(chartBean1);
				resBean.setBean2(chartBean2);
				resBean.setBean3(chartBean3);
				resBean.setBean4(chartBean4);
				resBean.setUtilisationList(utilisationList);
				resBean.setSuccess(true);

		} catch (Exception e) {
			resBean.setSuccess(false);
			e.printStackTrace();
			
		}
				
		return resBean;
	}
	
	
	
	public voyagePerformanceTrackerBean getValues(List<voyagePerformanceTrackerBean> csrBeans) {
		voyagePerformanceTrackerBean bean = new voyagePerformanceTrackerBean();
		for (voyagePerformanceTrackerBean csrBean : csrBeans) {
			
			bean.addMonthListValues(csrBean.getVoyageId());
			
			bean.addTeusListValues(csrBean.getTotalTeus());
			
			bean.addRevenueListValues(csrBean.getTotalRevenue());
			
			bean.addBlendedListValues(csrBean.getTotalBlended());

		}
		return bean;
	}
	
	
	public voyagePerformanceTrackerBean getValuesDays(List<voyagePerformanceTrackerBean> csrBeans) {
		voyagePerformanceTrackerBean bean = new voyagePerformanceTrackerBean();
		for (voyagePerformanceTrackerBean csrBean : csrBeans) {
			
			bean.addVoyageListValues(csrBean.getVoyageId());
			
			bean.addProformaListValues(csrBean.getTotalProformaVoyDays());
			
			bean.addActualListValues(csrBean.getTotalActualDays());

		}
		return bean;
	}
	
	public voyagePerformanceTrackerBean getValuesUtilisationList(List<voyagePerformanceTrackerBean> csrBeans) {
		voyagePerformanceTrackerBean bean = new voyagePerformanceTrackerBean();
		for (voyagePerformanceTrackerBean csrBean : csrBeans) {
			
			bean.addMonthListValues(csrBean.getVoyageId());
			
			bean.addTeusListValues(csrBean.getTotalTeus());  
		}
		return bean;
	}
	
	public voyagePerformanceTrackerBean getValuesUtilisationTeusList(List<voyagePerformanceTrackerBean> csrBeans) {
		voyagePerformanceTrackerBean bean = new voyagePerformanceTrackerBean();
		
		for (voyagePerformanceTrackerBean csrBean : csrBeans) {
			
			bean.addRevenueListValues(csrBean.getTotalWeight()); 
		}
		return bean;
	}
	
	
	public voyagePerformanceTrackerBean getValuesMarginList(List<voyagePerformanceTrackerBean> csrBeans) {
		voyagePerformanceTrackerBean bean = new voyagePerformanceTrackerBean();
		for (voyagePerformanceTrackerBean csrBean : csrBeans) {
			bean.addVoyageListValues(csrBean.getVoyageId());
			bean.addRevenueListValues(csrBean.getTotalRevenue());
		}
		return bean;
	}

	@Override
	public voyagePerformanceTrackerResultBean getSpeedometerData(voyagePerformanceTrackerBean vptBean) {
		voyagePerformanceTrackerResultBean resBean = new voyagePerformanceTrackerResultBean();
		JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
		try {
			String query = "select * from vw_get_voyage_performance_weight_speedometer_graph(?, ?, ?)";
			List<voyagePerformanceTrackerBean> list = jdbcTemplate.query(query,
				new Object[]{vptBean.getSectorId(), vptBean.getVesselId(), vptBean.getVoyageId()},
				new BeanPropertyRowMapper<>(voyagePerformanceTrackerBean.class));
			resBean.setVoyageWeightList(list);
			resBean.setSuccess(true);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return resBean;
	}

	@Override
	public voyagePerformanceTrackerResultBean getScatterData(voyagePerformanceTrackerBean vptBean) {
		voyagePerformanceTrackerResultBean resBean = new voyagePerformanceTrackerResultBean();
		JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
		try {
			String query = "select * from vw_get_voyage_performance_revenues_scatter_graph(?, ?, ?, ?)";
			resBean.setMloScatterPlotList(jdbcTemplate.query(query, new Object[]{vptBean.getSectorId(), vptBean.getVesselId(), "MLO", vptBean.getVoyageId()}, new BeanPropertyRowMapper<>(voyagePerformanceTrackerBean.class)));
			resBean.setAgentScatterPlotList(jdbcTemplate.query(query, new Object[]{vptBean.getSectorId(), vptBean.getVesselId(), "AGENT", vptBean.getVoyageId()}, new BeanPropertyRowMapper<>(voyagePerformanceTrackerBean.class)));
			resBean.setNvoccScatterPlotList(jdbcTemplate.query(query, new Object[]{vptBean.getSectorId(), vptBean.getVesselId(), "NVOCC", vptBean.getVoyageId()}, new BeanPropertyRowMapper<>(voyagePerformanceTrackerBean.class)));
			resBean.setJvScatterPlotList(jdbcTemplate.query(query, new Object[]{vptBean.getSectorId(), vptBean.getVesselId(), "JV", vptBean.getVoyageId()}, new BeanPropertyRowMapper<>(voyagePerformanceTrackerBean.class)));
			resBean.setSuccess(true);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return resBean;
	}

}
