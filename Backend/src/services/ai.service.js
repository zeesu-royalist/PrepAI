const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const AI_MODEL = process.env.GOOGLE_GENAI_MODEL || "gemini-2.0-flash"

let ai = null

if (process.env.GOOGLE_GENAI_API_KEY) {
    try {
        ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY })
    } catch (error) {
        console.warn("GoogleGenAI init failed:", error.message)
    }
}

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

function normalizeText(value = "") {
    return String(value || "").replace(/\s+/g, " ").trim()
}

function extractKeywords(text = "") {
    const stopWords = new Set([
        "the", "and", "for", "with", "that", "this", "your", "from", "into", "have", "will", "you",
        "are", "was", "were", "their", "about", "also", "than", "where", "when", "what", "who", "how",
        "over", "using", "team", "role", "project", "work", "build", "good", "strong", "skills", "experience",
        "hiring", "candidate", "interview", "description", "business", "full", "stack", "requirements", "resume"
    ])

    return Array.from(new Set(
        normalizeText(text)
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, " ")
            .split(/\s+/)
            .filter((token) => token.length > 2 && !stopWords.has(token))
    ))
}

function titleFromJobDescription(jobDescription = "") {
    const rawTitle = normalizeText(jobDescription).split(/\n|\.|\!/)[0]
    return rawTitle ? rawTitle.slice(0, 120) : "Interview Preparation Report"
}

function buildLocalInterviewReport({ resume, selfDescription, jobDescription }) {
    const profileText = `${resume || ""} ${selfDescription || ""}`
    const jobKeywords = extractKeywords(jobDescription)
    const profileKeywords = extractKeywords(profileText)
    const matchedKeywords = jobKeywords.filter((keyword) => profileKeywords.includes(keyword))
    const rawMatch = jobKeywords.length
        ? Math.round((matchedKeywords.length / jobKeywords.length) * 100)
        : 70

    const matchScore = Math.max(35, Math.min(95, rawMatch))

    const technicalQuestions = [
        {
            question: `How would you approach ${jobKeywords[0] || "a complex technical problem"} in a production-grade system?`,
            intention: "The interviewer wants to see structured problem solving, trade-off awareness, and design thinking.",
            answer: "Start with clarifying requirements, define the expected inputs and constraints, then outline a simple scalable approach with trade-offs. Walk through the core implementation steps, validation strategy, and how you would monitor the solution in production."
        },
        {
            question: `Describe a project where you used ${jobKeywords[1] || "modern web technologies"} to deliver measurable business impact.`,
            intention: "This checks ownership, delivery mindset, and whether you can explain impact beyond only implementation details.",
            answer: "Discuss the challenge, your role, the technology choices you made, and the measurable result. Focus on collaboration, decision-making, and the lessons you learned when the project evolved."
        }
    ]

    const behavioralQuestions = [
        {
            question: "Tell me about a time you handled ambiguity or a changing priority on a real project.",
            intention: "The interviewer wants evidence of communication, adaptability, and calm decision-making under pressure.",
            answer: "Use the STAR format. Explain the situation, the ambiguity you faced, the actions you took, and the outcome. Highlight how you aligned stakeholders and kept delivery moving."
        },
        {
            question: "Describe a moment when you had to learn a new technology quickly and apply it in practice.",
            intention: "This reveals learning agility and whether you can adapt to a changing technical environment.",
            answer: "Explain how you identified the learning need, the resources you used, how you applied the new skill, and the eventual result. Emphasize your system for ramping up quickly and validating knowledge in real work."
        }
    ]

    const skillGaps = jobKeywords
        .filter((keyword) => !profileKeywords.includes(keyword))
        .slice(0, 3)
        .map((skill, index) => ({
            skill: skill.replace(/\b\w/g, (character) => character.toUpperCase()),
            severity: index === 0 ? "high" : index === 1 ? "medium" : "low"
        }))

    const preparationPlan = [
        {
            day: 1,
            focus: "Role and skill mapping",
            tasks: [
                "Review the job requirements and isolate the top technical competencies you must demonstrate.",
                "Compare those expectations against your resume and self-description to identify the biggest gaps."
            ]
        },
        {
            day: 2,
            focus: "System design and application thinking",
            tasks: [
                "Practice explaining how you would design a simple scalable solution for a real business problem.",
                "Prepare 2-3 examples of architecture decisions you made or would make in a team setting."
            ]
        },
        {
            day: 3,
            focus: "Coding and communication drills",
            tasks: [
                "Solve one coding challenge related to the role's stack and explain your reasoning out loud.",
                "Use concise, structured answers to describe trade-offs, edge cases, and testing coverage."
            ]
        },
        {
            day: 4,
            focus: "Behavioral story rehearsal",
            tasks: [
                "Prepare 3 STAR stories covering leadership, collaboration, and conflict resolution.",
                "Practise trimming each answer down to 2-3 minutes while keeping the signal clear."
            ]
        },
        {
            day: 5,
            focus: "Interview simulation and review",
            tasks: [
                "Run a timed mock interview and review weak areas in your communication flow.",
                "Refine your answer structure so that every response feels confident, specific, and aligned with the role."
            ]
        }
    ]

    return {
        matchScore,
        technicalQuestions,
        behavioralQuestions,
        skillGaps,
        preparationPlan,
        title: titleFromJobDescription(jobDescription)
    }
}

