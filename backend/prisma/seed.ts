import { PrismaClient, Plan } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const prisma = new PrismaClient();
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const restaurants = [
  {
    email: 'demo1@nami.app',
    password: 'demo1234',
    name: 'La Sazón de Yumbo',
    slug: 'la-sazon-de-yumbo',
    description: 'Comida casera vallecaucana con el sabor de siempre. Almuerzos completos y platos típicos.',
    address: 'Calle 13 #5-42, Centro, Yumbo',
    whatsapp: '573001234567',
    category: 'Comida casera',
    plan: 'PRO' as Plan,
    categories: [
      {
        name: 'Almuerzos',
        items: [
          { name: 'Bandeja paisa', description: 'Frijoles, arroz, chicharrón, huevo, arepa, aguacate y tajadas', price: 18000 },
          { name: 'Sancocho de gallina', description: 'Sancocho tradicional con yuca, papa, plátano y arroz', price: 15000 },
          { name: 'Arroz atollado', description: 'Arroz con pollo, cerdo, papa y hogao vallecaucano', price: 16000 },
        ],
      },
      {
        name: 'Bebidas',
        items: [
          { name: 'Lulada', description: 'Lulo fresco con hielo y azúcar', price: 5000 },
          { name: 'Jugo de maracuyá', description: 'Natural, sin conservantes', price: 4000 },
          { name: 'Agua panela con limón', price: 3000 },
        ],
      },
      {
        name: 'Postres',
        items: [
          { name: 'Cholao', description: 'Frutas picadas con leche condensada y crema', price: 7000 },
          { name: 'Arroz con leche', price: 4500 },
        ],
      },
    ],
  },
  {
    email: 'demo2@nami.app',
    password: 'demo1234',
    name: 'Burger Lab',
    slug: 'burger-lab',
    description: 'Hamburguesas artesanales con ingredientes premium. La mejor burger de Yumbo.',
    address: 'Cra 4 #10-15, Yumbo',
    whatsapp: '573009876543',
    category: 'Hamburguesas',
    plan: 'PRO' as Plan,
    categories: [
      {
        name: 'Hamburguesas',
        items: [
          { name: 'Clásica', description: 'Carne 200g, lechuga, tomate, cebolla caramelizada', price: 22000 },
          { name: 'BBQ Bacon', description: 'Carne 200g, tocineta, cheddar, salsa BBQ artesanal', price: 26000 },
          { name: 'Doble Smash', description: 'Doble carne smash 150g c/u, queso americano, pepinillos', price: 28000 },
          { name: 'Veggie', description: 'Portobello, queso de cabra, rúgula, pesto', price: 20000 },
        ],
      },
      {
        name: 'Acompañamientos',
        items: [
          { name: 'Papas cajún', description: 'Papas fritas con sazonador cajún', price: 8000 },
          { name: 'Aros de cebolla', description: 'Crujientes con salsa ranch', price: 9000 },
        ],
      },
      {
        name: 'Bebidas',
        items: [
          { name: 'Malteada de Oreo', price: 12000 },
          { name: 'Limonada de coco', price: 7000 },
        ],
      },
    ],
  },
  {
    email: 'demo3@nami.app',
    password: 'demo1234',
    name: 'Sushi Yumbo',
    slug: 'sushi-yumbo',
    description: 'Sushi fusión colombiano-japonés. Rolls creativos a precios accesibles.',
    address: 'Calle 15 #3-28, Yumbo',
    whatsapp: '573005551234',
    category: 'Sushi',
    plan: 'GRATIS' as Plan,
    categories: [
      {
        name: 'Rolls clásicos',
        items: [
          { name: 'California Roll', description: 'Kanikama, aguacate, pepino (10 piezas)', price: 18000 },
          { name: 'Philadelphia', description: 'Salmón, queso crema, aguacate (10 piezas)', price: 22000 },
          { name: 'Tempura Roll', description: 'Langostino tempura, aguacate, salsa anguila', price: 24000 },
        ],
      },
      {
        name: 'Rolls premium',
        items: [
          { name: 'Volcano Roll', description: 'Salmón flambeado, queso crema, cebolla crispy', price: 28000 },
          { name: 'Dragon Roll', description: 'Langostino, aguacate laminado, tobiko', price: 30000 },
        ],
      },
    ],
  },
  {
    email: 'demo4@nami.app',
    password: 'demo1234',
    name: 'Empanadas Doña Rosa',
    slug: 'empanadas-dona-rosa',
    description: 'Las empanadas más crujientes del Valle. Tradición familiar desde 1998.',
    address: 'Plaza de mercado, Local 12, Yumbo',
    whatsapp: '573007778899',
    category: 'Empanadas',
    plan: 'GRATIS' as Plan,
    categories: [
      {
        name: 'Empanadas',
        items: [
          { name: 'Empanada de carne', description: 'Rellena de carne molida con papa y hogao', price: 2500 },
          { name: 'Empanada de pollo', description: 'Pollo desmechado con especias', price: 2500 },
          { name: 'Empanada hawaiana', description: 'Jamón, queso y piña', price: 3000 },
          { name: 'Empanada de queso', description: 'Queso doble crema derretido', price: 2000 },
        ],
      },
      {
        name: 'Combos',
        items: [
          { name: 'Combo 3 empanadas + gaseosa', description: 'Escoge 3 empanadas + Coca-Cola personal', price: 10000 },
          { name: 'Combo familiar (10 empanadas)', description: '10 empanadas surtidas', price: 22000 },
        ],
      },
      {
        name: 'Bebidas',
        items: [
          { name: 'Gaseosa personal', price: 3000 },
          { name: 'Jugo Hit', price: 2500 },
        ],
      },
    ],
  },
  {
    email: 'demo5@nami.app',
    password: 'demo1234',
    name: 'Pizza Nápoles',
    slug: 'pizza-napoles',
    description: 'Pizzas artesanales al horno de leña. Masa madre de 48 horas.',
    address: 'Cra 5 #12-08, Yumbo',
    whatsapp: '573004443322',
    category: 'Pizzería',
    plan: 'PRO' as Plan,
    categories: [
      {
        name: 'Pizzas tradicionales',
        items: [
          { name: 'Margherita', description: 'Salsa pomodoro, mozzarella fresca, albahaca', price: 25000 },
          { name: 'Pepperoni', description: 'Salsa, mozzarella, pepperoni artesanal', price: 28000 },
          { name: 'Hawaiana', description: 'Jamón, piña caramelizada, mozzarella', price: 27000 },
        ],
      },
      {
        name: 'Pizzas especiales',
        items: [
          { name: 'Cuatro quesos', description: 'Mozzarella, gorgonzola, parmesano, provolone', price: 32000 },
          { name: 'Carnívora', description: 'Pepperoni, jamón, tocineta, carne molida', price: 35000 },
        ],
      },
      {
        name: 'Bebidas',
        items: [
          { name: 'Cerveza artesanal', description: 'BBC Cajicá Miel o Lager', price: 8000 },
          { name: 'Limonada natural', price: 5000 },
        ],
      },
    ],
  },
];

