import connectDB from "@/utils/db";
import blogModel from '@/models/Blog'
import { NextResponse } from "next/server";

export async function GET(req) {
    await connectDB()

    const blogs = await blogModel.find().lean()

    if (blogs) {
        return NextResponse.json({
            result: blogs,
            success: true
        })
    } else {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}