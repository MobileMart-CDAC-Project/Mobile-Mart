package com.backend.dto;



import jakarta.validation.constraints.*;
import lombok.*;

//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//public class ProductUpdateDto {
//
//    @NotBlank
//    private String name;
//
//    @NotNull
//    @Positive
//    private Double price;
//}


@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductUpdateDto {

    @NotBlank
    private String name;

    @NotBlank
    private String brand;

    @NotBlank
    private String description;

    @NotNull
    @Positive
    private Double price;

    @NotNull
    @Min(0)
    private Integer stockQuantity;

    @NotNull
    private Boolean isActive;
}
