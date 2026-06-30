import React, { useState, useEffect } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams, Link } from 'react-router'
import { 
  Code2, 
  MessageSquare, 
  Calendar, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  Brain, 
  ArrowLeft, 
  Check, 
  Copy,
  AlertTriangle,
  Award,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Loader2
} from 'lucide-react'

// ── Sub-components ────────────────────────────────────────────────────────────

const CopyButton = ({ text }) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = async (e) => {
        e.stopPropagation()
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Copy answer"
        >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
    )
}

const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className="glass-panel rounded-xl overflow-hidden border border-zinc-850 hover:border-zinc-800 transition-all shadow-sm">
            <div 
                className="px-5 py-4 flex items-center justify-between cursor-pointer select-none bg-zinc-900/10 hover:bg-zinc-900/30 gap-4"
                onClick={() => setOpen(o => !o)}
            >
                <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 border border-violet-500/20 text-xs font-bold text-violet-400">
                        Q{index + 1}
                    </span>
                    <p className="text-sm font-semibold text-zinc-100 leading-snug">{item.question}</p>
                </div>
                <div className="text-zinc-500 hover:text-white shrink-0 transition-colors">
                    {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
            </div>
            
            {open && (
                <div className="p-5 border-t border-zinc-850/80 bg-zinc-950/20 space-y-4 text-sm">
                    <div className="space-y-1.5">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-violet-400">
                            Intention
                        </span>
                        <p className="text-zinc-300 text-xs leading-relaxed bg-violet-950/10 border border-violet-900/20 p-3 rounded-lg">
                            {item.intention}
                        </p>
                    </div>
                    
                    <div className="space-y-1.5 relative">
                        <div className="flex justify-between items-center">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400">
                                Model Answer
                            </span>
                            <CopyButton text={item.answer} />
                        </div>
                        <p className="text-zinc-200 text-xs leading-relaxed bg-zinc-900/60 border border-zinc-850 p-4 rounded-lg whitespace-pre-line">
                            {item.answer}
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day, isLast }) => (
    <div className="relative flex gap-6 pb-8 last:pb-0">
        {/* Timeline connector track */}
        {!isLast && (
            <div className="absolute left-[19px] top-9 bottom-0 w-[2px] bg-gradient-to-b from-violet-500/30 to-indigo-500/10" />
        )}
        
        {/* Timeline Node Icon */}
        <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-900 border-2 border-violet-500 text-xs font-bold text-violet-400 shadow-md">
            D{day.day}
        </div>
        
        {/* Detail Panel */}
        <div className="flex-1 glass-panel rounded-xl p-5 border border-zinc-850 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="h-4 w-4 text-violet-400" />
                {day.focus}
            </h3>
            
            <ul className="space-y-2 text-xs text-zinc-300">
                {day.tasks.map((task, i) => (
                    <li key={i} className="flex gap-2 items-start">
                        <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{task}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
)

// ── Main Component ────────────────────────────────────────────────────────────

const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const [pdfLoading, setPdfLoading] = useState(false)
    const { report, getReportById, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [interviewId])

    const handleDownloadPdf = async () => {
        setPdfLoading(true)
        try {
            await getResumePdf(interviewId)
        } catch (err) {
            console.error(err)
        } finally {
            setPdfLoading(false)
        }
    }

    if (loading || !report) {
        return (
            <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center relative font-sans text-zinc-50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-dots opacity-20 pointer-events-none" />
                <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
                
                <div className="relative z-10 flex flex-col items-center max-w-md px-6 text-center space-y-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-xl shadow-violet-500/30 animate-bounce">
                        <Brain className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-xl font-bold tracking-tight">Loading preparation details...</h1>
                        <p className="text-zinc-400 text-xs">Assembling your target questions, feedback analysis, and roadmap...</p>
                    </div>
                </div>
            </main>
        )
    }

    const scoreColor =
        report.matchScore >= 80 ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5' :
        report.matchScore >= 60 ? 'text-amber-400 border-amber-500/30 bg-amber-500/5' : 
        'text-rose-400 border-rose-500/30 bg-rose-500/5'

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col font-sans">
            {/* Header */}
            <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                            title="Back to Dashboard"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </button>
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-sm">
                                <Brain className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-base font-bold text-white hidden sm:inline">PrepAI</span>
                        </div>
                        <div className="h-4 w-[1px] bg-zinc-800 mx-1 hidden sm:block" />
                        <span className="text-xs font-medium text-zinc-400 max-w-[180px] sm:max-w-[280px] truncate">
                            {report.title}
                        </span>
                    </div>

                    <button
                        onClick={handleDownloadPdf}
                        disabled={pdfLoading}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-white hover:bg-zinc-200 disabled:opacity-50 text-zinc-950 px-3.5 py-1.5 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                    >
                        {pdfLoading ? (
                            <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-800" />
                                Exporting...
                            </>
                        ) : (
                            <>
                                <Download className="h-3.5 w-3.5 text-zinc-800" />
                                Export Custom Resume
                            </>
                        )}
                    </button>
                </div>
            </header>

            {/* Layout Grid */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Panel - Tabs Navigation */}
                    <div className="lg:col-span-3 space-y-4">
                        <div className="glass-panel rounded-xl p-3 border border-zinc-850 space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-3.5 pb-2">Sections</p>
                            
                            <button
                                onClick={() => setActiveNav('technical')}
                                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                                    activeNav === 'technical' 
                                    ? 'bg-violet-500/10 text-violet-300 border border-violet-500/20 shadow-sm' 
                                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-905/30 border border-transparent'
                                }`}
                            >
                                <Code2 className="h-4 w-4 shrink-0" />
                                <span>Technical Questions</span>
                                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
                                    {report.technicalQuestions.length}
                                </span>
                            </button>

                            <button
                                onClick={() => setActiveNav('behavioral')}
                                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                                    activeNav === 'behavioral' 
                                    ? 'bg-violet-500/10 text-violet-300 border border-violet-500/20 shadow-sm' 
                                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-905/30 border border-transparent'
                                }`}
                            >
                                <MessageSquare className="h-4 w-4 shrink-0" />
                                <span>Behavioral Questions</span>
                                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
                                    {report.behavioralQuestions.length}
                                </span>
                            </button>

                            <button
                                onClick={() => setActiveNav('roadmap')}
                                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                                    activeNav === 'roadmap' 
                                    ? 'bg-violet-500/10 text-violet-300 border border-violet-500/20 shadow-sm' 
                                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-905/30 border border-transparent'
                                }`}
                            >
                                <Calendar className="h-4 w-4 shrink-0" />
                                <span>Preparation Roadmap</span>
                                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
                                    {report.preparationPlan.length}d
                                </span>
                            </button>
                        </div>

                        {/* Quick Tips panel */}
                        <div className="glass-panel rounded-xl p-4 border border-zinc-850 text-xs text-zinc-400 space-y-2.5">
                            <div className="flex items-center gap-1.5 text-zinc-300 font-bold">
                                <Sparkles className="h-4 w-4 text-violet-400" />
                                <span>Preparation Tip</span>
                            </div>
                            <p className="leading-relaxed">
                                Review the "Intention" section on each card. Understanding *why* an interviewer asks a question allows you to pivot your answers dynamically on the spot.
                            </p>
                        </div>
                    </div>

                    {/* Center Panel - Dynamic Content View */}
                    <div className="lg:col-span-6 space-y-5">
                        
                        {activeNav === 'technical' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-zinc-850 pb-2.5">
                                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                                        <Code2 className="h-4 w-4 text-violet-400" />
                                        Technical Analysis
                                    </h2>
                                    <span className="text-[11px] font-medium text-zinc-400">
                                        {report.technicalQuestions.length} Questions Map
                                    </span>
                                </div>
                                
                                <div className="space-y-3">
                                    {report.technicalQuestions.map((q, i) => (
                                        <QuestionCard key={i} item={q} index={i} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeNav === 'behavioral' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-zinc-850 pb-2.5">
                                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4 text-violet-400" />
                                        Behavioral Alignment
                                    </h2>
                                    <span className="text-[11px] font-medium text-zinc-400">
                                        {report.behavioralQuestions.length} Questions Map
                                    </span>
                                </div>
                                
                                <div className="space-y-3">
                                    {report.behavioralQuestions.map((q, i) => (
                                        <QuestionCard key={i} item={q} index={i} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeNav === 'roadmap' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b border-zinc-850 pb-2.5">
                                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-violet-400" />
                                        Strategic Roadmap
                                    </h2>
                                    <span className="text-[11px] font-medium text-zinc-400">
                                        {report.preparationPlan.length} Day Study Plan
                                    </span>
                                </div>
                                
                                <div className="relative pl-1">
                                    {report.preparationPlan.map((day, i) => (
                                        <RoadMapDay 
                                            key={day.day} 
                                            day={day} 
                                            isLast={i === report.preparationPlan.length - 1} 
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Right Panel - Profile Score & Skill gaps */}
                    <div className="lg:col-span-3 space-y-6">
                        
                        {/* Match Score Card */}
                        <div className="glass-panel rounded-xl p-5 border border-zinc-850 flex flex-col items-center text-center space-y-4">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Target Match Score</div>
                            
                            <div className={`relative flex items-center justify-center rounded-full border-2 p-1.5 ${scoreColor}`}>
                                <div className="w-24 h-24 rounded-full bg-zinc-950/60 border border-zinc-800/80 flex flex-col items-center justify-center shadow-inner">
                                    <span className="text-3xl font-extrabold text-white">{report.matchScore}</span>
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">% match</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs font-bold text-zinc-200">
                                    {report.matchScore >= 80 ? 'Highly Qualified' : report.matchScore >= 60 ? 'Competent Fit' : 'Skills Alignment Required'}
                                </p>
                                <p className="text-[10px] text-zinc-400 max-w-[200px] leading-relaxed mx-auto">
                                    AI matching score aligns your profile against core job requirements.
                                </p>
                            </div>
                        </div>

                        {/* Skill Gaps Card */}
                        <div className="glass-panel rounded-xl p-5 border border-zinc-850 space-y-3">
                            <div className="flex items-center gap-1.5 border-b border-zinc-800/60 pb-2">
                                <AlertTriangle className="h-4 w-4 text-violet-400 shrink-0" />
                                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Identified Skill Gaps</h3>
                            </div>
                            
                            {report.skillGaps && report.skillGaps.length > 0 ? (
                                <div className="flex flex-wrap gap-2 pt-1.5">
                                    {report.skillGaps.map((gap, i) => {
                                        const severityStyles = 
                                            gap.severity === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                            gap.severity === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                            'bg-sky-500/10 text-sky-400 border-sky-500/20'

                                        return (
                                            <span 
                                                key={i} 
                                                className={`text-[10px] font-semibold border px-2 py-0.5 rounded-full capitalize ${severityStyles}`}
                                            >
                                                {gap.skill}
                                            </span>
                                        )
                                    })}
                                </div>
                            ) : (
                                <p className="text-[10px] text-zinc-500 italic py-2">No notable skill gaps identified. You match well!</p>
                            )}
                        </div>
                        
                    </div>

                </div>
            </main>
        </div>
    )
}

export default Interview