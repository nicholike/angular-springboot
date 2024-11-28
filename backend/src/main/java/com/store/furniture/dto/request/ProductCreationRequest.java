package com.store.furniture.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductCreationRequest {
    @NotBlank(message = "PRODUCT_NAME_MANDATORY")
    @Size(min = 2, message = "PRODUCT_NAME_SIZE")
    String name;

    @NotBlank(message = "DESCRIPTION_MANDATORY")
    @Size(min = 1, message = "DESCRIPTION_SIZE")
    String description;

    @NotNull(message = "PRICE_MANDATORY")
    double price;

    MultipartFile image;

    @NotNull(message = "CATEGORY_ID_MANDATORY")
    Long categoryId;
}
