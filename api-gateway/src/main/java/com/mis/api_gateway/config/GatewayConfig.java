package com.mis.api_gateway.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

import com.mis.api_gateway.routes.AuthServiceRoutes;
import com.mis.api_gateway.routes.FeederServiceRoutes;
import com.mis.api_gateway.routes.NvocServiceRoutes;

@Configuration
@Import({AuthServiceRoutes.class, FeederServiceRoutes.class, NvocServiceRoutes.class})
public class GatewayConfig {
    
    // Global filters or common configuration can go here
}
