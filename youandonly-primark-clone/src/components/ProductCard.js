import Link from 'next/link';

export default function ProductCard({ product }) {
  return (
    <Link href={`/product/${product.id}`} className="w-full">
      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-3 sm:p-4 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-lg">
        <img src={product.imageUrl} alt={product.name} className="w-28 h-28 sm:w-40 sm:h-40 object-cover mb-2 sm:mb-3 rounded-lg" />
        <div className="font-semibold text-base sm:text-lg mb-1 text-gray-900 text-center">{product.name}</div>
        <div className="text-xs sm:text-sm mb-1 text-cyan-600 font-medium uppercase tracking-wide">{product.category?.name}</div>
        <div className="font-bold text-lg sm:text-2xl text-cyan-700 mt-1">${product.price.toFixed(2)}</div>
      </div>
    </Link>
  );
} 