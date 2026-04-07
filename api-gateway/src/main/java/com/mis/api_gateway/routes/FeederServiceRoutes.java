package com.mis.api_gateway.routes;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeederServiceRoutes {

    @Bean
    public RouteLocator feederRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
            // Monthly services
            .route("feeder-monthly", r -> r
                .path("/api/feeder/monthly/**")
                .uri("lb://feeder"))
            
            // Weekly services  
            .route("feeder-weekly", r -> r
                .path("/api/feeder/weekly/**")
                .uri("lb://feeder"))
            
            // Daily services
            .route("feeder-daily", r -> r
                .path("/api/feeder/tracker/**")
                .uri("lb://feeder"))
            
            // Generic feeder routes
            .route("feeder-generic", r -> r
                .path("/api/feeder/**")
                .uri("lb://feeder"))
            .build();
    }
}