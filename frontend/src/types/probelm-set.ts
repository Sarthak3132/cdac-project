export interface DifficultyCardProps {
  label: string;
  solved: number;
  total: number;
  colorClass: string;
  barClass: string;
  iconClass: string;
}

export interface OverallCardProps {
  solved: number;
  total: number;
  pct: number;
}

export interface AttemptedCardProps {
  attempted: number;
  total: number;
}

export interface Problem {
  id: number;
  title: string;
  level: string;
  tags?: string[];
}

export interface ProblemTableProps {
  problems: ProblemSummary[];
  page: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export interface ProblemFiltersProps {
  search: string;
  level: string;
  totalFiltered: number;
  onSearchChange: (value: string) => void;
  onLevelChange: (value: string) => void;
}

export interface ProblemSummary {
  id: number;
  title: string;
  slug: string;
  description: string;
  problemDifficulty: "EASY" | "MEDIUM" | "HARD";
  createdAt: string;
}
