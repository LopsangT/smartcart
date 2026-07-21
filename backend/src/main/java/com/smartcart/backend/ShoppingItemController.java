package com.smartcart.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/items")
public class ShoppingItemController {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GroupListRepository groupListRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private GeminiService geminiService;

    private User getUserFromToken(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);
        Optional<User> userOptional = userRepository.findByEmail(email);
        return userOptional.orElse(null);
    }

    @GetMapping("/{groupListId}")
    public List<Item> getItems(@PathVariable Long groupListId, @RequestHeader("Authorization") String authHeader) {
        Optional<GroupList> groupListOptional = groupListRepository.findById(groupListId);
        if (groupListOptional.isEmpty()) return List.of();
        return itemRepository.findByGroupList(groupListOptional.get());
    }

    @PostMapping("/{groupListId}")
    public Item addItem(@PathVariable Long groupListId, @RequestBody Item item, @RequestHeader("Authorization") String authHeader) {
        Optional<GroupList> groupListOptional = groupListRepository.findById(groupListId);
        if (groupListOptional.isEmpty()) return null;
        item.setGroupList(groupListOptional.get());
        return itemRepository.save(item);
    }

    @DeleteMapping("/item/{id}")
    public void deleteItem(@PathVariable Long id) {
        itemRepository.deleteById(id);
    }

    @PutMapping("/item/{id}")
    public Item updateItem(@PathVariable Long id, @RequestBody Item updatedItem) {
        Optional<Item> itemOptional = itemRepository.findById(id);

        if (itemOptional.isPresent()) {
            Item item = itemOptional.get();

            if (updatedItem.getQuantity() != null && updatedItem.getQuantity() > 0) {
                item.setQuantity(updatedItem.getQuantity());
            }

            if (updatedItem.getPrice() != null) {
                item.setPrice(updatedItem.getPrice());
            }

            return itemRepository.save(item);
        }
        return null;
    }

    @GetMapping("/{groupListId}/suggestions")
    public Map<String, String> getSuggestions(@PathVariable Long groupListId, @RequestHeader("Authorization") String authHeader) {
        Optional<GroupList> groupListOptional = groupListRepository.findById(groupListId);
        if (groupListOptional.isEmpty()) return Map.of("suggestions", "");
        List<Item> items = itemRepository.findByGroupList(groupListOptional.get());
        String suggestions = geminiService.getSuggestions(items);
        return Map.of("suggestions", suggestions);
    }
}