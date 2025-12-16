import React, { useState } from 'react';
import { GlassCard, NeonButton, InputField } from '../components/NeonComponents';
import { useStore } from '../store';
import { Question, QuestionType, MediaType, Quiz } from '../types';
import { saveQuiz } from '../services/db';
import { Plus, Trash, Save, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const { user } = useStore();
  const navigate = useNavigate();

  // Quiz state
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);

  // Current question state
  const [currentQText, setCurrentQText] = useState('');
  const [qType, setQType] = useState<QuestionType>(QuestionType.RADIO);
  const [optionsStr, setOptionsStr] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');

  // Restrict access
  if (!user?.isAdmin) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-3xl font-bold text-red-500">ACCESS DENIED</h1>
        <p>Director access only.</p>
        <button onClick={() => navigate('/')} className="underline mt-4">
          Go Home
        </button>
      </div>
    );
  }

  const handleAddQuestion = () => {
    if (!currentQText || !correctAnswer) return;

    const newQuestion: Question = {
      id: `manual-${Date.now()}`,
      text: currentQText,
      mediaType: MediaType.NONE,
      questionType: qType,
      options:
        qType === QuestionType.RADIO
          ? optionsStr.split(',').map(o => o.trim())
          : undefined,
      correctAnswer:
        qType === QuestionType.TEXT
          ? correctAnswer.toLowerCase()
          : correctAnswer,
      points: 10,
    };

    setQuestions(prev => [...prev, newQuestion]);

    // Reset
    setCurrentQText('');
    setOptionsStr('');
    setCorrectAnswer('');
  };

  const handlePublish = async () => {
    if (questions.length === 0) return;

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
          <NeonButton onClick={handlePublish} disabled={questions.length === 0}>
            <Save className="w-4 h-4" /> Publish Quiz
          </NeonButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Creator */}
        <div className="space-y-6">
          <GlassCard>
            <h2 className="text-xl font-bold mb-4 text-kolly-cyan">
              Quiz Details
            </h2>
            <InputField
              label="Quiz Title"
              value={quizTitle}
              onChange={(e: any) => setQuizTitle(e.target.value)}
              placeholder="e.g. Kollywood 2024"
            />
          </GlassCard>

          <GlassCard>
            <h2 className="text-xl font-bold mb-4 text-kolly-cyan">
              Add Question
            </h2>

            <InputField
              label="Question Text"
              value={currentQText}
              onChange={(e: any) => setCurrentQText(e.target.value)}
              placeholder="Enter question..."
            />

            <div className="mb-4">
              <label className="block text-sm mb-2 text-kolly-cyan font-bold">
                Answer Type
              </label>
              <select
                className="w-full bg-black/40 border border-white/20 rounded p-2 text-white"
                value={qType}
                onChange={e => setQType(e.target.value as QuestionType)}
              >
                <option value={QuestionType.RADIO}>
                  Multiple Choice
                </option>
                <option value={QuestionType.TEXT}>
                  Typing Answer
                </option>
              </select>
            </div>

            {qType === QuestionType.RADIO && (
              <InputField
                label="Options (comma separated)"
                value={optionsStr}
                onChange={(e: any) => setOptionsStr(e.target.value)}
                placeholder="Option A, Option B, Option C"
              />
            )}

            <InputField
              label="Correct Answer"
              value={correctAnswer}
              onChange={(e: any) => setCorrectAnswer(e.target.value)}
              placeholder="Exact answer"
            />

            <div className="mb-6 p-4 border border-dashed border-white/20 rounded text-center text-gray-500">
              <Upload className="w-6 h-6 mx-auto mb-2" />
              Media upload (coming soon)
            </div>

            <NeonButton onClick={handleAddQuestion} className="w-full">
              <Plus className="w-4 h-4" /> Add Question
            </NeonButton>
          </GlassCard>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-400">
            Question Queue ({questions.length})
          </h2>

          {questions.length === 0 && (
            <div className="text-gray-600 italic">
              No questions added yet
            </div>
          )}

          {questions.map((q, idx) => (
            <GlassCard key={q.id} className="relative group">
              <button
                onClick={() =>
                  setQuestions(prev => prev.filter((_, i) => i !== idx))
                }
                className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100"
              >
                <Trash className="w-4 h-4" />
              </button>

              <div className="font-bold mb-1">
                Q{idx + 1}: {q.text}
              </div>
              <div className="text-sm text-gray-400">
                Answer: {q.correctAnswer}
              </div>
              {q.options && (
                <div className="text-xs text-gray-500 mt-1">
                  {q.options.join(' | ')}
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
