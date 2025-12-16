import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash, Save, Upload } from 'lucide-react';

import { GlassCard, NeonButton, InputField } from '../components/NeonComponents';
import { useStore } from '../store';
import { Question, QuestionType, MediaType, Quiz } from '../types';
import { saveQuiz } from '../services/db';

const Admin = () => {
  const { user } = useStore();
  const navigate = useNavigate();

  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);

  const [qText, setQText] = useState('');
  const [qType, setQType] = useState<QuestionType>(QuestionType.RADIO);
  const [optionsStr, setOptionsStr] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');

  /* =========================
     ACCESS CONTROL
  ========================== */
  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <GlassCard>
          <h1 className="text-3xl font-bold text-red-500 mb-2">
            ACCESS DENIED
          </h1>
          <p className="text-gray-400 mb-4">
            Director access only
          </p>
          <NeonButton onClick={() => navigate('/')}>
            Go Back
          </NeonButton>
        </GlassCard>
      </div>
    );
  }

  /* =========================
     ADD QUESTION
  ========================== */
  const handleAddQuestion = () => {
    if (!qText.trim()) return;

    const question: Question = {
      id: `q-${Date.now()}`,
      text: qText,
      mediaType: MediaType.NONE,
      questionType: qType,
      options:
        qType === QuestionType.TEXT
          ? undefined
          : optionsStr.split(',').map(o => o.trim()),
      correctAnswer:
        qType === QuestionType.CHECKBOX
          ? correctAnswer.split(',').map(a => a.trim())
          : correctAnswer,
      points: 10
    };

    setQuestions(prev => [...prev, question]);

    setQText('');
    setOptionsStr('');
    setCorrectAnswer('');
  };

  /* =========================
     PUBLISH QUIZ
  ========================== */
  const handlePublish = async () => {
    if (!questions.length) return;

    const quiz: Quiz = {
      id: `quiz-${Date.now()}`,
      title: quizTitle || 'Daily Quiz',
      date: new Date().toISOString().split('T')[0],
      questions,
      published: true
    };

    await saveQuiz(quiz);
    alert('Quiz published successfully!');
    navigate('/');
  };

  /* =========================
     UI
  ========================== */
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto pb-24">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold">
          DIRECTOR PANEL
        </h1>
        <div className="flex gap-2">
          <NeonButton variant="outline" onClick={() => navigate('/')}>
            Cancel
          </NeonButton>
          <NeonButton onClick={handlePublish} disabled={!questions.length}>
            <Save className="w-4 h-4" /> Publish
          </NeonButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT – CREATOR */}
        <div className="space-y-6">
          <GlassCard>
            <InputField
              label="Quiz Title"
              value={quizTitle}
              onChange={(e: any) => setQuizTitle(e.target.value)}
              placeholder="e.g. Vijay vs Ajith"
            />
          </GlassCard>

          <GlassCard>
            <h2 className="font-bold text-kolly-cyan mb-4">
              Add Question
            </h2>

            <InputField
              label="Question"
              value={qText}
              onChange={(e: any) => setQText(e.target.value)}
            />

            <div className="mb-4">
              <label className="block mb-2 text-sm">
                Answer Type
              </label>
              <select
                className="w-full bg-black/40 border border-white/20 rounded p-2"
                value={qType}
                onChange={e => setQType(e.target.value as QuestionType)}
              >
                <option value={QuestionType.RADIO}>
                  Single Choice
                </option>
                <option value={QuestionType.CHECKBOX}>
                  Multi Select
                </option>
                <option value={QuestionType.TEXT}>
                  Typing
                </option>
              </select>
            </div>

            {qType !== QuestionType.TEXT && (
              <InputField
                label="Options (comma separated)"
                value={optionsStr}
                onChange={(e: any) => setOptionsStr(e.target.value)}
              />
            )}

            <InputField
              label="Correct Answer"
              value={correctAnswer}
              onChange={(e: any) => setCorrectAnswer(e.target.value)}
              placeholder={
                qType === QuestionType.CHECKBOX
                  ? 'Comma separated'
                  : 'Exact answer'
              }
            />

            <div className="mb-4 p-4 border border-dashed border-white/20 rounded text-center text-gray-500">
              <Upload className="mx-auto mb-2" />
              Media upload (Firebase – later)
            </div>

            <NeonButton className="w-full" onClick={handleAddQuestion}>
              <Plus className="w-4 h-4" /> Add Question
            </NeonButton>
          </GlassCard>
        </div>

        {/* RIGHT – QUEUE */}
        <div>
          <h2 className="text-gray-400 mb-4">
            Question Queue ({questions.length})
          </h2>

          {questions.map((q, i) => (
            <GlassCard key={q.id} className="mb-3 relative">
              <button
                onClick={() =>
                  setQuestions(prev =>
                    prev.filter((_, idx) => idx !== i)
                  )
                }
                className="absolute top-2 right-2 text-red-500"
              >
                <Trash size={16} />
              </button>

              <div className="font-bold mb-1">
                Q{i + 1}: {q.text}
              </div>
              <div className="text-sm text-gray-400">
                Answer: {String(q.correctAnswer)}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
