package com.fitnesstan.fitnesstan_backend.Entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.mongodb.core.mapping.DBRef;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DayPlan {

    private int dayNumber; // 1 through 14
    
    // A list of exercises associated with this single day
    @DBRef
    private List<Exercise> exercises;
}
