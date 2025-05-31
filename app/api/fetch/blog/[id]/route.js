// app/api/blogs/[id]/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import blogModel from '@/models/Blog';

export async function GET(request, { params }) {
  try {
    await connectDB()

    const { id } = await params

    const blog = await blogModel.findById({_id: id})
    
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
