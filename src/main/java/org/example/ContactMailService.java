package org.example;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class ContactMailService {
    private static final Logger logger = LoggerFactory.getLogger(ContactMailService.class);

    private final JavaMailSender mailSender;
    private final String sender;
    private final String recipient;

    public ContactMailService(
            JavaMailSender mailSender,
            @Value("${portfolio.contact.sender}") String sender,
            @Value("${portfolio.contact.recipient}") String recipient) {
        this.mailSender = mailSender;
        this.sender = sender;
        this.recipient = recipient;
    }

    public void send(String name, String replyTo, String phone, String message) {
        var email = new SimpleMailMessage();
        email.setFrom(sender);
        email.setTo(recipient);
        email.setReplyTo(replyTo);
        email.setSubject("Portfolio enquiry from " + name);
        email.setText("""
                Name: %s
                Email: %s
                Phone: %s

                Message:
                %s
                """.formatted(name, replyTo, phone == null || phone.isBlank() ? "Not provided" : phone, message));

        try {
            mailSender.send(email);
        } catch (MailAuthenticationException exception) {
            logger.error("Contact email authentication failed. Verify the Resend SMTP API key.", exception);
            throw exception;
        } catch (MailSendException exception) {
            logger.error("Contact email delivery failed. Verify SMTP connectivity and the sender domain.", exception);
            throw exception;
        } catch (MailException exception) {
            logger.error("Contact email transport failed.", exception);
            throw exception;
        }
    }
}
