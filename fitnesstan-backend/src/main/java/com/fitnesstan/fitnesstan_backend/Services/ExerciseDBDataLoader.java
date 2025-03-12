package com.fitnesstan.fitnesstan_backend.Services;

import com.fitnesstan.fitnesstan_backend.DAO.ExerciseRepository;
import com.fitnesstan.fitnesstan_backend.DTO.ExerciseDBDto;
import com.fitnesstan.fitnesstan_backend.Entity.Exercise;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.*;

@Component
public class ExerciseDBDataLoader implements ApplicationRunner {

    @Autowired
    private ExerciseRepository exerciseRepository;

    // RapidAPI credentials from application.properties
    @Value("${exercisedb.api.key}")
    private String exercisedbApiKey;

    @Value("${exercisedb.api.host}")
    private String exercisedbApiHost;

    // Directory to save downloaded GIFs locally.
    private static final String GIF_DIR = "gif_images";

    @Override
    public void run(ApplicationArguments args) throws Exception {
        // If the collection is empty, fetch exercises in batches
        if (exerciseRepository.count() == 0) {
            fetchAllExercisesInBatches();
        }
        System.out.println("All Exercises are fetched correctly...!");
    }

    /**
     * Repeatedly fetch 10 exercises at a time (using offset), assign each to one of 7 groups,
     * download the GIF and save locally, then add new exercises to the database.
     * Also, prints a breakdown for each batch.
     */
    public void fetchAllExercisesInBatches() {
        System.out.println("Starting batch fetch from ExerciseDB...");
        int offset = 0;
        boolean newExercisesAdded = true;
        int totalAdded = 0;
        int batchCount = 0;
        // Set to collect unique body parts from all fetched exercises
        Set<String> uniqueBodyParts = new HashSet<>();

        while (newExercisesAdded) {
            batchCount++;
            List<ExerciseDBDto> batch = fetchExercisesWithOffset(offset, 10);
            if (batch.isEmpty()) {
                System.out.println("API returned empty batch, stopping.");
                break;
            }

            int newlyAddedThisBatch = 0;
            int totalInBatch = batch.size();
            // Map to count group assignments for this batch
            Map<String, Integer> batchGroupCount = new HashMap<>();

            for (int i = 0; i < totalInBatch; i++) {
                ExerciseDBDto dto = batch.get(i);
                
                // Collect unique body parts
                if (dto.getBodyPart() != null) {
                    uniqueBodyParts.add(dto.getBodyPart());
                }
                
                // Determine which of the 7 groups the exercise belongs to
                String group = determineGroup(dto.getBodyPart());
                
                // Count the group assignment for this batch
                batchGroupCount.put(group, batchGroupCount.getOrDefault(group, 0) + 1);
                
                // Check for duplicates by exercise name
                if (!exerciseRepository.existsByName(dto.getName())) {
                    // Build a description using target and equipment info
                    String description = "Target: " + dto.getTarget() + ", Equipment: " + dto.getEquipment();
                    
                    // Download the GIF and get the local file path
                    String localGifUrl = downloadAndSaveGif(dto.getGifUrl(), dto.getName());
                    
                    // Build and save the Exercise entity using the determined group as muscleGroup.
                    Exercise exercise = Exercise.builder()
                            .name(dto.getName())
                            .muscleGroup(group)
                            .gifUrl(localGifUrl)
                            .description(description)
                            .equipment(dto.getEquipment())
                            .build();
                    exerciseRepository.save(exercise);
                    newlyAddedThisBatch++;
                }
                
                // -------------------------
                // Console-based progress indicator for this batch
                // -------------------------
                int currentIndex = i + 1;
                int progressPercent = (int) ((currentIndex / (double) totalInBatch) * 100);
                System.out.print("\rBatch " + batchCount + ": " + progressPercent + "% (" + currentIndex + "/" + totalInBatch + ")");
                if (currentIndex == totalInBatch) {
                    System.out.println(); // New line when batch is complete
                }
            }

            // Print group breakdown for this batch
            System.out.println("Batch " + batchCount + " group breakdown: " + batchGroupCount);

            if (newlyAddedThisBatch == 0) {
                System.out.println("No new exercises found in batch " + batchCount + ". Stopping.");
                newExercisesAdded = false;
            } else {
                totalAdded += newlyAddedThisBatch;
                offset += 10;  // Increase offset to get the next batch
                System.out.println("Batch " + batchCount + " added " + newlyAddedThisBatch + " new exercises. Total so far: " + totalAdded);
            }
        }

        System.out.println("Finished fetching in batches. Total new exercises added: " + totalAdded);
        System.out.println("Unique body parts collected: " + uniqueBodyParts);
    }

