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

  /* =====================
     ACCESS CONTROL
  ===================== */
  if (!user?.isAdmin) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-3xl font-bold text-red-500">ACCESS DENIED</h1>
        <p>Admin only</p>
        <button onClick={() => navigate('/')} className="underline mt-4">
          Go Home
        </button>
      </div>
    );
  }

  /* =====================
     STATE
  ===================== */
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);

  const [questionText, setQuestionText] = useState('');
  const [type, setType] = useState<QuestionType>(QuestionType.RADIO);
  const [options, setOptions] = useState<string[]>(['']);
  const [correctRadio, setCorrectRadio] = useState('');
  const [correctMulti, setCorrectMulti] = useState<string[]>([]);
  const [correctText, setCorrectText] = useState('');

  /* =====================
     HELPERS
  ===================== */
  const addOption = () => setOptions([...options, '']);

  const updateOption = (i: number, value: string) => {
    const copy = [...options];
    copy[i] = value;
    setOptions(copy);
  };

  const addQuestion = () => {
    const q: Question = {
      id: `q-${Date.now()}`,
      text: questionText,
      mediaType: MediaType.NONE,
      questionType: type,
      options: type === QuestionType.TEXT ? undefined : options.filter(Boolean),
      correctAnswer:
        type === QuestionType.RADIO
          ? correctRadio
          : type === QuestionType.CHECKBOX
          ? correctMulti
          : correctText,
      points: 10,
    };

    setQuestions([...questions, q]);

    setQuestionText('');
    setOptions(['']);
    setCorrectRadio('');
    setCorrectMulti([]);
    setCorrectText('');
  };

  const publishQuiz = async () => {
    const quiz: Quiz = {
      id: `quiz-${Date.now()}`,
      title: quizTitle,
      date: new Date().toISOString().split('T')[0],
      questions,
      published: true,
    };

    await saveQuiz(quiz);
    alert('Quiz published');
    navigate('/');
  };

  /* =====================
     UI
  ===================== */
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">ADMIN PANEL</h1>

      <GlassCard>
        <InputField
          label="Quiz Title (Shown to users)"
          value={quizTitle}
          onChange={(e: any) => setQuizTitle(e.target.value)}
        />
      </GlassCard>

      <GlassCard>
        <InputField
          label="Question Text"
          value={questionText}
          onChange={(e: any) => setQuestionText(e.target.value)}
        />

        <label className="block mb-2">Answer Type</label>
        <select
          className="w-full mb-4 bg-black/40 border border-white/20 p-2 rounded"
          value={type}
          onChange={(e) => setType(e.target.value as QuestionType)}
        >
          <option value={QuestionType.RADIO}>Single Choice</option>
          <option value={QuestionType.CHECKBOX}>Multi Select</option>
          <option value={QuestionType.TEXT}>Text Answer</option>
        </select>

        {(type === QuestionType.RADIO || type === QuestionType.CHECKBOX) && (
          <>
            {options.map((opt, i) => (
              <InputField
                key={i}
                label={`Option ${i + 1}`}
                value={opt}
                onChange={(e: any) => updateOption(i, e.target.value)}
              />
            ))}

            <NeonButton variant="secondary" onClick={addOption}>
              <Plus /> Add Option
            </NeonButton>
          </>
        )}

        {type === QuestionType.RADIO && (
          <select
            className="w-full mt-4 bg-black/40 border border-white/20 p-2 rounded"
            value={correctRadio}
            onChange={(e) => setCorrectRadio(e.target.value)}
          >
            <option value="">Select Correct Answer</option>
            {options.map((o, i) => (
              <option key={i} value={o}>
                {o}
              </option>
            ))}
          </select>
        )}

        {type === QuestionType.CHECKBOX && (
          <div className="mt-4 space-y-2">
            {options.map((o, i) => (
              <label key={i} className="flex gap-2">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    e.target.checked
                      ? setCorrectMulti([...correctMulti, o])
                      : setCorrectMulti(correctMulti.filter(x => x !== o))
                  }
                />
                {o}
              </label>
            ))}
          </div>
        )}

        {type === QuestionType.TEXT && (
          <InputField
            label="Correct Text Answer"
            value={correctText}
            onChange={(e: any) => setCorrectText(e.target.value)}
          />
        )}

        <NeonButton className="mt-4" onClick={addQuestion}>
          Add Question
        </NeonButton>
      </GlassCard>

      <GlassCard>
        <h2 className="font-bold mb-2">Questions ({questions.length})</h2>
        {questions.map((q, i) => (
          <div key={i} className="flex justify-between border-b py-2">
            <span>{q.text}</span>
            <button onClick={() => setQuestions(questions.filter((_, x) => x !== i))}>
              <Trash />
            </button>
          </div>
        ))}
      </GlassCard>

      <NeonButton onClick={publishQuiz} disabled={!questions.length}>
        <Save /> Publish Quiz
      </NeonButton>
    </div>
  );
};

export default Admin;
