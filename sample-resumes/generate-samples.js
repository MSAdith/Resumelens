import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createDocxResume() {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: "Alex Mercer",
            heading: HeadingLevel.HEADING_1
          }),
          new Paragraph({
            children: [
              new TextRun("Email: alex.mercer@example.com | Phone: (555) 987-6543 | Location: New York, NY\n"),
              new TextRun("LinkedIn: linkedin.com/in/alexmercer | GitHub: github.com/alexmercer")
            ]
          }),
          new Paragraph({ text: "Professional Summary", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({
            text: "Experienced Senior Full Stack Engineer with 6+ years of expertise designing and delivering scalable web applications using React, Node.js, TypeScript, PostgreSQL, and AWS cloud services."
          }),
          new Paragraph({ text: "Work Experience", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: "Senior Software Engineer - Apex Technologies (Jan 2021 – Present)" }),
          new Paragraph({ text: "• Spearheaded the migration of monolithic frontend to Next.js and React, improving page speed by 40%." }),
          new Paragraph({ text: "• Architected high-throughput REST APIs with Node.js and Express handling 100k daily transactions." }),
          new Paragraph({ text: "• Optimized PostgreSQL database queries, reducing average API response latency by 150ms." }),
          new Paragraph({ text: "Software Engineer - DataFlow Systems (Jun 2018 – Dec 2020)" }),
          new Paragraph({ text: "• Built automated CI/CD pipelines using GitHub Actions, Docker, and Kubernetes for multi-cloud deployments." }),
          new Paragraph({ text: "• Automated unit testing with Jest and Vitest, reaching 90% code coverage." }),
          new Paragraph({ text: "Education", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: "Bachelor of Science in Computer Science - Columbia University (2014 – 2018)" }),
          new Paragraph({ text: "Technical Skills", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: "Languages: JavaScript, TypeScript, Python, SQL, HTML, CSS" }),
          new Paragraph({ text: "Frameworks: React, Next.js, Node.js, Express, Redux, Jest, Vitest" }),
          new Paragraph({ text: "DevOps & Cloud: AWS, Docker, Kubernetes, GitHub Actions, PostgreSQL, Redis" }),
          new Paragraph({ text: "Projects", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: "• ResumeLens: Open-source ATS optimization tool built with React, Express, and PDF parsing." })
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(__dirname, "sample_resume.docx");
  fs.writeFileSync(outputPath, buffer);
  console.log("Created DOCX sample resume at:", outputPath);
}

createDocxResume().catch(console.error);
