package com.mis.feeder.portFlow;

import java.util.List;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class PortFlowDaoImpl implements PortFlowDao {

    @Autowired
    private DataSource dataSource;

    @Override
    public PortFlowResultBean getPortFlowHeader(PortFlowBean bean) {
        PortFlowResultBean result = new PortFlowResultBean();
        try {
            JdbcTemplate jdbc = new JdbcTemplate(dataSource);
            String query = "select * from vw_get_port_flows_dependancy_wheel(?, ?, ?)";
            List<PortFlowBean> list = jdbc.query(query,
                new Object[]{bean.getYear(), bean.getMonth(), bean.getType()},
                new BeanPropertyRowMapper<>(PortFlowBean.class));
            result.setDataList(list);
            result.setSuccess(true);
        } catch (Exception e) {
            e.printStackTrace();
            result.setSuccess(false);
        }
        return result;
    }
}
