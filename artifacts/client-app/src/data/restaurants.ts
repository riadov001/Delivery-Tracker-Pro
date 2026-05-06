export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  popular?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  category: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  deliveryMinutes: number;
  deliveryFee: number;
  minOrder: number;
  gradient: string;
  emoji: string;
  description: string;
  menu: MenuItem[];
  promoted?: boolean;
  isNew?: boolean;
  freeDelivery?: boolean;
}

export const CATEGORIES = [
  { id: "all", label: "All", emoji: "🍽️" },
  { id: "burgers", label: "Burgers", emoji: "🍔" },
  { id: "pizza", label: "Pizza", emoji: "🍕" },
  { id: "sushi", label: "Sushi", emoji: "🍣" },
  { id: "chicken", label: "Chicken", emoji: "🍗" },
  { id: "healthy", label: "Healthy", emoji: "🥗" },
  { id: "desserts", label: "Desserts", emoji: "🍰" },
  { id: "coffee", label: "Coffee", emoji: "☕" },
  { id: "pasta", label: "Pasta", emoji: "🍝" },
];

export const RESTAURANTS: Restaurant[] = [
  {
    id: "1",
    name: "Burger Palace",
    category: "burgers",
    tags: ["Burgers", "American"],
    rating: 4.8,
    reviewCount: 1240,
    deliveryMinutes: 25,
    deliveryFee: 0,
    minOrder: 12,
    gradient: "from-[#D4006A] to-[#FF4D9E]",
    emoji: "🍔",
    description: "Premium smash burgers with house-made sauces",
    freeDelivery: true,
    promoted: true,
    menu: [
      { id: "m1", name: "Classic Smash Burger", description: "Double smash patty, cheddar, pickles, special sauce", price: 12.99, category: "Burgers", popular: true },
      { id: "m2", name: "Spicy Inferno Burger", description: "Jalapeño patty, pepper jack, sriracha aioli", price: 13.99, category: "Burgers", popular: true },
      { id: "m3", name: "Mushroom Swiss Burger", description: "Beef patty, sautéed mushrooms, Swiss cheese", price: 13.49, category: "Burgers" },
      { id: "m4", name: "BBQ Bacon Stack", description: "Double patty, crispy bacon, BBQ sauce, onion rings", price: 15.99, category: "Burgers" },
      { id: "m5", name: "Crispy Fries", description: "Hand-cut fries with sea salt", price: 4.99, category: "Sides" },
      { id: "m6", name: "Onion Rings", description: "Beer-battered rings with ranch", price: 5.49, category: "Sides" },
      { id: "m7", name: "Vanilla Milkshake", description: "Thick & creamy hand-spun shake", price: 6.99, category: "Drinks" },
      { id: "m8", name: "Chocolate Shake", description: "Rich Belgian chocolate shake", price: 6.99, category: "Drinks" },
    ],
  },
  {
    id: "2",
    name: "Sakura Sushi",
    category: "sushi",
    tags: ["Sushi", "Japanese"],
    rating: 4.9,
    reviewCount: 876,
    deliveryMinutes: 35,
    deliveryFee: 1.99,
    minOrder: 20,
    gradient: "from-[#00B8B8] to-[#00D4D4]",
    emoji: "🍣",
    description: "Authentic Japanese sushi & rolls, crafted daily",
    isNew: false,
    menu: [
      { id: "s1", name: "Salmon Nigiri (2pcs)", description: "Fresh Atlantic salmon over seasoned rice", price: 7.99, category: "Nigiri", popular: true },
      { id: "s2", name: "Dragon Roll", description: "Shrimp tempura, avocado, cucumber topped with tuna", price: 16.99, category: "Rolls", popular: true },
      { id: "s3", name: "Rainbow Roll", description: "California roll topped with assorted sashimi", price: 17.99, category: "Rolls" },
      { id: "s4", name: "Spicy Tuna Roll", description: "Spicy tuna, cucumber, sesame", price: 13.99, category: "Rolls" },
      { id: "s5", name: "Edamame", description: "Steamed salted soybeans", price: 5.99, category: "Starters" },
      { id: "s6", name: "Miso Soup", description: "Traditional dashi broth with tofu", price: 3.99, category: "Starters" },
      { id: "s7", name: "Green Tea Ice Cream", description: "Matcha-infused creamy dessert", price: 5.99, category: "Desserts" },
    ],
  },
  {
    id: "3",
    name: "La Piazza",
    category: "pizza",
    tags: ["Pizza", "Italian"],
    rating: 4.7,
    reviewCount: 2103,
    deliveryMinutes: 30,
    deliveryFee: 0,
    minOrder: 15,
    gradient: "from-[#F5C518] to-[#FFD94D]",
    emoji: "🍕",
    description: "Neapolitan wood-fired pizzas since 1987",
    freeDelivery: true,
    promoted: true,
    menu: [
      { id: "p1", name: "Margherita", description: "San Marzano tomatoes, fresh mozzarella, basil", price: 13.99, category: "Pizzas", popular: true },
      { id: "p2", name: "Diavola", description: "Spicy salami, chili, fior di latte", price: 15.99, category: "Pizzas", popular: true },
      { id: "p3", name: "Quattro Formaggi", description: "Mozzarella, gorgonzola, parmesan, ricotta", price: 16.99, category: "Pizzas" },
      { id: "p4", name: "Prosciutto e Rucola", description: "Prosciutto crudo, rocket, shaved parmesan", price: 17.99, category: "Pizzas" },
      { id: "p5", name: "Bruschetta", description: "Grilled bread, tomatoes, garlic, basil", price: 7.99, category: "Starters" },
      { id: "p6", name: "Tiramisu", description: "Classic Italian espresso dessert", price: 6.99, category: "Desserts" },
      { id: "p7", name: "Panna Cotta", description: "Vanilla cream with berry coulis", price: 6.49, category: "Desserts" },
    ],
  },
  {
    id: "4",
    name: "Green Garden",
    category: "healthy",
    tags: ["Healthy", "Salads", "Bowls"],
    rating: 4.6,
    reviewCount: 541,
    deliveryMinutes: 20,
    deliveryFee: 0,
    minOrder: 10,
    gradient: "from-[#6B7C00] to-[#8CA400]",
    emoji: "🥗",
    description: "Nourishing bowls & salads for a balanced life",
    freeDelivery: true,
    isNew: true,
    menu: [
      { id: "g1", name: "Power Bowl", description: "Quinoa, roasted chickpeas, avocado, tahini", price: 12.99, category: "Bowls", popular: true },
      { id: "g2", name: "Greek Salad", description: "Cucumber, tomato, olives, feta, oregano", price: 10.99, category: "Salads", popular: true },
      { id: "g3", name: "Buddha Bowl", description: "Brown rice, edamame, carrots, miso dressing", price: 13.49, category: "Bowls" },
      { id: "g4", name: "Caesar Salad", description: "Romaine, croutons, parmesan, classic dressing", price: 11.49, category: "Salads" },
      { id: "g5", name: "Acai Bowl", description: "Acai blend, granola, fresh fruit, honey", price: 11.99, category: "Bowls" },
      { id: "g6", name: "Green Detox Juice", description: "Spinach, cucumber, ginger, lemon, apple", price: 5.99, category: "Drinks" },
    ],
  },
  {
    id: "5",
    name: "CrispyBird",
    category: "chicken",
    tags: ["Chicken", "Wings", "Fast Food"],
    rating: 4.5,
    reviewCount: 3217,
    deliveryMinutes: 22,
    deliveryFee: 1.49,
    minOrder: 10,
    gradient: "from-[#FF6B35] to-[#FF8C5A]",
    emoji: "🍗",
    description: "Nashville hot chicken & legendary wings",
    menu: [
      { id: "c1", name: "Nashville Hot Sandwich", description: "Crispy chicken, hot sauce, pickles, slaw", price: 11.99, category: "Sandwiches", popular: true },
      { id: "c2", name: "Classic Bucket (8pcs)", description: "Original crispy fried chicken pieces", price: 18.99, category: "Buckets", popular: true },
      { id: "c3", name: "Wings (12pcs)", description: "Choice of Buffalo, BBQ, or Honey Garlic", price: 16.99, category: "Wings" },
      { id: "c4", name: "Chicken Tenders (5pcs)", description: "Juicy tenders with dipping sauce", price: 12.99, category: "Tenders" },
      { id: "c5", name: "Mac & Cheese", description: "Creamy house-made mac", price: 5.99, category: "Sides" },
      { id: "c6", name: "Coleslaw", description: "Creamy tangy slaw", price: 3.99, category: "Sides" },
    ],
  },
  {
    id: "6",
    name: "Café Arôme",
    category: "coffee",
    tags: ["Coffee", "Pastries", "Brunch"],
    rating: 4.8,
    reviewCount: 892,
    deliveryMinutes: 18,
    deliveryFee: 0,
    minOrder: 8,
    gradient: "from-[#6B3A2A] to-[#8B5E3C]",
    emoji: "☕",
    description: "Specialty coffee & artisan pastries",
    freeDelivery: true,
    menu: [
      { id: "cf1", name: "Flat White", description: "Double ristretto, silky microfoam", price: 4.99, category: "Hot Coffee", popular: true },
      { id: "cf2", name: "Iced Matcha Latte", description: "Ceremonial grade matcha, oat milk", price: 5.99, category: "Cold Drinks", popular: true },
      { id: "cf3", name: "Espresso", description: "Single origin Ethiopian Yirgacheffe", price: 3.49, category: "Hot Coffee" },
      { id: "cf4", name: "Croissant", description: "Butter croissant, baked fresh daily", price: 4.49, category: "Pastries" },
      { id: "cf5", name: "Almond Danish", description: "Flaky pastry with almond cream", price: 4.99, category: "Pastries" },
      { id: "cf6", name: "Avocado Toast", description: "Sourdough, smashed avo, poached egg", price: 9.99, category: "Food" },
    ],
  },
  {
    id: "7",
    name: "Pasta Bella",
    category: "pasta",
    tags: ["Pasta", "Italian", "Comfort Food"],
    rating: 4.6,
    reviewCount: 654,
    deliveryMinutes: 28,
    deliveryFee: 1.99,
    minOrder: 15,
    gradient: "from-[#D4006A] to-[#00B8B8]",
    emoji: "🍝",
    description: "Handmade pasta & rich Italian sauces",
    menu: [
      { id: "pa1", name: "Spaghetti Carbonara", description: "Guanciale, egg yolk, pecorino, black pepper", price: 14.99, category: "Pasta", popular: true },
      { id: "pa2", name: "Tagliatelle Bolognese", description: "Slow-cooked beef ragù, fresh tagliatelle", price: 15.99, category: "Pasta", popular: true },
      { id: "pa3", name: "Penne Arrabbiata", description: "San Marzano tomatoes, garlic, chili, basil", price: 12.99, category: "Pasta" },
      { id: "pa4", name: "Risotto ai Funghi", description: "Arborio rice, porcini, parmesan, truffle oil", price: 16.99, category: "Risotto" },
      { id: "pa5", name: "Focaccia", description: "Rosemary & sea salt, extra virgin olive oil", price: 5.99, category: "Bread" },
    ],
  },
  {
    id: "8",
    name: "Sweet Dreams",
    category: "desserts",
    tags: ["Desserts", "Ice Cream", "Cakes"],
    rating: 4.9,
    reviewCount: 1567,
    deliveryMinutes: 20,
    deliveryFee: 0,
    minOrder: 8,
    gradient: "from-[#FF9AD5] to-[#D4006A]",
    emoji: "🍰",
    description: "Artisan cakes, gelato & gourmet desserts",
    freeDelivery: true,
    isNew: true,
    menu: [
      { id: "d1", name: "Chocolate Lava Cake", description: "Warm chocolate cake, molten centre, vanilla ice cream", price: 8.99, category: "Cakes", popular: true },
      { id: "d2", name: "Cheesecake Slice", description: "New York style with berry compote", price: 7.99, category: "Cakes", popular: true },
      { id: "d3", name: "Gelato (3 Scoops)", description: "Choice from 12 artisan flavours", price: 6.99, category: "Gelato" },
      { id: "d4", name: "Waffle & Nutella", description: "Belgian waffle, Nutella, fresh strawberries", price: 9.99, category: "Waffles" },
      { id: "d5", name: "Crème Brûlée", description: "Classic vanilla custard, caramelised sugar", price: 7.49, category: "Classics" },
      { id: "d6", name: "Macarons (6pcs)", description: "Assorted French macarons", price: 10.99, category: "Pastries" },
    ],
  },
];
