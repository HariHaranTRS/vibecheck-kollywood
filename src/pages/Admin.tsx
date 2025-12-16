import React, { useState } from 'react';
import { GlassCard, NeonButton, InputField } from '../components/NeonComponents';
import { useStore } from '../store';
import { Question, QuestionType, MediaType, Quiz } from '../types';
import { saveQuiz } from '../services/db';
import { generateAIQuiz } from '../services/geminiService';https://accounts.google.com/v3/signin/accountchooser?access_type=offline&client_id=823511539352-ojaretejk1s95sdvkic0te923pt7knpu.apps.googleusercontent.com&login_hint=100281961605996592554&redirect_uri=storagerelay%3A%2F%2Fhttps%2Faistudio.google.com%3Fid%3Dauth12354&response_type=none+gsession&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.install&dsh=S-217779309%3A1765883318048438&o2v=1&service=lso&flowName=GeneralOAuthFlow&Email=trshariharan2701%40gmail.com&opparams=%253F&continue=https%3A%2F%2Faccounts.google.com%2Fsignin%2Foauth%2Fconsent%3Fauthuser%3Dunknown%26part%3DAJi8hAN0YJGEXL-7pqphP45hPaUUwVlKcBrmH_HbVBMUWM2fIcOtGLfN6j4DFhU5p6_I7QCXKbzVocRME_UnLKfc7nW2bWyVKG0WfGe3sA0m_dBtEkAUcrgm2vE7OBc2xZKQw-y_YV7XGBOMtN649VfZP-spwvG1bw1fY6llcMLkNzE8YQftE9Dl5Kn_qrprHGI78_1axK4285EOl45kB5wEbAMW4glMBWtJVMdQA3i7RHYPLk3DjMSpdvBFBk_NgFBELQT-cSr2EQe_nZvwosugiM5O3q1ngwS2iOfjbbVuDpI4Tt9lvj3GZi20-eWjivVXp7Ovyvb1jCJcoJl4bvb2Gm3H8VZ8-Uh4sOV0AcmLRkInA3aG_tgz38g6xKoXi2cSN2slKFslZQQ_Bygbhkj-dzouI9F-aADqflzGPcVgNdqNJyTWrsgRnwJ9szzvc8I7XvuPv8VAcwlU4MuDXuWj1UxLRZ1YKg%26flowName%3DGeneralOAuthFlow%26as%3DS-217779309%253A1765883318048438%26client_id%3D823511539352-ojaretejk1s95sdvkic0te923pt7knpu.apps.googleusercontent.com%26requeimport React, { useState } from 'react';
import { GlassCard, NeonButton, InputField } from '../components/NeonComponents';
import { useStore } from '../store';
import { Question, QuestionType, MediaType, Quiz } from '../types';
import { saveQuiz } from '../services/db';
import { generateAIQuiz } from '../services/geminiService';
import { Plus, Trash, Wand2, Save, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const [loadingAI, setLoadingAI] = useState(false);
  
  // New Quiz State
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  
  // Current Question Editing
  const [currentQText, setCurrentQText] = useState('');
  const [qType, setQType] = useState<QuestionType>(QuestionType.RADIO);
  const [optionsStr, setOptionsStr] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');

  if (!user?.isAdmin) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-3xl font-bold text-red-500">ACCESS DENIED</h1>
        <p>Restricted Area. Director Access Only.</p>
        <button onClick={() => navigate('/')} className="underline mt-4">Go Home</button>
      </div>
    );
  }

  const handleAddQuestion = () => {
    const newQ: Question = {
      id: `manual-${Date.now()}`,
      text: currentQText,
      mediaType: MediaType.NONE, // Simplification for demo
      questionType: qType,
      options: optionsStr.split(',').map(s => s.trim()),
      correctAnswer: correctAnswer,
      points: 10
    };
    setQuestions([...questions, newQ]);
    // Reset fields
    setCurrentQText('');
    setOptionsStr('');
    setCorrectAnswer('');
  };

  const handleGenerateAI = async () => {
    setLoadingAI(true);
    try {
      const aiQuestions = await generateAIQuiz("Tamil Cinema 2020-2024");
      setQuestions([...questions, ...aiQuestions]);
    } catch (e) {
      alert("AI Generation failed. Check API Key configuration.");
    } finally {
      setLoadingAI(false);
    }
  };

  const handlePublish = async () => {
    const newQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      date: new Date().toISOString().split('T')[0], // Set for today
      title: quizTitle || 'Daily Quiz',
      questions: questions,
      published: true
    };
    await saveQuiz(newQuiz);
    alert('Quiz Published Successfully!');
    navigate('/');
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pb-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold">DIRECTOR PANEL</h1>
        <div className="flex gap-2">
            <NeonButton variant="outline" onClick={() => navigate('/')}>Cancel</NeonButton>
            <NeonButton onClick={handlePublish} disabled={questions.length === 0}>
                <Save className="w-4 h-4" /> Publish Daily Quiz
            </NeonButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Creator Column */}
        <div className="space-y-6">
          <GlassCard>
            <h2 className="text-xl font-bold mb-4 text-kolly-cyan">Quiz Meta</h2>
            <InputField label="Quiz Title" value={quizTitle} onChange={(e: any) => setQuizTitle(e.target.value)} placeholder="e.g. 90s Rahman Hits" />
          </GlassCard>

          <GlassCard>
            <h2 className="text-xl font-bold mb-4 text-kolly-cyan">Add Question</h2>
            
            <InputField 
              label="Question Text" 
              value={currentQText} 
              onChange={(e: any) => setCurrentQText(e.target.value)} 
              placeholder="Enter question..." 
            />

            <div className="mb-4">
               <label className="block text-sm text-kolly-cyan font-bold mb-2">Question Type</label>
               <select 
                 className="w-full bg-black/40 border border-white/20 rounded p-2 text-white"
                 value={qType}
                 onChange={(e) => setQType(e.target.value as QuestionType)}
               >
                 <option value={QuestionType.RADIO}>Multiple Choice (Radio)</option>
                 <option value={QuestionType.TEXT}>Text Input</option>
               </select>
            </div>

            {qType === QuestionType.RADIO && (
                <InputField 
                    label="Options (comma separated)" 
                    value={optionsStr} 
                    onChange={(e: any) => setOptionsStr(e.target.value)} 
                    placeholder="Option A, Option B, Option C, Option D" 
                />
            )}

            <InputField 
              label="Correct Answer" 
              value={correctAnswer} 
              onChange={(e: any) => setCorrectAnswer(e.target.value)} 
              placeholder="Exact match string" 
            />

            <div className="mb-6 p-4 border border-dashed border-white/20 rounded flex flex-col items-center justify-center text-gray-500 hover:bg-white/5 transition cursor-pointer">
               <Upload className="w-6 h-6 mb-2" />
               <span className="text-xs">Drag & Drop Media (Image/MP3/MP4)</span>
               <span className="text-[10px] mt-1">(Disabled in Demo)</span>
            </div>

            <div className="flex gap-2">
               <NeonButton onClick={handleAddQuestion} className="flex-1">
                 <Plus className="w-4 h-4" /> Add to Queue
               </NeonButton>
               <NeonButton variant="secondary" onClick={handleGenerateAI} disabled={loadingAI}>
                 {loadingAI ? 'Thinking...' : <><Wand2 className="w-4 h-4" /> AI Generate</>}
               </NeonButton>
            </div>
          </GlassCard>
        </div>

        {/* Preview Column */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-400 uppercase tracking-widest">Question Queue ({questions.length})</h2>
          {questions.length === 0 && <div className="text-gray-600 italic">No questions added yet.</div>}
          
          {questions.map((q, idx) => (
            <GlassCard key={idx} className="relative group">
               <button 
                 onClick={() => setQuestions(questions.filter((_, i) => i !== idx))}
                 className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition"
               >
                 <Trash className="w-4 h-4" />
               </button>
               <div className="font-bold mb-2"><span className="text-kolly-violet">Q{idx+1}:</span> {q.text}</div>
               <div className="text-sm text-gray-400">Ans: {q.correctAnswer}</div>
               {q.options && <div className="text-xs text-gray-500 mt-2">{q.options.join(' | ')}</div>}
            </GlassCard>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Admin;
stPath%3D%252Fsignin%252Foauth%252Fconsent%23&app_domain=https%3A%2F%2Faistudio.google.com
import { Plus, Trash, Wand2, Save, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const [loadingAI, setLoadingAI] = useState(false);
  
  // New Quiz State
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  
  // Current Question Editing
  const [currentQText, setCurrentQText] = useState('');
  const [qType, setQType] = useState<QuestionType>(QuestionType.RADIO);
  const [optionsStr, setOptionsStr] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');

  if (!user?.isAdmin) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-3xl font-bold text-red-500">ACCESS DENIED</h1>
        <p>Restricted Area. Director Access Only.</p>
        <button onClick={() => navigate('/')} className="underline mt-4">Go Home</button>
      </div>
    );
  }

  const handleAddQuestion = () => {
    const newQ: Question = {
      id: `manual-${Date.now()}`,
      text: currentQText,
      mediaType: MediaType.NONE, // Simplification for demo
      questionType: qType,
      options: optionsStr.split(',').map(s => s.trim()),
      correctAnswer: correctAnswer,
      points: 10
    };
    setQuestions([...questions, newQ]);
    // Reset fields
    setCurrentQText('');
    setOptionsStr('');
    setCorrectAnswer('');
  };

  const handleGenerateAI = async () => {
    setLoadingAI(true);
    try {
      const aiQuestions = await generateAIQuiz("Tamil Cinema 2020-2024");
      setQuestions([...questions, ...aiQuestions]);
    } catch (e) {
      alert("AI Generation failed. Check API Key configuration.");
    } finally {
      setLoadingAI(false);
    }
  };

  const handlePublish = async () => {
    const newQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      date: new Date().toISOString().split('T')[0], // Set for today
      title: quizTitle || 'Daily Quiz',
      questions: questions,
      published: true
    };
    await saveQuiz(newQuiz);
    alert('Quiz Published Successfully!');
    navigate('/');
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pb-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold">DIRECTOR PANEL</h1>
        <div className="flex gap-2">
            <NeonButton variant="outline" onClick={() => navigate('/')}>Cancel</NeonButton>
            <NeonButton onClick={handlePublish} disabled={questions.length === 0}>
                <Save className="w-4 h-4" /> Publish Daily Quiz
            </NeonButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Creator Column */}
        <div className="space-y-6">
          <GlassCard>
            <h2 className="text-xl font-bold mb-4 text-kolly-cyan">Quiz Meta</h2>
            <InputField label="Quiz Title" value={quizTitle} onChange={(e: any) => setQuizTitle(e.target.value)} placeholder="e.g. 90s Rahman Hits" />
          </GlassCard>

          <GlassCard>
            <h2 className="text-xl font-bold mb-4 text-kolly-cyan">Add Question</h2>
            
            <InputField 
              label="Question Text" 
              value={currentQText} 
              onChange={(e: any) => setCurrentQText(e.target.value)} 
              placeholder="Enter question..." 
            />

            <div className="mb-4">
               <label className="block text-sm text-kolly-cyan font-bold mb-2">Question Type</label>
               <select 
                 className="w-full bg-black/40 border border-white/20 rounded p-2 text-white"
                 value={qType}
                 onChange={(e) => setQType(e.target.value as QuestionType)}
               >
                 <option value={QuestionType.RADIO}>Multiple Choice (Radio)</option>
                 <option value={QuestionType.TEXT}>Text Input</option>
               </select>
            </div>

            {qType === QuestionType.RADIO && (
                <InputField 
                    label="Options (comma separated)" 
                    value={optionsStr} 
                    onChange={(e: any) => setOptionsStr(e.target.value)} 
                    placeholder="Option A, Option B, Option C, Option D" 
                />
            )}

            <InputField 
              label="Correct Answer" 
              value={correctAnswer} 
              onChange={(e: any) => setCorrectAnswer(e.target.value)} 
              placeholder="Exact match string" 
            />

            <div className="mb-6 p-4 border border-dashed border-white/20 rounded flex flex-col items-center justify-center text-gray-500 hover:bg-white/5 transition cursor-pointer">
               <Upload className="w-6 h-6 mb-2" />
               <span className="text-xs">Drag & Drop Media (Image/MP3/MP4)</span>
               <span className="text-[10px] mt-1">(Disabled in Demo)</span>
            </div>

            <div className="flex gap-2">
               <NeonButton onClick={handleAddQuestion} className="flex-1">
                 <Plus className="w-4 h-4" /> Add to Queue
               </NeonButton>
               <NeonButton variant="secondary" onClick={handleGenerateAI} disabled={loadingAI}>
                 {loadingAI ? 'Thinking...' : <><Wand2 className="w-4 h-4" /> AI Generate</>}
               </NeonButton>
            </div>
          </GlassCard>
        </div>

        {/* Preview Column */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-400 uppercase tracking-widest">Question Queue ({questions.length})</h2>
          {questions.length === 0 && <div className="text-gray-600 italic">No questions added yet.</div>}
          
          {questions.map((q, idx) => (
            <GlassCard key={idx} className="relative group">
               <button 
                 onClick={() => setQuestions(questions.filter((_, i) => i !== idx))}
                 className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition"
               >
                 <Trash className="w-4 h-4" />
               </button>
               <div className="font-bold mb-2"><span className="text-kolly-violet">Q{idx+1}:</span> {q.text}</div>
               <div className="text-sm text-gray-400">Ans: {q.correctAnswer}</div>
               {q.options && <div className="text-xs text-gray-500 mt-2">{q.options.join(' | ')}</div>}
            </GlassCard>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Admin;
