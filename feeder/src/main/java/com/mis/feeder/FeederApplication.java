package com.mis.feeder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class FeederApplication {

	public static void main(String[] args) {
		SpringApplication.run(FeederApplication.class, args);
	}

}
