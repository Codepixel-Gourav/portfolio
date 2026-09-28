async function initializePortfolio() {
const portfolioData = {
  personal: {
    name: 'Gourav Yadav',
    initials: 'GY',
    title: 'Final-year Computer Science & Engineering student (B.Tech) specializing in enterprise Java and Spring Boot backend architecture, RESTful APIs, and MySQL, with frontend development using vanilla HTML5, CSS3, and JavaScript (ES6+).',
    location: 'Jaipur, Rajasthan, India',
    phone: '+91 9588269913',
    email: 'gourav.jv9588@gmail.com',
    summary: 'Final-year Computer Science & Engineering student (B.Tech) specializing in enterprise Java and Spring Boot backend architecture, RESTful APIs, and MySQL, with frontend development using vanilla HTML5, CSS3, and JavaScript (ES6+).',
    githubUsername: 'Gourav857',
    socials: {
      github: 'https://github.com/Gourav857'
    }
  },
  skillGroups: [
    {
      category: 'Frontend · Vanilla Web',
      skills: [
        { name: 'HTML5', icon: 'html5/html5-original.svg' },
        { name: 'CSS3', icon: 'css3/css3-original.svg' },
        { name: 'JavaScript', icon: 'javascript/javascript-original.svg' }
      ]
    },
    {
      category: 'Backend · Java',
      skills: [
        { name: 'Java', icon: 'java/java-original.svg' },
        { name: 'Spring Boot', icon: 'spring/spring-original.svg' }
      ]
    },
    {
      category: 'Database · Developer Tools',
      skills: [
        { name: 'MySQL', icon: 'mysql/mysql-original.svg' },
        { name: 'Git', icon: 'git/git-original.svg' },
        { name: 'GitHub', icon: 'github/github-original.svg' },
        { name: 'Postman', icon: 'postman/postman-original.svg' }
      ]
    }
  ],
  projects: [
    {
      name: 'Enterprise Inventory & Billing System (ERP/POS)',
      description: 'Enterprise inventory and billing workflows backed by Java, Spring Boot REST endpoints, and MySQL.',
      stack: ['Java', 'Spring Boot', 'MySQL'],
      icon: '▣',
      repositoryUrl: null,
      demoUrl: null
    },
    {
      name: 'Enterprise CRM Automation Platform',
      description: 'CRM automation built around a Java and Spring Boot backend, RESTful APIs, and MySQL relational data.',
      stack: ['Java', 'Spring Boot', 'MySQL'],
      icon: '♙',
      repositoryUrl: null,
      demoUrl: null
    }
  ],
  education: {
    degree: 'B.Tech in Computer Science & Engineering',
    institution: 'Regional College for Education, Research & Technology',
    location: 'Jaipur, Rajasthan',
    affiliation: 'RTU, Kota',
    period: '2023 - 2027'
  },
  experience: [
    { period: '2025', role: 'Java Developer Trainee', company: 'Lavya IT Training Center, Jaipur' },
    { period: '2024', role: 'Python Developer Intern Trainee', company: 'GPC Solution, Jaipur' }
  ]
};

try {
  const response = await fetch('/api/portfolio/content');
  if (!response.ok) throw new Error(`Unable to load saved portfolio content (${response.status}).`);
  const savedContent = await response.json();
  Object.assign(portfolioData, savedContent);
  Object.assign(portfolioData.personal, savedContent.personal, {
    summary: savedContent.personal.title,
    socials: { github: savedContent.personal.githubUrl }
  });
} catch (error) {
  console.error('Unable to load saved portfolio content; using the built-in portfolio data.', error);
}

const allSkills = portfolioData.skillGroups.flatMap((group) => group.skills);

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
}[character]));
const safeExternalUrl = (url) => {
  if (!url) return null;
  try {
    const parsedUrl = new URL(url, window.location.href);
    return ['http:', 'https:'].includes(parsedUrl.protocol) ? parsedUrl.href : null;
  } catch {
    return null;
  }
};
const deviconUrl = (iconPath) => `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${iconPath}`;
document.title = `${portfolioData.personal.name} — Software Engineer`;
document.querySelector('meta[name="description"]').content = `${portfolioData.personal.name} — ${portfolioData.personal.title}`;
document.querySelector('#hero-summary').textContent = portfolioData.personal.summary;
document.querySelector('#about-summary').textContent = portfolioData.personal.summary;
const heroName = document.querySelector('#hero-title');
const nameParts = portfolioData.personal.name.trim().split(/\s+/);
const familyName = nameParts.pop() || '';
heroName.replaceChildren(document.createTextNode(`${nameParts.join(' ')} `));
const familyNameElement = document.createElement('span');
familyNameElement.textContent = familyName;
heroName.append(familyNameElement);
document.querySelector('#copyright-year').textContent = new Date().getFullYear();
document.querySelector('#footer-name').textContent = portfolioData.personal.name;
document.querySelector('#education-degree').textContent = portfolioData.education.degree;
document.querySelector('#education-institution').textContent = portfolioData.education.institution;
document.querySelector('#education-location').textContent = `${portfolioData.education.location} · ${portfolioData.education.affiliation}`;
document.querySelector('#education-period').textContent = portfolioData.education.period;

const socialItems = [
  ['GitHub', 'GH', portfolioData.personal.socials.github],
  ['Email', '✉', `mailto:${portfolioData.personal.email}`]
];
document.querySelector('#social-links').innerHTML = socialItems
  .map(([label, text, href]) => `<a href="${href}" aria-label="${label}" target="_blank" rel="noreferrer">${text}</a>`).join('');
document.querySelector('#contact-socials').innerHTML = socialItems.slice(0, 2)
  .map(([label, , href]) => `<a href="${href}" target="_blank" rel="noreferrer">${label}</a>`).join('');

