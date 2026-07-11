import React from 'react'
import { useState } from "react";
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import {
  ArrowRight,
  Sparkles,
  Brain,
  FileText,
  CheckCircle2,
  Award,
  TrendingUp,
  Briefcase,
  ArrowUpRight,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react'

const Landing = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-50 overflow-hidden font-sans">
      {/* Background Glow Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-radial opacity-100 pointer-events-none z-0" />
      <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] rounded-full bg-indigo-600/10 blur-[130px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-gradient-dots opacity-40 pointer-events-none z-0" />

      <header className="fixed top-4 left-1/2 z-50 w-[96%] max-w-7xl -translate-x-1/2 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.08] shadow-[0_4px_15px_rgba(0,0,0,0.20)] backdrop-blur-3xl before:absolute before:inset-0 before:pointer-events-none before:bg-gradient-to-b before:from-white/10 before:to-transparent">
        <div className="relative z-10 flex h-16 items-center justify-between px-4 sm:px-6">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="leading-none">
              <h1 className="bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-lg sm:text-xl font-extrabold tracking-tight text-transparent">
                PrepAI
              </h1>

              <p className="mt-1 hidden text-[10px] uppercase tracking-[0.15em] text-zinc-400 sm:block">
                AI Interview Coach
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center lg:flex">
            {[
              ["Features", "#features"],
              ["How it Works", "#how-it-works"],
              ["Success Rates", "#stats"],
            ].map(([title, href]) => (
              <a
                key={title}
                href={href}
                className="rounded-full px-4 py-2 text-sm font-medium text-zinc-300 transition-all duration-300 hover:bg-white/10 hover:text-white"
              >
                {title}
              </a>
            ))}
          </nav>

          {/* Desktop Right */}
          <div className="hidden items-center gap-4 lg:flex">
            {user ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="group inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-2 text-sm font-semibold text-zinc-200 shadow-lg shadow-black/10 transition-all duration-300 hover:border-zinc-500 hover:bg-zinc-800 hover:text-white"
              >
                Go to Dashboard

                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-zinc-300 transition-colors hover:text-white"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:border-white/30 hover:bg-white/20"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-white transition hover:bg-white/10 lg:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`overflow-hidden transition-all duration-300 lg:hidden ${mobileMenuOpen
            ? "max-h-[500px] border-t border-white/10"
            : "max-h-0"
            }`}
        >
          <div className="space-y-2 px-4 py-4">

            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-4 py-3 text-zinc-300 hover:bg-white/10 hover:text-white"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-4 py-3 text-zinc-300 hover:bg-white/10 hover:text-white"
            >
              How it Works
            </a>

            <a
              href="#stats"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-4 py-3 text-zinc-300 hover:bg-white/10 hover:text-white"
            >
              Success Rates
            </a>

            <div className="pt-3">
              {user ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/dashboard");
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 font-semibold text-zinc-200 transition hover:bg-zinc-800"
                >
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-4 py-3 text-center text-zinc-300 hover:bg-white/10 hover:text-white"
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-center font-semibold text-white backdrop-blur-xl hover:bg-white/20"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-32 md:pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 mt-10 md:mt-4 lg:mt-0 text-xs font-medium mb-6 shadow-inner animate-pulse">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Next-Gen AI Interview Preparation</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-none mb-6">
          Master Your Next Interview with <span className="text-gradient">AI Precision</span>
        </h1>

        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Instantly generate a tailored technical and behavioral roadmap, custom interview questions, and key profile matches by aligning your resume with any job description.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          {user ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-8 py-4 text-base font-semibold text-white hover:from-violet-600 hover:to-indigo-700 transition-all shadow-lg shadow-violet-500/25 group scale-100 hover:scale-[1.02] active:scale-[0.98]"
            >
              Access Dashboard
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </button>
          ) : (
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-8 py-4 text-base font-semibold text-white hover:from-violet-600 hover:to-indigo-700 transition-all shadow-lg shadow-violet-500/25 group scale-100 hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </button>
          )}

          <a
            href="#how-it-works"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 px-8 py-4 text-base font-semibold text-zinc-300 hover:bg-zinc-800/60 hover:text-white transition-colors"
          >
            How it works
          </a>
        </div>

        {/* Platform Preview Mockup */}
        {/* Inside Window Mockup */}
        <div className="flex h-full overflow-hidden rounded-2xl bg-zinc-950/40 text-left">

          {/* Sidebar */}
          <div className="hidden md:flex w-14 flex-col items-center gap-3 border-r border-zinc-800 py-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-8 w-8 rounded-lg ${i === 1 ? "bg-violet-500/40" : "bg-zinc-800"
                  }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 p-4 md:p-6 space-y-5">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="h-6 w-40 rounded bg-zinc-800" />
                <div className="mt-2 h-3 w-56 rounded bg-zinc-700/60" />
              </div>

              <div className="flex items-center gap-3">
                <div className="h-9 w-28 rounded-xl bg-zinc-800" />
                <div className="h-9 w-9 rounded-full bg-violet-500/30" />
              </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4"
                >
                  <div className="h-3 w-16 rounded bg-zinc-700" />
                  <div className="mt-3 h-6 w-10 rounded bg-violet-500/40" />
                  <div className="mt-3 h-2 w-full rounded bg-zinc-800" />
                </div>
              ))}
            </div>

            {/* Chart + Score */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

              {/* Chart */}
              <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                <div className="mb-4 h-3 w-28 rounded bg-zinc-700" />

                <div className="flex h-28 items-end gap-2">
                  {[45, 70, 35, 90, 60, 75].map((h) => (
                    <div
                      key={h}
                      style={{ height: `${h}%` }}
                      className="flex-1 rounded-t-lg bg-gradient-to-t from-violet-600/80 to-fuchsia-400/70"
                    />
                  ))}
                </div>
              </div>

              {/* Score */}
              <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-violet-500/40">
                  <span className="text-xl font-bold text-violet-400">87%</span>
                </div>

                <div className="mt-4 h-3 w-20 rounded bg-zinc-700" />
                <div className="mt-2 h-2 w-14 rounded bg-zinc-800" />
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 border-t border-zinc-900 bg-zinc-950/50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Everything you need to land the offer
            </h2>
            <p className="text-zinc-400 text-lg">
              Our advanced analysis pipelines dissect job descriptions and resumes to build structured, interactive, and high-yield interview tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-panel glass-panel-hover rounded-2xl p-6 transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-6">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Job Description Mapping</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Automatically isolates core competencies, technologies, and team roles from any text snippet or posting to target key expectations.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel glass-panel-hover rounded-2xl p-6 transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Match Score &amp; Skill Gaps</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Get an objective score showing how your profile stacks up. Easily isolate high, medium, and low severity skill gaps to fix before the call.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel glass-panel-hover rounded-2xl p-6 transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Technical &amp; Behavioral Q&amp;A</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Generate highly tailored questions with deep intent explanations (why they ask) and comprehensive model answers built directly from your profile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="relative z-10 py-24 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Get prepped in under 60 seconds
            </h2>
            <p className="text-zinc-400 text-lg">
              A simple, streamlined process designed to maximize output and respect your preparation timeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connector lines (desktop) */}
            <div className="hidden md:block absolute top-16 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-violet-500/30 via-indigo-500/30 to-transparent z-0" />

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-violet-400 shadow-lg shadow-violet-500/5">
                1
              </div>
              <h3 className="text-lg font-bold text-white">Paste Job Requirements</h3>
              <p className="text-zinc-400 text-sm max-w-xs leading-relaxed">
                Copy and paste the job description from LinkedIn, Indeed, or any career page.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-indigo-400 shadow-lg shadow-indigo-500/5">
                2
              </div>
              <h3 className="text-lg font-bold text-white">Upload Your Profile</h3>
              <p className="text-zinc-400 text-sm max-w-xs leading-relaxed">
                Drop your current resume (PDF) or write a quick self-description of your background.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-purple-400 shadow-lg shadow-purple-500/5">
                3
              </div>
              <h3 className="text-lg font-bold text-white">Receive Your Strategy</h3>
              <p className="text-zinc-400 text-sm max-w-xs leading-relaxed">
                Instantly unpack your match score, custom interactive questions, and day-by-day prep plan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="relative z-10 py-20 border-t border-zinc-900 bg-zinc-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel rounded-3xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-zinc-800/80">
            <div className="space-y-2 py-4 md:py-0">
              <div className="text-4xl md:text-5xl font-extrabold text-violet-400">85%</div>
              <div className="text-zinc-400 text-sm font-medium">Placement success rate</div>
            </div>
            <div className="space-y-2 py-4 md:py-0 md:pl-8">
              <div className="text-4xl md:text-5xl font-extrabold text-indigo-400">10k+</div>
              <div className="text-zinc-400 text-sm font-medium">Interview plans generated</div>
            </div>
            <div className="space-y-2 py-4 md:py-0 md:pl-8">
              <div className="text-4xl md:text-5xl font-extrabold text-purple-400">4.9 / 5</div>
              <div className="text-zinc-400 text-sm font-medium">User satisfaction rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="relative z-10 py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-zinc-800 bg-gradient-to-r from-violet-950/30 to-indigo-950/30 p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial opacity-30 pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4 relative z-10">
            Ready to stand out in your interviews?
          </h2>
          <p className="text-zinc-300 max-w-xl mx-auto mb-8 relative z-10">
            Join thousands of developers, product managers, and specialists preparing with AI accuracy.
          </p>
          <div className="relative z-10">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-zinc-950 hover:bg-zinc-200 transition-colors shadow-lg shadow-white/10"
              >
                Go to Dashboard
                <ArrowRight className="h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-zinc-950 hover:bg-zinc-200 transition-colors shadow-lg shadow-white/10"
              >
                Get Started for Free
                <ArrowRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-900 bg-zinc-950 py-12 text-zinc-500 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-zinc-800 text-zinc-400">
              <Brain className="h-3.5 w-3.5" />
            </div>
            <span className="font-semibold text-zinc-400">PrepAI</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Support</a>
          </div>
          <p>&copy; {new Date().getFullYear()} PrepAI. By Zeesu Royalist. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Landing
