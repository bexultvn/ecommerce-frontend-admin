export const mockProducts = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    price: 79.99,
    image: 'https://placehold.co/400x400?text=Headphones',
    category: 'Electronics', categoryName: 'Electronics', categoryId: 1,
    stock: 25, availableQuantity: 25,
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and comfortable over-ear design. Perfect for music lovers and remote workers.',
    rating: 4.5
  },
  {
    id: '2',
    name: 'Smartphone Stand & Charger',
    price: 34.99,
    image: 'https://placehold.co/400x400?text=Phone+Stand',
    category: 'Electronics', categoryName: 'Electronics', categoryId: 1,
    stock: 50, availableQuantity: 50,
    description: 'Adjustable smartphone stand with built-in 15W wireless charging. Compatible with all Qi-enabled devices. Non-slip base for stable placement.',
    rating: 4.2
  },
  {
    id: '3',
    name: 'USB-C Hub 7-in-1',
    price: 49.99,
    image: 'https://placehold.co/400x400?text=USB+Hub',
    category: 'Electronics', categoryName: 'Electronics', categoryId: 1,
    stock: 30, availableQuantity: 30,
    description: 'Expand your laptop connectivity with HDMI 4K, 3x USB 3.0, SD card reader, and 100W PD charging port. Plug and play, no drivers required.',
    rating: 4.7
  },
  {
    id: '4',
    name: 'Mechanical Keyboard',
    price: 129.99,
    image: 'https://placehold.co/400x400?text=Keyboard',
    category: 'Electronics', categoryName: 'Electronics', categoryId: 1,
    stock: 15, availableQuantity: 15,
    description: 'Compact TKL mechanical keyboard with Cherry MX Red switches. RGB backlit keys, aluminum frame, and detachable USB-C cable.',
    rating: 4.8
  },
  {
    id: '5',
    name: 'Classic Cotton T-Shirt',
    price: 19.99,
    image: 'https://placehold.co/400x400?text=T-Shirt',
    category: 'Clothing', categoryName: 'Clothing', categoryId: 2,
    stock: 100, availableQuantity: 100,
    description: '100% organic cotton crew-neck t-shirt. Pre-shrunk, breathable fabric available in a range of sizes. Machine washable.',
    rating: 4.3
  },
  {
    id: '6',
    name: 'Slim Fit Chino Pants',
    price: 44.99,
    image: 'https://placehold.co/400x400?text=Chinos',
    category: 'Clothing', categoryName: 'Clothing', categoryId: 2,
    stock: 60, availableQuantity: 60,
    description: 'Versatile slim-fit chino pants made from stretch cotton blend. Suitable for casual and semi-formal occasions. Available in multiple colors.',
    rating: 4.1
  },
  {
    id: '7',
    name: 'Hooded Zip-Up Sweatshirt',
    price: 54.99,
    image: 'https://placehold.co/400x400?text=Hoodie',
    category: 'Clothing', categoryName: 'Clothing', categoryId: 2,
    stock: 45, availableQuantity: 45,
    description: 'Cozy fleece-lined hoodie with kangaroo pocket and adjustable drawstring. Perfect for layering on cool days.',
    rating: 4.6
  },
  {
    id: '8',
    name: 'JavaScript: The Good Parts',
    price: 24.99,
    image: 'https://placehold.co/400x400?text=JS+Book',
    category: 'Books', categoryName: 'Books', categoryId: 3,
    stock: 20, availableQuantity: 20,
    description: 'A classic guide to JavaScript best practices by Douglas Crockford. Essential reading for any web developer looking to master the language.',
    rating: 4.9
  },
  {
    id: '9',
    name: 'Clean Code',
    price: 29.99,
    image: 'https://placehold.co/400x400?text=Clean+Code',
    category: 'Books', categoryName: 'Books', categoryId: 3,
    stock: 18, availableQuantity: 18,
    description: "Robert C. Martin's handbook of agile software craftsmanship. Learn how to write readable, maintainable, and robust code.",
    rating: 4.8
  },
  {
    id: '10',
    name: 'The Pragmatic Programmer',
    price: 32.99,
    image: 'https://placehold.co/400x400?text=Pragmatic',
    category: 'Books', categoryName: 'Books', categoryId: 3,
    stock: 22, availableQuantity: 22,
    description: 'A timeless guide to software development best practices. Covers topics from career development to technical excellence.',
    rating: 4.7
  },
  {
    id: '11',
    name: 'Ceramic Coffee Mug Set',
    price: 27.99,
    image: 'https://placehold.co/400x400?text=Mug+Set',
    category: 'Home', categoryName: 'Home', categoryId: 4,
    stock: 35, availableQuantity: 35,
    description: 'Set of 4 handcrafted ceramic mugs, 12oz each. Microwave and dishwasher safe. Minimalist design complements any kitchen style.',
    rating: 4.4
  },
  {
    id: '12',
    name: 'Bamboo Desk Organizer',
    price: 39.99,
    image: 'https://placehold.co/400x400?text=Organizer',
    category: 'Home', categoryName: 'Home', categoryId: 4,
    stock: 28, availableQuantity: 28,
    description: 'Eco-friendly bamboo desk organizer with 5 compartments for pens, papers, and accessories. Keeps your workspace tidy and stylish.',
    rating: 4.5
  }
];

