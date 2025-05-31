import connectDB from "@/utils/db";
import noteModel from "@/models/Note";
import { NextResponse } from "next/server";


export async function GET(req, { params }) {
    const { id } = await params
    console.log(id)

    if (id) {
        await connectDB()

        try {

            const notes = await noteModel.find({"uploaded_by.user_id": id })

            console.log(notes)

            return NextResponse.json({
                success: true,
                results: notes
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