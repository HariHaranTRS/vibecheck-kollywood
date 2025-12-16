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

  const [quizTitle, setQuizTitle] = useState('');
  const [quizDate, setQuizDate] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);

  const [text, setText] = useState('');
  const [options, setOptions] = useState('');
  const [answer, setAnswer] = useState('');
  const [qType, setQType] = useState<QuestionType>(QuestionType.RADIO);
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.NONE);

  if (!user?.isAdmin) {
    return <div className="p-10 text-center text-red-500">ACCESS DENIED</div>;
  }

  const addQuestion = () => {
    const q: Question = {
      id: `q-${Date.now()}`,
      text,
      questionType: qType,
      mediaType,
      options: qType !== QuestionType.TEXT ? options.split(',').map(o => o.trim()) : undefined,
      correctAnswer: qType === QuestionType.CHECKBOX
        ? answer.split(',').map(a => a.trim())
        : answer,
      points: 10
    };

    setQuestions([...questions, q]);
    setText('');
    setOptions('');
    setAnswer('');
  };

  const publishQuiz = async () => {
    const quiz: Quiz = {
      id: `quiz-${Date.now()}`,
      title: quizTitle || 'Daily Quiz',
      date: quizDate,
      questions,
      published: true
    };

    await saveQuiz(quiz);
    alert('Quiz Published!');
    navigate('/');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-display mb-6">🎬 Director Panel</h1>

      <GlassCard>
        <InputField label="Quiz Title" value={quizTitle} onChange={e => setQuizTitle(e.target.value)} />
        <InputField type="date" label="Quiz Date" value={quizDate} onChange={e => setQuizDate(e.target.value)} />
      </GlassCard>

      <GlassCard className="mt-6">
        <InputField label="Question Text" value={text} onChange={e => setText(e.target.value)} />

        <label className="block mb-2">Answer Type</label>
        <select className="w-full mb-4 p-2 bg-black/40" value={qType} onChange={e => setQType(e.target.value as QuestionType)}>
          <option value={QuestionType.RADIO}>Radio</option>
          <option value={QuestionType.CHECKBOX}>Checkbox</option>
          <option value={QuestionType.TEXT}>Typing</option>
        </select>

        <label className="block mb-2">Media Type</label>
        <select className="w-full mb-4 p-2 bg-black/40" value={mediaType} onChange={e => setMediaType(e.target.value as MediaType)}>
          <option value={MediaType.NONE}>None</option>
          <option value={MediaType.IMAGE}>Image</option>
          <option value={MediaType.AUDIO}>Audio</option>
          <option value={MediaType.VIDEO}>Video</option>
        </select>

        {qType !== QuestionType.TEXT && (
          <InputField label="Options (comma separated)" value={options} onChange={e => setOptions(e.target.value)} />
        )}

        <InputField label="Correct Answer" value={answer} onChange={e => setAnswer(e.target.value)} />

        <NeonButton onClick={addQuestion}><Plus /> Add Question</NeonButton>
      </GlassCard>

      <GlassCard className="mt-6">
        <h3 className="mb-4">Questions ({questions.length})</h3>
        {questions.map((q, i) => (
          <div key={q.id} className="mb-2 flex justify-between">
            <span>{i + 1}. {q.text}</span>
            <button onClick={() => setQuestions(questions.filter((_, idx) => idx !== i))}>
              <Trash className="text-red-500" />
            </button>
          </div>
        ))}
      </GlassCard>

      <NeonButton className="mt-6" onClick={publishQuiz} disabled={!quizDate || !questions.length}>
        <Save /> Publish Quiz
      </NeonButton>
    </div>
  );
};

export default Admin;
