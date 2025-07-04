const placeholderImages = {
  Women: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=400&h=400',
  Men: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=facearea&w=400&h=400',
  Kids: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=400&h=400',
  Baby: 'https://images.unsplash.com/photo-1503457574465-494bba506e52?auto=format&fit=facearea&w=400&h=400',
  Home: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=facearea&w=400&h=400',
  Beauty: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=facearea&w=400&h=400',
};

export default function CategoryTiles({ categories, onSelect }) {
  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 py-6 sm:py-8">
      <div
        className={`flex flex-col items-center cursor-pointer group w-24 sm:w-32`}
        onClick={() => onSelect(null)}
      >
        <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-cyan-100 mb-2 border-2 border-cyan-300 group-hover:scale-105 transition-transform flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=facearea&w=400&h=400"
            alt="All"
            className="w-full h-full object-cover opacity-80"
          />
        </div>
        <div className="font-bold text-xs sm:text-lg uppercase tracking-wide text-center">All</div>
      </div>
      {categories.map(cat => (
        <div
          key={cat.id}
          className="flex flex-col items-center cursor-pointer group w-24 sm:w-32"
          onClick={() => onSelect(cat.id)}
        >
          <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-100 mb-2 border-2 border-gray-200 group-hover:scale-105 transition-transform">
            <img
              src={cat.imageUrl || placeholderImages[cat.name] || 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=facearea&w=400&h=400'}
              alt={cat.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="font-bold text-xs sm:text-lg uppercase tracking-wide text-center">{cat.name}</div>
        </div>
      ))}
    </div>
  );
} 