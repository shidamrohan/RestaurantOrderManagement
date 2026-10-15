import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../models/User.js';
import Category from '../models/Category.js';
import MenuItem from '../models/MenuItem.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const seedDatabase = async () => {
  try {
    console.log('\x1b[36mConnecting to MongoDB Atlas for seeding...\x1b[0m');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('\x1b[32m✔ Connected to MongoDB Atlas\x1b[0m');

    // Clean existing records
    console.log('Cleaning existing collection data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await MenuItem.deleteMany({});

    // 1. Seed Users (Admin, Staff, Customer)
    console.log('Seeding Users...');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@restaurant.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'adminPassword123!';

    const adminUser = await User.create({
      name: 'Restaurant Administrator',
      email: adminEmail.toLowerCase(),
      password: adminPassword,
      role: 'admin',
      phone: '+1 555-0199',
    });

    const staffUser = await User.create({
      name: 'Kitchen Staff Member',
      email: 'staff@restaurant.com',
      password: 'staffPassword123!',
      role: 'staff',
      phone: '+1 555-0144',
    });

    const customerUser = await User.create({
      name: 'John Customer',
      email: 'customer@restaurant.com',
      password: 'customerPassword123!',
      role: 'customer',
      phone: '+1 555-0123',
    });

    console.log(`✔ Created 3 users: Admin (${adminUser.email}), Staff (${staffUser.email}), Customer (${customerUser.email})`);

    // 2. Seed Categories
    console.log('Seeding Categories...');
    const categoriesData = [
      {
        name: 'Starters & Appetizers',
        slug: 'starters-appetizers',
        description: 'Crispy, savory snacks and light bites to begin your meal.',
        image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=600&auto=format&fit=crop&q=80',
        displayOrder: 1,
      },
      {
        name: 'Main Course',
        slug: 'main-course',
        description: 'Hearty, chef-crafted signature dishes and sizzlers.',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
        displayOrder: 2,
      },
      {
        name: 'Artisan Pizzas & Burgers',
        slug: 'pizzas-burgers',
        description: 'Hand-tossed stone-baked pizzas and gourmet smash burgers.',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
        displayOrder: 3,
      },
      {
        name: 'Desserts & Sweets',
        slug: 'desserts-sweets',
        description: 'Decadent sweets, rich cakes, and refreshing gelatos.',
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
        displayOrder: 4,
      },
      {
        name: 'Beverages & Mocktails',
        slug: 'beverages-mocktails',
        description: 'Chilled artisanal refreshers, fresh juices, and hot brews.',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
        displayOrder: 5,
      },
    ];

    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`✔ Created ${createdCategories.length} categories`);

    // Category mapping helper
    const catMap = {};
    createdCategories.forEach((cat) => {
      catMap[cat.name] = cat._id;
    });

    // 3. Seed Menu Items
    console.log('Seeding Menu Items...');
    const menuItemsData = [
      // Starters
      {
        name: 'Crispy Truffle Fries',
        description: 'Golden hand-cut potato fries tossed with white truffle oil, sea salt, fresh parsley, and grated aged parmesan.',
        price: 8.99,
        category: catMap['Starters & Appetizers'],
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        preparationTime: 12,
        tags: ['Vegetarian', 'Crispy', 'Popular'],
        isFeatured: true,
      },
      {
        name: 'Smoked Garlic Bruschetta',
        description: 'Toasted sourdough slices topped with heirloom cherry tomatoes, roasted garlic, basil chiffonade, and balsamic glaze.',
        price: 9.5,
        category: catMap['Starters & Appetizers'],
        image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        preparationTime: 10,
        tags: ['Vegetarian', 'Italian'],
        isFeatured: false,
      },
      {
        name: 'Spicy Buffalo Wings',
        description: 'Crispy fried chicken wings glazed with tangy Louisiana buffalo hot sauce, served with blue cheese dip and celery.',
        price: 13.99,
        category: catMap['Starters & Appetizers'],
        image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        preparationTime: 15,
        tags: ['Spicy', 'Non-Veg', 'Chef Special'],
        isFeatured: true,
      },

      // Main Course
      {
        name: 'Grilled Herb Butter Salmon',
        description: 'Fresh Atlantic salmon fillet seared with garlic herb butter, accompanied by roasted asparagus and wild rice pilaf.',
        price: 24.99,
        category: catMap['Main Course'],
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        preparationTime: 25,
        tags: ['Seafood', 'Gluten-Free', 'Healthy'],
        isFeatured: true,
      },
      {
        name: 'Creamy Tuscan Chicken Pasta',
        description: 'Fettuccine pasta in rich sun-dried tomato garlic cream sauce with pan-seared chicken breast and baby spinach.',
        price: 18.5,
        category: catMap['Main Course'],
        image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281729?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        preparationTime: 20,
        tags: ['Italian', 'Pasta', 'Comfort Food'],
        isFeatured: false,
      },
      {
        name: 'Wild Mushroom Risotto',
        description: 'Slow-simmered Arborio rice with porcini mushrooms, white wine reduction, parmesan, and freshly cracked black pepper.',
        price: 17.0,
        category: catMap['Main Course'],
        image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        preparationTime: 22,
        tags: ['Vegetarian', 'Gluten-Free'],
        isFeatured: false,
      },

      // Artisan Pizzas & Burgers
      {
        name: 'Signature Wagyu Smash Burger',
        description: 'Double Wagyu beef patties, melted sharp cheddar, caramelized onions, house truffle aioli, on toasted brioche bun.',
        price: 16.99,
        category: catMap['Artisan Pizzas & Burgers'],
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        preparationTime: 18,
        tags: ['Burger', 'Chef Special', 'Best Seller'],
        isFeatured: true,
      },
      {
        name: 'Margherita Burrata Pizza',
        description: 'San Marzano tomato base, fresh creamy burrata, Fior di Latte mozzarella, organic basil, and extra virgin olive oil.',
        price: 15.99,
        category: catMap['Artisan Pizzas & Burgers'],
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        preparationTime: 15,
        tags: ['Pizza', 'Vegetarian', 'Stone-Baked'],
        isFeatured: true,
      },
      {
        name: 'Spicy Diavola Pepperoni Pizza',
        description: 'Hand-stretched dough topped with smoky Italian pepperoni, Calabrian chili oil, mozzarella, and honey drizzle.',
        price: 17.5,
        category: catMap['Artisan Pizzas & Burgers'],
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        preparationTime: 16,
        tags: ['Pizza', 'Spicy', 'Popular'],
        isFeatured: false,
      },

      // Desserts
      {
        name: 'Classic Espresso Tiramisu',
        description: 'Savoiardi ladyfingers soaked in dark espresso and coffee liqueur, layered with rich mascarpone and cocoa powder.',
        price: 8.5,
        category: catMap['Desserts & Sweets'],
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        preparationTime: 5,
        tags: ['Dessert', 'Italian', 'Coffee'],
        isFeatured: true,
      },
      {
        name: 'Warm Belgian Chocolate Lava Cake',
        description: 'Molten Belgian dark chocolate center served warm with Madagascar vanilla bean gelato and fresh raspberries.',
        price: 9.99,
        category: catMap['Desserts & Sweets'],
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        preparationTime: 12,
        tags: ['Dessert', 'Chocolate', 'Popular'],
        isFeatured: false,
      },

      // Beverages
      {
        name: 'Passion Fruit Mint Cooler',
        description: 'Sparkling cooler infused with fresh passion fruit pulp, crushed garden mint, lime juice, and agave nectar.',
        price: 5.99,
        category: catMap['Beverages & Mocktails'],
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        preparationTime: 5,
        tags: ['Beverage', 'Mocktail', 'Refreshing'],
        isFeatured: true,
      },
      {
        name: 'Iced Vanilla Cold Brew',
        description: '18-hour steeped single-origin Arabica cold brew with Madagascar vanilla syrup and a splash of oat milk.',
        price: 5.5,
        category: catMap['Beverages & Mocktails'],
        image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        preparationTime: 3,
        tags: ['Beverage', 'Coffee', 'Cold Brew'],
        isFeatured: false,
      },
    ];

    const createdItems = await MenuItem.insertMany(menuItemsData);
    console.log(`✔ Created ${createdItems.length} menu items`);

    console.log('\x1b[32m✔ DATABASE SEEDING COMPLETED SUCCESSFULLY!\x1b[0m');
    console.log('----------------------------------------------------');
    console.log('Login credentials:');
    console.log(`Admin:    ${adminEmail}  /  ${adminPassword}`);
    console.log(`Staff:    staff@restaurant.com  /  staffPassword123!`);
    console.log(`Customer: customer@restaurant.com  /  customerPassword123!`);
    console.log('----------------------------------------------------');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\x1b[31m✖ Database Seeding Failed:\x1b[0m', error);
    process.exit(1);
  }
};

seedDatabase();
