package com.backend.security;






import java.util.List;

//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
////import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//
//import lombok.RequiredArgsConstructor;
////
//@Configuration
//@EnableMethodSecurity
//@RequiredArgsConstructor
//public class SecurityConfig {
//
//    private final JwtAuthenticationFilter jwtAuthenticationFilter;
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//
//        http
//            .csrf(csrf -> csrf.disable())
//            .sessionManagement(session ->
//                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//            )
//            .authorizeHttpRequests(auth -> auth
//                .requestMatchers("/api/auth/**").permitAll()
//                .requestMatchers("/api/products/**").permitAll()
//                .requestMatchers("/images/**").permitAll()
//                .anyRequest().authenticated()
//            )
//            .addFilterBefore(
//                jwtAuthenticationFilter,
//                UsernamePasswordAuthenticationFilter.class
//            );
//
//        return http.build();
//    }
//}



import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


import lombok.RequiredArgsConstructor;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
  
	 private final JwtAuthenticationFilter jwtAuthenticationFilter;
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
        	.cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm ->
                sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
//            .authorizeHttpRequests(auth -> auth
//                // PUBLIC APIs
//                .requestMatchers(
//                    "/api/auth/**",
//                    "/swagger-ui/**",
//                    "/v3/api-docs/**",
//                    "/api/products/**",
//                    "/images/**"
//                ).permitAll()
//
//                // everything else secured
//                .anyRequest().authenticated()
//            )
            .authorizeHttpRequests(auth -> auth

            	    // ✅ ALLOW ACTUATOR FOR RAILWAY
            	    .requestMatchers(
            	        "/actuator/health",
            	        "/actuator/info"
            	    ).permitAll()

            	    // PUBLIC
            	    .requestMatchers(
            	        "/api/auth/**",
            	        "/api/products/**",
            	        "/api/payments/**",
            	        "/api/transactions/**",
            	        "/images/**",
            	        "/swagger-ui/**",
            	        "/v3/api-docs/**"
            	    ).permitAll()

            	    // PRODUCT COMMENTS
            	    .requestMatchers(HttpMethod.GET,
            	            "/api/products/*/comments")
            	    .permitAll()

            	    .requestMatchers(HttpMethod.POST,
            	            "/api/products/*/comments")
            	    .hasRole("USER")

            	    // USER APIs
            	    .requestMatchers("/api/cart/**", "/api/orders/**", "/api/user/**")
            	    .hasRole("USER")

            	    // ADMIN APIs
            	    .requestMatchers("/api/admin/**")
            	    .hasRole("ADMIN")

            	    .anyRequest().authenticated()
            	)


            .addFilterBefore(
                    jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

    CorsConfiguration config = new CorsConfiguration();

    //allow all origins for development purposes
    config.setAllowedOrigins(List.of(
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "https://mobile-mart-production-e345.up.railway.app" // RAILWAY URL
    ));

    config.setAllowedMethods(List.of(
        "GET", "POST", "PUT", "DELETE", "OPTIONS"
    ));

    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);

    return source;
}

}

