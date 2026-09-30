// Dictionary of 500+ tech, business, design, and engineering skills with canonical names & synonyms

const RAW_SKILLS = [
  // Programming Languages
  { name: "JavaScript", synonyms: ["js", "javascript", "ecmascript", "es6", "es2020", "esnext"] },
  { name: "TypeScript", synonyms: ["ts", "typescript"] },
  { name: "Python", synonyms: ["python", "python3", "py"] },
  { name: "Java", synonyms: ["java", "core java", "j2ee"] },
  { name: "C++", synonyms: ["c++", "cpp", "cplusplus"] },
  { name: "C#", synonyms: ["c#", "csharp"] },
  { name: "C", synonyms: ["c programming", "ansi c"] },
  { name: "Go", synonyms: ["golang", "go programming"] },
  { name: "Rust", synonyms: ["rustlang", "rust"] },
  { name: "Ruby", synonyms: ["ruby"] },
  { name: "PHP", synonyms: ["php", "php7", "php8"] },
  { name: "Swift", synonyms: ["swift"] },
  { name: "Kotlin", synonyms: ["kotlin"] },
  { name: "R", synonyms: ["r programming", "r-lang"] },
  { name: "SQL", synonyms: ["sql", "tsql", "plsql", "structured query language"] },
  { name: "HTML", synonyms: ["html", "html5"] },
  { name: "CSS", synonyms: ["css", "css3"] },
  { name: "Sass", synonyms: ["sass", "scss"] },
  { name: "Bash", synonyms: ["bash", "shell", "zsh", "powershell", "shell scripting"] },
  { name: "Scala", synonyms: ["scala"] },
  { name: "Elixir", synonyms: ["elixir"] },
  { name: "Haskell", synonyms: ["haskell"] },
  { name: "Dart", synonyms: ["dart"] },
  { name: "Assembly", synonyms: ["assembly", "x86", "arm assembly"] },
  { name: "MATLAB", synonyms: ["matlab"] },

  // Web Frameworks & Frontend
  { name: "React", synonyms: ["react", "react.js", "reactjs"] },
  { name: "Vue.js", synonyms: ["vue", "vue.js", "vuejs"] },
  { name: "Angular", synonyms: ["angular", "angularjs", "angular2+"] },
  { name: "Next.js", synonyms: ["next.js", "nextjs", "next"] },
  { name: "Nuxt.js", synonyms: ["nuxt", "nuxt.js", "nuxtjs"] },
  { name: "Svelte", synonyms: ["svelte", "sveltekit"] },
  { name: "Ember.js", synonyms: ["ember", "ember.js"] },
  { name: "Backbone.js", synonyms: ["backbone", "backbone.js"] },
  { name: "jQuery", synonyms: ["jquery"] },
  { name: "Redux", synonyms: ["redux", "redux toolkit", "rtk"] },
  { name: "Zustand", synonyms: ["zustand"] },
  { name: "MobX", synonyms: ["mobx"] },
  { name: "RxJS", synonyms: ["rxjs"] },
  { name: "Tailwind CSS", synonyms: ["tailwind", "tailwindcss"] },
  { name: "Bootstrap", synonyms: ["bootstrap", "bootstrap4", "bootstrap5"] },
  { name: "Material UI", synonyms: ["mui", "material ui", "material-ui"] },
  { name: "Chakra UI", synonyms: ["chakra ui", "chakra"] },
  { name: "Styled Components", synonyms: ["styled-components", "styled components"] },
  { name: "Webpack", synonyms: ["webpack"] },
  { name: "Vite", synonyms: ["vite", "vitejs"] },
  { name: "Babel", synonyms: ["babel"] },
  { name: "ESLint", synonyms: ["eslint"] },
  { name: "GraphQL", synonyms: ["graphql"] },
  { name: "REST API", synonyms: ["rest", "restful", "rest api", "restful apis"] },
  { name: "gRPC", synonyms: ["grpc"] },
  { name: "WebSockets", synonyms: ["websocket", "websockets", "socket.io"] },

  // Backend Frameworks
  { name: "Node.js", synonyms: ["node", "node.js", "nodejs"] },
  { name: "Express.js", synonyms: ["express", "express.js", "expressjs"] },
  { name: "NestJS", synonyms: ["nestjs", "nest.js"] },
  { name: "Fastify", synonyms: ["fastify"] },
  { name: "Django", synonyms: ["django"] },
  { name: "Flask", synonyms: ["flask"] },
  { name: "FastAPI", synonyms: ["fastapi"] },
  { name: "Spring Boot", synonyms: ["spring", "spring boot", "springframework"] },
  { name: "Ruby on Rails", synonyms: ["rails", "ruby on rails", "ror"] },
  { name: "ASP.NET", synonyms: [".net", "asp.net", "dotnet", ".net core"] },
  { name: "Laravel", synonyms: ["laravel"] },
  { name: "Symfony", synonyms: ["symfony"] },
  { name: "Gin", synonyms: ["gin", "gin-gonic"] },

  // Databases & Storage
  { name: "PostgreSQL", synonyms: ["postgres", "postgresql", "pg"] },
  { name: "MySQL", synonyms: ["mysql"] },
  { name: "MongoDB", synonyms: ["mongo", "mongodb"] },
  { name: "Redis", synonyms: ["redis"] },
  { name: "SQLite", synonyms: ["sqlite"] },
  { name: "Cassandra", synonyms: ["cassandra", "apache cassandra"] },
  { name: "DynamoDB", synonyms: ["dynamodb", "aws dynamodb"] },
  { name: "Elasticsearch", synonyms: ["elasticsearch", "elastic search", "elk"] },
  { name: "Oracle DB", synonyms: ["oracle", "oracle db"] },
  { name: "MSSQL", synonyms: ["mssql", "sql server", "microsoft sql server"] },
  { name: "Neo4j", synonyms: ["neo4j"] },
  { name: "Supabase", synonyms: ["supabase"] },
  { name: "Firebase", synonyms: ["firebase", "firestore"] },
  { name: "Pinecone", synonyms: ["pinecone"] },
  { name: "ChromaDB", synonyms: ["chroma", "chromadb"] },
  { name: "Snowflake", synonyms: ["snowflake"] },
  { name: "BigQuery", synonyms: ["bigquery", "google bigquery"] },
  { name: "Redshift", synonyms: ["redshift", "aws redshift"] },

  // Cloud & DevOps
  { name: "AWS", synonyms: ["aws", "amazon web services", "ec2", "s3", "lambda", "cloudfront"] },
  { name: "Google Cloud", synonyms: ["gcp", "google cloud", "google cloud platform"] },
  { name: "Microsoft Azure", synonyms: ["azure", "microsoft azure"] },
  { name: "Docker", synonyms: ["docker", "containerization"] },
  { name: "Kubernetes", synonyms: ["k8s", "kubernetes", "k8"] },
  { name: "Terraform", synonyms: ["terraform"] },
  { name: "Ansible", synonyms: ["ansible"] },
  { name: "Jenkins", synonyms: ["jenkins"] },
  { name: "GitHub Actions", synonyms: ["github actions", "gh actions"] },
  { name: "GitLab CI", synonyms: ["gitlab ci", "gitlab-ci"] },
  { name: "CircleCI", synonyms: ["circleci"] },
  { name: "CI/CD", synonyms: ["ci/cd", "cicd", "continuous integration", "continuous deployment"] },
  { name: "Nginx", synonyms: ["nginx"] },
  { name: "Apache", synonyms: ["apache", "httpd"] },
  { name: "Helm", synonyms: ["helm", "helm charts"] },
  { name: "Prometheus", synonyms: ["prometheus"] },
  { name: "Grafana", synonyms: ["grafana"] },
  { name: "Datadog", synonyms: ["datadog"] },
  { name: "Linux", synonyms: ["linux", "ubuntu", "debian", "centos", "redhat"] },

  // AI & Data Science
  { name: "Machine Learning", synonyms: ["machine learning", "ml"] },
  { name: "Deep Learning", synonyms: ["deep learning", "dl"] },
  { name: "Artificial Intelligence", synonyms: ["artificial intelligence", "ai", "genai", "generative ai"] },
  { name: "TensorFlow", synonyms: ["tensorflow", "tf"] },
  { name: "PyTorch", synonyms: ["pytorch"] },
  { name: "Scikit-Learn", synonyms: ["scikit-learn", "sklearn"] },
  { name: "Pandas", synonyms: ["pandas"] },
  { name: "NumPy", synonyms: ["numpy"] },
  { name: "OpenCV", synonyms: ["opencv"] },
  { name: "NLP", synonyms: ["nlp", "natural language processing"] },
  { name: "LLM", synonyms: ["llm", "large language models", "transformers", "langchain", "llamaIndex"] },
  { name: "Computer Vision", synonyms: ["computer vision", "cv"] },
  { name: "Data Analysis", synonyms: ["data analysis", "data analytics"] },
  { name: "Data Engineering", synonyms: ["data engineering", "etl", "data pipelines"] },
  { name: "Apache Spark", synonyms: ["spark", "apache spark", "pyspark"] },
  { name: "Apache Kafka", synonyms: ["kafka", "apache kafka"] },
  { name: "Airflow", synonyms: ["airflow", "apache airflow"] },
  { name: "PowerBI", synonyms: ["powerbi", "power bi"] },
  { name: "Tableau", synonyms: ["tableau"] },

  // Testing & Quality
  { name: "Jest", synonyms: ["jest"] },
  { name: "Vitest", synonyms: ["vitest"] },
  { name: "Cypress", synonyms: ["cypress"] },
  { name: "Playwright", synonyms: ["playwright"] },
  { name: "Selenium", synonyms: ["selenium"] },
  { name: "Mocha", synonyms: ["mocha"] },
  { name: "Chai", synonyms: ["chai"] },
  { name: "JUnit", synonyms: ["junit"] },
  { name: "PyTest", synonyms: ["pytest"] },
  { name: "TDD", synonyms: ["tdd", "test-driven development"] },
  { name: "Unit Testing", synonyms: ["unit testing", "integration testing", "e2e testing"] },

  // Methodology & Management
  { name: "Agile", synonyms: ["agile"] },
  { name: "Scrum", synonyms: ["scrum", "scrum master"] },
  { name: "Kanban", synonyms: ["kanban"] },
  { name: "Jira", synonyms: ["jira"] },
  { name: "Confluence", synonyms: ["confluence"] },
  { name: "Git", synonyms: ["git", "github", "gitlab", "bitbucket", "version control"] },
  { name: "Project Management", synonyms: ["project management", "pmp"] },
  { name: "Product Management", synonyms: ["product management"] },
  { name: "System Architecture", synonyms: ["system architecture", "software design", "design patterns"] },
  { name: "Microservices", synonyms: ["microservices", "microservice architecture"] },
  { name: "Serverless", synonyms: ["serverless"] },
  { name: "Clean Code", synonyms: ["clean code", "refactoring"] },
  { name: "Code Review", synonyms: ["code review", "peer review"] },

  // UI/UX & Design
  { name: "Figma", synonyms: ["figma"] },
  { name: "Adobe XD", synonyms: ["adobe xd", "xd"] },
  { name: "UI Design", synonyms: ["ui design", "user interface"] },
  { name: "UX Design", synonyms: ["ux design", "user experience"] },
  { name: "Wireframing", synonyms: ["wireframing", "prototyping"] },
  { name: "Accessibility", synonyms: ["accessibility", "a11y", "wcag"] },

  // Business & Soft Skills
  { name: "Leadership", synonyms: ["leadership", "team lead"] },
  { name: "Communication", synonyms: ["communication", "verbal communication", "written communication"] },
  { name: "Problem Solving", synonyms: ["problem solving", "analytical skills"] },
  { name: "Cross-functional Collaboration", synonyms: ["cross-functional", "collaboration", "stakeholder management"] },
  { name: "Strategic Planning", synonyms: ["strategic planning", "strategy"] },
  { name: "Financial Modeling", synonyms: ["financial modeling", "finance"] },
  { name: "Data-Driven Decision Making", synonyms: ["data-driven", "analytics"] },
  { name: "Mentorship", synonyms: ["mentorship", "coaching", "training"] }
];

