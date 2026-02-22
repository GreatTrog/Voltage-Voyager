
export enum AppView {
  WELCOME = 'welcome',
  LEARN = 'learn',
  EXPERIMENT = 'experiment',
  QUIZ = 'quiz'
}

export interface CircuitState {
  batteries: number;
  isOpen: boolean;
  voltage: number;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
