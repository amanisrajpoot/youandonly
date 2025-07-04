import Image from 'next/image';

export default function HeroSection() {
  return (
    <div className="relative w-full h-[300px] md:h-[500px] flex items-center justify-center overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80"
        alt="Hero"
        fill
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
        priority
      />
      <div className="relative z-10 text-white text-center drop-shadow-lg px-2 md:px-0">
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-2 md:mb-4">We Are You&Only</h1>
        <p className="text-base sm:text-lg md:text-2xl mb-1 md:mb-2">At You&Only, There&apos;s Something For Everyone</p>
        <div className="text-base sm:text-xl font-semibold mt-2 md:mt-4">YOU&ONLY PRESENTS <span className="font-bold">New Collection</span></div>
        <button
          className="mt-6 px-6 py-2 bg-amber-700 text-white rounded-lg font-bold text-lg shadow hover:bg-amber-800 transition"
          onClick={() => {
            const el = document.querySelector('main');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Shop Now
        </button>
      </div>
      <div className="absolute inset-0 bg-black/30 z-5" />
    </div>
  );
} 