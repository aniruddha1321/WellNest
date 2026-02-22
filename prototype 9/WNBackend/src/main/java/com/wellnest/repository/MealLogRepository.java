package com.wellnest.repository;

import com.wellnest.model.MealLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MealLogRepository extends MongoRepository<MealLog, String> {
    List<MealLog> findByUsernameOrderByTimestampDesc(String username);
}
