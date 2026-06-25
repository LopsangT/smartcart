package com.smartcart.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/items")
public class ShoppingItemController {

    @GetMapping
    public List<Map<String, Object>> getItems() {
        List<Map<String, Object>> items = new ArrayList<>();

        Map<String, Object> item1 = new HashMap<>();
        item1.put("id", 1);
        item1.put("name", "milk");
        item1.put("quantity", 2);

        Map<String, Object> item2 = new HashMap<>();
        item2.put("id", 2);
        item2.put("name", "eggs");
        item2.put("quantity", 12);

        Map<String, Object> item3 = new HashMap<>();
        item3.put("id", 3);
        item3.put("name", "bread");
        item3.put("quantity", 1);

        items.add(item1);
        items.add(item2);
        items.add(item3);

        return items;
    }
}