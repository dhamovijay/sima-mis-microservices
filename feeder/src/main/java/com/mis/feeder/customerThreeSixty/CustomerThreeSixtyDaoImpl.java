package com.mis.feeder.customerThreeSixty;

import java.util.List;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class CustomerThreeSixtyDaoImpl implements CustomerThreeSixtyDao {

    @Autowired
    private DataSource dataSource;

    @Override
    public CustomerThreeSixtyResultBean getCustomerDropDown() {
        CustomerThreeSixtyResultBean result = new CustomerThreeSixtyResultBean();
        try {
            JdbcTemplate jdbc = new JdbcTemplate(dataSource);
            List<CustomerThreeSixtyBean> list = jdbc.query(
                "select mlo_code as id, mlo_name as text from mlo_master order by mlo_name",
                new BeanPropertyRowMapper<>(CustomerThreeSixtyBean.class));
            result.setDataList(list);
            result.setSuccess(true);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    @Override
    public CustomerThreeSixtyResultBean getPortDropDown() {
        CustomerThreeSixtyResultBean result = new CustomerThreeSixtyResultBean();
        try {
            JdbcTemplate jdbc = new JdbcTemplate(dataSource);
            List<CustomerThreeSixtyBean> list = jdbc.query(
                "select port_code as id, port_name as text from public.port_master_gfs",
                new BeanPropertyRowMapper<>(CustomerThreeSixtyBean.class));
            result.setDataList(list);
            result.setSuccess(true);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    @Override
    public CustomerThreeSixtyResultBean getCustomerRevenueRate(CustomerThreeSixtyBean bean) {
        CustomerThreeSixtyResultBean result = new CustomerThreeSixtyResultBean();
        try {
            JdbcTemplate jdbc = new JdbcTemplate(dataSource);
            String revQuery = "SELECT customer, mlo_name AS customerName, invoice_dt AS year, SUM(rev) AS rev " +
                "FROM cust_by_amt_revenue WHERE invoice_dt = ? AND customer = ? " +
                "GROUP BY customer, mlo_name, invoice_dt ORDER BY rev DESC";
            List<CustomerThreeSixtyBean> revList = jdbc.query(revQuery,
                new Object[]{bean.getYear(), bean.getCustomer()},
                new BeanPropertyRowMapper<>(CustomerThreeSixtyBean.class));
            result.setDataList(revList);

            String teusQuery = "SELECT mlo AS customer, mlo_name AS customerName, loading_year AS year, SUM(mlo_loading_teus) AS tues " +
                "FROM contribution_rev_tues WHERE loading_year = ? AND mlo = ? " +
                "GROUP BY mlo, mlo_name, loading_year ORDER BY tues DESC";
            List<CustomerThreeSixtyBean> teusList = jdbc.query(teusQuery,
                new Object[]{bean.getYear(), bean.getCustomer()},
                new BeanPropertyRowMapper<>(CustomerThreeSixtyBean.class));
            result.setTuesList(teusList);

            result.setSuccess(true);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    @Override
    public CustomerThreeSixtyResultBean getCustomerByRate(CustomerThreeSixtyBean bean) {
        CustomerThreeSixtyResultBean result = new CustomerThreeSixtyResultBean();
        try {
            JdbcTemplate jdbc = new JdbcTemplate(dataSource);
            String query = "WITH customer_rate AS (" +
                "SELECT mlo.mlo_name AS customerName, customer_d20 as minRate, customer_d40 as maxRate " +
                "FROM cust_by_rate cb JOIN mlo_master mlo ON mlo_code=cb.customer_mlo_id " +
                "WHERE customer_mlo_id = ? AND pol = ? AND pod = ?) " +
                "SELECT * FROM customer_rate";
            List<CustomerThreeSixtyBean> list = jdbc.query(query,
                new Object[]{bean.getCustomer(), bean.getPol(), bean.getPod()},
                new BeanPropertyRowMapper<>(CustomerThreeSixtyBean.class));
            result.setRateList(list);
            result.setSuccess(true);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    @Override
    public CustomerThreeSixtyResultBean getBlendedRateList(CustomerThreeSixtyBean bean) {
        CustomerThreeSixtyResultBean result = new CustomerThreeSixtyResultBean();
        try {
            JdbcTemplate jdbc = new JdbcTemplate(dataSource);
            String graphQuery = "SELECT TO_CHAR(TO_DATE(montext, 'YYYY-MM-DD'), 'MON') AS label, " +
                "ROUND(COALESCE(SUM(nondf_revenue) / NULLIF(SUM(nondf_tues), 0), 0)::NUMERIC, 2) AS rev " +
                "FROM blended_rate_new WHERE yeartext = ? " +
                "GROUP BY TO_CHAR(TO_DATE(montext, 'YYYY-MM-DD'), 'MON') " +
                "ORDER BY TO_DATE(TO_CHAR(TO_DATE(montext, 'YYYY-MM-DD'), 'MON') || ' 01', 'MON DD')";
            List<CustomerThreeSixtyBean> graphList = jdbc.query(graphQuery,
                new Object[]{bean.getYear()},
                new BeanPropertyRowMapper<>(CustomerThreeSixtyBean.class));
            result.setGraphList(graphList);

            String tableQuery = "SELECT CONCAT(montext, '-', yeartext) as montext, " +
                "COALESCE(ROUND(SUM(nondf_revenue)::NUMERIC,2),0) AS revenue, " +
                "COALESCE(ROUND(SUM(nondf_tues)::NUMERIC,2),0) AS tues, " +
                "ROUND(COALESCE(SUM(nondf_revenue) / NULLIF(SUM(nondf_tues), 0), 0)::NUMERIC,2) AS rate " +
                "FROM blended_rate_new WHERE yeartext = ? " +
                "GROUP BY montext, yeartext ORDER BY TO_DATE(montext, 'MON')";
            List<CustomerThreeSixtyBean> tableList = jdbc.query(tableQuery,
                new Object[]{bean.getYear()},
                new BeanPropertyRowMapper<>(CustomerThreeSixtyBean.class));
            result.setTableList(tableList);

            result.setSuccess(true);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }
}
