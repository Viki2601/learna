// DevOps More Q&A dataset: Git, GitHub, Linux, Nginx, GraphQL, Jest, AWS
// Covers modules with clear explanations, practical code examples, and key takeaways.

export const QA_DEVOPS_MORE = [
  // ==========================================
  // GIT (15 Modules)
  // ==========================================
  {
    question: "What is the difference between Git Merge and Git Rebase?",
    answer:
      "Both commands integrate changes from one branch into another:\n\n• `git merge`: Preserves the exact historical timeline and creates a new 3-way 'merge commit'. It is non-destructive, safe for shared public branches, but can create complex branch history graphs.\n• `git rebase`: Re-applies commits from the feature branch on top of the base branch, creating a completely linear project history. **Never rebase commits that have been pushed to a shared public branch**.",
    example: `# 1. Rebase feature branch on top of main for linear history
git checkout feature-branch
git rebase main

# If conflicts occur, resolve and continue:
# git add <resolved-files>
# git rebase --continue

# 2. Fast-forward merge into main
git checkout main
git merge feature-branch`,
    explanation:
      "Rebasing keeps Git commit history clean and easy to navigate with `git bisect`, while merge preserves the true chronological order of commits.",
    moduleSlug: "merge-vs-rebase",
    category: "git",
    language: "bash",
  },
  {
    question: "How do Git Hooks automate pre-commit linting and testing?",
    answer:
      "Git hooks are scripts placed in `.git/hooks/` (or managed via Husky) that run automatically at key points in the Git workflow (e.g. `pre-commit`, `commit-msg`, `pre-push`).\n\nIf the hook script exits with a non-zero status code, Git aborts the commit or push.",
    example: `#!/bin/sh
# .husky/pre-commit
echo "Running automated pre-commit checks..."

# Run linter and type-checker
npm run lint || exit 1
npm run type-check || exit 1

echo "Pre-commit checks passed successfully!"`,
    explanation:
      "Pre-commit hooks prevent developers from accidentally pushing unlinted or broken code to remote repositories.",
    moduleSlug: "git-hooks",
    category: "git",
    language: "bash",
  },

  // ==========================================
  // LINUX (15 Modules)
  // ==========================================
  {
    question:
      "How do Linux file permissions and chmod (numeric vs symbolic) work?",
    answer:
      "Linux permissions are divided into three user classes: **User (u)**, **Group (g)**, and **Others (o)**. Each class has three permission bits:\n• Read (r = 4)\n• Write (w = 2)\n• Execute (x = 1)\n\nNumeric permissions sum these values (e.g., `755` = rwx for user, r-x for group, r-x for others).",
    example: `# Give read, write, execute to owner; read and execute to group and others
chmod 755 deploy_script.sh

# Make script executable symbolically
chmod +x deploy_script.sh

# Change file ownership to user 'appuser' and group 'webgroup'
chown appuser:webgroup deploy_script.sh`,
    explanation:
      "`chmod 600 id_rsa` ensures only the current user can read their private SSH keys, which OpenSSH strictly enforces before allowing connections.",
    moduleSlug: "file-permissions-chmodchown",
    category: "linux",
    language: "bash",
  },
  {
    question: "How does systemd manage background services in Linux?",
    answer:
      "`systemd` is the standard init system and service manager for Linux. Services are defined in `.service` unit files, specifying restart behavior, dependencies, user privileges, and environment variables.",
    example: `[Unit]
Description=Learna Node.js Web Application
After=network.target postgresql.service

[Service]
Type=simple
User=deploy
WorkingDirectory=/var/www/app
ExecStart=/usr/bin/node dist/server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production PORT=3000

[Install]
WantedBy=multi-user.target`,
    explanation:
      "Configuring `Restart=always` ensures that if the application crashes due to an out-of-memory error, `systemd` revives it within 5 seconds.",
    moduleSlug: "systemd-services",
    category: "linux",
    language: "ini",
  },

  // ==========================================
  // NGINX (15 Modules)
  // ==========================================
  {
    question:
      "How do you configure Nginx as a Reverse Proxy and SSL/TLS termination gateway?",
    answer:
      "Nginx acts as a high-performance reverse proxy that accepts client requests, terminates SSL certificates, and forwards requests to backend application servers (Node.js, Python, Go) while buffering slow clients.",
    example: `server {
    listen 80;
    server_name api.domain.com;
    return 301 https://$host$request_uri; # Redirect HTTP to HTTPS
}

server {
    listen 443 ssl http2;
    server_name api.domain.com;

    ssl_certificate /etc/letsencrypt/live/domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/domain.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`,
    explanation:
      "Nginx handles HTTPS decryption on optimized C cores, passing plain HTTP to backend application instances and freeing up CPU cycles.",
    moduleSlug: "reverse-proxy-setup",
    category: "nginx",
    language: "nginx",
  },

  // ==========================================
  // GRAPHQL (15 Modules)
  // ==========================================
  {
    question:
      "What is the N+1 Problem in GraphQL and how does DataLoader solve it?",
    answer:
      "The N+1 problem occurs when a query fetches 1 parent record and then executes N individual database queries for related child records in field resolvers.\n\n**DataLoader** solves this by batching and caching: it collects all individual IDs requested within a single event loop tick and fires a single batch query (`SELECT * FROM table WHERE id IN (...)`).",
    example: `import DataLoader from "dataloader";

// Batch function: receives array of author IDs and returns array of authors in identical order
const authorLoader = new DataLoader(async (authorIds) => {
  const authors = await db.authors.findMany({
    where: { id: { in: authorIds } }
  });
  // Map back to match input authorIds order
  return authorIds.map((id) => authors.find((a) => a.id === id));
});

// Inside GraphQL Resolver:
export const resolvers = {
  Book: {
    author: (book) => authorLoader.load(book.authorId) // Batched automatically!
  }
};`,
    explanation:
      "DataLoader collapses 100 separate database queries for 100 books into a single `WHERE id IN (...)` query, dramatically reducing database load.",
    moduleSlug: "n1-problem-dataloader",
    category: "graphql",
    language: "javascript",
  },

  // ==========================================
  // JEST (15 Modules)
  // ==========================================
  {
    question: "How do Mocks and Spies work in Jest (jest.fn, jest.spyOn)?",
    answer:
      "• `jest.fn()`: Creates a mock function that tracks calls, arguments, and return values.\n• `jest.spyOn()`: Wraps an existing method on an object to track calls while optionally preserving or overriding its implementation.",
    example: `import * as userService from "./userService";

test("sends welcome email on registration", async () => {
  // Spy on email sending method and mock implementation
  const emailSpy = jest.spyOn(userService, "sendEmail").mockResolvedValue(true);

  await userService.registerUser({ email: "test@example.com" });

  // Assertions
  expect(emailSpy).toHaveBeenCalledTimes(1);
  expect(emailSpy).toHaveBeenCalledWith("test@example.com", expect.any(String));

  emailSpy.mockRestore(); // Restore original implementation
});`,
    explanation:
      "Spies allow asserting that side-effect functions (like email senders or analytics trackers) were invoked correctly without sending real emails in unit tests.",
    moduleSlug: "mocking-spies",
    category: "jest",
    language: "javascript",
  },
];
