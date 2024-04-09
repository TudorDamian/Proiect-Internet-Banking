package com.example.ProjectIS.Repository;

import com.example.ProjectIS.Model.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface UserRepository extends CrudRepository<User, Long> {
    User findFirstById(Long id);
    User findUserByEmail(String email);
}
