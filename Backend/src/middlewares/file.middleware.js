const multer = require("multer")

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter(req, file, cb) {
        const allowedMimeTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ]
        const allowedExtensions = /\.(pdf|docx)$/i

        if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.test(file.originalname)) {
            cb(null, true)
            return
        }

        cb(new Error("Only PDF and DOCX files are supported."))
    }
})

module.exports = upload