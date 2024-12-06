package com.fitnesstan.fitnesstan_backend.Entity;

public class UserRegistrationDTO {
    private Users user;
    private Users additionalInfo;

    // Getters and Setters
    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }

    public Users getAdditionalInfo() {
        return additionalInfo;
    }

    public void setAdditionalInfo(Users additionalInfo) {
        this.additionalInfo = additionalInfo;
    }
}