export const mockUsers = [
  {
    id: 'u1',
    email: 'john@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    registeredDate: '2025-04-12',
    address: { street: 'Main St', houseNumber: '123', zipCode: '62701' }
  },
  {
    id: 'u2',
    email: 'jane@example.com',
    password: 'password456',
    firstName: 'Jane',
    lastName: 'Smith',
    registeredDate: '2025-06-08',
    address: { street: 'Oak Ave', houseNumber: '456', zipCode: '97201' }
  },
  {
    id: 'u3',
    email: 'mike.johnson@example.com',
    password: 'password789',
    firstName: 'Mike',
    lastName: 'Johnson',
    registeredDate: '2025-08-20',
    address: { street: 'Elm St', houseNumber: '789', zipCode: '10001' }
  },
  {
    id: 'u4',
    email: 'sarah.w@example.com',
    password: 'passwordabc',
    firstName: 'Sarah',
    lastName: 'Williams',
    registeredDate: '2025-09-05',
    address: { street: 'Pine Rd', houseNumber: '22', zipCode: '30301' }
  },
  {
    id: 'u5',
    email: 'david.brown@example.com',
    password: 'passworddef',
    firstName: 'David',
    lastName: 'Brown',
    registeredDate: '2025-10-14',
    address: { street: 'Maple Dr', houseNumber: '55', zipCode: '60601' }
  },
  {
    id: 'u6',
    email: 'emily.davis@example.com',
    password: 'passwordghi',
    firstName: 'Emily',
    lastName: 'Davis',
    registeredDate: '2025-11-30',
    address: { street: 'Cedar Ln', houseNumber: '8', zipCode: '77001' }
  },
  {
    id: 'u7',
    email: 'chris.wilson@example.com',
    password: 'passwordjkl',
    firstName: 'Chris',
    lastName: 'Wilson',
    registeredDate: '2026-01-18',
    address: { street: 'Birch Blvd', houseNumber: '301', zipCode: '85001' }
  }
];

