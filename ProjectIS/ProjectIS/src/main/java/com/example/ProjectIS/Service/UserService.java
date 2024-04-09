package com.example.ProjectIS.Service;

import com.example.ProjectIS.DTO.*;
import com.example.ProjectIS.Model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public interface UserService {
    void Insert(User user);
    void Update(User user);
    void Delete(User user);
    void DeleteById(Long id);
    User findFirstByUserId(Long id);
    User findUserByEmail(String email);
    Iterable<User> getAll();
    Iterable<User> getAllOtherUsers(Long id);
    ResponseEntity singIn(SignInRequest signInRequest);
    ResponseEntity singUp(SignUpRequest signUpRequest);
    ResponseEntity editProfile(EditProfileRequest editProfileRequest);
    ResponseEntity editUserProfile(EditUserProfileRequest editUserProfileRequest);
    ResponseEntity changePassword(ChangePasswordRequest changePasswordRequest);
}
