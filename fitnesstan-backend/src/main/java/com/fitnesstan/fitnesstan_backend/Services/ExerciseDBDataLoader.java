package com.fitnesstan.fitnesstan_backend.Services;

import com.fitnesstan.fitnesstan_backend.DAO.ExerciseRepository;
import com.fitnesstan.fitnesstan_backend.DTO.ExerciseDBDto;
import com.fitnesstan.fitnesstan_backend.Entity.Exercise;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
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
        // Load exercises only if the collection is empty
        if (exerciseRepository.count() == 0) {
            loadExercisesFromExerciseDB();
        }
    }

    private void loadExercisesFromExerciseDB() {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://" + exercisedbApiHost + "/exercises";

        // Prepare HTTP headers required by RapidAPI
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-RapidAPI-Key", exercisedbApiKey);
        headers.set("X-RapidAPI-Host", exercisedbApiHost);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        // Retrieve a list of exercises from ExerciseDB API
        ResponseEntity<List<ExerciseDBDto>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<List<ExerciseDBDto>>() {}
        );

        List<ExerciseDBDto> exerciseList = response.getBody();
        if (exerciseList != null) {
            int total = exerciseList.size();
            for (int i = 0; i < total; i++) {
                ExerciseDBDto dto = exerciseList.get(i);

                // Use the bodyPart field as the muscle group
                String muscleGroup = dto.getBodyPart();

                // Create a description combining target and equipment details
                String description = "Target: " + dto.getTarget() + ", Equipment: " + dto.getEquipment();

                // Build the Exercise entity using your updated Exercise class
                Exercise exercise = Exercise.builder()
                        .name(dto.getName())
                        .muscleGroup(muscleGroup)
                        .gifUrl(dto.getGifUrl())  // ExerciseDB returns a GIF URL for each exercise
                        .description(description)
                        .equipment(dto.getEquipment())
                        .build();

                // Save the Exercise entity into MongoDB
                exerciseRepository.save(exercise);

                // -------------------------
                // Console-based progress indicator
                // -------------------------
                int currentIndex = i + 1;
                int progressPercent = (int) ((currentIndex / (double) total) * 100);
                System.out.print("\rLoading exercises: " + progressPercent + "% (" + currentIndex + "/" + total + ")");
                if (currentIndex == total) {
                    System.out.println(); // New line on completion
                }
            }
        }
    }
}
