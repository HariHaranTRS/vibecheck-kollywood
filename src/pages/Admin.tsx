import React, { useState } from 'react';
import { GlassCard, NeonButton, InputField } from '../components/NeonComponents';
import { useStore } from '../store';
import { Question, QuestionType, MediaType, Quiz } from '../types';
import { saveQuiz } from '../services/db';
import { Plus, Trash, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const { user } = useStore();
  const navigate = useNavigate();

  // 🚫 HARD ADMIN BLOCK
  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h1 className="text-3xl text-red-500 font-bold">ACCESS DENIED</h1>
          <p className="text-gray-400 mt-2">Admin only</p>
          <button className="underline mt-4" onClick={() => navigate('/')}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Quiz meta
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);

  // Current question builder
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState<QuestionType>(QuestionType.RADIO);
  const [options, setOptions] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<string | string[]>('');

  // Add option
  const addOption = () => setOptions([...options, '']);

  // Update option
  const updateOption = (index: number, value: string) => {
    const copy = [...options];
    copy[index] = value;
    setOptions(copy);
  };

  // Remove option
  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  // Add question
  const addQuestion = () => {
    if (!questionText.trim()) return alert('Question text required');

    const q: Question = {
      id: `q-${Date.now()}`,
      text: questionText,
      mediaType: MediaType.NONE,
      questionType,
      options: questionType === QuestionType.TEXT ? undefined : options,
      correctAnswer,
      points: 10,
    };

    setQuestions([...questions, q]);

    // Reset
    setQuestionText('');
    setOptions([]);
    setCorrectAnswer('');
  };

  // Publish quiz
  const publishQuiz = async () => {
    if (!quizTitle || questions.length === 0) {
      alert('Quiz title and questions required');
      return;
    }

    const quiz: Quiz = {
      id: `quiz-${Date.now()}`,
      title: quizTitle,
      date: new Date().toISOString().split('T')[0],
      questions,
      published: true,
    };

    await saveQuiz(quiz);
    alert('Quiz published!');
    navigate('/');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 pb-32">
      <h1 className="text-3xl font-bold">🎬 DIRECTOR PANEL</h1>

      {/* QUIZ META */}
      <GlassCard>
        <InputField
          label="Quiz Title"
          value={quizTitle}
          onChange={(e: any) => setQuizTitle(e.target.value)}
          placeholder="e.g. Kollywood 2024 Special"
        />
      </GlassCard>

      {/* QUESTION BUILDER */}
      <GlassCard>
        <h2 className="text-xl font-bold mb-4">Add Question</h2>

        <InputField
          label="Question Text"
          value={questionText}
          onChange={(e: any) => setQuestionText(e.target.value)}
          placeholder="Enter question"
        />

        {/* TYPE */}
        <label className="block mb-2 text-sm">Question Type</label>
        <select
          className="w-full bg-black/40 border border-white/20 p-2 rounded mb-4"
          value={questionType}
          onChange={(e) => {
            setQuestionType(e.target.value as QuestionType);
            setOptions([]);
            setCorrectAnswer('');
          }}
        >
          <option value={QuestionType.RADIO}>Single Choice</option>
          <option value={QuestionType.CHECKBOX}>Multi Select</option>
          <option value={QuestionType.TEXT}>Text Answer</option>
        </select>

        {/* OPTIONS */}
        {(questionType === QuestionType.RADIO ||
          questionType === QuestionType.CHECKBOX) && (
          <>
            <label className="text-sm mb-2 block">Options</label>

            {options.map((opt, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  className="flex-1 bg-black/40 border border-white/20 p-2 rounded"
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value)}
                />
                <button onClick={() => removeOption(i)}>
                  <Trash className="text-red-500" />
                </button>
              </div>
            ))}

            <NeonButton variant="secondary" onClick={addOption}>
              <Plus /> Add Option
            </NeonButton>

            {/* CORRECT ANSWER */}
            <div className="mt-4">
              <label className="text-sm block mb-2">Correct Answer</label>

              {questionType === QuestionType.RADIO &&
                options.map((opt) => (
                  <label key={opt} className="flex gap-2 items-center">
                    <input
                      type="radio"
                      name="correct"
                      checked={correctAnswer === opt}
                      onChange={() => setCorrectAnswer(opt)}
                    />
                    {opt}
                  </label>
                ))}

              {questionType === QuestionType.CHECKBOX &&
                options.map((opt) => (
                  <label key={opt} className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      checked={
                        Array.isArray(correctAnswer) &&
                        correctAnswer.includes(opt)
                      }
                      onChange={() => {
                        const arr = Array.isArray(correctAnswer)
                          ? correctAnswer
                          : [];
                        setCorrectAnswer(
                          arr.includes(opt)
                            ? arr.filter((o) => o !== opt)
                            : [...arr, opt]
                        );
                      }}
                    />
                    {opt}
                  </label>
                ))}
            </div>
          </>
        )}

        {/* TEXT ANSWER */}
        {questionType === QuestionType.TEXT && (
          <InputField
            label="Correct Answer (Text)"
            value={correctAnswer as string}
            onChange={(e: any) => setCorrectAnswer(e.target.value)}
            placeholder="Exact answer (case-insensitive)"
          />
        )}

        <NeonButton className="mt-6" onClick={addQuestion}>
          <Plus /> Add Question
        </NeonButton>
      </GlassCard>

      {/* PREVIEW */}
      <GlassCard>
        <h2 className="font-bold mb-4">Questions ({questions.length})</h2>
        {questions.map((q, i) => (
          <div key={q.id} className="mb-3 text-sm">
            <b>Q{i + 1}:</b> {q.text}
          </div>
        ))}
      </GlassCard>

      <NeonButton onClick={publishQuiz} className="w-full text-lg">
        <Save /> Publish Quiz
      </NeonButton>
    </div>
  );
};

export default Admin;
