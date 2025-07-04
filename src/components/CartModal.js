import Image from 'next/image';
import { useCart } from '../context/CartContext';

export default function CartModal({ open, onClose }) {
  const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-2xl text-gray-400 hover:text-gray-700">×</button>
        <h2 className="text-xl font-bold mb-4 text-gray-900">Your Cart</h2>
        {cart.length === 0 ? (
          <div className="text-gray-500">Your cart is empty.</div>
        ) : (
          <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-3 border-b pb-2">
                <Image src={item.imageUrl || item.image} alt={item.name} width={56} height={56} className="w-14 h-14 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{item.name}</div>
                  <div className="text-xs text-amber-700">{item.category?.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="px-2 py-0.5 bg-gray-200 text-gray-900 border border-gray-400 rounded font-bold hover:bg-gray-300">-</button>
                    <span className="text-gray-900">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-0.5 bg-gray-200 text-gray-900 border border-gray-400 rounded font-bold hover:bg-gray-300">+</button>
                  </div>
                </div>
                <div className="font-bold text-amber-800">${(item.price * item.quantity).toFixed(2)}</div>
                <button onClick={() => removeFromCart(item.id)} className="ml-2 text-gray-400 hover:text-red-600 text-lg">×</button>
              </div>
            ))}
            <div className="flex justify-between items-center mt-4">
              <div className="font-bold text-lg text-gray-900">Total:</div>
              <div className="font-bold text-2xl text-amber-800">${total.toFixed(2)}</div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={clearCart} className="flex-1 bg-amber-700 text-white py-2 rounded-lg font-semibold hover:bg-amber-800 transition">Clear Cart</button>
              <button className="flex-1 bg-gray-900 text-amber-50 py-2 rounded-lg font-semibold hover:bg-gray-800 transition">Checkout</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 