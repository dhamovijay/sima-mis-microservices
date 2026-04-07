package com.mis.feeder.weeklyVoyageSummary;

import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class WeeklyVoyageSummaryDaoImpl implements WeeklyVoyageSummaryDao {
	
	
	@Autowired
	DataSource dataSource;
	

	@Override
	public WeeklyVoyageSummaryResultBean getInitialChart() {
		WeeklyVoyageSummaryResultBean resBean = new WeeklyVoyageSummaryResultBean();
		List <WeeklyVoyageSummaryBean> yearDataList = new ArrayList<WeeklyVoyageSummaryBean>();
		List <WeeklyVoyageSummaryBean> monthDataList = new ArrayList<WeeklyVoyageSummaryBean>();
		List <WeeklyVoyageSummaryBean> weekDataList = new ArrayList<WeeklyVoyageSummaryBean>();
 		
		JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
		
         try {
        	 
        	String yearWiseQuery="select * from vw_get_weekly_voyage_summary_yearly()"; 
        	String monthWiseQuery="select * from vw_get_weekly_voyage_summary_monthly()"; 
        	String weekWiseQuery="select * from vw_get_weekly_voyage_summary_weekly()"; 
		           
			yearDataList = jdbcTemplate.query(yearWiseQuery, new BeanPropertyRowMapper<WeeklyVoyageSummaryBean>(WeeklyVoyageSummaryBean.class));

			monthDataList = jdbcTemplate.query(monthWiseQuery, new BeanPropertyRowMapper<WeeklyVoyageSummaryBean>(WeeklyVoyageSummaryBean.class));

			weekDataList = jdbcTemplate.query(weekWiseQuery, new BeanPropertyRowMapper<WeeklyVoyageSummaryBean>(WeeklyVoyageSummaryBean.class));

			
			resBean.setMonthDataList(monthDataList);
			resBean.setYearDataList(yearDataList);
			resBean.setWeekDataList(weekDataList);
			
			resBean.setSuccess(true);

		} catch (Exception e) {
			resBean.setSuccess(false);
			e.printStackTrace();
			
		}
				
		return resBean;
	}


	@Override
	public WeeklyVoyageSummaryResultBean getTableList(String value) {
		WeeklyVoyageSummaryResultBean resultBean = new WeeklyVoyageSummaryResultBean();
		List<WeeklyVoyageSummaryBean> tableList = new ArrayList<WeeklyVoyageSummaryBean>();
		List<WeeklyVoyageSummaryBean> tableList2 = new ArrayList<WeeklyVoyageSummaryBean>();
		
		JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
		try {
			String week="";
			String year=""; 
			
			if (value.contains("-")) {
				String array1[] = value.split("-");

				year = array1[0];
				week = array1[1];
			} 
			
			if(week.equals("1")){
				week = "01";
			}
			if(week.equals("2")){
				week = "02";
			}
			if(week.equals("3")){
				week = "03";
			}
			if(week.equals("4")){
				week = "04";
			}
			if(week.equals("5")){
				week = "05";
			}
			if(week.equals("6")){
				week = "06";
			}
			if(week.equals("7")){
				week = "07";
			}
			if(week.equals("8")){
				week = "08";
			}
			if(week.equals("9")){
				week = "09";
			}
			
			
			String query=null;
			String query2=null;
			
			query="select * from vw_get_weekly_voyage_summary_table_dtl('"+year+"','"+week+"')  where (voyagetype ='O' or null_or_empty(voyagetype)) ";
			query2="select * from vw_get_weekly_voyage_summary_table_dtl('"+year+"','"+week+"')  where voyagetype='T'";
			
			tableList = jdbcTemplate.query(query,new Object[]{}, new BeanPropertyRowMapper<WeeklyVoyageSummaryBean>(WeeklyVoyageSummaryBean.class));
			tableList2 =  jdbcTemplate.query(query2,new Object[]{}, new BeanPropertyRowMapper<WeeklyVoyageSummaryBean>(WeeklyVoyageSummaryBean.class));
		 

			resultBean.setTableList(tableList);
			resultBean.setTableList2(tableList2);
			
		} catch (Exception e) {
			e.printStackTrace();
		}

		return resultBean;
	}

}
