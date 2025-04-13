package com.fitnesstan.fitnesstan_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.admin.SpringApplicationAdminJmxAutoConfiguration;

@SpringBootApplication(exclude = {SpringApplicationAdminJmxAutoConfiguration.class})
public class FitnesstanApplication {
    public static void main(String[] args) {
        SpringApplication.run(FitnesstanApplication.class, args);

		System.out.println("-----------------------------");
		System.out.println("| Fitnesstan Running | ");
		System.out.println("-----------------------------");
	}

}
