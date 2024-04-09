package com.example.ProjectIS.Service.Implementation;

import com.example.ProjectIS.DTO.*;
import com.example.ProjectIS.Model.Account;
import com.example.ProjectIS.Model.User;
import com.example.ProjectIS.Repository.UserRepository;
import com.example.ProjectIS.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class UserServiceImplementation implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void Insert(User user) {
        userRepository.save(user);
    }

    @Override
    public void Update(User user) {
        User user1 = userRepository.findFirstById(user.getId());
        if(user1 != null){
            user1.setFirstName(user.getFirstName());
            user1.setLastName(user.getLastName());
            user1.setEmail(user.getEmail());
            user1.setPhone(user.getPhone());
            user1.setPassword(user.getPassword());
            userRepository.save(user1);
        }
    }

    @Override
    public void Delete(User user) {
        userRepository.delete(user);
    }

    @Override
    public void DeleteById(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public User findFirstByUserId(Long id) {
        return userRepository.findFirstById(id);
    }

    @Override
    public User findUserByEmail(String email) {
        return userRepository.findUserByEmail(email);
    }

    @Override
    public Iterable<User> getAll() {
        ArrayList<User> users = (ArrayList<User>) userRepository.findAll();
        users.remove(0);
        return users;
    }

    @Override
    public Iterable<User> getAllOtherUsers(Long id) {
        ArrayList<User> users = (ArrayList<User>) userRepository.findAll();
        users.remove(0);
        User user = userRepository.findFirstById(id);
        users.remove(user);
        return users;
    }

    @Override
    public ResponseEntity singIn(SignInRequest signInRequest) {
        User user = userRepository.findUserByEmail(signInRequest.getEmail());

        if (user != null && user.getPassword().equals(signInRequest.getPassword())) {
            return ResponseEntity.ok().body(user);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }

    @Override
    public ResponseEntity singUp(SignUpRequest signUpRequest) {
        User user = userRepository.findUserByEmail(signUpRequest.getEmail());

        if(user != null) {
            return ResponseEntity.status(HttpStatus.FOUND).body("Account with this email already exists!");
        }

        User newUser = new User(
                signUpRequest.getEmail(),
                signUpRequest.getFirstName(),
                signUpRequest.getLastName(),
                signUpRequest.getPhone(),
                signUpRequest.getPassword()
        );

        userRepository.save(newUser);
        user = userRepository.findUserByEmail(newUser.getEmail());
        return ResponseEntity.status(HttpStatus.OK).body(user);
    }

    @Override
    public ResponseEntity editProfile(EditProfileRequest editProfileRequest) {
        User user = userRepository.findFirstById(editProfileRequest.getProfileId());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        user.setFirstName(editProfileRequest.getProfileFirstName());
        user.setLastName(editProfileRequest.getProfileLastName());
        user.setPhone(editProfileRequest.getProfilePhone());
        userRepository.save(user);
        return ResponseEntity.status(HttpStatus.OK).body(user);
    }

    @Override
    public ResponseEntity editUserProfile(EditUserProfileRequest editUserProfileRequest) {
        return null;
    }

    @Override
    public ResponseEntity changePassword(ChangePasswordRequest changePasswordRequest) {
        User user = userRepository.findById(changePasswordRequest.getUserId()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        if (!user.getPassword().equals(changePasswordRequest.getCurrentPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid current password");
        }
        if (!changePasswordRequest.getNewPassword().equals(changePasswordRequest.getConfirmPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("New password and confirm password do not match");
        }
        user.setPassword(changePasswordRequest.getNewPassword());
        userRepository.save(user);
        return ResponseEntity.ok().body("Password successfully changed");
    }
}