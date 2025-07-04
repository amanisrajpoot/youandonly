import { useCart } from '../context/CartContext';

export default function CartModal({ open, onClose }) {
  const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-2xl text-gray-400 hover:text-gray-700">×</button>
        <h2 className="text-xl font-bold mb-4">Your Cart</h2>
        {cart.length === 0 ? (
          <div className="text-gray-500">Your cart is empty.</div>
        ) : (
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-3 border-b pb-2">
                <img src={item.imageUrl} alt={item.name} className="w-14 h-14 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-xs text-cyan-600">{item.category?.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="px-2 py-0.5 bg-gray-200 rounded">-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-0.5 bg-gray-200 rounded">+</button>
                  </div>
                </div>
                <div className="font-bold text-cyan-700">${(item.price * item.quantity).toFixed(2)}</div>
                <button onClick={() => removeFromCart(item.id)} className="ml-2 text-gray-400 hover:text-red-600 text-lg">×</button>
              </div>
            ))}
            <div className="flex justify-between items-center mt-4">
              <div className="font-bold text-lg">Total:</div>
              <div className="font-bold text-2xl text-cyan-700">${total.toFixed(2)}</div>
            </div>
            <button onClick={clearCart} className="w-full mt-4 bg-cyan-600 text-white py-2 rounded-lg font-semibold hover:bg-cyan-700 transition">Clear Cart</button>
          </div>
        )}
      </div>
    </div>
  );
} 