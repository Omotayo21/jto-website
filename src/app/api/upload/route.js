import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file received' }, { status: 400 });
    }

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      return NextResponse.json({ success: false, error: 'Only images and videos are allowed' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Data = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64Data}`;

    const uploadResponse = await cloudinary.uploader.upload(dataUri, {
      folder: 'ecommerce_products',
      resource_type: 'auto',
    });

    return NextResponse.json({ 
      success: true, 
      data: { 
        url: uploadResponse.secure_url, 
        publicId: uploadResponse.public_id,
        type: isImage ? 'image' : 'video'
      } 
    }, { status: 200 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}
