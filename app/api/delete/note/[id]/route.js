import connectDB from '@/utils/db'
import noteModel from "@/models/Note";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const {id} = await params

    try {   
        const res = await noteModel.findByIdAndDelete({_id: id})
        return NextResponse.json({
            success: true,
            message: "Note Delete Successfully!"
        })
    } catch (err) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}