const skillsGrid = document.querySelector('#skills-grid');
portfolioData.skillGroups.forEach((group) => {
  const category = document.createElement('section');
  category.className = 'skill-category';
  const heading = document.createElement('h3');
  heading.textContent = group.category;
  const items = document.createElement('div');
  items.className = 'skill-items';
  group.skills.forEach((skill) => {
    const card = document.createElement('div');
    card.className = 'skill-card tilt-card';
    card.dataset.skillId = String(skill.id);
    card.setAttribute('aria-label', skill.name);
    const icon = document.createElement('span');
    icon.className = 'skill-icon';
    const image = document.createElement('img');
    image.src = deviconUrl(skill.icon);
    image.alt = '';
    image.loading = 'lazy';
    image.decoding = 'async';
    image.addEventListener('error', () => image.remove(), { once: true });
    icon.append(image);
    const label = document.createElement('span');
    label.textContent = skill.name;
    card.append(icon, label);
    items.append(card);
  });
  category.append(heading, items);
  skillsGrid.append(category);
});

  document.querySelector('#project-grid').innerHTML = portfolioData.projects.map((project, index) => {
    const projectUrl = safeExternalUrl(project.demoUrl) || safeExternalUrl(project.repositoryUrl);
    return `
    <article class="project-card tilt-card" data-project-index="${index}" data-project-id="${project.id}" tabindex="0" role="group" aria-haspopup="dialog" aria-label="${escapeHtml(project.name)}. Press Enter or Space to view details.">
    <span class="project-icon" aria-hidden="true">${escapeHtml(project.icon)}</span>
    <div class="project-info">
      <h3>${escapeHtml(project.name)}</h3>
      <p>${escapeHtml(project.description)}</p>
      <div class="tags">${project.stack.map((technology) => `<span>${escapeHtml(technology)}</span>`).join('')}</div>
    </div>
      ${projectUrl
        ? `<a class="project-arrow" href="${escapeHtml(projectUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escapeHtml(project.name)} demo or repository in a new tab">↗</a>`
        : ''}
  </article>
`;
  }).join('');

  const projectModal = document.querySelector('#project-modal');
  const modalContent = document.querySelector('#modal-project-content');
  let modalReturnFocus = null;
  const externalLink = (label, url) => {
    const safeUrl = safeExternalUrl(url);
    if (!safeUrl) return '';
    return `<a class="button button-outline" href="${escapeHtml(safeUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)} <span aria-hidden="true">↗</span></a>`;
  };
  const openProjectModal = (project, trigger) => {
    modalReturnFocus = trigger;
    const projectLinks = [
      externalLink('View repository', project.repositoryUrl),
      externalLink('Open live demo', project.demoUrl)
    ].filter(Boolean).join('');
    modalContent.innerHTML = `
      <button class="modal-close" type="button" aria-label="Close project details">×</button>
      <p class="eyebrow">Project deep dive</p>
      <h2 id="modal-project-title">${escapeHtml(project.name)}</h2>
      <p class="modal-description">${escapeHtml(project.description)}</p>
      <h3>Technology stack</h3>
      <div class="modal-tags">${project.stack.map((technology) => `<span>${escapeHtml(technology)}</span>`).join('')}</div>
      <div class="modal-actions${projectLinks ? '' : ' is-empty'}">${projectLinks}</div>
    `;
    projectModal.showModal();
    modalContent.querySelector('.modal-close').focus();
  };
  const projectGrid = document.querySelector('#project-grid');
  projectGrid.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('[data-admin-action]')) return;
    if (event.target instanceof Element && event.target.closest('.project-arrow')) return;
    const card = event.target.closest('.project-card');
    if (!card) return;
    const project = portfolioData.projects[Number(card.dataset.projectIndex)];
    if (project) openProjectModal(project, card);
  });
  projectGrid.addEventListener('keydown', (event) => {
    if (!(event.target instanceof Element) || !event.target.closest('.project-card')) return;
    if (event.target.closest('[data-admin-action]')) return;
    if (event.target.closest('.project-arrow')) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    const card = event.target.closest('.project-card');
    const project = portfolioData.projects[Number(card.dataset.projectIndex)];
    if (project) openProjectModal(project, card);
  });
  modalContent.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('.modal-close')) projectModal.close();
  });
  projectModal.addEventListener('click', (event) => {
    if (event.target === projectModal) projectModal.close();
  });
  projectModal.addEventListener('close', () => {
    if (modalReturnFocus instanceof HTMLElement) modalReturnFocus.focus();
  });

const projectCarousel = document.querySelector('#project-carousel');
const carouselButtons = [...document.querySelectorAll('[data-carousel-direction]')];
const updateCarouselButtons = () => {
  const maxScroll = projectCarousel.scrollWidth - projectCarousel.clientWidth;
  carouselButtons.forEach((button) => {
    const direction = Number(button.dataset.carouselDirection);
    button.disabled = direction < 0
      ? projectCarousel.scrollLeft <= 1
      : projectCarousel.scrollLeft >= maxScroll - 1;
  });
};
carouselButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const card = projectCarousel.querySelector('.project-card');
    if (!card) return;
    const gap = Number.parseFloat(getComputedStyle(projectCarousel.querySelector('.project-grid')).columnGap) || 0;
    projectCarousel.scrollBy({
      left: (card.getBoundingClientRect().width + gap) * Number(button.dataset.carouselDirection),
      behavior: 'smooth'
    });
  });
});
projectCarousel.addEventListener('scroll', updateCarouselButtons, { passive: true });
window.addEventListener('resize', updateCarouselButtons);
updateCarouselButtons();

