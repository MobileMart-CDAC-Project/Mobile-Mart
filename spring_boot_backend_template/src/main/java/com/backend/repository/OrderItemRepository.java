package com.backend.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

//import com.backend.dto.OrderDto;
import com.backend.entitys.Order;
import com.backend.entitys.OrderItem;
import com.backend.entitys.Product;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

//	   OrderDto placeOrder();
//
//	    List<OrderDto> myOrders();
//
//	    OrderDto orderDetails(Long orderId);
	 List<OrderItem> findByOrder(Order order);
	 
	 @Query("SELECT SUM(oi.quantity) FROM OrderItem oi WHERE oi.product.productId = :productId")
	 Integer getTotalQuantitySold(@Param("productId") Long productId);
	 
	 @Query("SELECT SUM(oi.quantity * oi.price) FROM OrderItem oi WHERE oi.product.productId = :productId")
	 Double getTotalRevenue(@Param("productId") Long productId);
}
