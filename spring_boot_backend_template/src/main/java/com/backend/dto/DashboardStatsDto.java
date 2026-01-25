package com.backend.dto;



import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {
    private long totalUsers;
    private long totalOrders;
}
