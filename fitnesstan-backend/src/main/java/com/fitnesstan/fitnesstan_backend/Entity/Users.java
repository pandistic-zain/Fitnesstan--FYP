package com.fitnesstan.fitnesstan_backend.Entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.mongodb.lang.NonNull;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "users") // Map this class to the "users" collection in MongoDB
public class Users {
    @Id
    private ObjectId id;  // Use String instead of ObjectId for simplicity.

    @Indexed(unique = true)
    @NonNull
    private String username;

    @NonNull
    private String email;

    @NonNull
    private String password;

    private List<String> roles; // Store roles as List<String> for multiple roles (e.g., ADMIN, USER)

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
