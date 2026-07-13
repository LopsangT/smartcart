package com.smartcart.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String getSuggestions(List<Item> items) {
        String itemNames = items.stream()
                .map(Item::getName)
                .reduce((a, b) -> a + ", " + b)
                .orElse("nothing");

        String prompt = "I have these items in my shopping list: " + itemNames + ". "
                + "Suggest exactly 3 additional grocery items that would go well with these. "
                + "Respond with ONLY the 3 item names separated by commas, nothing else. "
                + "Example format: butter, garlic, onions";

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=" + apiKey;

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)
                        ))
                )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            Map<String, Object> response = restTemplate.postForObject(url, request, Map.class);

            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            String text = (String) parts.get(0).get("text");

            return text.trim();
        } catch (Exception e) {
            e.printStackTrace();
            return "Could not get suggestions";
        }
    }
}