package com.wellnest.main;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.wellnest")
public class WellNestApplication {

	public static void main(String[] args) {
		SpringApplication.run(WellNestApplication.class, args);
	}

}
