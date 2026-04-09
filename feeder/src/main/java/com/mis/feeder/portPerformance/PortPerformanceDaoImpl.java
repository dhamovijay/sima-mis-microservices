package com.mis.feeder.portPerformance;

import java.util.List;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class PortPerformanceDaoImpl implements PortPerformanceDao {

    @Autowired
    private DataSource dataSource;

    @Override
    public PortPerformanceResultBean getPortPerformance(String voyageId) {
        PortPerformanceResultBean result = new PortPerformanceResultBean();
        try {
            JdbcTemplate jdbc = new JdbcTemplate(dataSource);

            String utilQuery = "select concat(polseq,'-',pol) as pol, concat(podseq,'-',pod) as pod, averageutilization from vw_get_portperformance_voy_chart(?) order by 1";
            List<PortPerformanceBean> utilList = jdbc.query(utilQuery, new Object[]{voyageId}, new BeanPropertyRowMapper<>(PortPerformanceBean.class));
            result.setDataList(utilList);

            String loadQuery = "select concat(polseq,'-',pol) as pol, sum(loadedteus) as loadedteus, sum(-dischargedteus) as dischargedteus, sum(onboardteus) as onboardteus from vw_get_portperformance_voy_chart(?) group by 1 order by 1";
            List<PortPerformanceBean> loadList = jdbc.query(loadQuery, new Object[]{voyageId}, new BeanPropertyRowMapper<>(PortPerformanceBean.class));
            result.setLoadingList(loadList);

            String catQuery = "select distinct concat(polseq,'-',pol) as pol from vw_get_portperformance_voy_chart(?) order by 1";
            List<String> cats = jdbc.queryForList(catQuery, new Object[]{voyageId}, String.class);
            result.setCategories(cats);

            result.setSuccess(true);
        } catch (Exception e) {
            e.printStackTrace();
            result.setSuccess(false);
        }
        return result;
    }
}
