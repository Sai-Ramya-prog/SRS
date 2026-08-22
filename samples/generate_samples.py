import os

# Minimal valid PDF generator helper function
def create_pdf(filename, text):
    lines = text.split('\n')
    pdf_content = [
        "%PDF-1.4",
        "1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj",
        "2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj",
        "3 0 obj <</Type /Page /Parent 2 0 R /Resources <</Font <</F1 4 0 R>>>> /MediaBox [0 0 612 792] /Contents 5 0 R>> endobj",
        "4 0 obj <</Type /Font /Subtype /Type1 /BaseFont /Helvetica>> endobj"
    ]
    
    # Text stream
    stream_lines = ["BT", "/F1 12 Tf", "50 750 Td", "14 TL"]
    for l in lines:
        escaped = l.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
        stream_lines.append(f"({escaped}) T*")
    stream_lines.append("ET")
    
    stream_str = "\n".join(stream_lines)
    stream_bytes = stream_str.encode('latin1')
    
    pdf_content.append(f"5 0 obj <</Length {len(stream_bytes)}>> stream\n{stream_str}\nendstream\nendobj")
    pdf_content.append("xref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000056 00000 n \n0000000111 00000 n \n0000000224 00000 n \n")
    pdf_content.append("trailer <</Size 6 /Root 1 0 R>>\nstartxref\n300\n%%EOF")
    
    full_pdf = "\n".join(pdf_content)
    with open(filename, "wb") as f:
        f.write(full_pdf.encode('latin1', errors='ignore'))
    print(f"Created sample PDF: {filename}")

if __name__ == "__main__":
    os.makedirs("d:/SRS/samples", exist_ok=True)
    
    create_pdf("d:/SRS/samples/john_doe_backend.pdf", 
"""John Doe
Email: john.doe@email.com | Phone: (555) 019-2831

SUMMARY
Senior Python Backend Developer with 5 years of experience building high-scale REST APIs using FastAPI, PostgreSQL, and Docker.

SKILLS
Python, FastAPI, PostgreSQL, SQL, Docker, Kubernetes, AWS, REST API, Git, Redis, CI/CD

EXPERIENCE
Senior Backend Developer - CloudTech (2022 - Present)
- Architected microservices with FastAPI and PostgreSQL handling 50M requests daily.
- Deployed containerized applications on AWS EKS using Kubernetes and Helm.

Software Engineer - DataFlow Inc (2019 - 2022)
- Built Python data processing pipelines and Django web applications.

EDUCATION
B.Tech Computer Science, State University (2019)""")

    create_pdf("d:/SRS/samples/sara_jenkins_fullstack.pdf", 
"""Sara Jenkins
Email: sara.jenkins@techmail.com

SUMMARY
Full Stack Engineer with 3 years experience specializing in React, Node.js, and Python API development.

SKILLS
React, JavaScript, TypeScript, Python, FastAPI, Node.js, PostgreSQL, CSS, HTML, Git

EXPERIENCE
Full Stack Engineer - WebLabs (2021 - Present)
- Designed interactive UI dashboards using React, Redux, and Tailwind CSS.
- Developed backend API endpoints in FastAPI and Node.js.

EDUCATION
B.S. Software Engineering, City College (2021)""")

    create_pdf("d:/SRS/samples/alex_smith_frontend.pdf", 
"""Alex Smith
Email: alex.smith@devmail.org

SUMMARY
Junior Frontend Developer focused on HTML, CSS, and basic JavaScript. Looking for entry level web roles.

SKILLS
HTML5, CSS3, JavaScript, Figma, Git

EXPERIENCE
Web Developer Intern - Creative Studio (2023 - 2024)
- Built static landing pages using HTML and CSS.

EDUCATION
Associate Degree in Web Design, Tech Institute (2023)""")
