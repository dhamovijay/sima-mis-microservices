package com.mis.api_gateway.routes;


import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class NvocServiceRoutes {

    @Bean
    public RouteLocator nvocRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("nvoc-service", r -> r
                .path("/api/nvoc/**")
                .uri("lb://nvoc-service"))
            .build();
    }
}