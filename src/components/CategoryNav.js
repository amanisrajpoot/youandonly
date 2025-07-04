export default function CategoryNav({ categories, selectedId, onSelect }) {
  return (
    <div className="flex gap-2">
      <button
        className={`px-3 py-1 rounded border font-semibold transition-colors ${!selectedId ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-white text-gray-800 border-gray-300 hover:bg-cyan-50'}`}
        onClick={() => onSelect(null)}
      >
        All
      </button>
      {categories.map(cat => (
        <button
          key={cat.id}
          className={`px-3 py-1 rounded border font-semibold transition-colors ${selectedId === cat.id ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-white text-gray-800 border-gray-300 hover:bg-cyan-50'}`}
          onClick={() => onSelect(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
} 