package com.backend.repository;



import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.entitys.Order;
import com.backend.entitys.User;

public interface OrderRepository extends JpaRepository<Order, Long> {

	List<Order> findByUser(User user);
}
