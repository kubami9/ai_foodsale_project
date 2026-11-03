CREATE TABLE sellers (
  id uuid PRIMARY KEY,
  name text NOT NULL CHECK (length(name) > 0),
  city text NOT NULL CHECK (length(city) > 0),
  description text NOT NULL DEFAULT ''
);
CREATE TABLE products (
  id uuid PRIMARY KEY,
  seller_id uuid NOT NULL REFERENCES sellers(id),
  name text NOT NULL CHECK (length(name) > 0),
  description text NOT NULL DEFAULT '',
  category text NOT NULL CHECK (category IN ('dairy', 'bakery', 'produce', 'pantry', 'meals')),
  price_grosze integer NOT NULL CHECK (price_grosze >= 0),
  currency text NOT NULL DEFAULT 'PLN' CHECK (currency = 'PLN'),
  unit text NOT NULL CHECK (length(unit) > 0),
  stock_quantity integer NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0)
);
CREATE INDEX products_seller_idx ON products(seller_id);
CREATE INDEX products_category_idx ON products(category);
