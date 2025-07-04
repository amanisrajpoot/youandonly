import Link from 'next/link';
import { useCart } from '../context/CartContext';
import Image from 'next/image';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  return (
    <div className="w-full">
      <Link href={`/product/${product.id}`} className="block">
        <div className="bg-stone-100 border border-gray-200 rounded-xl shadow-md p-3 sm:p-4 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-lg">
          <Image
            src={product.imageUrl || product.image}
            alt={product.name}
            width={256}
            height={256}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="font-semibold text-base sm:text-lg mb-1 text-gray-900 text-center">{product.name}</div>
          <div className="text-xs sm:text-sm mb-1 text-rose-400 font-medium uppercase tracking-wide">{product.category?.name}</div>
          <div className="font-bold text-lg sm:text-2xl text-amber-500 mt-1">${product.price.toFixed(2)}</div>
        </div>
      </Link>
      <button
        className="w-full mt-2 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-rose-400 hover:text-gray-900 transition"
        onClick={() => addToCart(product)}
      >
        Add to Cart
      </button>
    </div>
  );
} 