import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function DELETE(request) {
  try {
    const { publicId } = await request.json();
    
    if (!publicId) {
      return NextResponse.json({ success: false, error: 'No public ID provided' }, { status: 400 });
    }

    await cloudinary.uploader.destroy(publicId);

    return NextResponse.json({ success: true, message: 'Image deleted' }, { status: 200 });
  } catch (error) {
    console.error('Image delete error:', error);
    return NextResponse.json({ success: false, error: 'Delete failed' }, { status: 500 });
  }
}
