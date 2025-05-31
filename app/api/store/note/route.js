import connectDB from "@/utils/db";
import noteModel from "@/models/Note"
import { NextResponse } from "next/server";

export async function POST(req) {
    const formData = await req.formData()
    const title = formData.get("title")
    const content = formData.get("content")
    const user_string = formData.get("user")
    const user = JSON.parse(user_string)

    if (title && content && user) {
        
        await connectDB()

        const newnote = new noteModel({
            title: title,
            content: content,
            uploaded_by: {
                user_id: user.user_id,
                user_image: user.user_image
            }
        })

        try {
            const result = await newnote.save()

            return NextResponse.json({
                success: true,
                result: result
            })

        } catch (err) {
            console.log(err)
        }
    } else {
        return NextResponse.json({
            success: false,
            message: "Please Fill All The Fields"
        })
    }
}