export interface CuriosityExperience {
  id: string;
  slug: string;
  title: string;
  hookQuestion: string;
  lessonText: string;
  surprisingFact?: string;
  realWorldRelevance?: string;
  category?: string;
  difficulty?: string;
  tags?: string[];
}

export interface Challenge {
  id: string;
  topicId: string;
  question: string;
  type: "multiple_choice" | "reasoning" | "logic";
  options?: string[];
  correctAnswer?: string;
}

export interface FollowUpQuestion {
  id: string;
  topicId: string;
  question: string;
  answer?: string;
}
