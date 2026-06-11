#!/usr/bin/env ts-node

/**
 * Migration Script: File-based storage to MySQL
 * 
 * This script migrates data from the old file-based storage system to MySQL.
 * It handles:
 * - CMS settings (from settings-storage.ts defaults)
 * - Plans, FAQ, Testimonials (from data files)
 * - Seeds the database with initial data
 */

import mysql from 'mysql2/promise';
import { promises as fs } from 'fs';
import path from 'path';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpassword',
  database: process.env.DB_NAME || 'cms_db',
};

async function main() {
  console.log('🚀 Starting MySQL migration...');
  
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    console.log('✅ Connected to MySQL database');
    
    // 1. Migrate/Seed Settings
    console.log('\n📋 Migrating settings...');
    await migrateSettings(connection);
    
    // 2. Seed Plans
    console.log('\n💰 Seeding plans...');
    await seedPlans(connection);
    
    // 3. Seed FAQ
    console.log('\n❓ Seeding FAQ...');
    await seedFAQ(connection);
    
    // 4. Seed Testimonials
    console.log('\n⭐ Seeding testimonials...');
    await seedTestimonials(connection);
    
    // 5. Check for existing JSON data and migrate if present
    console.log('\n📁 Checking for existing JSON data...');
    await migrateExistingJSONData(connection);
    
    console.log('\n✨ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

async function migrateSettings(connection: mysql.Connection) {
  const defaultSettings = {
    pricing: [
      {
        slug: '1-mois', name: '1 Mois', price: 17.99, originalPrice: null,
        currency: 'EUR', duration: 'month', badge: null, featured: false,
        visible: true, order: 0, promoPrice: null,
        features: ['Activation instantanée', '45 000 chaînes & films', 'Qualité HD / Full HD / 4K', 'TV de rattrapage (Replay)', 'Support 24h/7j'],
        description: 'Abonnement 1 mois découverte sans engagement.',
      },
      {
        slug: '3-mois', name: '3 Mois', price: 26.99, originalPrice: 53.97,
        savings: '50%', currency: 'EUR', duration: 'month', badge: 'Populaire',
        featured: false, visible: true, order: 1, promoPrice: null,
        features: ['Activation instantanée', '45 000 chaînes & films', 'Qualité HD / Full HD / 4K', 'TV de rattrapage (Replay)', 'Support 24h/7j'],
        description: 'Excellent rapport qualité-prix pour 3 mois.',
      },
      {
        slug: '6-mois', name: '6 Mois', price: 36.99, originalPrice: 107.94,
        savings: '66%', currency: 'EUR', duration: 'month', badge: null,
        featured: false, visible: true, order: 2, promoPrice: null,
        features: ['Activation instantanée', '45 000 chaînes & films', 'Qualité HD / Full HD / 4K', 'TV de rattrapage (Replay)', 'Support 24h/7j'],
        description: 'Notre offre la plus populaire pour toute une saison.',
      },
      {
        slug: '12-mois', name: '12 Mois', subtitle: '+ 3 mois offerts',
        price: 46.99, originalPrice: 215.88, savings: '78%', currency: 'EUR',
        duration: 'month', badge: 'MEILLEURE OFFRE', featured: true,
        visible: true, order: 3, promoPrice: null,
        features: ['Activation instantanée', '45 000 chaînes & films', 'Qualité HD / Full HD / 4K', 'TV de rattrapage (Replay)', 'Support 24h/7j', '3 mois supplémentaires offerts'],
        description: 'Notre meilleure offre: 15 mois au prix de 12.',
      },
      {
        slug: '24-mois', name: '24 Mois', price: 89.99, originalPrice: 431.76,
        savings: '79%', currency: 'EUR', duration: 'month', badge: 'Meilleur Prix/Durée',
        featured: false, visible: true, order: 4, promoPrice: null,
        features: ['Activation instantanée', '45 000 chaînes & films', 'Qualité HD / Full HD / 4K', 'TV de rattrapage (Replay)', 'Support 24h/7j'],
        description: 'Offre VIP ultime pour les passionnés.',
      },
      {
        slug: 'essai-3h', name: 'Essai 3H', price: 0, originalPrice: null,
        currency: 'EUR', duration: 'hour', badge: 'GRATUIT', featured: false,
        visible: true, order: 5, promoPrice: null,
        ctaText: 'Obtenir via WhatsApp',
        ctaHref: 'https://api.whatsapp.com/send?phone=212708245223&text=Bonjour, je souhaite un essai IPTV gratuit de 3h',
        features: ["3 heures d'accès complet", 'Sans carte de crédit', 'Activation immédiate'],
        description: 'Essayez gratuitement pendant 3 heures.',
      },
    ],
    hero: {
      title: 'Le meilleur IPTV premium en France',
      subtitle: "45 000 chaînes HD & 4K. Sport, Films, Séries. Activation en moins de 5 minutes. Essai gratuit disponible.",
      ctaText: 'Voir les offres',
      ctaHref: '/tarifs',
      badgeText: '⭐ 4.9/5 · 140 000+ abonnés satisfaits',
    },
    about: {
      title: 'Pourquoi choisir RegardezIPTV ?',
      description: "Depuis 2020, nous offrons le meilleur service IPTV premium en France. Notre infrastructure dédiée garantit une qualité d'image exceptionnelle et une stabilité de 99.9%.",
      stat1Label: 'Abonnés actifs',
      stat1Value: '140K+',
      stat2Label: 'Chaînes disponibles',
      stat2Value: '45K+',
      stat3Label: 'Disponibilité',
      stat3Value: '99.9%',
    },
    features: [
      { id: 'feat-1', icon: 'Zap', title: 'Activation instantanée', description: 'Votre accès IPTV est prêt en moins de 5 minutes après paiement, 24h/24.' },
      { id: 'feat-2', icon: 'Tv', title: '45 000 chaînes HD & 4K', description: 'Sport, cinéma, séries, chaînes internationales — tout en HD et 4K.' },
      { id: 'feat-3', icon: 'Shield', title: 'Stabilité 99.9%', description: 'Infrastructure dédiée avec redondance pour un service toujours disponible.' },
      { id: 'feat-4', icon: 'Headphones', title: 'Support 24h/7j', description: 'Notre équipe est disponible à toute heure sur WhatsApp.' },
    ],
    footer: {
      companyDescription: 'Le service IPTV premium #1 en France. 45 000 chaînes HD & 4K, activation instantanée.',
      whatsappUrl: 'https://api.whatsapp.com/send?phone=212708245223',
      email: 'contact@regardeziptv.fr',
      phone: '+212 708 245 223',
      address: 'France',
      businessHours: 'Lun–Dim: 8h–22h',
    },
    seoPages: [
      { key: 'home', title: 'RegardezIPTV - Meilleur IPTV Premium France', description: "Le meilleur IPTV premium en France. 45 000 chaînes HD & 4K. Activation instantanée.", keywords: 'iptv, iptv france, abonnement iptv, iptv premium', ogImageUrl: '' },
      { key: 'tarifs', title: 'Tarifs IPTV - Abonnements & Prix | RegardezIPTV', description: 'Découvrez nos offres IPTV à partir de 17,99€. Abonnements 1, 3, 6, 12 et 24 mois.', keywords: 'prix iptv, tarif iptv, abonnement iptv pas cher', ogImageUrl: '' },
      { key: 'blog', title: 'Blog IPTV - Guides & Actualités | RegardezIPTV', description: 'Guides, tutoriels et actualités sur le monde de la télévision en streaming.', keywords: 'blog iptv, guide iptv, tutoriel iptv', ogImageUrl: '' },
    ],
    contact: {
      phone: '+212 708 245 223',
      phone2: '',
      email: 'contact@regardeziptv.fr',
      whatsappUrl: 'https://api.whatsapp.com/send?phone=212708245223',
      address: 'France',
      businessHours: 'Lun–Dim: 8h00–22h00',
    },
    announcement: {
      enabled: false,
      text: '🎉 Offre spéciale : -20% sur tous les abonnements ce week-end !',
      backgroundColor: '#f59e0b',
      textColor: '#000000',
      expiresAt: null,
      ctaText: 'Voir les offres',
      ctaHref: '/tarifs',
    },
    updatedAt: new Date().toISOString(),
  };

  // Check if settings already exist
  const [existing] = await connection.execute('SELECT COUNT(*) as count FROM settings WHERE setting_key = ?', ['site_settings']);
  const count = (existing as any)[0].count;
  
  if (count > 0) {
    console.log('  ℹ️  Settings already exist, skipping...');
    return;
  }

  await connection.execute(
    'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)',
    ['site_settings', JSON.stringify(defaultSettings)]
  );
  console.log('  ✅ Settings migrated');
}

async function seedPlans(connection: mysql.Connection) {
  const [existing] = await connection.execute('SELECT COUNT(*) as count FROM plans');
  const count = (existing as any)[0].count;
  
  if (count > 0) {
    console.log('  ℹ️  Plans already exist, skipping...');
    return;
  }

  const plans = [
    {
      slug: '1-mois', name: '1 Mois', price: 17.99, originalPrice: null,
      currency: 'EUR', duration: 'month', badge: null, featured: false,
      visible: true, reviewCount: 8430, rating: 4.95,
      description: "Notre abonnement 1 mois est parfait pour découvrir notre service IPTV premium sans engagement.",
      sort_order: 0,
    },
    {
      slug: '3-mois', name: '3 Mois', price: 26.99, originalPrice: 53.97,
      savings: '50%', currency: 'EUR', duration: 'month', badge: 'Populaire',
      featured: false, visible: true, reviewCount: 23967, rating: 4.95,
      description: "L'abonnement 3 mois offre un excellent rapport qualité-prix.",
      sort_order: 1,
    },
    {
      slug: '6-mois', name: '6 Mois', price: 36.99, originalPrice: 107.94,
      savings: '66%', currency: 'EUR', duration: 'month', badge: null,
      featured: false, visible: true, reviewCount: 40167, rating: 4.95,
      description: "Notre abonnement 6 mois est notre offre la plus populaire.",
      sort_order: 2,
    },
    {
      slug: '12-mois', name: '12 Mois', subtitle: '+ 3 mois offerts',
      price: 46.99, originalPrice: 215.88, savings: '78%', currency: 'EUR',
      duration: 'month', badge: 'MEILLEURE OFFRE', featured: true,
      visible: true, reviewCount: 57267, rating: 4.95,
      description: "Notre meilleure offre : 12 mois avec 3 mois offerts.",
      sort_order: 3,
    },
    {
      slug: '24-mois', name: '24 Mois', price: 89.99, originalPrice: 431.76,
      savings: '79%', currency: 'EUR', duration: 'month', badge: 'Meilleur Prix/Durée',
      featured: false, visible: true, reviewCount: 12500, rating: 4.95,
      description: "L'abonnement 24 mois est notre offre VIP ultime.",
      sort_order: 4,
    },
    {
      slug: 'essai-3h', name: 'Essai 3H', price: 0, originalPrice: null,
      currency: 'EUR', duration: 'hour', badge: 'GRATUIT', featured: false,
      visible: true, reviewCount: 0, rating: 0,
      ctaText: 'Obtenir via WhatsApp',
      ctaHref: 'https://api.whatsapp.com/send?phone=212708245223&text=Bonjour, je souhaite un essai IPTV gratuit de 3h',
      description: "Essayez notre service IPTV gratuitement pendant 3 heures.",
      sort_order: 5,
    },
  ];

  const features = [
    ['Activation instantanée', '45 000 chaînes & films', 'Qualité HD / Full HD / 4K', 'Mises à jour automatiques', 'TV de rattrapage (Replay)', 'Support 24h/7j'],
    ['Activation instantanée', '45 000 chaînes & films', 'Qualité HD / Full HD / 4K', 'Mises à jour automatiques', 'TV de rattrapage (Replay)', 'Support 24h/7j'],
    ['Activation instantanée', '45 000 chaînes & films', 'Qualité HD / Full HD / 4K', 'Mises à jour automatiques', 'TV de rattrapage (Replay)', 'Support 24h/7j'],
    ['Activation instantanée', '45 000 chaînes & films', 'Qualité HD / Full HD / 4K', 'Mises à jour automatiques', 'TV de rattrapage (Replay)', 'Support 24h/7j', '3 mois supplémentaires offerts'],
    ['Activation instantanée', '45 000 chaînes & films', 'Qualité HD / Full HD / 4K', 'Mises à jour automatiques', 'TV de rattrapage (Replay)', 'Support 24h/7j'],
    ["3 heures d'accès complet", 'Sans carte de crédit', 'Activation immédiate'],
  ];

  for (let i = 0; i < plans.length; i++) {
    const plan = plans[i];
    const [result] = await connection.execute(
      `INSERT INTO plans (slug, name, subtitle, price, original_price, savings, currency, duration, badge, featured, visible, review_count, rating, description, cta_text, cta_href, sort_order) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        plan.slug, plan.name, plan.subtitle || null, plan.price, plan.originalPrice,
        plan.savings || null, plan.currency, plan.duration, plan.badge, plan.featured,
        plan.visible, plan.reviewCount, plan.rating, plan.description,
        plan.ctaText || null, plan.ctaHref || null, plan.sort_order,
      ]
    );

    const insertId = (result as any).insertId;
    
    // Insert features
    for (let j = 0; j < features[i].length; j++) {
      await connection.execute(
        'INSERT INTO plan_features (plan_id, feature, included, sort_order) VALUES (?, ?, ?, ?)',
        [insertId, features[i][j], true, j]
      );
    }
  }
  
  console.log('  ✅ Plans seeded');
}

async function seedFAQ(connection: mysql.Connection) {
  const [existing] = await connection.execute('SELECT COUNT(*) as count FROM faq');
  const count = (existing as any)[0].count;
  
  if (count > 0) {
    console.log('  ℹ️  FAQ already exist, skipping...');
    return;
  }

  const faqs = [
    {
      question: 'Comment fonctionne l\'abonnement IPTV ?',
      answer: 'Après votre achat, vous recevez instantanément vos identifiants de connexion par email.',
      category: 'Général',
    },
    {
      question: 'Sur quels appareils puis-je utiliser mon abonnement ?',
      answer: 'Notre service est compatible avec Smart TV (Samsung, LG), Android TV, Fire TV Stick, iPhone/iPad, PC/Mac.',
      category: 'Compatibilité',
    },
    {
      question: 'Quelle est la qualité des chaînes ?',
      answer: 'Nous proposons des chaînes en HD, Full HD et 4K selon le contenu.',
      category: 'Qualité',
    },
    {
      question: 'Puis-je tester le service avant d\'acheter ?',
      answer: 'Oui, nous proposons un essai gratuit de 3 heures sans engagement.',
      category: 'Essai',
    },
    {
      question: 'Le service est-il stable et sans coupures ?',
      answer: 'Nos serveurs sont optimisés pour garantir une disponibilité de 99.9%.',
      category: 'Stabilité',
    },
    {
      question: 'Comment fonctionne la garantie de remboursement ?',
      answer: 'Nous offrons une garantie satisfait ou remboursé de 7 jours.',
      category: 'Garantie',
    },
    {
      question: 'Puis-je utiliser mon abonnement sur plusieurs appareils ?',
      answer: 'Chaque abonnement est valide pour une connexion simultanée.',
      category: 'Utilisation',
    },
    {
      question: 'Comment contacter le support client ?',
      answer: 'Notre support est disponible 24h/24 et 7j/7 via WhatsApp au +212 708 245 223.',
      category: 'Support',
    },
  ];

  for (let i = 0; i < faqs.length; i++) {
    await connection.execute(
      'INSERT INTO faq (question, answer, category, is_active, sort_order) VALUES (?, ?, ?, ?, ?)',
      [faqs[i].question, faqs[i].answer, faqs[i].category, true, i]
    );
  }
  
  console.log('  ✅ FAQ seeded');
}

async function seedTestimonials(connection: mysql.Connection) {
  const [existing] = await connection.execute('SELECT COUNT(*) as count FROM testimonials');
  const count = (existing as any)[0].count;
  
  if (count > 0) {
    console.log('  ℹ️  Testimonials already exist, skipping...');
    return;
  }

  const testimonials = [
    {
      id: '1',
      name: 'Marie Dupont',
      location: 'Paris, France',
      rating: 5,
      text: 'Service exceptionnel ! La qualité 4K est parfaite et aucun buffering.',
    },
    {
      id: '2',
      name: 'Ahmed Benali',
      location: 'Lyon, France',
      rating: 5,
      text: 'Installation ultra simple sur ma Fire TV Stick. Support réactif.',
    },
    {
      id: '3',
      name: 'Sophie Martin',
      location: 'Marseille, France',
      rating: 5,
      text: 'Le catalogue de chaînes est incroyable. Prix imbattable.',
    },
    {
      id: '4',
      name: 'Karim Lefevre',
      location: 'Bruxelles, Belgique',
      rating: 5,
      text: 'Utilisation depuis 6 mois sur Smart TV Samsung. Aucun problème.',
    },
    {
      id: '5',
      name: 'Isabelle Moreau',
      location: 'Nice, France',
      rating: 5,
      text: 'VOD à jour avec les derniers films. Service client réactif.',
    },
  ];

  for (let i = 0; i < testimonials.length; i++) {
    await connection.execute(
      'INSERT INTO testimonials (id, name, location, rating, text, avatar, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [testimonials[i].id, testimonials[i].name, testimonials[i].location, testimonials[i].rating, testimonials[i].text, null, true, i]
    );
  }
  
  console.log('  ✅ Testimonials seeded');
}

async function migrateExistingJSONData(connection: mysql.Connection) {
  const dataDir = path.join(process.cwd(), 'data', 'cms');
  const storeFile = path.join(dataDir, 'store.json');
  
  try {
    await fs.access(storeFile);
    console.log('  📄 Found existing store.json, migrating...');
    
    const content = await fs.readFile(storeFile, 'utf-8');
    const data = JSON.parse(content);
    
    // Migrate users
    if (data.users && data.users.length > 0) {
      console.log('    - Migrating users...');
      for (const user of data.users) {
        await connection.execute(
          `INSERT INTO users (id, name, email, password, role, avatar, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
           ON DUPLICATE KEY UPDATE name=VALUES(name), email=VALUES(email), role=VALUES(role)`,
          [user.id, user.name, user.email, user.passwordHash, user.role, user.avatar, user.createdAt, user.updatedAt]
        );
      }
    }
    
    // Migrate categories
    if (data.categories && data.categories.length > 0) {
      console.log('    - Migrating categories...');
      for (const cat of data.categories) {
        await connection.execute(
          `INSERT INTO categories (id, name, slug, description, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?) 
           ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description)`,
          [cat.id, cat.name, cat.slug, cat.description, cat.createdAt, cat.updatedAt]
        );
      }
    }
    
    // Migrate tags
    if (data.tags && data.tags.length > 0) {
      console.log('    - Migrating tags...');
      for (const tag of data.tags) {
        await connection.execute(
          `INSERT INTO tags (id, name, slug, created_at) 
           VALUES (?, ?, ?, ?) 
           ON DUPLICATE KEY UPDATE name=VALUES(name)`,
          [tag.id, tag.name, tag.slug, tag.createdAt]
        );
      }
    }
    
    // Migrate posts
    if (data.posts && data.posts.length > 0) {
      console.log('    - Migrating posts...');
      for (const post of data.posts) {
        await connection.execute(
          `INSERT INTO posts (id, title, slug, excerpt, content, status, featured, author_id, category_id, featured_image_id, gallery_image_ids, published_at, read_time, views, seo_title, seo_description, seo_keywords, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE title=VALUES(title), content=VALUES(content), gallery_image_ids=VALUES(gallery_image_ids), updated_at=VALUES(updated_at)`,
            [
              post.id, post.title, post.slug, post.excerpt, post.content,
              post.status, post.featured || false, post.authorId, post.categoryId,
              post.featuredImageId, JSON.stringify(post.galleryImageIds || []), post.publishedAt, post.readTime, post.views,
              post.seo?.title, post.seo?.description, JSON.stringify(post.seo?.keywords || []),
              post.createdAt, post.updatedAt
            ]
        );
        
        // Migrate post-tag relationships
        if (post.tagIds && post.tagIds.length > 0) {
          for (const tagId of post.tagIds) {
            await connection.execute(
              `INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?) 
               ON DUPLICATE KEY UPDATE post_id=VALUES(post_id)`,
              [post.id, tagId]
            );
          }
        }
      }
    }
    
    // Migrate media
    if (data.media && data.media.length > 0) {
      console.log('    - Migrating media...');
      for (const media of data.media) {
        await connection.execute(
          `INSERT INTO media (id, filename, original_name, url, mime_type, size, type, folder, alt, width, height, optimized, created_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
           ON DUPLICATE KEY UPDATE url=VALUES(url), alt=VALUES(alt)`,
          [
            media.id, media.filename, media.originalName, media.url, media.mimeType,
            media.size, media.type, media.folder, media.alt, media.width, media.height,
            media.optimized, media.createdAt
          ]
        );
      }
    }
    
    // Migrate pages
    if (data.pages && data.pages.length > 0) {
      console.log('    - Migrating pages...');
      for (const page of data.pages) {
        await connection.execute(
          `INSERT INTO pages (id, title, slug, template, status, sections, seo_title, seo_description, seo_keywords, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
           ON DUPLICATE KEY UPDATE title=VALUES(title), content=VALUES(content), updated_at=VALUES(updated_at)`,
          [
            page.id, page.title, page.slug, page.template, page.status,
            JSON.stringify(page.sections), page.seo?.title, page.seo?.description,
            JSON.stringify(page.seo?.keywords || []), page.createdAt, page.updatedAt
          ]
        );
      }
    }
    
    console.log('  ✅ JSON data migrated');
  } catch (error) {
    console.log('  ℹ️  No existing JSON data found, skipping...');
  }
}

// Run the migration
main().catch(console.error);
