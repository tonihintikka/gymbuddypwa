import { useCallback, useMemo, useState } from 'react';
import { Exercise, ExerciseCategory, MuscleGroup } from '../../../types/models';

export type MuscleGroupFilter = MuscleGroup | 'All';
export type ExerciseCategoryFilter = ExerciseCategory | 'All';

export interface ActiveChip {
  key: string;
  label: string;
  onRemove: () => void;
}

export interface UseExerciseFiltersResult {
  search: string;
  setSearch: (value: string) => void;
  muscleGroup: MuscleGroupFilter;
  setMuscleGroup: (value: MuscleGroupFilter) => void;
  category: ExerciseCategoryFilter;
  setCategory: (value: ExerciseCategoryFilter) => void;
  groupByBase: boolean;
  toggleGroup: () => void;
  reset: () => void;
  hasActiveFilters: boolean;
  activeChips: ActiveChip[];
  getFiltered: (exercises: Exercise[]) => Exercise[];
}

export function useExerciseFilters(initial?: Partial<Pick<UseExerciseFiltersResult, 'search' | 'muscleGroup' | 'category' | 'groupByBase'>>): UseExerciseFiltersResult {
  const [search, setSearch] = useState<string>(initial?.search ?? '');
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroupFilter>(initial?.muscleGroup ?? 'All');
  const [category, setCategory] = useState<ExerciseCategoryFilter>(initial?.category ?? 'All');
  const [groupByBase, setGroupByBase] = useState<boolean>(initial?.groupByBase ?? false);

  const toggleGroup = useCallback(() => setGroupByBase(prev => !prev), []);

  const reset = useCallback(() => {
    setSearch('');
    setMuscleGroup('All');
    setCategory('All');
  }, []);

  const hasActiveFilters = useMemo(() => muscleGroup !== 'All' || category !== 'All', [muscleGroup, category]);

  const activeChips = useMemo<ActiveChip[]>(() => {
    const chips: ActiveChip[] = [];
    if (muscleGroup !== 'All') {
      chips.push({
        key: 'muscleGroup',
        label: String(muscleGroup),
        onRemove: () => setMuscleGroup('All'),
      });
    }
    if (category !== 'All') {
      chips.push({
        key: 'category',
        label: String(category),
        onRemove: () => setCategory('All'),
      });
    }
    return chips;
  }, [muscleGroup, category]);

  const getFiltered = useCallback((exercises: Exercise[]) => {
    const query = search.trim().toLowerCase();
    return exercises.filter(exercise => {
      const nameMatch = query.length === 0 || exercise.name.toLowerCase().includes(query);
      const muscleGroupMatch = muscleGroup === 'All' || exercise.muscleGroup === muscleGroup;
      const categoryMatch = category === 'All' || exercise.category === category;
      return nameMatch && muscleGroupMatch && categoryMatch;
    });
  }, [search, muscleGroup, category]);

  return {
    search,
    setSearch,
    muscleGroup,
    setMuscleGroup,
    category,
    setCategory,
    groupByBase,
    toggleGroup,
    reset,
    hasActiveFilters,
    activeChips,
    getFiltered,
  };
}
