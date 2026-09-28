package org.example;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AdminUserDetailsService implements UserDetailsService {
    private final String username;
    private final String password;

    public AdminUserDetailsService(
            @Value("${portfolio.admin.username}") String username,
            @Value("${portfolio.admin.password}") String password) {
        if (password == null || password.isEmpty()) {
            throw new IllegalStateException(
                    "Set PORTFOLIO_ADMIN_PASSWORD before starting the application.");
        }
        this.username = username;
        this.password = password;
    }

    @Override
    public UserDetails loadUserByUsername(String requestedUsername) throws UsernameNotFoundException {
        if (!username.equals(requestedUsername)) {
            throw new UsernameNotFoundException("Admin account not found.");
        }
        return User.withUsername(username)
                .password("{noop}" + password)
                .roles("ADMIN")
                .build();
    }
}
