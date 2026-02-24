package com.wellnest.repository;

import com.wellnest.model.SleepLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SleepLogRepository extends MongoRepository<SleepLog, String> {
    List<SleepLog> findByUsernameOrderByTimestampDesc(String username);
}
