import type { Pool } from 'pg';

const sellers = [
  [
    '10000000-0000-4000-8000-000000000001',
    'Zagroda pod Lipami',
    'Kazimierz Dolny',
    'Mała rodzinna zagroda. Ręcznie wyrabiane sery z mleka od własnych kóz.',
  ],
  [
    '10000000-0000-4000-8000-000000000002',
    'Piekarnia Dobry Zaczyn',
    'Nałęczów',
    'Chleb na zakwasie, długi czas fermentacji i dobry skład. Wypiekamy małe partie.',
  ],
  [
    '10000000-0000-4000-8000-000000000003',
    'Ogród nad Wisłą',
    'Puławy',
    'Warzywa sezonowe, owoce i przetwory z naszego ogrodu. Zbieramy blisko dnia odbioru.',
  ],
  [
    '10000000-0000-4000-8000-000000000004',
    'Bistro przy Rynku',
    'Lublin',
    'Niewielka kuchnia, lokalne składniki i dania gotowane od podstaw.',
  ],
];
const products = [
  [
    '20000000-0000-4000-8000-000000000001',
    sellers[0]![0],
    'Ser kozi z ziołami',
    'Delikatny ser z koziego mleka, doprawiony ziołami z naszego ogrodu. Wytwarzany ręcznie w małych partiach. Zawiera mleko.',
    'dairy',
    2400,
    '200 g',
    12,
  ],
  [
    '20000000-0000-4000-8000-000000000002',
    sellers[1]![0],
    'Chleb żytni na zakwasie',
    'Aromatyczny chleb na żytnim zakwasie, z chrupiącą skórką. Fermentuje przez 24 godziny. Zawiera gluten.',
    'bakery',
    1800,
    'bochenek 700 g',
    8,
  ],
  [
    '20000000-0000-4000-8000-000000000003',
    sellers[2]![0],
    'Koszyk warzyw sezonowych',
    'Różnorodny zestaw warzyw z naszego ogrodu. Skład zmienia się wraz z porą roku i jest opisany przy odbiorze.',
    'produce',
    4500,
    'koszyk 3 kg',
    6,
  ],
  [
    '20000000-0000-4000-8000-000000000004',
    sellers[2]![0],
    'Konfitura malinowa',
    'Maliny z letniego zbioru zamknięte w słoiku. Owoce, odrobina cukru i sok z cytryny.',
    'pantry',
    2200,
    'słoik 250 g',
    15,
  ],
  [
    '20000000-0000-4000-8000-000000000005',
    sellers[3]![0],
    'Pierogi z pieczonymi warzywami',
    'Ręcznie lepione pierogi z sezonowym nadzieniem. Gotowe do podgrzania w domu. Zawierają gluten i jaja.',
    'meals',
    3200,
    'porcja 10 szt.',
    0,
  ],
  [
    '20000000-0000-4000-8000-000000000006',
    sellers[0]![0],
    'Jogurt naturalny',
    'Gęsty jogurt z pełnego mleka, bez dodatku cukru. Zawiera mleko. Przechowuj w lodówce.',
    'dairy',
    900,
    'słoik 300 ml',
    10,
  ],
];

export function assertDemoDatabase(databaseUrl: string, allowed: boolean): void {
  const name = new URL(databaseUrl).pathname.slice(1);
  if (!allowed || !/^[a-z0-9_]+_(dev|test)$/.test(name)) {
    throw new Error(
      'Demo seed requires ALLOW_DEMO_SEED=true and a database ending in _dev or _test.',
    );
  }
}

export async function seedDemo(pool: Pool): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const seller of sellers) {
      await client.query(
        'INSERT INTO sellers (id, name, city, description) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING',
        seller,
      );
    }
    for (const product of products) {
      await client.query(
        `INSERT INTO products (id, seller_id, name, description, category, price_grosze, unit, stock_quantity)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO NOTHING`,
        product,
      );
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
