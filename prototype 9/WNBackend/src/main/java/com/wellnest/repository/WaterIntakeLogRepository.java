package com.wellnest.repository;

import com.wellnest.model.WaterIntakeLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WaterIntakeLogRepository extends MongoRepository<WaterIntakeLog, String> {
    List<WaterIntakeLog> findByUsernameOrderByTimestampDesc(String username);
}
