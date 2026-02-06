package com.backend.dto;



import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {
    private Long totalProducts;
    private Long totalSold;
    private Double revenue;
}