// Additional 400+ domain terms to reach 500+ total tracked skills
const EXTRA_TERMS = [
  "Kubernetes", "Prometheus", "Grafana", "Splunk", "NewRelic", "Sentry", "PagerDuty", "Terraform", "CloudFormation",
  "Serverless", "OpenShift", "Rancher", "Vagrant", "VirtualBox", "VMware", "Hyper-V", "Bash", "Zsh", "Powershell",
  "OpenAPI", "Swagger", "Postman", "Insomnia", "SOAP", "WSDL", "XML", "JSON", "Protobuf", "Thrift", "Avro",
  "OAuth", "OAuth2", "JWT", "SAML", "OpenID", "SSO", "Auth0", "Okta", "Keycloak", "HTTPS", "TLS", "SSL",
  "AES", "RSA", "Cryptography", "Penetration Testing", "Ethical Hacking", "OWASP", "Vulnerability Scanning", "SOC2",
  "HIPAA", "GDPR", "PCI-DSS", "ISO27001", "Cybersecurity", "Zero Trust", "IAM", "VPC", "DNS", "CDN", "Cloudflare",
  "Fastly", "Akamai", "HAProxy", "Envoy", "Traefik", "Istio", "Linkerd", "Kong", "Apigee", "Kafka", "RabbitMQ",
  "ActiveMQ", "SQS", "SNS", "EventBridge", "NATS", "ZeroMQ", "Pulsar", "Flink", "Beam", "Hadoop", "Hive", "Pig",
  "Presto", "Trino", "Databricks", "dbt", "Airflow", "Dagster", "Prefect", "Luigi", "KubeFlow", "MLflow",
  "Feast", "DVC", "W&B", "Ray", "Triton", "ONNX", "TensorRT", "OpenVINO", "Hugging Face", "Ollama", "vLLM",
  "LlamaIndex", "LangChain", "AutoGPT", "Semantic Kernel", "RAG", "Vector Search", "Pinecone", "Weaviate",
  "Qdrant", "Milvus", "FAISS", "Chroma", "Elasticsearch", "Opensearch", "Algolia", "Solr", "Lucene",
  "Meilisearch", "Typesense", "PostgreSQL", "MySQL", "MariaDB", "SQLite", "Oracle", "SQL Server", "CockroachDB",
  "YugabyteDB", "TiDB", "Spanner", "Vitess", "ClickHouse", "DuckDB", "TimescaleDB", "InfluxDB", "QuestDB",
  "Prometheus", "VictoriaMetrics", "Couchbase", "CouchDB", "RethinkDB", "RavenDB", "ArangoDB", "OrientDB",
  "Memcached", "Hazelcast", "Ehcache", "Aerospike", "ScyllaDB", "JanusGraph", "Amazon Neptune", "CosmosDB",
  "React", "Vue", "Angular", "Svelte", "SolidJS", "Qwik", "Astro", "Gatsby", "Nuxt", "Next.js", "Remix",
  "Alpine.js", "Lit", "Stencil", "Web Components", "HTML5", "CSS3", "Sass", "Less", "Stylus", "PostCSS",
  "TailwindCSS", "Bootstrap", "Bulma", "Foundation", "Semantic UI", "Ant Design", "Chakra UI", "MUI",
  "Radix UI", "Shadcn UI", "Headless UI", "Storybook", "Framer Motion", "GSAP", "Three.js", "PixiJS",
  "Canvas API", "WebGL", "WebGPU", "WebAssembly", "Wasm", "Service Workers", "PWA", "IndexedDB", "Web Workers",
  "Node.js", "Deno", "Bun", "Express", "Koa", "Fastify", "Hono", "NestJS", "Feathers", "Sails.js", "AdonisJS",
  "Django", "Flask", "FastAPI", "Tornado", "Pyramid", "Bottle", "Sanic", "Celery", "RQ", "Drama", "Spring",
  "Spring Boot", "Micronaut", "Quarkus", "Vert.x", "Hibernate", "JPA", "MyBatis", "Laravel", "Symfony",
  "CodeIgniter", "Yii", "CakePHP", "Ruby on Rails", "Sinatra", "Hanami", "ASP.NET Core", "Entity Framework",
  "Blazor", "Nancy", "Gin", "Echo", "Fiber", "Chi", "Gorilla Mux", "GORM", "Ent", "Actix", "Axum", "Rocket",
  "Warp", "Diesel", "SQLx", "Phoenix", "Ecto", "Absinthe", "SwiftUI", "UIKit", "Combine", "CoreData",
  "Jetpack Compose", "Android SDK", "Flutter", "React Native", "Ionic", "Capacitor", "Cordova", "Xamarin",
  "MAUI", "Tauri", "Electron", "NW.js", "Qt", "GTK", "WxWidgets", "JUCE", "OpenGL", "Vulkan", "DirectX",
  "Metal", "Unity", "Unreal Engine", "Godot", "CryEngine", "Blender", "Maya", "3ds Max", "ZBrush",
  "Jest", "Vitest", "Mocha", "Chai", "Jasmine", "Karma", "AVA", "Tape", "Cypress", "Playwright", "Puppeteer",
  "Selenium", "Appium", "Detox", "Espresso", "XCTest", "JUnit", "TestNG", "Mockito", "PyTest", "Unittest",
  "NUnit", "xUnit", "RSpec", "Capybara", "Gherkin", "Cucumber", "Behave", "Locust", "JMeter", "k6", "Gatling",
  "Artillery", "Chaos Mesh", "LitmusChaos", "Gremlin", "SonarQube", "Snyk", "Dependabot", "Veracode",
  "Checkmarx", "Trivy", "Grype", "Clair", "Anchore", "Git", "GitHub", "GitLab", "Bitbucket", "Mercurial",
  "SVN", "Perforce", "Jira", "Linear", "Asana", "Trello", "Monday.com", "ClickUp", "Notion", "Basecamp",
  "Confluence", "Slack", "Microsoft Teams", "Discord", "Zoom", "Miro", "Figma", "Sketch", "InVision",
  "Zeplin", "Adobe XD", "Photoshop", "Illustrator", "After Effects", "Premiere Pro", "Canva",
  "Agile", "Scrum", "Kanban", "Extreme Programming", "XP", "Waterfall", "SAFe", "LeSS", "Prince2", "PMP",
  "ITIL", "Six Sigma", "Kaizen", "OKRs", "KPIs", "A/B Testing", "Feature Flags", "LaunchDarkly", "Split.io",
  "Google Analytics", "Mixpanel", "Amplitude", "Segment", "PostHog", "Heap", "Hotjar", "FullStory",
  "SEO", "SEM", "Content Strategy", "Copywriting", "Technical Writing", "Customer Support", "Customer Success",
  "Salesforce", "HubSpot", "Zendesk", "Intercom", "Marketo", "Pardot", "Mailchimp", "SendGrid", "Stripe",
  "PayPal", "Plaid", "Square", "Braintree", "Adyen", "Twilio", "Agora", "SendBird", "Firebase", "Supabase",
  "Appwrite", "NHost", "Convex", "Hasura", "Prisma", "Drizzle ORM", "TypeORM", "Sequelize", "Mongoose",
  "Kysely", "Knex.js", "Waterline", "DBFlow", "Room", "CoreData", "Realm", "ObjectBox", "RocksDB",
  "LevelDB", "LMDB", "BerkeleyDB", "H2", "Derby", "HSQLDB"
];

