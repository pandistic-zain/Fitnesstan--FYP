package com.fitnesstan.fitnesstan_backend.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.fitnesstan.fitnesstan_backend.DAO.UserRepository;
import com.fitnesstan.fitnesstan_backend.Entity.Users;

@Service
public class UserDetailServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user = userRepo.findByUsername(username); // Adjusted to work with your 'Users' entity
        if (user != null) {
            // Convert Users entity to Spring Security's UserDetails object
            UserDetails userDetails = User.builder()
                    .username(user.getUsername()) // Use the username from your Users entity
                    .password(user.getPassword()) // Use the encrypted password
                    .roles(user.getRoles().toArray(new String[0])) // Convert List<String> to String[]
                    .build();

            return userDetails;
        }
        // Throw an exception if the user is not found
        throw new UsernameNotFoundException("User Not Found With This Username: " + username);
    }
}
