import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.productTag.deleteMany();
  await prisma.productOption.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();

  // Sample products
  const products = [
    {
      title: "Leather Messenger Bag",
      body_html:
        "A beautiful handcrafted leather messenger bag. Perfect for work or school. Features multiple pockets and adjustable strap.",
      vendor: "Artisan Bags",
      product_type: "Bags",
      status: "active",
      published_at: new Date(),
      variants: {
        create: [
          {
            title: "Brown",
            price: 149.99,
            compare_at_price: 199.99,
            sku: "BAG-001",
            inventory_quantity: 10,
          },
        ],
      },
      images: {
        create: [
          {
            src: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
            alt: "Leather bag front",
          },
        ],
      },
      options: {
        create: [
          {
            name: "Color",
            values: "Brown, Black, Tan",
          },
        ],
      },
      tags: {
        create: [
          { name: "leather" },
          { name: "bag" },
          { name: "handmade" },
        ],
      },
    },
    {
      title: "Ceramic Coffee Mug",
      body_html:
        "Handmade ceramic mug with a beautiful glazed finish. Holds 12oz of your favorite beverage. Dishwasher and microwave safe.",
      vendor: "Home Ceramics",
      product_type: "Kitchen",
      status: "active",
      published_at: new Date(),
      variants: {
        create: [
          {
            title: "White",
            price: 24.99,
            sku: "MUG-001",
            inventory_quantity: 25,
          },
        ],
      },
      images: {
        create: [
          {
            src: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800",
            alt: "Ceramic mug",
          },
        ],
      },
      tags: {
        create: [
          { name: "ceramic" },
          { name: "mug" },
          { name: "kitchen" },
        ],
      },
    },
    {
      title: "Wireless Headphones",
      body_html:
        "Premium wireless headphones with noise cancellation. 20 hour battery life. Comfortable over-ear design for all day use.",
      vendor: "Tech Audio",
      product_type: "Electronics",
      status: "draft",
      variants: {
        create: [
          {
            title: "Black",
            price: 199.99,
            sku: "HP-001",
            inventory_quantity: 0,
          },
        ],
      },
      images: {
        create: [
          {
            src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
            alt: "Headphones",
          },
        ],
      },
      tags: {
        create: [
          { name: "audio" },
          { name: "wireless" },
          { name: "headphones" },
        ],
      },
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
    console.log(`  ✅ Created: ${product.title}`);
  }

  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