// Map of lowercased term -> canonical name
export const SKILL_MAP = new Map();
// Set of all canonical skill names
export const ALL_SKILLS = new Set();
// Set of lowercased tokens to ignore in spell check
export const SKILLS_DICTIONARY_WORDS = new Set();

RAW_SKILLS.forEach(item => {
  ALL_SKILLS.add(item.name);
  const canonical = item.name;
  item.synonyms.forEach(syn => {
    SKILL_MAP.set(syn.toLowerCase(), canonical);
    syn.toLowerCase().split(/\s+/).forEach(token => SKILLS_DICTIONARY_WORDS.add(token));
  });
  canonical.toLowerCase().split(/\s+/).forEach(token => SKILLS_DICTIONARY_WORDS.add(token));
});

EXTRA_TERMS.forEach(term => {
  if (!ALL_SKILLS.has(term)) {
    ALL_SKILLS.add(term);
    const lower = term.toLowerCase();
    SKILL_MAP.set(lower, term);
    lower.split(/[\s/\-_]+/).forEach(t => {
      if (t.length > 1) SKILLS_DICTIONARY_WORDS.add(t);
    });
  }
});

// Helper to normalize and resolve skill
export function normalizeSkill(term) {
  if (!term) return null;
  const lower = term.trim().toLowerCase();
  if (SKILL_MAP.has(lower)) return SKILL_MAP.get(lower);
  // Case-insensitive match check in ALL_SKILLS
  for (const s of ALL_SKILLS) {
    if (s.toLowerCase() === lower) return s;
  }
  return null;
}
