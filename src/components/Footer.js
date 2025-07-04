export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-700 mt-12 py-10 px-4 text-amber-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        <div>
          <div className="font-bold mb-2">HELP</div>
          <ul className="text-sm space-y-1">
            <li className="hover:underline cursor-pointer">Contact Us</li>
            <li className="hover:underline cursor-pointer">Help & FAQs</li>
            <li className="hover:underline cursor-pointer">Recalls</li>
            <li className="hover:underline cursor-pointer">Speak Up - Colleagues</li>
            <li className="hover:underline cursor-pointer">Tell Us - Supply Chain Workers & Third Parties</li>
          </ul>
        </div>
        <div>
          <div className="font-bold mb-2">USEFUL INFO</div>
          <ul className="text-sm space-y-1">
            <li className="hover:underline cursor-pointer">Terms of Use</li>
            <li className="hover:underline cursor-pointer">Primania Gallery Terms</li>
            <li className="hover:underline cursor-pointer">Privacy Notice</li>
            <li className="hover:underline cursor-pointer">Cookie Policy</li>
            <li className="hover:underline cursor-pointer">Franchise Scam</li>
            <li className="hover:underline cursor-pointer">Primark Size Charts</li>
            <li className="hover:underline cursor-pointer">Tell Primark Survey</li>
            <li className="hover:underline cursor-pointer">Sitemap</li>
          </ul>
        </div>
        <div>
          <div className="font-bold mb-2">INSIDE PRIMARK</div>
          <ul className="text-sm space-y-1">
            <li className="hover:underline cursor-pointer">Primark Careers</li>
            <li className="hover:underline cursor-pointer">Suppliers</li>
            <li className="hover:underline cursor-pointer">Cruelty Free International</li>
          </ul>
        </div>
        <div>
          <div className="font-bold mb-2">CORPORATE</div>
          <ul className="text-sm space-y-1">
            <li className="hover:underline cursor-pointer">About Us</li>
            <li className="hover:underline cursor-pointer">Ethics and sustainability</li>
            <li className="hover:underline cursor-pointer">Ethics and sustainability report 2022/2023</li>
            <li className="hover:underline cursor-pointer">Newsroom</li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
        <div className="flex gap-4 text-2xl">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition">🐦</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-rose-400 transition">📸</a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition">📘</a>
          <a href="mailto:info@youandonly.com" className="hover:text-amber-400 transition">✉️</a>
        </div>
        <div>
          <select className="border border-gray-600 rounded px-2 py-1 text-gray-900 bg-amber-50">
            <option>USA, $</option>
            <option>UK, £</option>
            <option>EU, €</option>
          </select>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} You&Only. All rights reserved.
      </div>
    </footer>
  );
} 