    /**
     * Determines the group for a given bodyPart string from ExerciseDB.
     * Mapping logic:
     * - "Chest"    → if bodyPart equals "chest"
     * - "Back"     → if bodyPart equals "back"
     * - "Shoulders"→ if bodyPart equals "shoulders"
     * - "Arms"     → if bodyPart equals "upper arms" or "lower arms"
     * - "Legs"     → if bodyPart equals "upper legs" or "lower legs"
     * - "Cardio"   → if bodyPart equals "cardio"
     * - "Core"     → if bodyPart equals "waist" or "neck"
     * - Otherwise → "Other"
     */
    private String determineGroup(String bodyPart) {
        if (bodyPart == null) {
            return "Other";
        }
        String bp = bodyPart.toLowerCase().trim();
        if (bp.equals("chest")) {
            return "Chest";
        } else if (bp.equals("back")) {
            return "Back";
        } else if (bp.equals("shoulders")) {
            return "Shoulders";
        } else if (bp.equals("upper arms") || bp.equals("lower arms")) {
            return "Arms";
        } else if (bp.equals("upper legs") || bp.equals("lower legs")) {
            return "Legs";
        } else if (bp.equals("cardio")) {
            return "Cardio";
        } else if (bp.equals("waist") || bp.equals("neck")) {
            return "Core";
        } else {
            return "Other";
        }
    }

    /**
     * Fetch a batch of exercises from the API using offset and limit.
     */
    private List<ExerciseDBDto> fetchExercisesWithOffset(int offset, int limit) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://" + exercisedbApiHost + "/exercises?limit=" + limit + "&offset=" + offset;

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-RapidAPI-Key", exercisedbApiKey);
        headers.set("X-RapidAPI-Host", exercisedbApiHost);
        HttpEntity<String> requestEntity = new HttpEntity<>(headers);

        ResponseEntity<List<ExerciseDBDto>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                requestEntity,
                new ParameterizedTypeReference<List<ExerciseDBDto>>() {}
        );

        return response.getBody() != null ? response.getBody() : List.of();
    }

    /**
     * Downloads the GIF from the provided URL and saves it to a local directory.
     * Returns the local file path as a String.
     */
    private String downloadAndSaveGif(String gifUrl, String exerciseName) {
        if (gifUrl == null || gifUrl.isEmpty()) {
            return "";
        }
        try {
            RestTemplate restTemplate = new RestTemplate();
            // Download the GIF as a byte array.
            ResponseEntity<byte[]> response = restTemplate.exchange(
                    gifUrl,
                    HttpMethod.GET,
                    null,
                    byte[].class
            );
            byte[] gifBytes = response.getBody();
            if (gifBytes == null || gifBytes.length == 0) {
                return "";
            }
            
            // Ensure the directory exists.
            File dir = new File(GIF_DIR);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            // Sanitize the exercise name for file naming.
            String sanitizedName = exerciseName.replaceAll("[^a-zA-Z0-9]", "_");
            String fileName = sanitizedName + "_" + System.currentTimeMillis() + ".gif";
            File file = new File(dir, fileName);
            
            // Write the bytes to the file.
            try (FileOutputStream fos = new FileOutputStream(file)) {
                fos.write(gifBytes);
            }
            
            // Return the local file path.
            return file.getAbsolutePath();
        } catch (IOException e) {
            e.printStackTrace();
            return "";
        }
    }
}
