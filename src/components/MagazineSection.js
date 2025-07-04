import React from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';

export default function MagazineSection({
  type = 'poster', // poster, grid, horizontal, editorial, vertical-stack, trending-2col, split, masonry, carousel, fullwidth-carousel, contained-carousel
  title,
  blurb,
  poster,
  products = [],
  background = '',
  highlight = '',
  editorsNote = '',
  onBannerClick,
  badge = '',
  playful = false,
  children,
}) {
  const { addToCart } = useCart();
  const router = useRouter();

  // Helper for Add to Cart button
  function AddToCartBtn({ product }) {
    return (
      <button
        className="mt-2 bg-gray-900 text-rose-400 rounded-lg font-semibold py-1.5 px-4 text-sm hover:bg-rose-400 transition shadow min-w-[110px] max-w-[140px]"
        onClick={e => { e.stopPropagation(); e.preventDefault(); addToCart(product); }}
      >
        Add to Cart
      </button>
    );
  }

  // Layout: Full-bleed poster with creative overlays and featured products
  if (type === 'poster') {
    return (
      <section className="w-full my-12 cursor-pointer group" onClick={onBannerClick}>
        <div className="relative w-full h-[340px] md:h-[440px] flex items-center justify-center overflow-hidden rounded-2xl shadow-lg transition-transform group-hover:scale-[1.01]" style={{ background }}>
          <img src={poster} alt={title} className="absolute inset-0 w-full h-full object-cover object-center z-0 group-hover:scale-105 transition-transform duration-500" />
          {/* Creative overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-gray-900/30 to-black/60 z-10 group-hover:bg-black/60 transition-colors duration-300" />
          <div className="absolute top-6 left-6 z-20">
            {badge && <span className="bg-rose-400 text-white px-4 py-1 rounded-full font-bold text-base shadow-lg animate-bounce-slow">{badge}</span>}
          </div>
          {/* Geometric shape */}
          <div className="absolute right-0 bottom-0 w-40 h-40 bg-gray-200/30 rounded-tl-full z-10 blur-2xl animate-float" />
          <div className="relative z-20 text-white text-center drop-shadow-lg px-4 md:px-0 flex flex-col items-center justify-center w-full h-full">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-2 md:mb-4 animate-fade-in">{title}</h2>
            {blurb && <p className="text-lg md:text-2xl font-medium mb-2 md:mb-4 max-w-2xl mx-auto animate-fade-in delay-100">{blurb}</p>}
            {highlight && <span className="inline-block bg-rose-400 text-white px-4 py-1 rounded-full font-bold text-base md:text-lg mt-2 animate-fade-in delay-200">{highlight}</span>}
            {products.length > 0 && (
              <div className="flex gap-6 mt-6 justify-center animate-fade-in delay-300">
                {products.slice(0, 3).map(product => (
                  <div
                    key={product.id}
                    onClick={() => router.push(`/product/${product.id}`)}
                    className="bg-white/90 hover:bg-white transition-colors rounded-xl shadow-lg p-3 flex flex-col items-center min-w-[120px] max-w-[140px] group/product hover:scale-105 cursor-pointer hover:shadow-lg"
                  >
                    <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded mb-2 border-2 border-gray-200 group-hover/product:border-rose-600 transition-colors" />
                    <div className="font-bold text-base text-gray-900 text-center mb-1">{product.name}</div>
                    <div className="text-rose-700 font-semibold mb-2">${product.price.toFixed(2)}</div>
                    <AddToCartBtn product={product} />
                  </div>
                ))}
              </div>
            )}
            {children}
          </div>
        </div>
      </section>
    );
  }

  // Layout: Split (image left, products right)
  if (type === 'split') {
    return (
      <section className="max-w-6xl mx-auto my-12 rounded-2xl overflow-hidden shadow-lg bg-white flex flex-col md:flex-row">
        <div className="md:w-1/2 relative min-h-[320px] flex items-center justify-center bg-gray-50">
          <img src={poster} alt={title} className="w-full h-full object-cover object-center min-h-[320px]" />
          {badge && <span className="absolute top-6 left-6 bg-rose-400 text-white px-4 py-1 rounded-full font-bold text-base shadow-lg animate-bounce-slow">{badge}</span>}
        </div>
        <div className="md:w-1/2 p-8 flex flex-col gap-6 justify-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{title}</h2>
          {blurb && <p className="text-lg text-gray-700 mb-2">{blurb}</p>}
          <div className="flex flex-col gap-4">
            {products.map(product => (
              <div
                key={product.id}
                onClick={() => router.push(`/product/${product.id}`)}
                className="flex items-center gap-4 bg-white rounded-xl shadow p-3 hover:scale-105 transition-transform cursor-pointer hover:shadow-lg"
              >
                <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-bold text-lg text-gray-900">{product.name}</div>
                  <div className="text-rose-700 font-semibold">${product.price.toFixed(2)}</div>
                </div>
                <AddToCartBtn product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Layout: Masonry (staggered grid)
  if (type === 'masonry') {
    return (
      <section className="max-w-6xl mx-auto my-12">
        <h2 className="text-3xl font-extrabold mb-4 text-gray-900 text-center">{title}</h2>
        {blurb && <p className="mb-4 text-lg text-gray-700 text-center">{blurb}</p>}
        <div className="columns-1 sm:columns-2 md:columns-3 gap-4 [column-fill:_balance]"><div className="flex flex-col gap-4">
          {products.map(product => (
            <div
              key={product.id}
              onClick={() => router.push(`/product/${product.id}`)}
              className="block bg-white rounded-xl shadow p-3 mb-4 hover:scale-105 transition-transform break-inside-avoid cursor-pointer hover:shadow-lg"
            >
              <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded mb-2" />
              <div className="font-bold text-base text-gray-900 text-center">{product.name}</div>
              <div className="text-rose-700 font-semibold text-center">${product.price.toFixed(2)}</div>
              <AddToCartBtn product={product} />
            </div>
          ))}
        </div></div>
      </section>
    );
  }

  // Layout: Carousel (horizontal slider with sticky blurb, playful for Kids)
  if (type === 'carousel') {
    return (
      <section className="max-w-6xl mx-auto my-12 flex flex-col md:flex-row items-stretch gap-8">
        <div className="md:w-1/3 flex flex-col justify-center bg-gray-50 rounded-2xl p-8 sticky top-24 h-fit self-start">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{title}</h2>
          {blurb && <p className="text-lg text-gray-700 mb-2">{blurb}</p>}
          {badge && <span className="bg-rose-400 text-white px-4 py-1 rounded-full font-bold text-base shadow-lg mt-4">{badge}</span>}
        </div>
        <div className="md:w-2/3 flex overflow-x-auto gap-6 pb-4">
          {products.map((product, idx) => (
            <div
              key={product.id}
              onClick={() => router.push(`/product/${product.id}`)}
              className={`min-w-[220px] rounded-xl shadow p-4 flex flex-col items-center hover:scale-105 transition-transform ${playful ? 'bg-gradient-to-br from-amber-100 via-pink-100 to-gray-100 border-2 border-pink-200 relative' : 'bg-white'} cursor-pointer hover:shadow-lg`}
            >
              <img src={product.imageUrl} alt={product.name} className="w-32 h-32 object-cover rounded mb-2" />
              {playful && <span className="absolute top-2 right-2 text-2xl">{['🦄','🎈','🧸','🎉','🚀','🐻','🌈','🦕'][idx%8]}</span>}
              <div className="font-bold text-lg text-gray-900 text-center">{product.name}</div>
              <div className="text-rose-700 font-semibold">${product.price.toFixed(2)}</div>
              <AddToCartBtn product={product} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Layout: Grid of products with a side poster (max-w-6xl)
  if (type === 'grid') {
    return (
      <section className="max-w-6xl mx-auto my-12 rounded-2xl overflow-hidden shadow-lg bg-white">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 relative min-h-[250px]">
            <img src={poster} alt={title} className="w-full h-full object-cover object-center min-h-[250px]" />
            <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-6">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow mb-2">{title}</h2>
              {blurb && <p className="text-white text-base font-medium drop-shadow mb-2">{blurb}</p>}
            </div>
          </div>
          <div className="md:w-2/3 p-6 flex flex-col gap-4 bg-gray-50">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {products.map(product => (
                <div
                  key={product.id}
                  onClick={() => router.push(`/product/${product.id}`)}
                  className="bg-white rounded-xl shadow p-3 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer hover:shadow-lg"
                >
                  <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-cover rounded mb-2" />
                  <div className="font-bold text-base text-gray-900 text-center">{product.name}</div>
                  <div className="text-rose-700 font-semibold">${product.price.toFixed(2)}</div>
                  <AddToCartBtn product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Layout: Horizontal scroll of products (full width)
  if (type === 'horizontal') {
    return (
      <section className="w-full my-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-extrabold mb-4 text-gray-900">{title}</h2>
          {blurb && <p className="mb-4 text-lg text-gray-700">{blurb}</p>}
          <div className="flex gap-6 overflow-x-auto pb-4">
            {products.map(product => (
              <div
                key={product.id}
                onClick={() => router.push(`/product/${product.id}`)}
                className="min-w-[180px] bg-white rounded-xl shadow p-3 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer hover:shadow-lg"
              >
                <img src={product.imageUrl} alt={product.name} className="w-24 h-24 object-cover rounded mb-2" />
                <div className="font-bold text-base text-gray-900 text-center">{product.name}</div>
                <div className="text-rose-700 font-semibold">${product.price.toFixed(2)}</div>
                <AddToCartBtn product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Layout: Editorial/Promo (max-w-6xl, multi-product horizontal scroll, editor's note)
  if (type === 'editorial') {
    return (
      <section className="max-w-6xl mx-auto my-12">
        <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center">
          <h2 className="text-3xl font-extrabold mb-2 text-gray-800">{title}</h2>
          {blurb && <p className="mb-4 text-lg text-gray-700">{blurb}</p>}
          {editorsNote && <div className="italic text-gray-900 mb-4">{editorsNote}</div>}
          <div className="flex gap-6 overflow-x-auto pb-4 w-full justify-center">
            {products.map(product => (
              <div
                key={product.id}
                onClick={() => router.push(`/product/${product.id}`)}
                className="min-w-[180px] bg-white rounded-xl shadow p-3 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer hover:shadow-lg"
              >
                <img src={product.imageUrl} alt={product.name} className="w-24 h-24 object-cover rounded mb-2" />
                <div className="font-bold text-base text-gray-900 text-center">{product.name}</div>
                <div className="text-rose-700 font-semibold">${product.price.toFixed(2)}</div>
                <AddToCartBtn product={product} />
              </div>
            ))}
          </div>
          {children}
        </div>
      </section>
    );
  }

  // Layout: Vertical stack of large product cards (max-w-6xl, 3-column grid for Kids)
  if (type === 'vertical-stack') {
    return (
      <section className="max-w-6xl mx-auto my-12">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-extrabold text-gray-900">{title}</h2>
          {blurb && <p className="text-lg text-gray-700 mt-2">{blurb}</p>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map(product => (
            <div
              key={product.id}
              onClick={() => router.push(`/product/${product.id}`)}
              className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-6 gap-4 hover:scale-[1.01] transition-transform cursor-pointer hover:shadow-lg"
            >
              <img src={product.imageUrl} alt={product.name} className="w-32 h-32 object-cover rounded-xl mb-2" />
              <div className="font-bold text-xl text-gray-900 mb-1">{product.name}</div>
              <div className="text-rose-700 font-semibold text-lg mb-1">${product.price.toFixed(2)}</div>
              <div className="text-gray-700 text-base text-center">{product.description}</div>
              <AddToCartBtn product={product} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Layout: Trending 2-column grid
  if (type === 'trending-2col') {
    return (
      <section className="max-w-6xl mx-auto my-12">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-extrabold text-gray-900">{title}</h2>
          {blurb && <p className="text-lg text-gray-700 mt-2">{blurb}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map(product => (
            <div
              key={product.id}
              onClick={() => router.push(`/product/${product.id}`)}
              className="flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-lg p-6 gap-6 hover:scale-[1.01] transition-transform cursor-pointer hover:shadow-lg"
            >
              <img src={product.imageUrl} alt={product.name} className="w-40 h-40 object-cover rounded-xl mb-4 md:mb-0" />
              <div className="flex-1 flex flex-col items-center md:items-start">
                <div className="font-bold text-2xl text-gray-900 mb-2">{product.name}</div>
                <div className="text-rose-700 font-semibold text-xl mb-2">${product.price.toFixed(2)}</div>
                <div className="text-gray-700 text-base mb-2 text-center md:text-left">{product.description}</div>
                <AddToCartBtn product={product} />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Layout: Full-width carousel with heading top left
  if (type === 'fullwidth-carousel') {
    return (
      <section className="w-full my-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start mb-4 px-2 md:px-0">
          <div className="flex-1 text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{title}</h2>
            {blurb && <p className="text-lg text-gray-700 mb-2">{blurb}</p>}
          </div>
          {badge && <span className="bg-rose-400 text-white px-4 py-1 rounded-full font-bold text-base shadow-lg ml-4">{badge}</span>}
        </div>
        <div className="w-full overflow-x-auto pb-4 flex gap-6 px-2 md:px-0">
          {products.map(product => (
            <div
              key={product.id}
              onClick={() => router.push(`/product/${product.id}`)}
              className="min-w-[220px] bg-white rounded-xl shadow p-4 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer hover:shadow-lg"
            >
              <img src={product.imageUrl} alt={product.name} className="w-32 h-32 object-cover rounded mb-2" />
              <div className="font-bold text-lg text-gray-900 text-center">{product.name}</div>
              <div className="text-rose-700 font-semibold">${product.price.toFixed(2)}</div>
              <AddToCartBtn product={product} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Layout: Contained carousel (max-w-6xl, heading top left, horizontal scroll area visually contained)
  if (type === 'contained-carousel') {
    return (
      <section className="max-w-6xl mx-auto my-12">
        <div className="flex flex-col md:flex-row items-center md:items-start mb-4 px-2 md:px-0">
          <div className="flex-1 text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{title}</h2>
            {blurb && <p className="text-lg text-gray-700 mb-2">{blurb}</p>}
          </div>
          {badge && <span className="bg-rose-400 text-white px-4 py-1 rounded-full font-bold text-base shadow-lg ml-4">{badge}</span>}
        </div>
        <div className="w-full overflow-x-auto pb-4 flex gap-6 px-2 md:px-0">
          {products.map(product => (
            <div
              key={product.id}
              onClick={() => router.push(`/product/${product.id}`)}
              className="min-w-[220px] bg-white rounded-xl shadow p-4 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer hover:shadow-lg"
            >
              <img src={product.imageUrl} alt={product.name} className="w-32 h-32 object-cover rounded mb-2" />
              <div className="font-bold text-lg text-gray-900 text-center">{product.name}</div>
              <div className="text-rose-700 font-semibold">${product.price.toFixed(2)}</div>
              <AddToCartBtn product={product} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Default fallback
  return <section className="my-12">{children}</section>;
} 