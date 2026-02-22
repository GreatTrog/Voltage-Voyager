
import React, { useState } from 'react';
import { AppView, Question } from './types';
import CircuitSimulator from './components/CircuitSimulator';
import { askProfessorSpark } from './services/geminiService';
import {
  Zap,
  Lightbulb,
  Gamepad2,
  GraduationCap,
  ArrowRight,
  MessageCircle,
  BrainCircuit,
  Waves,
  Sparkles,
  ChevronLeft,
  CheckCircle2,
  XCircle
} from 'lucide-react';

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What is voltage often compared to in a circuit?",
    options: ["The color of the wire", "The 'push' that moves electrons", "The weight of the bulb", "The length of the battery"],
    correctAnswer: 1,
    explanation: "Voltage is like a pump that pushes electrons through the wires!"
  },
  {
    id: 2,
    text: "What happens if we add MORE batteries to a circuit?",
    options: ["The light gets dimmer", "The wires change color", "The 'push' (voltage) increases", "Nothing happens"],
    correctAnswer: 2,
    explanation: "More batteries mean more voltage, which means a stronger push!"
  },
  {
    id: 3,
    text: "If voltage is like water pressure, what are the electrons like?",
    options: ["The water flowing through the pipe", "The metal pipe itself", "A bucket to catch water", "The sound of water"],
    correctAnswer: 0,
    explanation: "Electrons are the things being pushed, just like water in a pipe."
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.WELCOME);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAskSpark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    setAiLoading(true);
    setAiResponse("");
    const result = await askProfessorSpark(userQuery);
    setAiResponse(result);
    setAiLoading(false);
  };

  const resetQuiz = () => {
    setQuizScore(0);
    setCurrentQuestion(0);
    setShowResult(false);
  };

  const handleAnswer = (index: number) => {
    if (index === QUIZ_QUESTIONS[currentQuestion].correctAnswer) {
      setQuizScore(prev => prev + 1);
    }

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-blue-100 px-6 py-4 flex justify-between items-center">
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setView(AppView.WELCOME)}
        >
          <div className="bg-yellow-400 p-2 rounded-xl group-hover:rotate-12 transition-transform">
            <Zap size={24} className="text-white fill-white" />
          </div>
          <h1 className="text-2xl font-black text-blue-600 tracking-tight">VOLTAGE VOYAGER</h1>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => setView(AppView.LEARN)}
            className={`flex items-center gap-2 font-bold transition-colors ${view === AppView.LEARN ? 'text-blue-600' : 'text-slate-500 hover:text-blue-400'}`}
          >
            <Lightbulb size={20} /> Learn
          </button>
          <button
            onClick={() => setView(AppView.EXPERIMENT)}
            className={`flex items-center gap-2 font-bold transition-colors ${view === AppView.EXPERIMENT ? 'text-blue-600' : 'text-slate-500 hover:text-blue-400'}`}
          >
            <Gamepad2 size={20} /> Experiment
          </button>
          <button
            onClick={() => setView(AppView.QUIZ)}
            className={`flex items-center gap-2 font-bold transition-colors ${view === AppView.QUIZ ? 'text-blue-600' : 'text-slate-500 hover:text-blue-400'}`}
          >
            <GraduationCap size={20} /> Quiz
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 pt-12">

        {view === AppView.WELCOME && (
          <div className="flex flex-col md:flex-row items-center gap-12 animate-in fade-in duration-700">
            <div className="flex-1 space-y-6">
              <span className="bg-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest">
                Science Adventure
              </span>
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight">
                What makes electricity <span className="text-blue-600 underline decoration-yellow-400 decoration-8 underline-offset-8">GO?</span>
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                Ever wondered how a battery makes a lightbulb shine? It's all about the <strong>PUSH!</strong> Join Professor Spark to discover the magic of Voltage.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => setView(AppView.LEARN)}
                  className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 flex items-center gap-2"
                >
                  Start Learning <ArrowRight size={20} />
                </button>
                <button
                  onClick={() => setView(AppView.EXPERIMENT)}
                  className="px-8 py-4 bg-yellow-400 text-yellow-900 rounded-2xl font-bold text-lg hover:bg-yellow-500 transition-all shadow-lg hover:shadow-yellow-100 flex items-center gap-2"
                >
                  Go to Lab <Gamepad2 size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="w-full aspect-square bg-blue-100 rounded-[3rem] rotate-3 absolute top-0 left-0 -z-10"></div>
              <img
                src="https://picsum.photos/seed/electricity/600/600"
                alt="Electric Spark Illustration"
                className="rounded-[3rem] shadow-2xl relative z-10 border-8 border-white"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-xl z-20 max-w-xs border-2 border-blue-100 animate-bounce">
                <p className="text-blue-800 font-bold text-lg">"Voltage is just the PUSH that moves electrons!"</p>
                <p className="text-slate-400 text-sm mt-1">- Professor Spark</p>
              </div>
            </div>
          </div>
        )}

        {view === AppView.LEARN && (
          <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-500">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black text-slate-900">Let's Understand Voltage</h2>
              <p className="text-lg text-slate-600">Science is better with metaphors! Choose a way to learn:</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Metaphor 1 */}
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-4 border-blue-50 hover:border-blue-200 transition-all group">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                  <Waves size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">The Water Pipe</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Imagine electricity is like water in a pipe.
                  <strong> Voltage</strong> is like the <strong>Water Pressure</strong> or a pump.
                  The more pressure (Voltage), the faster the water (Electricity) flows!
                </p>
                <ul className="space-y-2 text-sm font-semibold text-slate-500">
                  <li className="flex items-center gap-2"><CheckCircle2 className="text-blue-400" size={16} /> Pump = Battery</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="text-blue-400" size={16} /> Pressure = Voltage</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="text-blue-400" size={16} /> Flowing Water = Current</li>
                </ul>
              </div>

              {/* Metaphor 2 */}
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-4 border-yellow-50 hover:border-yellow-200 transition-all group">
                <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center text-yellow-600 mb-6 group-hover:scale-110 transition-transform">
                  <BrainCircuit size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">The Crowd Push</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Imagine a group of people (Electrons) standing still.
                  A <strong>Voltage</strong> source is like a friendly giant <strong>pushing</strong> them from behind.
                  A bigger push makes the crowd move faster!
                </p>
                <ul className="space-y-2 text-sm font-semibold text-slate-500">
                  <li className="flex items-center gap-2"><CheckCircle2 className="text-yellow-400" size={16} /> Giant = Battery</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="text-yellow-400" size={16} /> Strength of Push = Voltage</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="text-yellow-400" size={16} /> Crowd Movement = Current</li>
                </ul>
              </div>
            </div>

            {/* AI Assistant Section */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <Sparkles className="absolute top-10 right-10 text-white/10" size={120} />
              <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-3xl flex items-center justify-center border border-white/30">
                  <MessageCircle size={40} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-black">Ask Professor Spark!</h3>
                  <p className="text-blue-100 text-lg">Still confused? Ask me anything about voltage or electricity!</p>
                </div>

                <form onSubmit={handleAskSpark} className="w-full flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    placeholder="E.g., Why do we need batteries?"
                    className="flex-1 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  <button
                    type="submit"
                    disabled={aiLoading}
                    className="px-8 py-4 bg-yellow-400 text-yellow-900 rounded-2xl font-bold hover:bg-yellow-300 transition-all disabled:opacity-50"
                  >
                    {aiLoading ? "Thinking..." : "Ask Away!"}
                  </button>
                </form>

                {aiResponse && (
                  <div className="w-full p-6 bg-white rounded-3xl text-slate-800 text-left border-t-8 border-yellow-400 animate-in zoom-in-95 duration-300">
                    <p className="text-lg leading-relaxed">{aiResponse}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center pt-8">
              <button
                onClick={() => setView(AppView.EXPERIMENT)}
                className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-bold text-xl hover:bg-slate-800 transition-all flex items-center gap-3 mx-auto"
              >
                Now, Let's Try it! <Gamepad2 size={24} />
              </button>
            </div>
          </div>
        )}

        {view === AppView.EXPERIMENT && (
          <div className="space-y-12 animate-in slide-in-from-right-12 duration-500">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-slate-900">Voltage Lab</h2>
                <p className="text-lg text-slate-600">Experiment with batteries to see the 'push' in action!</p>
              </div>
              <button
                onClick={() => setView(AppView.LEARN)}
                className="flex items-center gap-2 text-blue-600 font-bold hover:underline"
              >
                <ChevronLeft size={20} /> Back to Learning
              </button>
            </div>

            <CircuitSimulator />

            <div className="bg-yellow-50 p-8 rounded-[2.5rem] border-4 border-yellow-100 flex flex-col md:flex-row gap-8 items-center">
              <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-yellow-200">
                <BrainCircuit size={48} />
              </div>
              <div className="space-y-4">
                <h4 className="text-2xl font-black text-yellow-900">What to Look For:</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <li className="flex items-start gap-3 bg-white p-4 rounded-2xl shadow-sm">
                    <span className="w-6 h-6 bg-yellow-100 rounded text-yellow-600 flex items-center justify-center font-bold text-sm shrink-0">1</span>
                    <p className="text-sm text-slate-700">Watch the <strong>yellow dots</strong>. Do they move faster when you add more batteries?</p>
                  </li>
                  <li className="flex items-start gap-3 bg-white p-4 rounded-2xl shadow-sm">
                    <span className="w-6 h-6 bg-yellow-100 rounded text-yellow-600 flex items-center justify-center font-bold text-sm shrink-0">2</span>
                    <p className="text-sm text-slate-700">Look at the <strong>lightbulb</strong>. Is it brighter with 4 batteries than with 1?</p>
                  </li>
                  <li className="flex items-start gap-3 bg-white p-4 rounded-2xl shadow-sm">
                    <span className="w-6 h-6 bg-yellow-100 rounded text-yellow-600 flex items-center justify-center font-bold text-sm shrink-0">3</span>
                    <p className="text-sm text-slate-700">Voltage is measured in <strong>Volts (V)</strong>. Notice how it increases!</p>
                  </li>
                  <li className="flex items-start gap-3 bg-white p-4 rounded-2xl shadow-sm">
                    <span className="w-6 h-6 bg-yellow-100 rounded text-yellow-600 flex items-center justify-center font-bold text-sm shrink-0">4</span>
                    <p className="text-sm text-slate-700">Try opening the <strong>switch</strong>. What happens to the flow?</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {view === AppView.QUIZ && (
          <div className="max-w-3xl mx-auto animate-in zoom-in-95 duration-500">
            {!showResult ? (
              <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border-4 border-blue-50">
                <div className="bg-blue-600 p-8 text-white flex justify-between items-center">
                  <h3 className="text-2xl font-black">Voltage Master Quiz</h3>
                  <div className="bg-white/20 px-4 py-2 rounded-full text-sm font-bold backdrop-blur">
                    Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
                  </div>
                </div>

                <div className="p-10 space-y-8">
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all duration-500"
                      style={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                    ></div>
                  </div>

                  <h4 className="text-3xl font-bold text-slate-900 leading-tight">
                    {QUIZ_QUESTIONS[currentQuestion].text}
                  </h4>

                  <div className="grid grid-cols-1 gap-4">
                    {QUIZ_QUESTIONS[currentQuestion].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        className="p-6 text-left rounded-2xl border-2 border-slate-100 bg-slate-50 hover:border-blue-300 hover:bg-blue-50 transition-all font-bold text-lg text-slate-700 flex justify-between items-center group"
                      >
                        {option}
                        <div className="w-8 h-8 rounded-full border-2 border-slate-200 group-hover:border-blue-400 flex items-center justify-center">
                          <span className="text-xs text-slate-400 group-hover:text-blue-400 uppercase">{String.fromCharCode(65 + idx)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-[3rem] shadow-2xl p-12 text-center space-y-8 animate-in bounce-in">
                <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mx-auto shadow-inner">
                  <GraduationCap size={64} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-4xl font-black text-slate-900">You Finished!</h3>
                  <p className="text-2xl font-bold text-blue-600">You scored {quizScore} out of {QUIZ_QUESTIONS.length}!</p>
                  <p className="text-slate-600 text-lg">
                    {quizScore === QUIZ_QUESTIONS.length
                      ? "Incredible! You are a true Voltage Voyager!"
                      : "Great effort! Science takes practice. Try again?"}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={resetQuiz}
                    className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => setView(AppView.WELCOME)}
                    className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Back to Start
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Footer Branding */}
      <footer className="mt-20 text-center text-slate-400 font-medium">
        <p>© 2026 Voltage Voyager • Designed for KS2 Scientists</p>
      </footer>
    </div>
  );
};

export default App;