const terminalOutput = document.querySelector('#terminal-output');
const terminalForm = document.querySelector('#terminal-form');
const terminalInput = document.querySelector('#terminal-input');
const terminalWindow = document.querySelector('.terminal-window');
let terminalRun = 0;
const terminalCommands = {
  help: () => ['Available commands:', '  about       About Gourav', '  skills      Technical toolkit', '  projects    Featured projects', '  experience  Education and experience', '  contact     Contact details', '  clear       Clear the terminal'],
  about: () => [portfolioData.personal.name, portfolioData.personal.title, '', portfolioData.personal.summary],
  skills: () => portfolioData.skillGroups.map((group) => `${group.category}: ${group.skills.map((skill) => skill.name).join(', ')}`),
  projects: () => portfolioData.projects.map((project, index) => `${String(index + 1).padStart(2, '0')}  ${project.name}`),
  experience: () => portfolioData.experience.map((item) => `${item.period}  ${item.role} @ ${item.company}`),
  contact: () => [`Email: ${portfolioData.personal.email}`, `Location: ${portfolioData.personal.location}`]
};
const appendTerminalLine = (text, className = '') => {
  const line = document.createElement('div');
  line.className = `terminal-line ${className}`.trim();
  terminalOutput.append(line);
  line.textContent = text;
  return line;
};
const printTerminalLines = async (lines, run) => {
  let lastTypingSound = 0;
  terminalWindow.classList.add('is-running');
  terminalOutput.setAttribute('aria-busy', 'true');
  try {
    for (const text of lines) {
      if (run !== terminalRun) return;
      const line = appendTerminalLine('');
      for (const character of text) {
        if (run !== terminalRun) return;
        line.textContent += character;
        if (performance.now() - lastTypingSound > 55) {
          playInterfaceSound('typing');
          lastTypingSound = performance.now();
        }
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
        await new Promise((resolve) => window.setTimeout(resolve, 5));
      }
    }
  } finally {
    if (run === terminalRun) {
      terminalWindow.classList.remove('is-running');
      terminalOutput.removeAttribute('aria-busy');
    }
  }
};
const runTerminalCommand = (rawCommand) => {
  const command = rawCommand.trim().toLowerCase();
  if (!command) return;
  terminalInput.value = '';
  terminalRun += 1;
  const currentRun = terminalRun;
  if (command === 'clear') {
    terminalOutput.replaceChildren();
    terminalWindow.classList.remove('is-running');
    terminalOutput.removeAttribute('aria-busy');
    return;
  }
  appendTerminalLine(`visitor@portfolio:~$ ${command}`, 'is-command');
  const output = Object.prototype.hasOwnProperty.call(terminalCommands, command)
    ? terminalCommands[command]()
    : [`command not found: ${command}`, 'Type "help" to list available commands.'];
  void printTerminalLines(output, currentRun);
};
appendTerminalLine('Welcome to Gourav’s portfolio terminal.');
appendTerminalLine('Type "help" or choose a command below.');
terminalForm.addEventListener('submit', (event) => {
  event.preventDefault();
  runTerminalCommand(terminalInput.value);
});
document.querySelectorAll('[data-terminal-command]').forEach((button) => {
  button.addEventListener('click', () => runTerminalCommand(button.dataset.terminalCommand));
});

const githubStatus = document.querySelector('#github-status');
const githubUsername = portfolioData.personal.githubUsername;
const isRecord = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);
const loadGithubStats = async () => {
  githubStatus.textContent = 'Loading public GitHub stats…';
  githubStatus.classList.remove('is-error');
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8000);
  try {
    const baseUrl = `https://api.github.com/users/${encodeURIComponent(githubUsername)}`;
    const [profileResponse, eventsResponse] = await Promise.all([
      fetch(baseUrl, { headers: { Accept: 'application/vnd.github+json' }, signal: controller.signal }),
      fetch(`${baseUrl}/events?per_page=100`, { headers: { Accept: 'application/vnd.github+json' }, signal: controller.signal })
    ]);
    if (!profileResponse.ok || !eventsResponse.ok) {
      throw new Error(`GitHub API request failed (${profileResponse.status}/${eventsResponse.status}).`);
    }
    const profile = await profileResponse.json();
    const events = await eventsResponse.json();
    if (!isRecord(profile) || !Array.isArray(events)) throw new Error('GitHub returned an unexpected response.');
    const profileStats = {
      repositories: profile.public_repos,
      followers: profile.followers,
      following: profile.following
    };
    if (Object.values(profileStats).some((value) => !Number.isSafeInteger(value) || value < 0)) {
      throw new Error('GitHub profile statistics are incomplete.');
    }
    const recentCutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recentEvents = events.filter((item) => {
      if (!isRecord(item) || typeof item.created_at !== 'string') return false;
      const timestamp = Date.parse(item.created_at);
      return Number.isFinite(timestamp) && timestamp >= recentCutoff;
    }).length;
    document.querySelector('[data-stat="repositories"]').textContent = profileStats.repositories.toLocaleString();
    document.querySelector('[data-stat="followers"]').textContent = profileStats.followers.toLocaleString();
    document.querySelector('[data-stat="following"]').textContent = profileStats.following.toLocaleString();
    document.querySelector('[data-stat="activity"]').textContent = recentEvents.toLocaleString();
    githubStatus.textContent = 'Live public profile stats · activity from the latest 100 events.';
  } finally {
    window.clearTimeout(timeout);
  }
};
const requestGithubStats = () => {
  void loadGithubStats().catch((error) => {
    console.error('Unable to load GitHub activity.', error);
    githubStatus.textContent = error instanceof Error ? error.message : 'Unable to load GitHub activity.';
    githubStatus.classList.add('is-error');
    const retry = document.createElement('button');
    retry.className = 'github-retry';
    retry.type = 'button';
    retry.textContent = 'Retry';
    retry.addEventListener('click', requestGithubStats, { once: true });
    githubStatus.append(' ', retry);
  });
};
requestGithubStats();

document.querySelector('#timeline').innerHTML = portfolioData.experience.map((item) => `
  <div class="timeline-item">
    <span class="timeline-dot" aria-hidden="true"></span>
    <div><h3>${escapeHtml(item.role)}</h3><p><strong>${escapeHtml(item.company)}</strong></p></div>
    <span>${escapeHtml(item.period)}</span>
    <span class="timeline-admin" data-experience-id="${item.id}"></span>
  </div>
`).join('');

const emailLink = document.querySelector('#contact-email');
emailLink.href = `mailto:${portfolioData.personal.email}`;
emailLink.querySelector('.detail-value').textContent = portfolioData.personal.email;

const phoneLink = document.querySelector('#contact-phone');
phoneLink.href = `tel:${portfolioData.personal.phone.replace(/[^\d+]/g, '')}`;
phoneLink.querySelector('.detail-value').textContent = portfolioData.personal.phone;
document.querySelector('#contact-location').textContent = portfolioData.personal.location;

