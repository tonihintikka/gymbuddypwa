import { useState } from 'react';
import { Exercise, MuscleGroup, ExerciseCategory } from '../../../types/models';
import '../../exercise/components/Exercise.css';

interface AddExerciseToWorkoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  exercises: Exercise[];
  onAddExercise: (exerciseId: string) => void;
}

export const AddExerciseToWorkoutDialog = ({
  isOpen,
  onClose,
  exercises,
  onAddExercise
}: AddExerciseToWorkoutDialogProps) => {
  const [filter, setFilter] = useState('');
  const [muscleGroupFilter, setMuscleGroupFilter] = useState<MuscleGroup | 'All'>('All');
  const [categoryFilter, setCategoryFilter] = useState<ExerciseCategory | 'All'>('All');
  const [groupByName, setGroupByName] = useState(false);
  
  if (!isOpen) return null;
  
  // Filter exercises based on search input and filters
  const filteredExercises = exercises.filter(exercise => {
    const nameMatch = exercise.name.toLowerCase().includes(filter.toLowerCase());
    const muscleGroupMatch = muscleGroupFilter === 'All' || exercise.muscleGroup === muscleGroupFilter;
    const categoryMatch = categoryFilter === 'All' || exercise.category === categoryFilter;
    return nameMatch && muscleGroupMatch && categoryMatch;
  });

  // Group exercises if requested
  const groupedExercises = filteredExercises.reduce((acc, exercise) => {
    const key = groupByName ? exercise.baseExercise || exercise.name : exercise.id;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(exercise);
    return acc;
  }, {} as Record<string, Exercise[]>);

  // Get unique muscle groups and categories for filter options
  const availableMuscleGroups = Array.from(new Set(exercises.map(e => e.muscleGroup).filter(Boolean))) as MuscleGroup[];
  const availableCategories = Array.from(new Set(exercises.map(e => e.category).filter(Boolean))) as ExerciseCategory[];
  
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="dialog-overlay" onClick={handleBackdropClick}>
      <div className="dialog-content">
        <div className="dialog-header">
          <h2>Add Exercise to Workout</h2>
        </div>
        
        <div className="dialog-body">
          <div className="exercise-filters">
            <div className="search-section">
              <input
                type="text"
                placeholder="Search exercises..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                autoFocus
                className="search-input"
              />
            </div>
            
            <div className="filter-section">
              <div className="filter-group">
                <label className="filter-label">Muscle Group</label>
                <select
                  value={muscleGroupFilter}
                  onChange={(e) => setMuscleGroupFilter(e.target.value as MuscleGroup | 'All')}
                  className="filter-select"
                >
                  <option value="All">All Muscle Groups</option>
                  {availableMuscleGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label className="filter-label">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as ExerciseCategory | 'All')}
                  className="filter-select"
                >
                  <option value="All">All Categories</option>
                  {availableCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="options-section">
              <label className="group-toggle">
                <input
                  type="checkbox"
                  checked={groupByName}
                  onChange={(e) => setGroupByName(e.target.checked)}
                />
                <span className="toggle-text">Group by exercise type</span>
              </label>
            </div>
          </div>
          
          {filteredExercises.length === 0 ? (
            <div className="no-exercises">
              {filter || muscleGroupFilter !== 'All' || categoryFilter !== 'All' ? 
                'No exercises found matching the selected filters.' : 
                'No exercises available.'}
            </div>
          ) : groupByName ? (
            <div className="grouped-exercise-list">
              {Object.entries(groupedExercises).map(([groupName, groupExercises]) => (
                <div key={groupName} className="exercise-group">
                  <h4 className="group-name">{groupName}</h4>
                  <ul className="exercise-list">
                    {groupExercises.map(exercise => (
                      <li 
                        key={exercise.id} 
                        className={`exercise-item ${exercise.isCustom ? 'custom' : ''}`}
                        onClick={() => {
                          onAddExercise(exercise.id);
                          onClose();
                        }}
                      >
                        <div className="exercise-content">
                          <h3 className="exercise-name">{exercise.name}</h3>
                          <div className="exercise-meta">
                            {exercise.muscleGroup && (
                              <span className="muscle-group-badge">{exercise.muscleGroup}</span>
                            )}
                            {exercise.category && (
                              <span className="category-badge">{exercise.category}</span>
                            )}
                            {exercise.isCustom && (
                              <span className="custom-badge">Custom</span>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <ul className="exercise-list">
              {filteredExercises.map(exercise => (
                <li 
                  key={exercise.id} 
                  className={`exercise-item ${exercise.isCustom ? 'custom' : ''}`}
                  onClick={() => {
                    onAddExercise(exercise.id);
                    onClose();
                  }}
                >
                  <div className="exercise-content">
                    <h3 className="exercise-name">{exercise.name}</h3>
                    <div className="exercise-meta">
                      {exercise.muscleGroup && (
                        <span className="muscle-group-badge">{exercise.muscleGroup}</span>
                      )}
                      {exercise.category && (
                        <span className="category-badge">{exercise.category}</span>
                      )}
                      {exercise.isCustom && (
                        <span className="custom-badge">Custom</span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="dialog-actions">
          <button 
            className="secondary"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
