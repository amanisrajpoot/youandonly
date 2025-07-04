export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t mt-12 py-10 px-4 text-gray-100">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        <div>
          <div className="font-bold mb-2">HELP</div>
          <ul className="text-sm space-y-1">
            <li>Contact Us</li>
            <li>Help & FAQs</li>
            <li>Recalls</li>
            <li>Speak Up - Colleagues</li>
            <li>Tell Us - Supply Chain Workers & Third Parties</li>
          </ul>
        </div>
        <div>
          <div className="font-bold mb-2">USEFUL INFO</div>
          <ul className="text-sm space-y-1">
            <li>Terms of Use</li>
            <li>Primania Gallery Terms</li>
            <li>Privacy Notice</li>
            <li>Cookie Policy</li>
            <li>Franchise Scam</li>
            <li>Primark Size Charts</li>
            <li>Tell Primark Survey</li>
            <li>Sitemap</li>
          </ul>
        </div>
        <div>
          <div className="font-bold mb-2">INSIDE PRIMARK</div>
          <ul className="text-sm space-y-1">
            <li>Primark Careers</li>
            <li>Suppliers</li>
            <li>Cruelty Free International</li>
          </ul>
        </div>
        <div>
          <div className="font-bold mb-2">CORPORATE</div>
          <ul className="text-sm space-y-1">
            <li>About Us</li>
            <li>Ethics and sustainability</li>
            <li>Ethics and sustainability report 2022/2023</li>
            <li>Newsroom</li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
        <div className="flex gap-4 text-2xl">
          <span>🌎</span>
          <span>📌</span>
          <span>📷</span>
          <span>📘</span>
          <span>📸</span>
          <span>▶️</span>
          <span>🎵</span>
        </div>
        <div>
          <select className="border rounded px-2 py-1 text-gray-900">
            <option>USA, $</option>
            <option>UK, £</option>
            <option>EU, €</option>
          </select>
        </div>
      </div>
    </footer>
  );
} 