const javaSnippet = `package com.example.portfolio.project;

import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {
    private final JdbcTemplate jdbcTemplate;

    public InventoryController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/products")
    public List<ProductSummary> listProducts() {
        return jdbcTemplate.query(
                "SELECT id, name FROM products ORDER BY name",
                (result, row) -> new ProductSummary(
                        result.getLong("id"),
                        result.getString("name")));
    }
}

record ProductSummary(Long id, String name) {}`;
const javaKeywords = new Set([
  'package', 'import', 'public', 'private', 'final', 'class', 'record', 'return', 'new'
]);
const javaTokenPattern = /(@[A-Za-z]\w*|\/\/.*|"(?:\\.|[^"\\])*"|\b(?:package|import|public|private|final|class|record|return|new|void|long|int|boolean)\b|\b\d+\b)/g;
const codeElement = document.querySelector('#code-snippet');
javaSnippet.split('\n').forEach((sourceLine) => {
  const line = document.createElement('span');
  line.className = 'code-line';
  let cursor = 0;
  for (const match of sourceLine.matchAll(javaTokenPattern)) {
    const token = match[0];
    const index = match.index;
    if (index > cursor) line.append(document.createTextNode(sourceLine.slice(cursor, index)));
    const highlighted = document.createElement('span');
    if (token.startsWith('@')) highlighted.className = 'token-annotation';
    else if (token.startsWith('//')) highlighted.className = 'token-comment';
    else if (token.startsWith('"')) highlighted.className = 'token-string';
    else if (/^\d+$/.test(token)) highlighted.className = 'token-number';
    else if (javaKeywords.has(token) || ['void', 'long', 'int', 'boolean'].includes(token)) highlighted.className = 'token-keyword';
    highlighted.textContent = token;
    line.append(highlighted);
    cursor = index + token.length;
  }
  if (cursor < sourceLine.length) line.append(document.createTextNode(sourceLine.slice(cursor)));
  codeElement.append(line);
});
const copyCodeButton = document.querySelector('#copy-code');
const copyStatus = document.querySelector('#copy-status');
const copyText = async (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const temporaryInput = document.createElement('textarea');
  temporaryInput.value = text;
  temporaryInput.setAttribute('readonly', '');
  temporaryInput.style.position = 'fixed';
  temporaryInput.style.opacity = '0';
  document.body.append(temporaryInput);
  let copied = false;
  try {
    temporaryInput.select();
    copied = document.execCommand('copy');
  } finally {
    temporaryInput.remove();
  }
  if (!copied) throw new Error('Copy is unavailable in this browser.');
};
copyCodeButton.addEventListener('click', async () => {
  copyCodeButton.disabled = true;
  copyStatus.textContent = 'Copying code…';
  try {
    await copyText(javaSnippet);
    copyStatus.textContent = 'Java and Spring Boot source copied to clipboard.';
  } catch (error) {
    copyStatus.textContent = error instanceof Error ? error.message : 'Unable to copy code.';
  } finally {
    copyCodeButton.disabled = false;
  }
});

const architectureNodes = [
  { id: 'java', label: 'Java', x: 150, y: 68, detail: 'Java is the primary backend language used in the portfolio project descriptions.' },
  { id: 'spring', label: 'Spring Boot', x: 350, y: 68, detail: 'Spring Boot provides the Java REST API layer for the enterprise projects.' },
  { id: 'mysql', label: 'MySQL', x: 550, y: 68, detail: 'MySQL stores relational data for the inventory and CRM projects.' },
  { id: 'html', label: 'HTML5', x: 150, y: 230, detail: 'HTML5 structures the portfolio frontend using native browser technologies.' },
  { id: 'css', label: 'CSS3', x: 350, y: 230, detail: 'CSS3 styles the portfolio frontend without a UI framework.' },
  { id: 'javascript', label: 'JavaScript', x: 550, y: 230, detail: 'Vanilla JavaScript (ES6+) powers the portfolio interactions and calls RESTful APIs.' }
];
const architectureEdges = [
  ['java', 'spring'], ['spring', 'mysql'],
  ['html', 'css'], ['css', 'javascript'],
  ['javascript', 'spring']
];
const mapSvg = document.querySelector('.architecture-edges');
const mapNodes = document.querySelector('.architecture-nodes');
const architectureDetail = document.querySelector('#architecture-detail');
const mapNodeById = new Map(architectureNodes.map((node) => [node.id, node]));
architectureEdges.forEach(([from, to]) => {
  const start = mapNodeById.get(from);
  const end = mapNodeById.get(to);
  const edge = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  edge.classList.add('architecture-edge');
  edge.dataset.from = from;
  edge.dataset.to = to;
  edge.setAttribute('x1', String(start.x));
  edge.setAttribute('y1', String(start.y));
  edge.setAttribute('x2', String(end.x));
  edge.setAttribute('y2', String(end.y));
  mapSvg.append(edge);
});
const selectArchitectureNode = (selectedNode, button) => {
  const connected = new Set([selectedNode.id]);
  architectureEdges.forEach(([from, to]) => {
    if (from === selectedNode.id) connected.add(to);
    if (to === selectedNode.id) connected.add(from);
  });
  mapNodes.querySelectorAll('.architecture-node').forEach((nodeButton) => {
    const isSelected = nodeButton === button;
    nodeButton.setAttribute('aria-pressed', String(isSelected));
    nodeButton.classList.toggle('is-connected', connected.has(nodeButton.dataset.nodeId));
  });
  mapSvg.querySelectorAll('.architecture-edge').forEach((edge) => {
    edge.classList.toggle('is-active', edge.dataset.from === selectedNode.id || edge.dataset.to === selectedNode.id);
  });
  architectureDetail.textContent = selectedNode.detail;
};
architectureNodes.forEach((node) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'architecture-node';
  button.dataset.nodeId = node.id;
  button.textContent = node.label;
  button.style.left = `${node.x / 7}%`;
  button.style.top = `${node.y / 3}%`;
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => selectArchitectureNode(node, button));
  mapNodes.append(button);
});
const initialArchitectureNode = mapNodes.querySelector('[data-node-id="java"]');
selectArchitectureNode(architectureNodes[0], initialArchitectureNode);

