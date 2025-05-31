import connectDB from "@/utils/db";
import blogModel from "@/models/Blog";
import { NextResponse } from "next/server";


export async function GET(req, { params }) {
    const { id } = await params
    console.log(id)

    if (id) {
        await connectDB()

        try {

            const blogs = await blogModel.find({"uploaded_by.user_id": id })

            console.log(blogs)

            return NextResponse.json({
                success: true,
                results: blogs
            })
        
        } catch (err) {
            return NextResponse.json({
                message: "Internal Server Error",
                success: false
            })
        }
        
    } else {
        return NextResponse.json({
            success: false,
            message: "No ID Received"
        })
    }
}