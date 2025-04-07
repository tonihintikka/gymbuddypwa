import { SetLog } from '../../../types/models';

interface LoggedSetsListProps {
  sets: SetLog[];
  onDeleteSet?: (index: number) => void;
}

export const LoggedSetsList = ({ 
  sets, 
  onDeleteSet 
}: LoggedSetsListProps) => {
  if (sets.length === 0) {
    return (
      <div className="no-sets">
        No sets logged yet. Log your first set!
      </div>
    );
  }

  return (
    <div className="logged-sets-list">
      <h4>Logged Sets</h4>
      <table className="sets-table">
        <thead>
          <tr>
            <th>Set</th>
            <th>Weight</th>
            <th>Reps</th>
            <th>Modifiers</th>
            {onDeleteSet && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {sets.map((set, index) => (
            <tr key={index} className="set-row">
              <td>{index + 1}</td>
              <td>{set.weight} kg</td>
              <td>{set.reps}</td>
              <td>
                {(set.isFailure || set.isPaused || set.isSlowEccentric) ? (
                  <div className="set-modifiers-list">
                    {set.isFailure && <span className="modifier failure">F</span>}
                    {set.isPaused && <span className="modifier paused">P</span>}
                    {set.isSlowEccentric && <span className="modifier slow">S</span>}
                  </div>
                ) : (
                  '-'
                )}
              </td>
              {onDeleteSet && (
                <td>
                  <button 
                    className="delete-set-btn"
                    onClick={() => onDeleteSet(index)}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
