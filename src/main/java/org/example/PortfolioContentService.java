package org.example;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
public class PortfolioContentService {
    private final JdbcTemplate jdbc;
    private final ObjectMapper objectMapper;

    public PortfolioContentService(JdbcTemplate jdbc, ObjectMapper objectMapper) {
        this.jdbc = jdbc;
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    void seedInitialContent() {
        // PostgreSQL ke liye INSERT ... ON CONFLICT syntax use kiya gaya hai
        jdbc.update(
                "INSERT INTO portfolio_content (id, content_json) VALUES (1, ?) ON CONFLICT (id) DO NOTHING",
                serialize(defaultContent()));
    }

    public PortfolioContent getContent() {
        return jdbc.query(
                        "SELECT content_json FROM portfolio_content WHERE id = 1",
                        (result, row) -> deserialize(result.getString(1)))
                .stream()
                .findFirst()
                .orElseGet(PortfolioContentService::defaultContent);
    }

    @Transactional
    public Project createProject(ProjectInput input) {
        PortfolioContent content = currentForUpdate();
        long id = nextId(content.projects().stream().map(Project::id).toList());
        Project project = new Project(id, input.name(), input.description(), input.stack(), input.icon(),
                input.repositoryUrl(), input.demoUrl());
        save(copy(content, content.skillGroups(), append(content.projects(), project), content.experience(),
                content.education(), content.personal()));
        return project;
    }

    @Transactional
    public Project updateProject(long id, ProjectInput input) {
        PortfolioContent content = currentForUpdate();
        Project updated = new Project(id, input.name(), input.description(), input.stack(), input.icon(),
                input.repositoryUrl(), input.demoUrl());
        List<Project> projects = content.projects().stream()
                .map(project -> project.id() == id ? updated : project)
                .toList();
        requireFound(projects.stream().anyMatch(project -> project.id() == id), "Project not found.");
        save(copy(content, content.skillGroups(), projects, content.experience(), content.education(), content.personal()));
        return updated;
    }

    @Transactional
    public void deleteProject(long id) {
        PortfolioContent content = currentForUpdate();
        List<Project> projects = content.projects().stream().filter(project -> project.id() != id).toList();
        requireFound(projects.size() != content.projects().size(), "Project not found.");
        save(copy(content, content.skillGroups(), projects, content.experience(), content.education(), content.personal()));
    }

    @Transactional
    public Skill createSkill(SkillInput input) {
        PortfolioContent content = currentForUpdate();
        List<Skill> skills = flatten(content.skillGroups());
        Skill skill = new Skill(nextId(skills.stream().map(Skill::id).toList()), input.name(), input.category(), input.icon());
        save(copy(content, groupSkills(append(skills, skill)), content.projects(), content.experience(),
                content.education(), content.personal()));
        return skill;
    }

    @Transactional
    public Skill updateSkill(long id, SkillInput input) {
        PortfolioContent content = currentForUpdate();
        List<Skill> skills = flatten(content.skillGroups());
        Skill updated = new Skill(id, input.name(), input.category(), input.icon());
        List<Skill> replacements = skills.stream().map(skill -> skill.id() == id ? updated : skill).toList();
        requireFound(replacements.stream().anyMatch(skill -> skill.id() == id), "Skill not found.");
        save(copy(content, groupSkills(replacements), content.projects(), content.experience(),
                content.education(), content.personal()));
        return updated;
    }

    @Transactional
    public void deleteSkill(long id) {
        PortfolioContent content = currentForUpdate();
        List<Skill> skills = flatten(content.skillGroups());
        List<Skill> remaining = skills.stream().filter(skill -> skill.id() != id).toList();
        requireFound(remaining.size() != skills.size(), "Skill not found.");
        save(copy(content, groupSkills(remaining), content.projects(), content.experience(),
                content.education(), content.personal()));
    }

    @Transactional
    public Experience createExperience(ExperienceInput input) {
        PortfolioContent content = currentForUpdate();
        Experience experience = new Experience(nextId(content.experience().stream().map(Experience::id).toList()),
                input.period(), input.role(), input.company());
        save(copy(content, content.skillGroups(), content.projects(), append(content.experience(), experience),
                content.education(), content.personal()));
        return experience;
    }

    @Transactional
    public Experience updateExperience(long id, ExperienceInput input) {
        PortfolioContent content = currentForUpdate();
        Experience updated = new Experience(id, input.period(), input.role(), input.company());
        List<Experience> experiences = content.experience().stream()
                .map(item -> item.id() == id ? updated : item)
                .toList();
        requireFound(experiences.stream().anyMatch(item -> item.id() == id), "Experience entry not found.");
        save(copy(content, content.skillGroups(), content.projects(), experiences,
                content.education(), content.personal()));
        return updated;
    }

    @Transactional
    public void deleteExperience(long id) {
        PortfolioContent content = currentForUpdate();
        List<Experience> experiences = content.experience().stream().filter(item -> item.id() != id).toList();
        requireFound(experiences.size() != content.experience().size(), "Experience entry not found.");
        save(copy(content, content.skillGroups(), content.projects(), experiences,
                content.education(), content.personal()));
    }

    @Transactional
    public PortfolioContent updateEducation(Education education) {
        PortfolioContent content = currentForUpdate();
        PortfolioContent updated = copy(content, content.skillGroups(), content.projects(), content.experience(),
                education, content.personal());
        save(updated);
        return updated;
    }

    @Transactional
    public PortfolioContent updatePersonal(Personal personal) {
        PortfolioContent content = currentForUpdate();
        PortfolioContent updated = copy(content, content.skillGroups(), content.projects(), content.experience(),
                content.education(), personal);
        save(updated);
        return updated;
    }

    private PortfolioContent currentForUpdate() {
        return jdbc.query(
                        "SELECT content_json FROM portfolio_content WHERE id = 1 FOR UPDATE",
                        (result, row) -> deserialize(result.getString(1)))
                .stream()
                .findFirst()
                .orElseGet(PortfolioContentService::defaultContent);
    }

    private void save(PortfolioContent content) {
        jdbc.update("UPDATE portfolio_content SET content_json = ? WHERE id = 1", serialize(content));
    }

    private String serialize(PortfolioContent content) {
        try {
            return objectMapper.writeValueAsString(content);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Unable to serialize portfolio content.", exception);
        }
    }

    private PortfolioContent deserialize(String json) {
        try {
            return objectMapper.readValue(json, PortfolioContent.class);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Stored portfolio content is invalid.", exception);
        }
    }

    private static PortfolioContent copy(
            PortfolioContent content,
            List<SkillGroup> skillGroups,
            List<Project> projects,
            List<Experience> experience,
            Education education,
            Personal personal) {
        return new PortfolioContent(personal, skillGroups, projects, education, experience);
    }

    private static List<Skill> flatten(List<SkillGroup> groups) {
        return groups.stream().flatMap(group -> group.skills().stream()).toList();
    }

    private static List<SkillGroup> groupSkills(List<Skill> skills) {
        List<SkillGroup> groups = new ArrayList<>();
        for (Skill skill : skills) {
            int index = -1;
            for (int i = 0; i < groups.size(); i++) {
                if (groups.get(i).category().equals(skill.category())) {
                    index = i;
                    break;
                }
            }
            if (index < 0) {
                groups.add(new SkillGroup(skill.category(), new ArrayList<>(List.of(skill))));
            } else {
                List<Skill> grouped = new ArrayList<>(groups.get(index).skills());
                grouped.add(skill);
                groups.set(index, new SkillGroup(skill.category(), grouped));
            }
        }
        return groups;
    }

    private static long nextId(List<Long> ids) {
        return ids.stream().mapToLong(Long::longValue).max().orElse(0) + 1;
    }

    private static <T> List<T> append(List<T> existing, T item) {
        List<T> result = new ArrayList<>(existing);
        result.add(item);
        return result;
    }

    private static void requireFound(boolean found, String message) {
        if (!found) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, message);
        }
    }

    private static PortfolioContent defaultContent() {
        Personal personal = new Personal(
                "Gourav Yadav",
                "Final-year Computer Science & Engineering student (B.Tech) specializing in enterprise Java and Spring Boot backend architecture, RESTful APIs, and MySQL, with frontend development using vanilla HTML5, CSS3, and JavaScript (ES6+).",
                "Jaipur, Rajasthan, India",
                "gourav.jv9588@gmail.com",
                "+91 9588269913",
                "Gourav857",
                "https://github.com/Gourav857");
        List<SkillGroup> skills = List.of(
                new SkillGroup("Frontend · Vanilla Web", List.of(
                        new Skill(1, "HTML5", "Frontend · Vanilla Web", "html5/html5-original.svg"),
                        new Skill(2, "CSS3", "Frontend · Vanilla Web", "css3/css3-original.svg"),
                        new Skill(3, "JavaScript", "Frontend · Vanilla Web", "javascript/javascript-original.svg"))),
                new SkillGroup("Backend · Java", List.of(
                        new Skill(4, "Java", "Backend · Java", "java/java-original.svg"),
                        new Skill(5, "Spring Boot", "Backend · Java", "spring/spring-original.svg"))),
                new SkillGroup("Database · Developer Tools", List.of(
                        new Skill(6, "MySQL", "Database · Developer Tools", "mysql/mysql-original.svg"),
                        new Skill(7, "Git", "Database · Developer Tools", "git/git-original.svg"),
                        new Skill(8, "GitHub", "Database · Developer Tools", "github/github-original.svg"),
                        new Skill(9, "Postman", "Database · Developer Tools", "postman/postman-original.svg"))));
        List<Project> projects = List.of(
                new Project(1, "Enterprise Inventory & Billing System (ERP/POS)",
                        "Enterprise inventory and billing workflows backed by Java, Spring Boot REST endpoints, and MySQL.",
                        List.of("Java", "Spring Boot", "MySQL"), "▣", null, null),
                new Project(2, "Enterprise CRM Automation Platform",
                        "CRM automation built around a Java and Spring Boot backend, RESTful APIs, and MySQL relational data.",
                        List.of("Java", "Spring Boot", "MySQL"), "♙", null, null));
        Education education = new Education("B.Tech in Computer Science & Engineering",
                "Regional College for Education, Research & Technology", "Jaipur, Rajasthan", "RTU, Kota", "2023 - 2027");
        List<Experience> experience = List.of(
                new Experience(1, "2025", "Java Developer Trainee", "Lavya IT Training Center, Jaipur"),
                new Experience(2, "2024", "Python Developer Intern Trainee", "GPC Solution, Jaipur"));
        return new PortfolioContent(personal, skills, projects, education, experience);
    }

    public record PortfolioContent(
            Personal personal,
            List<SkillGroup> skillGroups,
            List<Project> projects,
            Education education,
            List<Experience> experience) { }

    public record Personal(
            String name,
            String title,
            String location,
            String email,
            String phone,
            String githubUsername,
            String githubUrl) { }

    public record SkillGroup(String category, List<Skill> skills) { }
    public record Skill(long id, String name, String category, String icon) { }
    public record Project(long id, String name, String description, List<String> stack, String icon,
                          String repositoryUrl, String demoUrl) { }
    public record Education(String degree, String institution, String location, String affiliation, String period) { }
    public record Experience(long id, String period, String role, String company) { }

    public record ProjectInput(
            @jakarta.validation.constraints.NotBlank @jakarta.validation.constraints.Size(max = 120) String name,
            @jakarta.validation.constraints.NotBlank @jakarta.validation.constraints.Size(max = 1000) String description,
            @jakarta.validation.constraints.NotEmpty @jakarta.validation.constraints.Size(max = 12) List<@jakarta.validation.constraints.NotBlank @jakarta.validation.constraints.Size(max = 40) String> stack,
            @jakarta.validation.constraints.Size(max = 12) String icon,
            @jakarta.validation.constraints.Size(max = 500) String repositoryUrl,
            @jakarta.validation.constraints.Size(max = 500) String demoUrl) { }

    public record SkillInput(
            @jakarta.validation.constraints.NotBlank @jakarta.validation.constraints.Size(max = 60) String name,
            @jakarta.validation.constraints.NotBlank @jakarta.validation.constraints.Size(max = 60) String category,
            @jakarta.validation.constraints.NotBlank @jakarta.validation.constraints.Size(max = 120) String icon) { }

    public record ExperienceInput(
            @jakarta.validation.constraints.NotBlank @jakarta.validation.constraints.Size(max = 40) String period,
            @jakarta.validation.constraints.NotBlank @jakarta.validation.constraints.Size(max = 120) String role,
            @jakarta.validation.constraints.NotBlank @jakarta.validation.constraints.Size(max = 160) String company) { }
}