export const mockOrders = [
  {
    id: 'o1',
    userId: 'u1',
    items: [
      { productId: '1', name: 'Wireless Bluetooth Headphones', price: 79.99, qty: 1 },
      { productId: '8', name: 'JavaScript: The Good Parts', price: 24.99, qty: 2 }
    ],
    total: 129.97,
    status: 'Delivered',
    date: '2025-10-15'
  },
  {
    id: 'o2',
    userId: 'u1',
    items: [
      { productId: '4', name: 'Mechanical Keyboard', price: 129.99, qty: 1 }
    ],
    total: 129.99,
    status: 'Delivered',
    date: '2025-11-20'
  },
  {
    id: 'o3',
    userId: 'u2',
    items: [
      { productId: '5', name: 'Classic Cotton T-Shirt', price: 19.99, qty: 3 },
      { productId: '11', name: 'Ceramic Coffee Mug Set', price: 27.99, qty: 1 }
    ],
    total: 87.96,
    status: 'Delivered',
    date: '2025-11-28'
  },
  {
    id: 'o4',
    userId: 'u3',
    items: [
      { productId: '3', name: 'USB-C Hub 7-in-1', price: 49.99, qty: 1 },
      { productId: '9', name: 'Clean Code', price: 29.99, qty: 1 }
    ],
    total: 79.98,
    status: 'Delivered',
    date: '2025-12-05'
  },
  {
    id: 'o5',
    userId: 'u4',
    items: [
      { productId: '7', name: 'Hooded Zip-Up Sweatshirt', price: 54.99, qty: 2 },
      { productId: '12', name: 'Bamboo Desk Organizer', price: 39.99, qty: 1 }
    ],
    total: 149.97,
    status: 'Delivered',
    date: '2025-12-18'
  },
  {
    id: 'o6',
    userId: 'u2',
    items: [
      { productId: '1', name: 'Wireless Bluetooth Headphones', price: 79.99, qty: 1 },
      { productId: '4', name: 'Mechanical Keyboard', price: 129.99, qty: 1 }
    ],
    total: 209.98,
    status: 'Delivered',
    date: '2026-01-08'
  },
  {
    id: 'o7',
    userId: 'u5',
    items: [
      { productId: '10', name: 'The Pragmatic Programmer', price: 32.99, qty: 1 },
      { productId: '8', name: 'JavaScript: The Good Parts', price: 24.99, qty: 1 }
    ],
    total: 57.98,
    status: 'Delivered',
    date: '2026-01-15'
  },
  {
    id: 'o8',
    userId: 'u6',
    items: [
      { productId: '2', name: 'Smartphone Stand & Charger', price: 34.99, qty: 1 },
      { productId: '6', name: 'Slim Fit Chino Pants', price: 44.99, qty: 2 }
    ],
    total: 124.97,
    status: 'Delivered',
    date: '2026-01-22'
  },
  {
    id: 'o9',
    userId: 'u3',
    items: [
      { productId: '11', name: 'Ceramic Coffee Mug Set', price: 27.99, qty: 2 },
      { productId: '12', name: 'Bamboo Desk Organizer', price: 39.99, qty: 1 }
    ],
    total: 95.97,
    status: 'Shipped',
    date: '2026-02-10'
  },
  {
    id: 'o10',
    userId: 'u7',
    items: [
      { productId: '4', name: 'Mechanical Keyboard', price: 129.99, qty: 1 },
      { productId: '3', name: 'USB-C Hub 7-in-1', price: 49.99, qty: 1 }
    ],
    total: 179.98,
    status: 'Delivered',
    date: '2026-02-14'
  },
  {
    id: 'o11',
    userId: 'u1',
    items: [
      { productId: '5', name: 'Classic Cotton T-Shirt', price: 19.99, qty: 2 },
      { productId: '7', name: 'Hooded Zip-Up Sweatshirt', price: 54.99, qty: 1 }
    ],
    total: 94.97,
    status: 'Delivered',
    date: '2026-02-20'
  },
  {
    id: 'o12',
    userId: 'u4',
    items: [
      { productId: '9', name: 'Clean Code', price: 29.99, qty: 1 },
      { productId: '10', name: 'The Pragmatic Programmer', price: 32.99, qty: 1 }
    ],
    total: 62.98,
    status: 'Shipped',
    date: '2026-03-05'
  },
  {
    id: 'o13',
    userId: 'u5',
    items: [
      { productId: '1', name: 'Wireless Bluetooth Headphones', price: 79.99, qty: 1 }
    ],
    total: 79.99,
    status: 'Processing',
    date: '2026-03-12'
  },
  {
    id: 'o14',
    userId: 'u6',
    items: [
      { productId: '12', name: 'Bamboo Desk Organizer', price: 39.99, qty: 2 },
      { productId: '11', name: 'Ceramic Coffee Mug Set', price: 27.99, qty: 1 }
    ],
    total: 107.97,
    status: 'Processing',
    date: '2026-03-18'
  },
  {
    id: 'o15',
    userId: 'u2',
    items: [
      { productId: '6', name: 'Slim Fit Chino Pants', price: 44.99, qty: 1 },
      { productId: '5', name: 'Classic Cotton T-Shirt', price: 19.99, qty: 3 }
    ],
    total: 104.96,
    status: 'Processing',
    date: '2026-03-22'
  }
];

export const mockAdminUsers = [
  {
    id: 'a1',
    email: 'admin@shopapp.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  }
];

// Monthly analytics data (last 12 months: Apr 2025 – Mar 2026)
export const monthlyStats = [
  { month: 'Apr', revenue: 1240, orders: 9 },
  { month: 'May', revenue: 1870, orders: 13 },
  { month: 'Jun', revenue: 2150, orders: 16 },
  { month: 'Jul', revenue: 1920, orders: 14 },
  { month: 'Aug', revenue: 2580, orders: 19 },
  { month: 'Sep', revenue: 3100, orders: 23 },
  { month: 'Oct', revenue: 3450, orders: 26 },
  { month: 'Nov', revenue: 4200, orders: 33 },
  { month: 'Dec', revenue: 5850, orders: 46 },
  { month: 'Jan', revenue: 3920, orders: 30 },
  { month: 'Feb', revenue: 4380, orders: 34 },
  { month: 'Mar', revenue: 2920, orders: 22 },
];