async function seed() {
  console.log('🌱 Seeding ÑAMI database...\n');

  for (const r of restaurants) {
    // Create Supabase auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: r.email,
      password: r.password,
      email_confirm: true,
    });

    if (authError) {
      // If user already exists, find them
      if (authError.message.includes('already been registered')) {
        console.log(`  ⚠ ${r.email} ya existe, saltando...`);
        continue;
      }
      console.error(`  ❌ Error creando ${r.email}:`, authError.message);
      continue;
    }

    const supabaseId = authData.user.id;

    // Create Prisma user + restaurant + categories + items
    const user = await prisma.user.create({
      data: {
        email: r.email,
        supabaseId,
        role: 'OWNER',
        restaurant: {
          create: {
            slug: r.slug,
            name: r.name,
            description: r.description,
            address: r.address,
            whatsapp: r.whatsapp,
            category: r.category,
            plan: r.plan,
            categories: {
              create: r.categories.map((cat, catIdx) => ({
                name: cat.name,
                order: catIdx,
                items: {
                  create: cat.items.map((item, itemIdx) => ({
                    name: item.name,
                    description: item.description || null,
                    price: item.price,
                    order: itemIdx,
                  })),
                },
              })),
            },
          },
        },
      },
    });

    const totalItems = r.categories.reduce((sum, c) => sum + c.items.length, 0);
    console.log(`  ✅ ${r.name} — ${r.categories.length} categorías, ${totalItems} items (${r.plan})`);
  }

  console.log('\n🎉 Seed completado!\n');
  console.log('Credenciales de prueba:');
  console.log('  Email: demo1@nami.app ... demo5@nami.app');
  console.log('  Password: demo1234');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
