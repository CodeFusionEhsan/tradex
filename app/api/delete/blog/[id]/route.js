import connectDB from '@/utils/db'
import blogModel from "@/models/Blog";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const {id} = await params

    try {   
        const res = await blogModel.findByIdAndDelete({_id: id})
        return NextResponse.json({
            success: true,
            message: "Blog Delete Successfully!"
        })
    } catch (err) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}