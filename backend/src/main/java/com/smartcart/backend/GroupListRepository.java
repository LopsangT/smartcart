package com.smartcart.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GroupListRepository extends JpaRepository<GroupList, Long> {
    Optional<GroupList> findByInviteCode(String inviteCode);
}