function parseJsonResponse(rawText) {
    const responseText = normalizeText(rawText)
    const start = responseText.indexOf("{")
    const end = responseText.lastIndexOf("}")

    if (start === -1 || end === -1) {
        throw new Error("AI response did not contain a JSON object.")
    }

    return JSON.parse(responseText.slice(start, end + 1))
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
`

    if (!ai) {
        return buildLocalInterviewReport({ resume, selfDescription, jobDescription })
    }

    try {
        const response = await ai.models.generateContent({
            model: AI_MODEL,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(interviewReportSchema),
            }
        })

        return parseJsonResponse(response.text)
    } catch (error) {
        console.warn("AI interview generation failed, using local fallback:", error.message)
        return buildLocalInterviewReport({ resume, selfDescription, jobDescription })
    }
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    })
    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

function buildFallbackResumeHtml({ resume, selfDescription, jobDescription }) {
    const profileSummary = normalizeText(`${resume || ""} ${selfDescription || ""}`)
    const title = titleFromJobDescription(jobDescription)

    return `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>${title}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #1f2937; padding: 24px; }
      .header { border-bottom: 2px solid #7c3aed; margin-bottom: 18px; padding-bottom: 12px; }
      .section { margin-top: 14px; }
      .tag { display: inline-block; background: #ede9fe; color: #6d28d9; padding: 4px 8px; border-radius: 999px; margin-right: 6px; margin-bottom: 6px; }
    </style>
  </head>
  <body>
    <div class="header">
      <h1 style="margin:0;">${title}</h1>
      <p style="margin:6px 0 0; color:#6b7280;">Tailored professional resume draft</p>
    </div>

    <div class="section">
      <h2>Profile Summary</h2>
      <p>${profileSummary.slice(0, 700) || "Experienced professional with strong technical execution and communication skills."}</p>
    </div>

    <div class="section">
      <h2>Role Alignment</h2>
      <div>
        ${extractKeywords(jobDescription).slice(0, 8).map((keyword) => `<span class="tag">${keyword}</span>`).join("")}
      </div>
    </div>

    <div class="section">
      <h2>Highlights</h2>
      <ul>
        <li>Delivered impact using modern engineering tools and collaboration practices.</li>
        <li>Communicated clearly across technical and non-technical stakeholders.</li>
        <li>Balanced ambiguity, speed, and quality while shipping business value.</li>
      </ul>
    </div>
  </body>
</html>`
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    if (!ai) {
        return generatePdfFromHtml(buildFallbackResumeHtml({ resume, selfDescription, jobDescription }))
    }

    try {
        const response = await ai.models.generateContent({
            model: AI_MODEL,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(resumePdfSchema),
            }
        })

        const jsonContent = parseJsonResponse(response.text)
        return generatePdfFromHtml(jsonContent.html)
    } catch (error) {
        console.warn("AI resume PDF generation failed, using local fallback:", error.message)
        return generatePdfFromHtml(buildFallbackResumeHtml({ resume, selfDescription, jobDescription }))
    }
}

module.exports = { generateInterviewReport, generateResumePdf }
