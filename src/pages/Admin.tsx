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
  const [questions, setQuestions] = useState<Question[]>([]);

  const [text, setText] = useState('');
  const [options, setOptions] = useState('');
  const [answer, setAnswer] = useState('');

  if (!user?.isAdmin) {
    return <div className="p-10 text-center text-red-500">ACCESS DENIED</div>;
  }

  const addQuestion = () => {
    setQuestions(prev => [
      ...prev,
      {
        id: `q-${Date.now()}`,
        text,
        mediaType: MediaType.NONE,
        questionType: QuestionType.RADIO,
        options: options.split(',').map(o => o.trim()),
        correctAnswer: answer,
        points: 10
      }
    ]);
    setText('');
    setOptions('');
    setAnswer('');
  };

  const publishQuiz = async () => {
    const quiz: Quiz = {
      id: `quiz-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: quizTitle || 'Daily Quiz',
      questions,
      published: true
    };
    await saveQuiz(quiz);
    alert('Quiz published');
    navigate('/');
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Director Panel</h1>

      <GlassCard>
        <InputField label="Quiz Title" value={quizTitle} onChange={(e:any)=>setQuizTitle(e.target.value)} />
      </GlassCard>

      <GlassCard>
        <InputField label="Question" value={text} onChange={(e:any)=>setText(e.target.value)} />
        <InputField label="Options (comma separated)" value={options} onChange={(e:any)=>setOptions(e.target.value)} />
        <InputField label="Correct Answer" value={answer} onChange={(e:any)=>setAnswer(e.target.value)} />

        <NeonButton onClick={addQuestion}><Plus /> Add Question</NeonButton>
      </GlassCard>

      {questions.map((q, i) => (
        <GlassCard key={q.id}>
          <div className="flex justify-between">
            <div>{i + 1}. {q.text}</div>
            <button onClick={() => setQuestions(questions.filter((_,x)=>x!==i))}>
              <Trash />
            </button>
          </div>
        </GlassCard>
      ))}

      <NeonButton onClick={publishQuiz} disabled={!questions.length}>
        <Save /> Publish Quiz
      </NeonButton>
    </div>
  );
};

export default Admin;
