package org.example;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ContactMailService {
    private static final Logger logger = LoggerFactory.getLogger(ContactMailService.class);

    private final RestTemplate restTemplate;
    private final String sender;
    private final String recipient;
    private final String resendApiKey;

    public ContactMailService(
            RestTemplate restTemplate,
            @Value("${portfolio.contact.sender}") String sender,
            @Value("${portfolio.contact.recipient}") String recipient,
            @Value("${resend.api.key}") String resendApiKey) {
        this.restTemplate = restTemplate;
        this.sender = sender;
        this.recipient = recipient;
        this.resendApiKey = resendApiKey;
    }

    public void send(String name, String replyTo, String phone, String message) {
        String url = "https://api.resend.com/emails";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(resendApiKey);

        String emailHtml = """
                <p><strong>Name:</strong> %s</p>
                <p><strong>Email:</strong> %s</p>
                <p><strong>Phone:</strong> %s</p>
                <p><strong>Message:</strong><br>%s</p>
                """.formatted(name, replyTo, phone == null || phone.isBlank() ? "Not provided" : phone, message);

        Map<String, Object> body = new HashMap<>();
        body.put("from", sender);
        body.put("to", List.of(recipient));
        body.put("subject", "Portfolio enquiry from " + name);
        body.put("html", emailHtml);
        body.put("reply_to", replyTo);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            restTemplate.postForEntity(url, request, String.class);
            logger.info("Contact email sent successfully via Resend HTTP API to {}", recipient);
        } catch (Exception exception) {
            logger.error("Contact email delivery failed via Resend HTTP API.", exception);
            throw new RuntimeException("Failed to send email", exception);
        }
    }
}
