export default function SetSelector({ current, onChange }) {
    const sets = ['JourneyTogether', 'TemporalForces', 'ObsidianFlames', 'PrismaticEvolutions'];
  
    return (
      <select
        value={current}
        onChange={(e) => onChange(e.target.value)}
        className="border p-1 rounded"
      >
        {sets.map(set => (
          <option key={set} value={set}>{set.replace(/([A-Z])/g, ' $1')}</option>
        ))}
      </select>
    );
  }
  