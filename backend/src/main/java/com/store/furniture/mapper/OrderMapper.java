package com.store.furniture.mapper;

import com.store.furniture.dto.request.OrderCreationRequest;
import com.store.furniture.dto.request.OrderUpdateRequest;
import com.store.furniture.dto.response.OrderResponse;
import com.store.furniture.entity.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {OrderItemMapper.class})
public interface OrderMapper {
    @Mapping(source = "orderItems", target = "orderItems")
    OrderResponse toResponse(Order order);

    Order toOrder(OrderCreationRequest request);

    void updateOrder(@MappingTarget Order order, OrderUpdateRequest orderUpdateRequest);



}