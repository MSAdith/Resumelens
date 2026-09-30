import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createPdfResume() {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const page = pdfDoc.addPage([612, 792]);
  let y = 740;

  const addLine = (text, isBold = false, size = 11, color = rgb(0.1, 0.1, 0.1)) => {
    page.drawText(text, {
      x: 50,
      y,
      size,
      font: isBold ? fontBold : font,
      color
    });
    y -= size + 6;
  };

  addLine("Alex Mercer", true, 22, rgb(0.12, 0.24, 0.17));
  addLine("Email: alex.mercer@example.com | Phone: (555) 987-6543 | Location: New York, NY", false, 10, rgb(0.4, 0.4, 0.4));
  addLine("LinkedIn: linkedin.com/in/alexmercer | GitHub: github.com/alexmercer", false, 10, rgb(0.4, 0.4, 0.4));
  y -= 10;

  addLine("Professional Summary", true, 14, rgb(0.12, 0.24, 0.17));
  addLine("Experienced Senior Full Stack Engineer with 6+ years of expertise designing and delivering scalable web applications using", false, 10);
  addLine("React, Node.js, TypeScript, PostgreSQL, and AWS cloud infrastructure.", false, 10);
  y -= 10;

  addLine("Work Experience", true, 14, rgb(0.12, 0.24, 0.17));
  addLine("Senior Software Engineer | Apex Technologies | Jan 2021 – Present", true, 11);
  addLine("- Spearheaded the migration of monolithic frontend to Next.js and React, improving page load speed by 45%.", false, 10);
  addLine("- Architected high-throughput REST APIs with Node.js and Express handling 100k daily active users.", false, 10);
  addLine("- Optimized PostgreSQL database queries, reducing average API response latency by 180ms.", false, 10);
  addLine("- Implemented automated CI/CD deployment pipelines with GitHub Actions, Docker, and AWS.", false, 10);
  y -= 8;

  addLine("Software Engineer | DataFlow Systems | Jun 2018 – Dec 2020", true, 11);
  addLine("- Engineered real-time data visualization dashboard using React, Redux, and WebSockets.", false, 10);
  addLine("- Automated unit testing coverage to 88% using Jest, Vitest, and Cypress.", false, 10);
  y -= 10;

  addLine("Education", true, 14, rgb(0.12, 0.24, 0.17));
  addLine("Bachelor of Science in Computer Science | Columbia University | 2014 – 2018", false, 10);
  y -= 10;

  addLine("Technical Skills", true, 14, rgb(0.12, 0.24, 0.17));
  addLine("Languages: JavaScript, TypeScript, Python, SQL, HTML5, CSS3", false, 10);
  addLine("Frameworks: React, Next.js, Node.js, Express, Redux, Jest, Vitest", false, 10);
  addLine("DevOps & Cloud: AWS, Docker, Kubernetes, GitHub Actions, PostgreSQL, Redis", false, 10);
  y -= 10;

  addLine("Projects", true, 14, rgb(0.12, 0.24, 0.17));
  addLine("- ResumeLens: Open-source ATS resume scoring web application built with React and Express.", false, 10);

  const pdfBytes = await pdfDoc.save();
  const outputPath = path.join(__dirname, "sample_resume.pdf");
  fs.writeFileSync(outputPath, pdfBytes);
  console.log("Successfully generated clean PDF sample resume at:", outputPath);
}

createPdfResume().catch(console.error);
