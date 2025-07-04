"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useCart } from '../../../context/CartContext';
import Image from 'next/image';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [related, setRelated] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
        // Fetch related products
        if (data?.category_id) {
          fetch('/api/products')
            .then(res => res.json())
            .then(all => {
              setRelated(all.filter(p => p.category_id === data.category_id && p.id !== data.id).slice(0, 4));
            });
        }
      });
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!product) return <div className="p-8 text-center">Product not found.</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex flex-col md:flex-row max-w-4xl mx-auto bg-white rounded-xl shadow-md mt-6 md:mt-8 p-4 md:p-6 gap-4 md:gap-8">
        <div className="flex-1 flex flex-col items-center md:items-start">
          <Image src={product.imageUrl || product.image} alt={product.name} width={384} height={384} className="w-full md:w-96 h-56 md:h-96 object-cover rounded-lg mb-4 md:mb-6 shadow" />
          {/* Gallery placeholder: add more images if available */}
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="text-amber-700 font-medium uppercase mb-1 md:mb-2 text-xs md:text-base">{product.category?.name}</div>
            <h1 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">{product.name}</h1>
            <div className="text-lg md:text-2xl font-bold text-amber-800 mb-2 md:mb-4">${product.price.toFixed(2)}</div>
            <p className="text-gray-700 mb-4 md:mb-6 text-sm md:text-base">{product.description}</p>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-semibold">Quantity:</span>
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-2 py-1 bg-gray-200 rounded">-</button>
              <span className="px-2">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
            </div>
            <button
              className="bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-amber-800 transition w-full md:w-auto"
              onClick={() => addToCart(product, quantity)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </main>
      {/* Related products */}
      {related.length > 0 && (
        <section className="max-w-4xl mx-auto mt-8 mb-16 px-4">
          <h2 className="text-xl font-bold mb-4 text-amber-700">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map(rp => (
              <div
                key={rp.id}
                onClick={() => window.location.href = `/product/${rp.id}`}
                className="bg-white rounded-xl shadow p-3 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer hover:shadow-lg"
              >
                <Image src={rp.imageUrl || rp.image} alt={rp.name} width={96} height={96} className="w-24 h-24 object-cover rounded mb-2" />
                <div className="font-semibold text-base text-gray-900 text-center">{rp.name}</div>
                <div className="text-amber-800 font-semibold">${rp.price.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
} 