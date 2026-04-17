
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { notFound } from 'next/navigation';
import { AdminProductForm } from '@/components/admin/AdminProductForm';

export default async function EditProductPage({ params }) {
  const { id } = params;
  
  await connectDB();
  const product = await Product.findById(id);
  
  if (!product) return notFound();

  return <AdminProductForm initialData={JSON.parse(JSON.stringify(product))} isEdit={true} />;
}
