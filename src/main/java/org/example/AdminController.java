package org.example;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import static org.example.PortfolioContentService.*;

@RestController
public class AdminController {
    private final PortfolioContentService contentService;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;
    private final SecurityContextHolderStrategy securityContextHolderStrategy =
            SecurityContextHolder.getContextHolderStrategy();
    public AdminController(
            PortfolioContentService contentService,
            AuthenticationManager authenticationManager,
            SecurityContextRepository securityContextRepository) {
        this.contentService = contentService;
        this.authenticationManager = authenticationManager;
        this.securityContextRepository = securityContextRepository;
    }

    @GetMapping("/api/portfolio/content")
    public PortfolioContent getPortfolioContent() {
        return contentService.getContent();
    }

    @GetMapping("/api/admin/csrf")
    public Map<String, String> csrfToken(HttpServletRequest request) {
        Object csrfAttribute = request.getAttribute("_csrf");
        if (!(csrfAttribute instanceof CsrfToken csrfToken)) {
            throw new IllegalStateException("The CSRF token was not initialized for this request.");
        }
        return Map.of("headerName", csrfToken.getHeaderName(), "token", csrfToken.getToken());
    }

    @GetMapping("/api/admin/session")
    public Map<String, String> session(Authentication authentication) {
        return Map.of("username", authentication.getName());
    }

    @PostMapping("/api/admin/login")
    public ResponseEntity<Map<String, String>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest servletRequest,
            HttpServletResponse servletResponse) {
        Authentication authentication = authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken.unauthenticated(request.username(), request.password()));
        servletRequest.getSession(true);
        servletRequest.changeSessionId();
        SecurityContext context = securityContextHolderStrategy.createEmptyContext();
        context.setAuthentication(authentication);
        securityContextHolderStrategy.setContext(context);
        securityContextRepository.saveContext(context, servletRequest, servletResponse);
        return ResponseEntity.ok(Map.of("username", authentication.getName()));
    }

    @ExceptionHandler(BadCredentialsException.class)
    ResponseEntity<Map<String, String>> invalidCredentials() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid username or password."));
    }

    @PostMapping("/api/admin/projects")
    public ResponseEntity<Project> createProject(@Valid @RequestBody ProjectInput request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contentService.createProject(request));
    }

    @PutMapping("/api/admin/projects/{id}")
    public Project updateProject(@PathVariable("id") long id, @Valid @RequestBody ProjectInput request) {
        return contentService.updateProject(id, request);
    }

    @DeleteMapping("/api/admin/projects/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable("id") long id) {
        contentService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/api/admin/skills")
    public ResponseEntity<Skill> createSkill(@Valid @RequestBody SkillInput request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contentService.createSkill(request));
    }

    @PutMapping("/api/admin/skills/{id}")
    public Skill updateSkill(@PathVariable("id") long id, @Valid @RequestBody SkillInput request) {
        return contentService.updateSkill(id, request);
    }

    @DeleteMapping("/api/admin/skills/{id}")
    public ResponseEntity<Void> deleteSkill(@PathVariable("id") long id) {
        contentService.deleteSkill(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/api/admin/experience")
    public ResponseEntity<Experience> createExperience(@Valid @RequestBody ExperienceInput request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contentService.createExperience(request));
    }

    @PutMapping("/api/admin/experience/{id}")
    public Experience updateExperience(@PathVariable("id") long id, @Valid @RequestBody ExperienceInput request) {
        return contentService.updateExperience(id, request);
    }

    @DeleteMapping("/api/admin/experience/{id}")
    public ResponseEntity<Void> deleteExperience(@PathVariable("id") long id) {
        contentService.deleteExperience(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/api/admin/education")
    public PortfolioContent updateEducation(@Valid @RequestBody EducationInput request) {
        return contentService.updateEducation(new Education(request.degree(), request.institution(), request.location(),
                request.affiliation(), request.period()));
    }

    @PutMapping("/api/admin/personal")
    public PortfolioContent updatePersonal(@Valid @RequestBody PersonalInput request) {
        Personal current = contentService.getContent().personal();
        return contentService.updatePersonal(new Personal(
                request.name(), request.title(), request.location(), request.email(), request.phone(),
                current.githubUsername(), current.githubUrl()));
    }

    public record LoginRequest(
            @NotBlank @Size(max = 80) String username,
            @NotBlank @Size(max = 200) String password) { }

    public record EducationInput(
            @NotBlank @Size(max = 120) String degree,
            @NotBlank @Size(max = 180) String institution,
            @NotBlank @Size(max = 120) String location,
            @NotBlank @Size(max = 120) String affiliation,
            @NotBlank @Size(max = 60) String period) { }

    public record PersonalInput(
            @NotBlank @Size(max = 100) String name,
            @NotBlank @Size(max = 500) String title,
            @NotBlank @Size(max = 500) String location,
            @NotBlank @Email @Size(max = 160) String email,
            @NotBlank @Size(max = 40) String phone) { }
}
