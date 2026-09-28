package org.example;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactController {
    private final ContactMailService contactMailService;

    public ContactController(ContactMailService contactMailService) {
        this.contactMailService = contactMailService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> sendMessage(@Valid @RequestBody ContactRequest request) {
        contactMailService.send(request.name(), request.email(), request.phone(), request.message());

        return ResponseEntity.ok(Map.of("message", "Thanks! Your message is on its way."));
    }

    @ExceptionHandler(MailAuthenticationException.class)
    ResponseEntity<Map<String, String>> handleMailAuthenticationError() {
        return mailError("Email service authentication failed. Please try again later.");
    }

    @ExceptionHandler(MailSendException.class)
    ResponseEntity<Map<String, String>> handleMailSendError() {
        return mailError("Email delivery failed. Please try again later.");
    }

    @ExceptionHandler(MailException.class)
    ResponseEntity<Map<String, String>> handleMailError() {
        return mailError("Email service is temporarily unavailable. Please try again later.");
    }

    private ResponseEntity<Map<String, String>> mailError(String message) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of("message", message));
    }

    public record ContactRequest(
            @NotBlank @Size(max = 80) String name,
            @NotBlank @Email @Size(max = 160) String email,
            @Size(max = 40) String phone,
            @NotBlank @Size(max = 3000) String message) {
    }
}
