const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

async function extractResumeText(file) {
    if (!file?.buffer?.length) {
        return ""
    }

    const fileBuffer = Buffer.from(file.buffer)
    const originalName = String(file.originalname || "").toLowerCase()
    const mimeType = String(file.mimetype || "")

    try {
        if (mimeType.includes("pdf") || originalName.endsWith(".pdf")) {
            const parsedPdf = await pdfParse(fileBuffer)
            return parsedPdf.text?.trim() || ""
        }

        if (mimeType.includes("word") || originalName.endsWith(".docx")) {
            try {
                const mammoth = require("mammoth")
                const mammothResult = await mammoth.extractRawText({ buffer: fileBuffer })
                return mammothResult.value?.trim() || ""
            } catch {
                return fileBuffer.toString("utf8").replace(/\u0000/g, "").trim()
            }
        }

        return fileBuffer.toString("utf8").replace(/\u0000/g, "").trim()
    } catch (error) {
        console.warn("Resume extraction failed:", error.message)
        return ""
    }
}

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    const { selfDescription, jobDescription } = req.body
    const safeSelfDescription = String(selfDescription || "").trim()
    const safeJobDescription = String(jobDescription || "").trim()

    if (!safeJobDescription) {
        return res.status(400).json({
            message: "Please provide a job description."
        })
    }

    if (!req.file && !safeSelfDescription) {
        return res.status(400).json({
            message: "Please upload a resume or provide a self-description."
        })
    }

    const resumeContent = await extractResumeText(req.file)

    const interViewReportByAi = await generateInterviewReport({
        resume: resumeContent,
        selfDescription: safeSelfDescription,
        jobDescription: safeJobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent,
        selfDescription: safeSelfDescription,
        jobDescription: safeJobDescription,
        ...interViewReportByAi
    })

    res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport
    })

}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }