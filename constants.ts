
import type { ClothingItem } from './types';

export const FASHION_STYLES: string[] = [
  "Minimalist",
  "Streetwear",
  "Bohemian",
  "Cyberpunk",
  "Vintage",
  "Athleisure",
];

export const CLOTHING_CATALOG: ClothingItem[] = [
  { id: 1, name: "White Linen Shirt", category: "Top", imageUrl: "https://picsum.photos/seed/whitelinenshirt/400/600", price: 79.99, description: "A timeless, breathable linen shirt, perfect for warm days and effortless style. Features a classic collar and mother-of-pearl buttons." },
  { id: 2, name: "Black Graphic Tee", category: "Top", imageUrl: "https://picsum.photos/seed/blackgraphictee/400/600", price: 39.99, description: "A soft, 100% cotton tee with a bold, retro-futuristic graphic print. A staple for any streetwear enthusiast." },
  { id: 3, name: "Floral Print Blouse", category: "Top", imageUrl: "https://picsum.photos/seed/floralblouse/400/600", price: 69.99, description: "A lightweight, flowy blouse with a delicate floral pattern and tie-neck detail. Perfect for a bohemian-inspired look." },
  { id: 4, name: "Beige Turtleneck Sweater", category: "Top", imageUrl: "https://picsum.photos/seed/beigesweater/400/600", price: 89.99, description: "A cozy, finely-knit turtleneck sweater made from a soft merino wool blend. An essential layering piece." },
  { id: 5, name: "Cropped Hoodie", category: "Top", imageUrl: "https://picsum.photos/seed/croppedhoodie/400/600", price: 64.99, description: "A stylish cropped hoodie in a heavy fleece-back cotton. Features a raw hem and an oversized fit for maximum comfort." },
  
  { id: 6, name: "Slim-fit Black Jeans", category: "Bottom", imageUrl: "https://picsum.photos/seed/blackjeans/400/600", price: 119.99, description: "Classic five-pocket slim-fit jeans in a stretch denim fabric that holds its shape. A versatile must-have for any wardrobe." },
  { id: 7, name: "Cargo Pants", category: "Bottom", imageUrl: "https://picsum.photos/seed/cargopants/400/600", price: 99.99, description: "Utilitarian cargo pants crafted from durable ripstop cotton with multiple pockets for a functional, street-ready look." },
  { id: 8, name: "Flowy Maxi Skirt", category: "Bottom", imageUrl: "https://picsum.photos/seed/maxiskirt/400/600", price: 84.99, description: "An ethereal, tiered maxi skirt in a lightweight fabric that moves beautifully with every step. Features a comfortable elastic waistband." },
  { id: 9, name: "High-Waisted Trousers", category: "Bottom", imageUrl: "https://picsum.photos/seed/trousers/400/600", price: 109.99, description: "Elegant high-waisted trousers with a wide-leg silhouette and a clean, pleat-front design. Tailored for a sophisticated look." },
  { id: 10, name: "Denim Cutoff Shorts", category: "Bottom", imageUrl: "https://picsum.photos/seed/denimshorts/400/600", price: 59.99, description: "Vintage-inspired denim shorts with a high-rise waist and frayed, cutoff hems for a perfectly worn-in feel." },

  { id: 11, name: "Classic White Sneakers", category: "Shoes", imageUrl: "https://picsum.photos/seed/whitesneakers/400/600", price: 129.99, description: "Minimalist low-top sneakers crafted from premium leather. Their clean design makes them incredibly versatile." },
  { id: 12, name: "Chunky Black Boots", category: "Shoes", imageUrl: "https://picsum.photos/seed/blackboots/400/600", price: 179.99, description: "Bold combat-style boots with a chunky lug sole and side-zip closure. Made from durable vegan leather." },
  { id: 13, name: "Leather Ankle Boots", category: "Shoes", imageUrl: "https://picsum.photos/seed/ankelboots/400/600", price: 199.99, description: "Sleek, heeled ankle boots in genuine leather with a pointed toe and a sculptural block heel. A timeless and elegant choice." },
  { id: 14, name: "Strappy Sandals", category: "Shoes", imageUrl: "https://picsum.photos/seed/sandals/400/600", price: 79.99, description: "Delicate strappy sandals with a low, comfortable heel and an adjustable ankle strap. Ideal for summer events." },
  { id: 15, name: "High-Top Sneakers", category: "Shoes", imageUrl: "https://picsum.photos/seed/hightops/400/600", price: 149.99, description: "Iconic canvas high-top sneakers with a retro design. Features a cushioned insole for all-day comfort." },
  
  { id: 16, name: "Silver Chain Necklace", category: "Accessory", imageUrl: "https://picsum.photos/seed/silvernecklace/400/600", price: 49.99, description: "A sterling silver chain necklace with a minimalist design. Perfect for layering or wearing on its own." },
  { id: 17, name: "Leather Belt", category: "Accessory", imageUrl: "https://picsum.photos/seed/leatherbelt/400/600", price: 54.99, description: "A classic leather belt with a polished silver-tone buckle. An essential accessory to complete any outfit." },
  { id: 18, name: "Beanie Hat", category: "Accessory", imageUrl: "https://picsum.photos/seed/beanie/400/600", price: 29.99, description: "A soft, ribbed-knit beanie hat designed for a snug and comfortable fit. Perfect for cooler weather." },
  { id: 19, name: "Round Sunglasses", category: "Accessory", imageUrl: "https://picsum.photos/seed/sunglasses/400/600", price: 69.99, description: "Vintage-style round sunglasses with a thin metal frame and 100% UV protection lenses." },
  { id: 20, name: "Canvas Tote Bag", category: "Accessory", imageUrl: "https://picsum.photos/seed/totebag/400/600", price: 44.99, description: "A durable and spacious canvas tote bag, perfect for everyday use. Features an internal pocket for organization." },

  { id: 21, name: "Leather Biker Jacket", category: "Outerwear", imageUrl: "https://picsum.photos/seed/bikerjacket/400/600", price: 299.99, description: "An iconic biker jacket crafted from supple genuine leather, featuring asymmetrical zip details and silver-tone hardware." },
  { id: 22, name: "Oversized Denim Jacket", category: "Outerwear", imageUrl: "https://picsum.photos/seed/denimjacket/400/600", price: 129.99, description: "A perfectly oversized denim jacket in a light wash with a relaxed, borrowed-from-the-boys fit." },
  { id: 23, name: "Long Trench Coat", category: "Outerwear", imageUrl: "https://picsum.photos/seed/trenchcoat/400/600", price: 249.99, description: "A timeless, double-breasted trench coat made from a water-resistant cotton blend. Features a waist belt for a defined silhouette." },
  { id: 24, name: "Techwear Windbreaker", category: "Outerwear", imageUrl: "https://picsum.photos/seed/windbreaker/400/600", price: 179.99, description: "A lightweight, water-repellent windbreaker with sealed seams, adjustable hood, and multiple utility pockets. Designed for the urban explorer." },
];
