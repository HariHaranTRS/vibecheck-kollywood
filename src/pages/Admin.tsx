import React, { useState } from 'react';
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

  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);

  const [currentQText, setCurrentQText] = useState('');
  const [qType, setQType] = useState<QuestionType>(QuestionType.RADIO);
  const [optionsStr, setOptionsStr] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');

  if (!user?.isAdmin) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-3xl font-bold text-red-500">ACCESS DENIED</h1>
        <p>Restricted Area. Director Access Only.</p>
        <button onClick={() => navigate('/')} className="underline mt-4">
          Go Home
        </button>
      </div>
    );
  }

  const handleAddQuestion = () => {
    const newQ: Question = {
      id: `manual-${Date.now()}`,
      text: currentQText,
      mediaType: MediaType.NONE,
      questionType: qType,
      options: optionsStr.split(',').map(s => s.trim()),
      correctAnswer,
      points: 10,
    };

    setQuestions(prev => [...prev, newQ]);
    setCurrentQText('');
    setOptionsStr('');
    setCorrectAnswer('');
  };

  const handleGenerateAI = async () => {
    setLoadingAI(true);
    try {
      const aiQuestions = await generateAIQuiz('Tamil Cinema 2020-2024');
      setQuestions(prev => [...prev, ...aiQuestions]);
    } catch {
      alert('AI Generation failed. Check API key.');
    } finally {
      setLoadingAI(false);
    }
  };

  const handlePublish = async () => {
    const newQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: quizTitle || 'Daily Quiz',
      questions,
      published: true,
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
          <NeonButton variant="outline" onClick={() => navigate('/')}>
            Cancel
          </NeonButton>
          <NeonButton onClick={handlePublish} disabled={!questions.length}>
            <Save className="w-4 h-4" /> Publish Daily Quiz
          </NeonButton>
        </div>
      </div>

      <GlassCard>
        <InputField
          label="Quiz Title"
          value={quizTitle}
          onChange={(e: any) => setQuizTitle(e.target.value)}
        />

        <InputField
          label="Question Text"
          value={currentQText}
          onChange={(e: any) => setCurrentQText(e.target.value)}
        />

        <InputField
          label="Options (comma separated)"
          value={optionsStr}
          onChange={(e: any) => setOptionsStr(e.target.value)}
        />

        <InputField
          label="Correct Answer"
          value={correctAnswer}
          onChange={(e: any) => setCorrectAnswer(e.target.value)}
        />

        <div className="flex gap-2 mt-4">
          <NeonButton onClick={handleAddQuestion}>
            <Plus /> Add
          </NeonButton>
          <NeonButton variant="secondary" onClick={handleGenerateAI} disabled={loadingAI}>
            <Wand2 /> AI Generate
          </NeonButton>
        </div>
      </GlassCard>

      <div className="mt-8 space-y-3">
        {questions.map((q, i) => (
          <GlassCard key={q.id}>
            <div className="flex justify-between">
              <span>{q.text}</span>
              <button
                onClick={() => setQuestions(qs => qs.filter((_, idx) => idx !== i))}
              >
                <Trash />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default Admin;
