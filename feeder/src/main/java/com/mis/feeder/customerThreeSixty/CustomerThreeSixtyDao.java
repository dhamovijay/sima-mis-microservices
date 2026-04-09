package com.mis.feeder.customerThreeSixty;

public interface CustomerThreeSixtyDao {
    CustomerThreeSixtyResultBean getCustomerDropDown();
    CustomerThreeSixtyResultBean getPortDropDown();
    CustomerThreeSixtyResultBean getCustomerRevenueRate(CustomerThreeSixtyBean bean);
    CustomerThreeSixtyResultBean getCustomerByRate(CustomerThreeSixtyBean bean);
    CustomerThreeSixtyResultBean getBlendedRateList(CustomerThreeSixtyBean bean);
}