const assistantPanel = document.querySelector('#assistant-panel');
const assistantLauncher = document.querySelector('#assistant-launcher');
const assistantClose = document.querySelector('#assistant-close');
const assistantMessages = document.querySelector('#assistant-messages');
const assistantForm = document.querySelector('#assistant-form');
const assistantInput = document.querySelector('#assistant-input');
const assistantPromptButtons = [...document.querySelectorAll('[data-assistant-prompt]')];
const addAssistantMessage = (text, role) => {
  const message = document.createElement('div');
  message.className = `assistant-message ${role === 'user' ? 'is-user' : 'is-assistant'}`;
  message.textContent = text;
  assistantMessages.append(message);
  while (assistantMessages.children.length > 51) assistantMessages.children[1].remove();
  assistantMessages.scrollTop = assistantMessages.scrollHeight;
  return message;
};
addAssistantMessage('Hi! Ask me about Gourav’s skills, education, experience, or projects.', 'assistant');
const assistantAnswers = [
  {
    test: (text) => /\b(skill|stack|technology|technologies|tech|tool|language|framework|database)\b/.test(text)
      || allSkills.some((skill) => text.includes(skill.name.toLowerCase())),
    answer: (text) => {
      const skillDetails = [
        { terms: /\bspring(?:\s*boot)?\b/, response: 'Spring Boot is the Java backend framework used for RESTful API development.' },
        { terms: /\bjava\b/, response: 'Java is Gourav’s primary backend language and is used with Spring Boot.' },
        { terms: /\bmysql\b/, response: 'MySQL is the relational database featured in the inventory and CRM projects.' },
        { terms: /\bjavascript\b/, response: 'The portfolio uses vanilla JavaScript (ES6+) for its interactive features.' },
        { terms: /\bhtml5?\b/, response: 'HTML5 is used to structure the portfolio frontend.' },
        { terms: /\bcss3?\b/, response: 'CSS3 is used to style the portfolio frontend.' },
        { terms: /\bgit\b/, response: 'Git is listed as a developer tool.' },
        { terms: /\bgithub\b/, response: 'GitHub is listed as a developer tool.' },
        { terms: /\bpostman\b/, response: 'Postman is listed as a developer tool for API workflows.' }
      ];
      const detail = skillDetails.find((item) => item.terms.test(text));
      return detail
        ? `${detail.response} Other core skills include ${allSkills.map((skill) => skill.name).join(', ')}.`
        : `Core skills include ${allSkills.map((skill) => skill.name).join(', ')}. Java, Spring Boot, and MySQL are featured in the enterprise project stacks.`;
    }
  },
  {
    test: (text) => /\b(education|college|degree|study|student|b\.?tech|university)\b/.test(text),
    answer: () => {
      return `${portfolioData.education.degree} at ${portfolioData.education.institution}, Jaipur, Rajasthan (${portfolioData.education.affiliation}), ${portfolioData.education.period}.`;
    }
  },
  {
    test: (text) => /\b(experience|intern|trainee|career|journey)\b/.test(text),
    answer: () => portfolioData.experience.filter((item) => !item.role.includes('B.Tech')).map((item) => `${item.period}: ${item.role} at ${item.company}`).join('\n')
  },
  {
    test: (text) => /\b(projects?|inventory|billing|crm|enterprise)\b/.test(text),
    project: true,
    answer: (text) => {
      const matchedProjects = portfolioData.projects.filter((project) => {
        const projectWords = project.name.toLowerCase().split(/\W+/).filter((word) => word.length > 3);
        const matchingName = projectWords.some((word) => text.includes(word));
        const matchingStack = project.stack.some((technology) => text.includes(technology.toLowerCase()));
        return matchingName || matchingStack;
      });
      const projects = matchedProjects.length ? matchedProjects : portfolioData.projects;
      return projects.map((project) => `${project.name} — ${project.description} Stack: ${project.stack.join(', ')}.`).join('\n\n');
    }
  },
  {
    test: (text) => /\b(contact|email|phone|hire|reach|location)\b/.test(text),
    answer: () => `You can reach Gourav at ${portfolioData.personal.email} or ${portfolioData.personal.phone}. Based in ${portfolioData.personal.location}.`
  },
  {
    test: (text) => /\b(resume|cv)\b/.test(text),
    answer: () => 'Use the Get In Touch link to contact Gourav about his resume and current opportunities.'
  },
  {
    test: (text) => /\b(hi|hello|hey|thanks|thank you)\b/.test(text),
    answer: () => 'Hello! Ask me about Java, Spring Boot, MySQL, Gourav’s projects, education, or experience.'
  }
];
const getAssistantAnswer = (question) => {
  const normalizedQuestion = question.toLowerCase();
  const projectIntent = /\b(projects?|inventory|billing|crm|enterprise)\b/.test(normalizedQuestion);
  const match = projectIntent
    ? assistantAnswers.find((entry) => entry.project && entry.test(normalizedQuestion))
      || assistantAnswers.find((entry) => !entry.project && entry.test(normalizedQuestion))
    : assistantAnswers.find((entry) => entry.test(normalizedQuestion));
  return match
    ? match.answer(normalizedQuestion)
    : 'I can help with Gourav’s tech stack, projects, education, experience, or contact details. Try asking about one of those.';
};
const askAssistant = async (question) => {
  const cleanQuestion = question.trim();
  if (!cleanQuestion) return;
  addAssistantMessage(cleanQuestion, 'user');
  assistantInput.value = '';
  assistantInput.disabled = true;
  assistantPromptButtons.forEach((button) => { button.disabled = true; });
  const typing = addAssistantMessage('Looking that up…', 'assistant');
  typing.classList.add('is-typing');
  try {
    await new Promise((resolve) => window.setTimeout(resolve, 240));
    typing.remove();
    addAssistantMessage(getAssistantAnswer(cleanQuestion), 'assistant');
  } finally {
    typing.remove();
    assistantInput.disabled = false;
    assistantPromptButtons.forEach((button) => { button.disabled = false; });
    if (!assistantPanel.hidden) assistantInput.focus();
  }
};
const setAssistantOpen = (open, restoreFocus = false) => {
  assistantPanel.hidden = !open;
  assistantLauncher.setAttribute('aria-expanded', String(open));
  assistantLauncher.setAttribute('aria-label', open ? 'Close portfolio assistant' : 'Open portfolio assistant');
  if (open) assistantInput.focus();
  else if (restoreFocus) assistantLauncher.focus();
};
assistantLauncher.addEventListener('click', () => setAssistantOpen(assistantPanel.hidden));
assistantClose.addEventListener('click', () => setAssistantOpen(false, true));
assistantForm.addEventListener('submit', (event) => {
  event.preventDefault();
  void askAssistant(assistantInput.value);
});
assistantPromptButtons.forEach((button) => {
  button.addEventListener('click', () => void askAssistant(button.dataset.assistantPrompt));
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !assistantPanel.hidden) setAssistantOpen(false, true);
});
document.addEventListener('click', (event) => {
  if (!assistantPanel.hidden && (!(event.target instanceof Element) || !event.target.closest('.assistant-widget'))) {
    setAssistantOpen(false);
  }
});

const nav = document.querySelector('.nav');
const menuButton = document.querySelector('.menu-button');
menuButton.addEventListener('click', () => {
  const expanded = nav.classList.toggle('mobile-open');
  menuButton.setAttribute('aria-expanded', String(expanded));
  menuButton.setAttribute('aria-label', expanded ? 'Close menu' : 'Open menu');
});
document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('mobile-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
  });
});

