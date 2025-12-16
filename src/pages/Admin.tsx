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

  // Question builder
  const [text, setText] = useState('');
  const [type, setType] = useState<QuestionType>(QuestionType.RADIO);
  const [options, setOptions] = useState('');
  const [correct, setCorrect] = useState<string | string[]>('');

  if (!user?.isAdmin) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-3xl font-bold text-red-500">ACCESS DENIED</h1>
        <button onClick={() => navigate('/')} className="underline mt-4">
          Go Home
        </button>
      </div>
    );
  }

  const addQuestion = () => {
    const q: Question = {
      id: `q-${Date.now()}`,
      text,
      mediaType: MediaType.NONE,
      questionType: type,
      options:
        type === QuestionType.TEXT
          ? undefined
          : options.split(',').map(o => o.trim()),
      correctAnswer: correct,
      points: 100,
    };

    setQuestions(prev => [...prev, q]);
    setText('');
    setOptions('');
    setCorrect('');
  };

  const publishQuiz = async () => {
    const quiz: Quiz = {
      id: `quiz-${Date.now()}`,
      title: quizTitle || 'Daily Quiz',
      date: new Date().toISOString().split('T')[0],
      questions,
      published: true,
    };

    await saveQuiz(quiz);
    alert('Quiz Published');
    navigate('/');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-display font-bold">ADMIN PANEL</h1>
        <NeonButton onClick={publishQuiz} disabled={!questions.length}>
          <Save className="w-4 h-4" /> Publish
        </NeonButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Builder */}
        <GlassCard>
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

          <label className="text-sm block mb-2">Answer Type</label>
          <select
            className="w-full mb-4 bg-black/40 border border-white/20 p-2 rounded"
            value={type}
            onChange={e => setType(e.target.value as QuestionType)}
          >
            <option value={QuestionType.RADIO}>Single Choice</option>
            <option value={QuestionType.CHECKBOX}>Multiple Choice</option>
            <option value={QuestionType.TEXT}>Text Answer</option>
          </select>

          {type !== QuestionType.TEXT && (
            <InputField
              label="Options (comma separated)"
              value={options}
              onChange={(e: any) => setOptions(e.target.value)}
            />
          )}

          <InputField
            label="Correct Answer"
            value={correct as string}
            onChange={(e: any) =>
              setCorrect(
                type === QuestionType.CHECKBOX
                  ? e.target.value.split(',').map((v: string) => v.trim())
                  : e.target.value
              )
            }
          />

          <NeonButton className="w-full mt-4" onClick={addQuestion}>
            <Plus /> Add Question
          </NeonButton>
        </GlassCard>

        {/* Preview */}
        <GlassCard>
          <h2 className="font-bold mb-4">
            Questions ({questions.length})
          </h2>

          {questions.map((q, i) => (
            <div
              key={q.id}
              className="border border-white/10 rounded p-3 mb-3 relative"
            >
              <button
                onClick={() =>
                  setQuestions(prev => prev.filter((_, idx) => idx !== i))
                }
                className="absolute top-2 right-2 text-red-400"
              >
                <Trash size={14} />
              </button>
              <p className="font-bold mb-1">
                Q{i + 1}: {q.text}
              </p>
              <p className="text-xs text-gray-400">
                Type: {q.questionType}
              </p>
            </div>
          ))}
        </GlassCard>
      </div>
    </div>
  );
};

export default Admin;
