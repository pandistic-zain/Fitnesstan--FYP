package com.fitnesstan.fitnesstan_backend.Controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/images")
public class ImageController {

    @GetMapping("/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            // Adjust the folder path to your actual images directory.
            Path imagePath = Paths.get("Z:/Fitnesstan- FYP/fitnesstan-backend/gif_images/" + filename);

            // Convert file path to a Resource object.
            Resource fileResource = new UrlResource(imagePath.toUri());
            if (!fileResource.exists() || !fileResource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            // For simplicity, we’re returning everything as GIF. 
            // If you have different file extensions, you may want to 
            // detect the content type dynamically (e.g. using Files.probeContentType()).
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_GIF)
                    .body(fileResource);

        } catch (Exception e) {
            // If anything goes wrong (e.g. file not found), return 404.
            return ResponseEntity.notFound().build();
        }
    }
}
