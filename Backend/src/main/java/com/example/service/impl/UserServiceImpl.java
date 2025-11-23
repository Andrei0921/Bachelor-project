package com.example.service.impl;

import com.example.domain.User;
import com.example.service.UserService;
import java.util.Collection;
import java.util.List;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    @Override
    public User addUser(User user) {
        return null;
    }

    @Override
    public User getUser(Long id) {
        return null;
    }

    @Override
    public Collection<User> getAllUsers() {
        return List.of();
    }

    @Override
    public User updateUser(User user) {
        return null;
    }

    @Override
    public void deleteUser(Long id) {}

    @Override
    public User getUserByEmail(String email) {
        return null;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return null;
    }
}
