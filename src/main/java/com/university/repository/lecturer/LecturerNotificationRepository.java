package com.university.repository.lecturer;

import com.university.entity.ThongBao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface LecturerNotificationRepository extends JpaRepository<ThongBao, UUID> {
}
