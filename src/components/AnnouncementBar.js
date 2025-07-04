export default function AnnouncementBar() {
  return (
    <div className="bg-gray-900 text-amber-50 text-sm py-2 px-4 flex flex-col sm:flex-row justify-between items-center animate-pulse">
      <span className="font-semibold flex items-center gap-2">🛍️ PIECES YOU LOVE. PRICES YOU WANT. FIND YOUR STORE</span>
      <a href="#" className="underline ml-0 sm:ml-4 mt-2 sm:mt-0 font-bold text-amber-50 bg-amber-800 px-3 py-1 rounded shadow hover:bg-amber-900 transition">Store Locator</a>
    </div>
  );
} 