const supportsFinePointer = window.matchMedia('(pointer: fine)').matches;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (supportsFinePointer && !reduceMotion) {
  document.querySelectorAll('.bento-card, .skill-card, .project-card, .info-panel, .journey-panel, .contact-section').forEach((card) => {
    card.classList.add('tilt-card');
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      const rotateX = ((event.clientY - bounds.top) / bounds.height - .5) * -5;
      const rotateY = ((event.clientX - bounds.left) / bounds.width - .5) * 5;
      card.style.setProperty('--tilt-x', `${rotateX}deg`);
      card.style.setProperty('--tilt-y', `${rotateY}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });
  document.querySelectorAll('.button-primary').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const bounds = button.getBoundingClientRect();
      const x = (event.clientX - bounds.left - bounds.width / 2) * .1;
      const y = (event.clientY - bounds.top - bounds.height / 2) * .1;
      button.style.setProperty('--magnet-x', `${x}px`);
      button.style.setProperty('--magnet-y', `${y}px`);
    });
    button.addEventListener('pointerleave', () => {
      button.style.setProperty('--magnet-x', '0px');
      button.style.setProperty('--magnet-y', '0px');
    });
  });
}

const soundToggle = document.querySelector('.sound-toggle');
const soundLabel = soundToggle.querySelector('.sound-label');
let soundEnabled = false;
let audioContext = null;
let soundToggleChangedAt = 0;
const playInterfaceSound = (kind = 'click') => {
  if (!soundEnabled || !window.AudioContext) return;
  audioContext ??= new window.AudioContext();
  if (audioContext.state === 'suspended') void audioContext.resume();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const now = audioContext.currentTime;
  const isTyping = kind === 'typing';
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(isTyping ? 740 : 660, now);
  oscillator.frequency.exponentialRampToValueAtTime(isTyping ? 610 : 440, now + (isTyping ? .025 : .055));
  gain.gain.setValueAtTime(isTyping ? .008 : .035, now);
  gain.gain.exponentialRampToValueAtTime(.001, now + (isTyping ? .03 : .06));
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(now + (isTyping ? .03 : .06));
};
soundToggle.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  soundToggleChangedAt = performance.now();
  soundToggle.setAttribute('aria-checked', String(soundEnabled));
  soundToggle.setAttribute('aria-label', soundEnabled ? 'Mute interface sounds' : 'Enable interface sounds');
  soundLabel.textContent = soundEnabled ? 'Sound on' : 'Sound off';
});
document.addEventListener('click', (event) => {
  if (!soundEnabled || !(event.target instanceof Element)) return;
  const control = event.target.closest('button, a, .project-card');
  if (!control || control.closest('[data-sound-exempt]') || control === soundToggle) return;
  if (performance.now() - soundToggleChangedAt < 180) return;
  playInterfaceSound('click');
});

const particleCanvas = document.querySelector('#particle-canvas');
const particleContext = particleCanvas.getContext('2d');
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const pointer = { x: -1000, y: -1000, active: false };
let particles = [];
let canvasWidth = 0;
let canvasHeight = 0;
let animationFrame = 0;
const resizeParticleCanvas = () => {
  if (!particleContext) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 1.25);
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  particleCanvas.width = Math.round(canvasWidth * ratio);
  particleCanvas.height = Math.round(canvasHeight * ratio);
  particleContext.setTransform(ratio, 0, 0, ratio, 0, 0);
  const particleCount = Math.max(22, Math.min(64, Math.round((canvasWidth * canvasHeight) / 30000)));
  particles = Array.from({ length: particleCount }, () => ({
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    vx: (Math.random() - .5) * .28,
    vy: (Math.random() - .5) * .28,
    radius: Math.random() * 1.15 + .45
  }));
  if (reducedMotionQuery.matches) drawParticles(false);
};
const drawParticles = (animate) => {
  if (!particleContext) return;
  particleContext.clearRect(0, 0, canvasWidth, canvasHeight);
  for (let index = 0; index < particles.length; index += 1) {
    const particle = particles[index];
    if (animate) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      if (particle.x < 0 || particle.x > canvasWidth) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvasHeight) particle.vy *= -1;
      if (pointer.active) {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 0 && distance < 135) {
          const force = (135 - distance) / 135 * .012;
          particle.vx -= dx / distance * force;
          particle.vy -= dy / distance * force;
          particle.vx = Math.max(-.55, Math.min(.55, particle.vx));
          particle.vy = Math.max(-.55, Math.min(.55, particle.vy));
        }
      }
    }
    for (let otherIndex = index + 1; otherIndex < particles.length; otherIndex += 1) {
      const other = particles[otherIndex];
      const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
      if (distance >= 112) continue;
      const opacity = (1 - distance / 112) * (pointer.active ? .22 : .13);
      particleContext.beginPath();
      particleContext.moveTo(particle.x, particle.y);
      particleContext.lineTo(other.x, other.y);
      particleContext.strokeStyle = `rgba(255, 69, 109, ${opacity})`;
      particleContext.lineWidth = .7;
      particleContext.stroke();
    }
    particleContext.beginPath();
    particleContext.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    particleContext.fillStyle = 'rgba(255, 112, 145, .62)';
    particleContext.fill();
  }
};
const animateParticles = () => {
  if (document.hidden || reducedMotionQuery.matches) return;
  drawParticles(true);
  animationFrame = window.requestAnimationFrame(animateParticles);
};
const startParticleAnimation = () => {
  window.cancelAnimationFrame(animationFrame);
  drawParticles(false);
  if (!document.hidden && !reducedMotionQuery.matches) {
    animationFrame = window.requestAnimationFrame(animateParticles);
  }
};
window.addEventListener('resize', resizeParticleCanvas, { passive: true });
window.addEventListener('pointermove', (event) => {
  if (event.pointerType === 'touch') return;
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  pointer.active = true;
  document.body.style.setProperty('--cursor-x', `${event.clientX}px`);
  document.body.style.setProperty('--cursor-y', `${event.clientY}px`);
  document.body.style.setProperty('--cursor-glow', '1');
}, { passive: true });
window.addEventListener('pointerleave', () => {
  pointer.active = false;
  document.body.style.setProperty('--cursor-glow', '0');
});
document.addEventListener('visibilitychange', startParticleAnimation);
reducedMotionQuery.addEventListener('change', startParticleAnimation);
resizeParticleCanvas();
startParticleAnimation();

const form = document.querySelector('#contact-form');
const status = document.querySelector('.form-status');
const contactFormLink = document.querySelector('#contact-form-link');
contactFormLink.addEventListener('click', (event) => {
  event.preventDefault();
  const details = form.closest('details');
  details.open = true;
  form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  form.querySelector('input[name="name"]').focus({ preventScroll: true });
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = form.querySelector('button');
  button.disabled = true;
  status.textContent = 'Sending your message...';

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': await fetchCsrfToken()
      },
      credentials: 'same-origin',
      body: JSON.stringify(Object.fromEntries(new FormData(form)))
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Unable to send');
    status.textContent = result.message;
    form.reset();
  } catch (error) {
    status.textContent = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
  } finally {
    button.disabled = false;
  }
});

let adminAuthenticated = false;
let csrfToken = '';
const adminDialog = document.querySelector('#admin-dialog');
const adminLoginView = document.querySelector('#admin-login-view');
const adminDashboard = document.querySelector('#admin-dashboard');
const adminLoginForm = document.querySelector('#admin-login-form');
const adminLoginStatus = document.querySelector('#admin-login-status');
const adminDashboardStatus = document.querySelector('#admin-dashboard-status');
const contentEditorDialog = document.querySelector('#content-editor-dialog');
const contentEditorForm = document.querySelector('#content-editor-form');
const contentEditorStatus = document.querySelector('#content-editor-status');
let activeEditor = null;

const fetchCsrfToken = async () => {
  const response = await fetch('/api/admin/csrf', { credentials: 'same-origin', cache: 'no-store' });
  if (!response.ok) throw new Error('Unable to prepare a secure admin request.');
  const result = await response.json();
  if (typeof result.token !== 'string' || !result.token) throw new Error('The server did not provide a CSRF token.');
  csrfToken = result.token;
  return csrfToken;
};

const adminRequest = async (url, method = 'GET', body) => {
  const headers = { Accept: 'application/json' };
  const options = { method, credentials: 'same-origin', cache: 'no-store', headers };
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    headers['X-XSRF-TOKEN'] = csrfToken || await fetchCsrfToken();
  }
  const response = await fetch(url, options);
  if (response.status === 204) return null;
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = result.message || result.detail ||
      (response.status === 401 ? 'Your admin session has expired. Please sign in again.' : `Request failed (${response.status}).`);
    throw new Error(message);
  }
  return result;
};

const makeAdminButton = (label, action, type, id) => {
  const button = document.createElement('button');
  button.className = 'admin-action admin-inline-action';
  button.type = 'button';
  button.textContent = label;
  button.dataset.adminAction = 'true';
  button.dataset[action] = type;
  if (id !== undefined) button.dataset.recordId = String(id);
  return button;
};

const refreshAdminControls = () => {
  document.querySelectorAll('[data-admin-only]').forEach((element) => {
    element.hidden = !adminAuthenticated;
  });
  document.querySelectorAll('.admin-card-actions, .skill-admin-controls, .timeline-admin-controls')
    .forEach((element) => element.remove());
  if (!adminAuthenticated) return;

  document.querySelectorAll('.project-card').forEach((card) => {
    const project = portfolioData.projects.find((item) => item.id === Number(card.dataset.projectId));
    if (!project) return;
    const actions = document.createElement('div');
    actions.className = 'admin-card-actions';
    actions.append(makeAdminButton('Edit', 'adminEdit', 'project', project.id));
    actions.append(makeAdminButton('Delete', 'adminDelete', 'project', project.id));
    card.append(actions);
  });

  document.querySelectorAll('.skill-card').forEach((card) => {
    const skill = allSkills.find((item) => item.id === Number(card.dataset.skillId));
    if (!skill) return;
    const actions = document.createElement('div');
    actions.className = 'admin-inline-controls skill-admin-controls';
    actions.append(makeAdminButton('Edit', 'adminEdit', 'skill', skill.id));
    actions.append(makeAdminButton('Delete', 'adminDelete', 'skill', skill.id));
    card.append(actions);
  });

  document.querySelectorAll('.timeline-admin').forEach((container) => {
    const experience = portfolioData.experience.find((item) => item.id === Number(container.dataset.experienceId));
    if (!experience) return;
    container.className = 'timeline-admin';
    const actions = document.createElement('div');
    actions.className = 'admin-inline-controls timeline-admin-controls';
    actions.append(makeAdminButton('Edit', 'adminEdit', 'experience', experience.id));
    actions.append(makeAdminButton('Delete', 'adminDelete', 'experience', experience.id));
    container.append(actions);
  });
};

const setAdminAuthenticated = (authenticated) => {
  adminAuthenticated = authenticated;
  adminLoginView.hidden = authenticated;
  adminDashboard.hidden = !authenticated;
  refreshAdminControls();
};

const editorFields = {
  project: [
    ['name', 'Project title', 'text'],
    ['description', 'Description', 'textarea'],
    ['stack', 'Technology tags (comma separated)', 'text'],
    ['icon', 'Card icon', 'text'],
    ['repositoryUrl', 'Repository URL (optional)', 'url'],
    ['demoUrl', 'Live demo URL (optional)', 'url']
  ],
  skill: [
    ['name', 'Skill name', 'text'],
    ['category', 'Skill group', 'text'],
    ['icon', 'Devicon path (for example java/java-original.svg)', 'text']
  ],
  experience: [
    ['period', 'Period', 'text'],
    ['role', 'Role', 'text'],
    ['company', 'Organization', 'text']
  ],
  education: [
    ['degree', 'Degree', 'text'],
    ['institution', 'Institution', 'text'],
    ['location', 'Location', 'text'],
    ['affiliation', 'Affiliation', 'text'],
    ['period', 'Period', 'text']
  ],
  personal: [
    ['name', 'Name', 'text'],
    ['title', 'Resume summary', 'textarea'],
    ['location', 'Location', 'text'],
    ['email', 'Email', 'email'],
    ['phone', 'Phone', 'tel']
  ]
};

const currentEditorRecord = (type, id) => {
  if (type === 'project') return portfolioData.projects.find((item) => item.id === id);
  if (type === 'skill') return allSkills.find((item) => item.id === id);
  if (type === 'experience') return portfolioData.experience.find((item) => item.id === id);
  if (type === 'education') return portfolioData.education;
  if (type === 'personal') return portfolioData.personal;
  return null;
};

const openContentEditor = (type, id = null) => {
  const isSingleton = type === 'education' || type === 'personal';
  const existing = isSingleton ? currentEditorRecord(type, null) : id === null ? null : currentEditorRecord(type, id);
  if (id !== null && !existing) throw new Error('The selected portfolio record no longer exists.');
  activeEditor = { type, id };
  document.querySelector('#content-editor-title').textContent =
    `${existing ? 'Edit' : 'Add'} ${type === 'personal' ? 'resume details' : type}`;
  contentEditorForm.replaceChildren();

  editorFields[type].forEach(([name, labelText, inputType]) => {
    const label = document.createElement('label');
    label.textContent = labelText;
    const control = inputType === 'textarea' ? document.createElement('textarea') : document.createElement('input');
    if (control instanceof HTMLInputElement) control.type = inputType;
    control.name = name;
    control.required = !['repositoryUrl', 'demoUrl'].includes(name);
    control.maxLength = name === 'description' ? 1000 : 500;
    let value = existing?.[name] ?? '';
    if (name === 'stack') value = (existing?.stack || []).join(', ');
    if (name === 'category' && !value) value = portfolioData.skillGroups[0]?.category || 'Skills';
    if (name === 'icon' && !value) value = type === 'project' ? '▣' : '';
    control.value = value;
    label.append(control);
    contentEditorForm.append(label);
  });

  const submit = document.createElement('button');
  submit.className = 'button button-primary';
  submit.type = 'submit';
  submit.textContent = 'Save changes';
  contentEditorForm.append(submit);
  contentEditorStatus.textContent = '';
  contentEditorDialog.showModal();
  contentEditorForm.querySelector('input, textarea')?.focus();
};

const submitContentEditor = async (event) => {
  event.preventDefault();
  if (!activeEditor) return;
  const submit = contentEditorForm.querySelector('[type="submit"]');
  submit.disabled = true;
  contentEditorStatus.textContent = 'Saving changes…';
  const fields = Object.fromEntries(new FormData(contentEditorForm));
  if (activeEditor.type === 'project') {
    fields.stack = fields.stack.split(',').map((tag) => tag.trim()).filter(Boolean);
    fields.repositoryUrl ||= null;
    fields.demoUrl ||= null;
  }

  let path;
  let method;
  if (activeEditor.type === 'education') {
    path = '/api/admin/education';
    method = 'PUT';
  } else if (activeEditor.type === 'personal') {
    path = '/api/admin/personal';
    method = 'PUT';
  } else {
    const segment = activeEditor.type === 'experience' ? 'experience' : `${activeEditor.type}s`;
    path = `/api/admin/${segment}${activeEditor.id === null ? '' : `/${activeEditor.id}`}`;
    method = activeEditor.id === null ? 'POST' : 'PUT';
  }

  try {
    await adminRequest(path, method, fields);
    contentEditorStatus.textContent = 'Saved. Refreshing the published portfolio…';
    window.setTimeout(() => window.location.reload(), 300);
  } catch (error) {
    contentEditorStatus.textContent = error instanceof Error ? error.message : 'Unable to save changes.';
    submit.disabled = false;
  }
};

document.querySelector('#admin-login-button').addEventListener('click', async () => {
  adminLoginStatus.textContent = '';
  setAdminAuthenticated(adminAuthenticated);
  adminDialog.showModal();
  if (!adminAuthenticated) {
    try {
      await fetchCsrfToken();
      adminLoginForm.querySelector('input[name="username"]').focus();
    } catch (error) {
      adminLoginStatus.textContent = error instanceof Error ? error.message : 'Unable to initialize secure login.';
    }
  }
});

adminLoginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submit = adminLoginForm.querySelector('[type="submit"]');
  submit.disabled = true;
  adminLoginStatus.textContent = 'Authenticating…';
  try {
    const credentials = Object.fromEntries(new FormData(adminLoginForm));
    await adminRequest('/api/admin/login', 'POST', credentials);
    adminLoginForm.reset();
    setAdminAuthenticated(true);
    adminLoginStatus.textContent = '';
  } catch (error) {
    adminLoginStatus.textContent = error instanceof Error ? error.message : 'Unable to sign in.';
  } finally {
    submit.disabled = false;
  }
});

document.querySelector('#admin-logout').addEventListener('click', async () => {
  adminDashboardStatus.textContent = 'Signing out…';
  try {
    await adminRequest('/api/admin/logout', 'POST');
    window.location.reload();
  } catch (error) {
    adminDashboardStatus.textContent = error instanceof Error ? error.message : 'Unable to sign out.';
  }
});

contentEditorForm.addEventListener('submit', (event) => { void submitContentEditor(event); });
document.querySelectorAll('[data-admin-close]').forEach((button) => {
  button.addEventListener('click', () => adminDialog.close());
});
document.querySelectorAll('[data-editor-close]').forEach((button) => {
  button.addEventListener('click', () => contentEditorDialog.close());
});

document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;
  const deleteButton = event.target.closest('[data-admin-delete]');
  if (deleteButton && adminAuthenticated) {
    const type = deleteButton.dataset.adminDelete;
    const id = Number(deleteButton.dataset.recordId);
    if (!window.confirm(`Delete this ${type}? This cannot be undone.`)) return;
    const segment = type === 'experience' ? 'experience' : `${type}s`;
    void adminRequest(`/api/admin/${segment}/${id}`, 'DELETE')
      .then(() => window.location.reload())
      .catch((error) => {
        adminDashboardStatus.textContent = error instanceof Error ? error.message : 'Unable to delete this item.';
        adminDialog.showModal();
      });
    return;
  }
  const editButton = event.target.closest('[data-admin-edit]');
  if (editButton && adminAuthenticated) {
    try {
      openContentEditor(editButton.dataset.adminEdit, Number(editButton.dataset.recordId) || null);
    } catch (error) {
      adminDashboardStatus.textContent = error instanceof Error ? error.message : 'Unable to open this item.';
    }
    return;
  }
  const addButton = event.target.closest('[data-admin-add]');
  if (addButton && adminAuthenticated) openContentEditor(addButton.dataset.adminAdd);
});

const restoreAdminSession = async () => {
  try {
    await fetchCsrfToken();
    await adminRequest('/api/admin/session');
    setAdminAuthenticated(true);
  } catch (error) {
    if (error instanceof Error && !error.message.includes('(401)') &&
        !error.message.includes('expired')) {
      console.warn('Unable to restore the admin session.', error);
    }
  }
};
void restoreAdminSession();
}

void initializePortfolio();
