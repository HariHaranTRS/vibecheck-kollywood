import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash, Save } from 'lucide-react';

import { GlassCard, NeonButton, InputField } from '../components/NeonComponents';
import { useStore } from '../store';
import { Question, QuestionType, MediaType, Quiz } from '../types';
import { saveQuiz } from '../services/db';

const Admin = () => {
  const { user } = useStore();
  const navigate = useNavigate();

  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);

  // Question builder state
  const [text, setText] = useState('');
  const [questionType, setQuestionType] = useState<QuestionType>(QuestionType.RADIO);
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.NONE);
  const [options, setOptions] = useState('');
  const [answer, setAnswer] = useState('');

  /* =========================
     ACCESS CONTROL
  ========================== */
  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h1 className="text-3xl font-bold text-red-500">ACCESS DENIED</h1>
          <p className="text-gray-400 mt-2">Admin only</p>
          <button onClick={() => navigate('/')} className="underline mt-4">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  /* =========================
     HANDLERS
  ========================== */
  const addQuestion = () => {
    if (!text.trim()) return;

    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      text,
      mediaType,
      questionType,
      options:
        questionType === QuestionType.RADIO || questionType === QuestionType.CHECKBOX
          ? options.split(',').map(o => o.trim())
          : undefined,
      correctAnswer:
        questionType === QuestionType.CHECKBOX
          ? answer.split(',').map(a => a.trim())
          : answer.trim(),
      points: 10
    };

    setQuestions(prev => [...prev, newQuestion]);
    setText('');
    setOptions('');
    setAnswer('');
  };

  const publishQuiz = async () => {
    if (questions.length === 0) return;

    const quiz: Quiz = {
      id: `quiz-${Date.now()}`,
      title: quizTitle || 'Daily Quiz',
      date: new Date().toISOString().split('T')[0],
      questions,
      published: true
    };

    await saveQuiz(quiz);
    alert('Quiz published!');
    navigate('/');
  };

  /* =========================
     UI
  ========================== */
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-bold">DIRECTOR PANEL</h1>
        <div className="flex gap-2">
          <NeonButton variant="outline" onClick={() => navigate('/')}>
            Cancel
          </NeonButton>
          <NeonButton onClick={publishQuiz} disabled={questions.length === 0}>
            <Save className="w-4 h-4" /> Publish
          </NeonButton>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* QUESTION BUILDER */}
        <GlassCard>
          <h2 className="text-xl font-bold mb-4 text-kolly-cyan">Create Question</h2>

          <InputField
            label="Quiz Title"
            value={quizTitle}
            onChange={(e: any) => setQuizTitle(e.target.value)}
          />

          <InputField
            label="Question Text"
            value={text}
            onChange={(e: any) => setText(e.target.value)}
          />

          <div className="mb-4">
            <label className="block text-sm mb-2">Media Type</label>
            <select
              className="w-full bg-black/40 border border-white/20 p-2 rounded"
              value={mediaType}
              onChange={e => setMediaType(e.target.value as MediaType)}
            >
              <option value={MediaType.NONE}>None</option>
              <option value={MediaType.IMAGE}>Image</option>
              <option value={MediaType.AUDIO}>Audio</option>
              <option value={MediaType.VIDEO}>Video</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2">Answer Type</label>
            <select
              className="w-full bg-black/40 border border-white/20 p-2 rounded"
              value={questionType}
              onChange={e => setQuestionType(e.target.value as QuestionType)}
            >
              <option value={QuestionType.RADIO}>Single Choice</option>
              <option value={QuestionType.CHECKBOX}>Multiple Choice</option>
              <option value={QuestionType.TEXT}>Typing</option>
            </select>
          </div>

          {(questionType === QuestionType.RADIO ||
            questionType === QuestionType.CHECKBOX) && (
            <InputField
              label="Options (comma separated)"
              value={options}
              onChange={(e: any) => setOptions(e.target.value)}
            />
          )}

          <InputField
            label="Correct Answer"
            value={answer}
            onChange={(e: any) => setAnswer(e.target.value)}
            placeholder={
              questionType === QuestionType.CHECKBOX
                ? 'comma separated answers'
                : 'exact answer'
            }
          />

          <NeonButton onClick={addQuestion} className="w-full mt-4">
            <Plus className="w-4 h-4" /> Add Question
          </NeonButton>
        </GlassCard>

        {/* PREVIEW */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-400">
            Question Queue ({questions.length})
          </h2>

          {questions.map((q, i) => (
            <GlassCard key={q.id} className="relative">
              <button
                className="absolute top-2 right-2 text-red-500"
                onClick={() =>
                  setQuestions(questions.filter((_, idx) => idx !== i))
                }
              >
                <Trash className="w-4 h-4" />
              </button>

              <div className="font-bold mb-1">
                Q{i + 1}: {q.text}
              </div>
              <div className="text-xs text-gray-400">
                Type: {q.questionType} | Media: {q.mediaType}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
