"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!product) return <div className="p-8 text-center">Product not found.</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex flex-col md:flex-row max-w-4xl mx-auto bg-white rounded-xl shadow-md mt-6 md:mt-8 p-4 md:p-6 gap-4 md:gap-8">
        <img src={product.imageUrl} alt={product.name} className="w-full md:w-1/2 h-56 md:h-80 object-cover rounded-lg mb-4 md:mb-0" />
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="text-cyan-600 font-medium uppercase mb-1 md:mb-2 text-xs md:text-base">{product.category?.name}</div>
            <h1 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">{product.name}</h1>
            <div className="text-lg md:text-2xl font-bold text-cyan-700 mb-2 md:mb-4">${product.price.toFixed(2)}</div>
            <p className="text-gray-700 mb-4 md:mb-6 text-sm md:text-base">{product.description}</p>
          </div>
          <button className="bg-cyan-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold text-base md:text-lg hover:bg-cyan-700 transition w-full md:w-auto">
            Add to Cart
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
} 