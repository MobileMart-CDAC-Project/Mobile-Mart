package com.backend.service;

import org.springframework.lang.NonNull;

import java.util.List;

import com.backend.dto.OrderDetailsDto;
import com.backend.dto.OrderDto;

public interface OrderService {
	//user
		OrderDto placeOrder();
	    List<OrderDto> myOrders();
	    OrderDetailsDto orderDetails(@NonNull Long orderId);
	    void clearCartForOrder(@NonNull Long orderId);
	    
	    // admin
	    List<OrderDto> getAllOrders();
	    OrderDetailsDto getOrderDetailsForAdmin(@NonNull Long orderId);
}
