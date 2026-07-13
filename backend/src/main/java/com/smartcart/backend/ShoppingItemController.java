package com.smartcart.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/items")
public class ShoppingItemController {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

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

    @GetMapping
    public List<Item> getItems(@RequestHeader("Authorization") String authHeader) {
        User user = getUserFromToken(authHeader);
        return itemRepository.findByUser(user);
    }

    @PostMapping
    public Item addItem(@RequestBody Item item, @RequestHeader("Authorization") String authHeader) {
        User user = getUserFromToken(authHeader);
        item.setUser(user);
        return itemRepository.save(item);
    }

    @DeleteMapping("/{id}")
    public void deleteItem(@PathVariable Long id) {
        itemRepository.deleteById(id);
    }

    @PutMapping("/{id}")
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

    @GetMapping("/suggestions")
    public Map<String, String> getSuggestions(@RequestHeader("Authorization") String authHeader) {
        User user = getUserFromToken(authHeader);
        List<Item> items = itemRepository.findByUser(user);
        String suggestions = geminiService.getSuggestions(items);
        return Map.of("suggestions", suggestions);
    }
}