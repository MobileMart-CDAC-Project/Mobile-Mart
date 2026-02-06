package com.backend.controller;

import org.springframework.lang.NonNull;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.backend.service.ImageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ImageController {

    private final ImageService imageService;

    // upload 4–5 images
    @PostMapping("/products/{productId}/images")
    public ResponseEntity<List<String>> uploadImages(
            @PathVariable @NonNull Long productId,
            @RequestParam("files") MultipartFile[] files) {

        return ResponseEntity.ok(
                imageService.uploadProductImages(productId, files)
        );
    }

    // delete single image by ID
    @DeleteMapping("/products/{imageId}")
    public ResponseEntity<Void> deleteImage(@PathVariable @NonNull Long imageId) {

        imageService.deleteImage(imageId);
        return ResponseEntity.noContent().build();
    }

    // delete image by filename
    @DeleteMapping("/images/{filename}")
    public ResponseEntity<Void> deleteImageByFilename(@PathVariable @NonNull String filename) {

        imageService.deleteImageByFilename(filename);
        return ResponseEntity.noContent().build();
    }
}




