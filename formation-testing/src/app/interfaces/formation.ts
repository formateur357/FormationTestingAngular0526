export type FormationCategory = 'frontend' | 'backend' | 'testing';

export type FormationLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Formation {
  id: number;
  title: string;
  category: FormationCategory;
  level: FormationLevel;
  duration: number;
}