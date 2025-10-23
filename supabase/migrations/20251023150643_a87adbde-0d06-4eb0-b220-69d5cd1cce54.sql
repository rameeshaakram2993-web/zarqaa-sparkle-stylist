-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  occasion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read products (public catalog)
CREATE POLICY "Anyone can view products"
ON public.products
FOR SELECT
TO public
USING (true);

-- Create policy for authenticated users to insert products (admin functionality)
CREATE POLICY "Authenticated users can insert products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Insert sample products
INSERT INTO public.products (name, description, price, category, occasion, image_url) VALUES
('Embroidered Lawn Suit', 'Elegant burgundy lawn suit with intricate gold embroidery, perfect for formal occasions', 4500, 'dress', 'wedding', '/src/assets/product-1.jpg'),
('Kundan Jewelry Set', 'Luxurious kundan necklace and earrings set with gold plating and precious stones', 8500, 'jewelry', 'bridal', '/src/assets/product-2.jpg'),
('Silk Saree', 'Beautiful silk saree in deep burgundy with gold border, traditional elegance', 6500, 'dress', 'formal', '/src/assets/product-3.jpg'),
('Traditional Earrings', 'Gold-plated kundan earrings with intricate design and pearl drops', 2500, 'jewelry', 'party', '/src/assets/product-4.jpg'),
('Designer Kurta', 'Modern designer kurta in burgundy with gold embroidery at neck and sleeves', 3500, 'dress', 'casual', '/src/assets/product-5.jpg'),
('Bridal Necklace', 'Stunning bridal necklace set with kundan work, pearls, and gold plating', 12000, 'jewelry', 'bridal', '/src/assets/product-6.jpg');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();