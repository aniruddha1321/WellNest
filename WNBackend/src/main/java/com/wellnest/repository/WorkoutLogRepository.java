package com.wellnest.repository;

import com.wellnest.model.WorkoutLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkoutLogRepository extends MongoRepository<WorkoutLog, String> {
    List<WorkoutLog> findByUsernameOrderByTimestampDesc(String username);
}
