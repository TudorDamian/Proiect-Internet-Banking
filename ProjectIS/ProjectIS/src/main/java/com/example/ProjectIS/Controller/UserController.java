package com.example.ProjectIS.Controller;

import com.example.ProjectIS.DTO.*;
import com.example.ProjectIS.Model.User;
import com.example.ProjectIS.Service.Implementation.AccountServiceImplementation;
import com.example.ProjectIS.Service.Implementation.UserServiceImplementation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@CrossOrigin
@RequestMapping("/users")
public class UserController {

    private final UserServiceImplementation userServiceImplementation;

    @PostMapping("/GetById")
    public ResponseEntity readById(@RequestBody Long id) {
        User user = userServiceImplementation.findFirstByUserId(id);
        return ResponseEntity.status(HttpStatus.OK).body(user);
    }

    @PostMapping("/GetByEmail")
    public ResponseEntity getByEmail(@RequestBody String email) {
        String[] emails = email.split("\"");
        User user = userServiceImplementation.findUserByEmail(emails[1]);
        return ResponseEntity.status(HttpStatus.OK).body(user);
    }

    @PostMapping("/Insert")
    public ResponseEntity insert(@RequestBody User user){
        userServiceImplementation.Insert(user);
        User user1 = userServiceImplementation.findUserByEmail(user.getEmail());
        return ResponseEntity.status(HttpStatus.OK).body(user1);
    }

    @GetMapping("/GetAll")
    public ResponseEntity getAll(){
        Iterable<User> users = userServiceImplementation.getAll();
        return ResponseEntity.status(HttpStatus.OK).body(users);
    }

    @PostMapping("/GetOtherUsers")
    public ResponseEntity getAllOtherUsers(@RequestBody Long id){
        Iterable<User> users = userServiceImplementation.getAllOtherUsers(id);
        return ResponseEntity.status(HttpStatus.OK).body(users);
    }

    @PostMapping("/Update")
    public ResponseEntity update(@RequestBody User user){
        userServiceImplementation.Update(user);
        User user1 = userServiceImplementation.findFirstByUserId(user.getId());
        return ResponseEntity.status(HttpStatus.OK).body(user1);
    }

    @PostMapping("/DeleteById")
    public void delete(@RequestBody Long id){
        userServiceImplementation.DeleteById(id);
    }

    @PostMapping("/SignIn")
    public ResponseEntity signIn(@RequestBody SignInRequest signInRequest){
        return userServiceImplementation.singIn(signInRequest);
    }

    @PostMapping("/SignUp")
    public ResponseEntity signUp(@RequestBody SignUpRequest signUpRequest){
        return userServiceImplementation.singUp(signUpRequest);
    }

    @PostMapping("/EditProfile")
    public ResponseEntity editProfile(@RequestBody EditProfileRequest editProfileRequest){
        return userServiceImplementation.editProfile(editProfileRequest);
    }

    @PostMapping("/ChangePassword")
    public ResponseEntity changePassword(@RequestBody ChangePasswordRequest changePasswordRequest){
        return userServiceImplementation.changePassword(changePasswordRequest);
    }
}
