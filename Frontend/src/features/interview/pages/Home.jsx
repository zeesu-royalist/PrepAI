import React, { useState, useRef } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useAuth } from '../../auth/hooks/useAuth'
import { useNavigate } from 'react-router'
import { 
  Sparkles, 
  UploadCloud, 
  FileText, 
  File,
  X,
  History, 
  ArrowRight,
  LogOut,
  Brain,
  User,
  Briefcase,
  AlertCircle
} from 'lucide-react'

const Home = () => {
    const { loading, generateReport, reports } = useInterview()
    const { user, handleLogout } = useAuth()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [resumeFile, setResumeFile] = useState(null)
    const [dragActive, setDragActive] = useState(false)
    const resumeInputRef = useRef(null)

    const navigate = useNavigate()

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setResumeFile(e.target.files[0])
        }
    }

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setResumeFile(e.dataTransfer.files[0])
        }
    }

    const handleRemoveFile = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setResumeFile(null)
        if (resumeInputRef.current) {
            resumeInputRef.current.value = ""
        }
    }

    const handleGenerateReport = async () => {
        if (!jobDescription.trim()) {
            alert("Job description is required.")
            return
        }
        if (!resumeFile && !selfDescription.trim()) {
            alert("Please upload a resume or provide a self-description.")
            return
        }
        
        const data = await generateReport({ jobDescription, selfDescription, resumeFile })
        if (data && data._id) {
            navigate(`/interview/${data._id}`)
        }
    }

    const onLogout = async () => {
        await handleLogout()
        navigate('/')
    }

    // Loading overlay screen
    if (loading) {
        return (
            <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center relative font-sans text-zinc-50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-dots opacity-20 pointer-events-none" />
                <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
                
                <div className="relative z-10 flex flex-col items-center max-w-md px-6 text-center space-y-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-xl shadow-violet-500/30 animate-bounce">
                        <Brain className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-extrabold tracking-tight">Analyzing Strategy...</h1>
                        <p className="text-zinc-400 text-sm animate-pulse">Our AI is parsing your profile against target competencies. This takes about 30s.</p>
                    </div>
                    <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full animate-infinite-loading w-[60%]" style={{
                            animation: 'loading-bar 1.5s infinite linear',
                            transformOrigin: 'left'
                        }} />
                    </div>
                    
                    <style>{`
                        @keyframes loading-bar {
                            0% { transform: translateX(-100%); }
                            100% { transform: translateX(200%); }
                        }
                    `}</style>
                </div>
            </main>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col font-sans">
            {/* Header */}
            <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md">
                            <Brain className="h-4.5 w-4.5 text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-white">PrepAI</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 bg-zinc-900 border border-zinc-850 px-3 py-1.5 rounded-lg text-xs text-zinc-300">
                            <User className="h-3.5 w-3.5 text-violet-400" />
                            <span className="font-medium text-zinc-200">{user?.username || 'Candidate'}</span>
                        </div>
                        <button
                            onClick={onLogout}
                            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white transition-all shadow-sm cursor-pointer"
                        >
                            <LogOut className="h-3.5 w-3.5" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 relative">
                {/* Background decorative glows */}
                <div className="absolute top-[10%] left-[20%] w-[350px] h-[350px] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />

                {/* Hero / Header info */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        Build your custom <span className="text-gradient">Interview Strategy</span>
                    </h1>
                    <p className="text-zinc-400 text-sm sm:text-base max-w-2xl">
                        Paste the target job description and upload your profile. Our AI will automatically construct a customized timeline, technical Q&amp;A, and matching assessment.
                    </p>
                </div>

                {/* Main Card Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left - Job Description Panel */}
                    <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-zinc-850 space-y-4">
                        <div className="flex items-center gap-2 border-b border-zinc-800/60 pb-3">
                            <div className="p-1.5 rounded bg-violet-500/10 border border-violet-500/20 text-violet-400">
                                <Briefcase className="h-4.5 w-4.5" />
                            </div>
                            <h2 className="text-base font-bold text-white">Target Job Description</h2>
                            <span className="ml-auto text-[10px] font-bold uppercase tracking-wider bg-violet-500/10 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded">Required</span>
                        </div>

                        <div className="space-y-1">
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the target job description here (responsibilities, technology stack, requirements)..."
                                className="w-full h-80 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 text-sm text-zinc-200 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 placeholder:text-zinc-600 resize-none"
                                maxLength={5000}
                            />
                            <div className="flex justify-between items-center text-xs text-zinc-500">
                                <span>Paste details to trigger analysis</span>
                                <span>{jobDescription.length} / 5000 chars</span>
                            </div>
                        </div>
                    </div>

                    {/* Right - Profile Panel */}
                    <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-zinc-850 space-y-6">
                        <div className="flex items-center gap-2 border-b border-zinc-800/60 pb-3">
                            <div className="p-1.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                                <FileText className="h-4.5 w-4.5" />
                            </div>
                            <h2 className="text-base font-bold text-white">Your Profile</h2>
                        </div>

                        {/* Resume File Upload Box */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Upload Resume</label>
                            
                            <div 
                                onDragEnter={handleDrag}
                                onDragOver={handleDrag}
                                onDragLeave={handleDrag}
                                onDrop={handleDrop}
                                className={`relative rounded-xl border-2 border-dashed p-6 transition-all flex flex-col items-center justify-center text-center group cursor-pointer ${
                                    dragActive ? 'border-violet-500 bg-violet-500/5' : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/10'
                                }`}
                                onClick={() => resumeInputRef.current?.click()}
                            >
                                <input 
                                    ref={resumeInputRef}
                                    type="file"
                                    accept=".pdf,.docx"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                
                                {resumeFile ? (
                                    <div className="space-y-3 w-full">
                                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                                            <File className="h-5 w-5" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-white truncate max-w-[240px] mx-auto">{resumeFile.name}</p>
                                            <p className="text-[11px] text-zinc-500">{(resumeFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                        </div>
                                        <button
                                            onClick={handleRemoveFile}
                                            className="inline-flex items-center gap-1 rounded bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 text-xs text-zinc-300 transition-colors"
                                        >
                                            <X className="h-3 w-3" />
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <UploadCloud className="h-8 w-8 text-zinc-500 group-hover:text-violet-400 mb-3 transition-colors" />
                                        <p className="text-sm font-medium text-zinc-200">Click to upload or drag &amp; drop</p>
                                        <p className="text-xs text-zinc-500 mt-1">PDF or DOCX (Max 5MB)</p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* OR separator */}
                        <div className="relative flex items-center justify-center py-2">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800" /></div>
                            <span className="relative z-10 px-3 bg-zinc-950/80 text-xs font-bold text-zinc-500 uppercase tracking-widest">Or write description</span>
                        </div>

                        {/* Self Description Textarea */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider" htmlFor="self-desc">Quick Self-Description</label>
                            <textarea
                                id="self-desc"
                                value={selfDescription}
                                onChange={(e) => setSelfDescription(e.target.value)}
                                placeholder="Describe your background, core technical skills, and years of experience..."
                                className="w-full h-28 rounded-xl border border-zinc-800 bg-zinc-900/30 p-3 text-sm text-zinc-200 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 placeholder:text-zinc-600 resize-none"
                            />
                        </div>

                        {/* Info Note */}
                        <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-850 flex gap-2.5 text-xs text-zinc-400 leading-relaxed">
                            <AlertCircle className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
                            <p>Either a uploaded <strong>Resume</strong> or a filled <strong>Self-Description</strong> is required to customize the assessment.</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Generator CTA Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl border border-zinc-850 glass-panel">
                    <span className="text-xs text-zinc-400">AI-Powered Strategy Assessment &bull; By Zeesu Royalist</span>
                    <button
                        onClick={handleGenerateReport}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 px-6 py-3 text-sm font-semibold transition-all shadow-md group scale-100 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                        <Sparkles className="h-4 w-4 text-violet-600 group-hover:scale-110 transition-transform" />
                        Generate Strategy Plan
                    </button>
                </div>

                {/* History Section */}
                {reports && reports.length > 0 && (
                    <section className="space-y-4 pt-4">
                        <div className="flex items-center gap-2 border-b border-zinc-800/60 pb-3">
                            <History className="h-5 w-5 text-zinc-400" />
                            <h2 className="text-lg font-bold text-white">Your Prepped Roadmaps</h2>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 ml-1.5">{reports.length} total</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {reports.map((report) => {
                                const scoreColor = 
                                    report.matchScore >= 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                    report.matchScore >= 60 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                    'bg-rose-500/10 text-rose-400 border-rose-500/20'

                                return (
                                    <div 
                                        key={report._id} 
                                        onClick={() => navigate(`/interview/${report._id}`)}
                                        className="group glass-panel rounded-xl p-5 border border-zinc-850 hover:border-zinc-800/80 hover:bg-zinc-900/40 transition-all flex justify-between items-center cursor-pointer shadow-sm hover:shadow-md"
                                    >
                                        <div className="space-y-1.5 pr-4 flex-1">
                                            <h3 className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors line-clamp-1">{report.title || 'Untitled Role'}</h3>
                                            <p className="text-[11px] text-zinc-500">Created: {new Date(report.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className={`text-xs font-bold px-2.5 py-1 rounded-full border ${scoreColor}`}>
                                                {report.matchScore}% Match
                                            </div>
                                            <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-white transition-all transform group-hover:translate-x-0.5" />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                )}
            </main>
        </div>
    )
}

export default Home