export const APP_NAME = "CYBER-KOLLYWOOD";
export const ADMIN_EMAIL = "admin@kollypop.com"; // Simulating admin

export const INITIAL_QUESTIONS = [
  {
    id: 'q1',
    text: "Who is known as 'Superstar' in Tamil Cinema?",
    mediaType: 'NONE',
    questionType: 'RADIO',
    options: ['Kamal Haasan', 'Rajinikanth', 'Vijay', 'Ajith'],
    correctAnswer: 'Rajinikanth',
    points: 10
  },
  {
    id: 'q2',
    text: "Which movie features the song 'Neruppu Da'?",
    mediaType: 'NONE', // Could be AUDIO in a real upload scenario
    questionType: 'RADIO',
    options: ['Kabali', 'Kaala', 'Petta', 'Darbar'],
    correctAnswer: 'Kabali',
    points: 10
  }
];

export const MOCK_USER = {
  uid: 'user-123',
  email: 'fan@kollywood.com',
  displayName: 'Kolly Fan',
  cinemaAlias: 'Thalaivar Veriyan',
  isAdmin: false
};
