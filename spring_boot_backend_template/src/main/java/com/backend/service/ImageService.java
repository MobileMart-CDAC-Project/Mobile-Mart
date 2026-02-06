package com.backend.service;

import java.util.List;

import org.springframework.lang.NonNull;

import org.springframework.web.multipart.MultipartFile;

public interface ImageService {

    List<String> uploadProductImages(@NonNull Long productId, MultipartFile[] files);

    void deleteImage(@NonNull Long imageId);

    void deleteImageByFilename(@NonNull String filename);
}
