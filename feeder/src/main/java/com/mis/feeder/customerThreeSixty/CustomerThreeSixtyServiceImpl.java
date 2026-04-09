package com.mis.feeder.customerThreeSixty;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CustomerThreeSixtyServiceImpl implements CustomerThreeSixtyService {

    @Autowired
    private CustomerThreeSixtyDao dao;

    @Override
    public CustomerThreeSixtyResultBean getCustomerDropDown() { return dao.getCustomerDropDown(); }
    @Override
    public CustomerThreeSixtyResultBean getPortDropDown() { return dao.getPortDropDown(); }
    @Override
    public CustomerThreeSixtyResultBean getCustomerRevenueRate(CustomerThreeSixtyBean bean) { return dao.getCustomerRevenueRate(bean); }
    @Override
    public CustomerThreeSixtyResultBean getCustomerByRate(CustomerThreeSixtyBean bean) { return dao.getCustomerByRate(bean); }
    @Override
    public CustomerThreeSixtyResultBean getBlendedRateList(CustomerThreeSixtyBean bean) { return dao.getBlendedRateList(bean); }
}
