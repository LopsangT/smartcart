package com.smartcart.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/groups")
public class GroupListController {

    @Autowired
    private GroupListRepository groupListRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private User getUserFromToken(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);
        Optional<User> userOptional = userRepository.findByEmail(email);
        return userOptional.orElse(null);
    }

    @GetMapping
    public List<GroupList> getMyGroups(@RequestHeader("Authorization") String authHeader) {
        User user = getUserFromToken(authHeader);
        return groupListRepository.findAll().stream()
                .filter(g -> g.getMembers().contains(user))
                .toList();
    }

    @PostMapping
    public GroupList createGroup(@RequestBody Map<String, String> body, @RequestHeader("Authorization") String authHeader) {
        User user = getUserFromToken(authHeader);
        String name = body.get("name");

        String inviteCode = UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        GroupList groupList = new GroupList(name, inviteCode);
        Set<User> members = new HashSet<>();
        members.add(user);
        groupList.setMembers(members);

        return groupListRepository.save(groupList);
    }

    @PostMapping("/join")
    public ResponseEntity<Map<String, String>> joinGroup(@RequestBody Map<String, String> body, @RequestHeader("Authorization") String authHeader) {
        User user = getUserFromToken(authHeader);
        String inviteCode = body.get("inviteCode");

        Map<String, String> response = new HashMap<>();
        Optional<GroupList> groupListOptional = groupListRepository.findByInviteCode(inviteCode);

        if (groupListOptional.isEmpty()) {
            response.put("error", "Invalid invite code");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        GroupList groupList = groupListOptional.get();
        groupList.getMembers().add(user);
        groupListRepository.save(groupList);

        response.put("message", "Joined group: " + groupList.getName());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public GroupList updateGroup(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<GroupList> groupListOptional = groupListRepository.findById(id);
        if (groupListOptional.isEmpty()) return null;

        GroupList groupList = groupListOptional.get();

        if (body.get("name") != null) {
            groupList.setName(body.get("name"));
        }

        if (body.get("emoji") != null) {
            groupList.setEmoji(body.get("emoji"));
        }

        return groupListRepository.save(groupList);
    }

    @DeleteMapping("/{id}")
    public void deleteGroup(@PathVariable Long id) {
        groupListRepository.deleteById(id);
    }   
}