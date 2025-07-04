"use client";
import { useEffect, useState } from 'react';
import AnnouncementBar from '../components/AnnouncementBar';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';
import MagazineSection from '../components/MagazineSection';

const categoryBlurbs = {
  Women: "Discover the latest trends and timeless classics for every woman.",
  Men: "Style and comfort for every man, from casual to formal.",
  Kids: "Fun, colorful, and durable fashion for kids of all ages.",
  Accessories: "Complete your look with our curated accessories collection.",
};
const categoryPosters = {
  Women: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=800&h=400",
  Men: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=facearea&w=800&h=400",
  Kids: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=800&h=400",
  Accessories: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80",
};

const editorialPosters = [
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
];

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  // Helper: get products by category name
  const getProducts = (catName, count = 4) => {
    const cat = categories.find(c => c.name === catName);
    if (!cat) return [];
    return products.filter(p => p.categoryId === cat.id).slice(0, count);
  };
  // Helper: get hot sellers (top 4 by price for demo)
  const getHotSellers = () => {
    return [...products].sort((a, b) => b.price - a.price).slice(0, 4);
  };
  // Helper: get trending (random 4)
  const getTrending = () => {
    return [...products].sort(() => 0.5 - Math.random()).slice(0, 4);
  };
  // Helper: get editor's choice (first product)
  const getEditorsChoice = () => {
    return products.length > 0 ? [products[0]] : [];
  };

  // Compose all sections in a fixed order (Hot Sellers first, then the rest in a chosen order)
  const sections = [
    // 1. Hot Sellers (Horizontal)
    {
      type: 'horizontal',
      title: 'Hot Sellers',
      blurb: 'Our most popular picks, loved by everyone.',
      products: getHotSellers(),
    },
    // 2. Seasonal Picks (Split)
    {
      type: 'split',
      title: 'Seasonal Picks',
      blurb: 'Curated for the season: must-haves and essentials.',
      poster: editorialPosters[0],
      products: getTrending(),
      badge: 'Seasonal',
    },
    // 3. Men (Masonry)
    {
      type: 'masonry',
      title: 'Men',
      blurb: categoryBlurbs.Men,
      products: getProducts('Men', 6),
      badge: 'Modern Looks',
    },
    // 4. Kids (Playful Carousel)
    {
      type: 'carousel',
      title: 'Kids',
      blurb: categoryBlurbs.Kids,
      products: getProducts('Kids', 4),
      badge: 'Fun & Playful',
      playful: true,
    },
    // 5. Women (Editorial)
    {
      type: 'editorial',
      title: 'Women',
      blurb: categoryBlurbs.Women,
      products: getProducts('Women', 4),
      editorsNote: 'Our favorite picks for her. Style, comfort, and confidence.',
      badge: 'Editor\'s Pick',
    },
    // 6. Accessories (Carousel)
    {
      type: 'carousel',
      title: 'Accessories',
      blurb: categoryBlurbs.Accessories,
      products: getProducts('Accessories', 8),
      badge: 'Shop the Look',
    },
    // 7. Trending Now (2-column)
    {
      type: 'trending-2col',
      title: 'Trending Now',
      blurb: "What's trending this week.",
      products: getTrending(),
    },
    // 8. Discover More (Contained Carousel)
    {
      type: 'contained-carousel',
      title: 'Discover More',
      blurb: 'Keep scrolling for more inspiration and exclusive finds.',
      products: getTrending().concat(getHotSellers()),
      badge: 'Scroll →',
    },
  ];

  return (
    <div className="bg-[#f7f7fa] min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <HeroSection />
      <main className="pt-8 pb-16">
        {loading ? (
          <div className="text-center text-lg py-12">Loading magazine...</div>
        ) : (
          sections.map((section, idx) => (
            <MagazineSection key={idx} {...section} />
          ))
        )}
      </main>
      <Footer />
    </div>
  );
} 