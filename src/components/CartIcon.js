import { useCart } from '../context/CartContext';

export default function CartIcon({ onClick }) {
  const { cart } = useCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <button onClick={onClick} className="relative p-2 rounded hover:bg-amber-50 transition">
      <span className="text-2xl">🛒</span>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
          {count}
        </span>
      )}
    </button>
  );
} 