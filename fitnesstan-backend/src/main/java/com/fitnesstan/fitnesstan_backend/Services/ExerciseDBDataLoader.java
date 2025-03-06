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

import java.util.List;

@Component
public class ExerciseDBDataLoader implements ApplicationRunner {

    @Autowired
    private ExerciseRepository exerciseRepository;

    // RapidAPI credentials from application.properties
    @Value("${exercisedb.api.key}")
    private String exercisedbApiKey;

    @Value("${exercisedb.api.host}")
    private String exercisedbApiHost;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        // If the collection is empty, fetch exercises in batches
        if (exerciseRepository.count() == 0) {
            fetchAllExercisesInBatches();
        }
    }

    /**
     * Repeatedly fetch 10 exercises at a time (using offset) and add new exercises
     * to the database. Stop when a batch returns zero new exercises.
     */
    public void fetchAllExercisesInBatches() {
        System.out.println("Starting batch fetch from ExerciseDB...");
        int offset = 0;
        boolean newExercisesAdded = true;
        int totalAdded = 0;
        int batchCount = 0;

        while (newExercisesAdded) {
            batchCount++;
            List<ExerciseDBDto> batch = fetchExercisesWithOffset(offset, 10);
            if (batch.isEmpty()) {
                System.out.println("API returned empty batch, stopping.");
                break;
            }

            int newlyAddedThisBatch = 0;
            int totalInBatch = batch.size();

            for (int i = 0; i < totalInBatch; i++) {
                ExerciseDBDto dto = batch.get(i);

                // Check for duplicates by exercise name
                if (!exerciseRepository.existsByName(dto.getName())) {
                    // Build a description using target and equipment info
                    String description = "Target: " + dto.getTarget() + ", Equipment: " + dto.getEquipment();

                    // Build and save the Exercise entity
                    Exercise exercise = Exercise.builder()
                            .name(dto.getName())
                            .muscleGroup(dto.getBodyPart())   // Use bodyPart as the muscle group
                            .gifUrl(dto.getGifUrl())            // GIF URL provided by ExerciseDB
                            .description(description)
                            .equipment(dto.getEquipment())
                            .build();
                    exerciseRepository.save(exercise);
                    newlyAddedThisBatch++;
                }

                // -------------------------
                // Console-based progress indicator
                // -------------------------
                int currentIndex = i + 1;
                int progressPercent = (int) ((currentIndex / (double) totalInBatch) * 100);
                System.out.print("\rBatch " + batchCount + ": " + progressPercent + "% (" + currentIndex + "/" + totalInBatch + ")");
                if (currentIndex == totalInBatch) {
                    System.out.println(); // New line when batch is complete
                }
            }

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
}
