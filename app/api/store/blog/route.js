import connectDB from "@/utils/db";
import blogModel from "@/models/Blog"
import { NextResponse } from "next/server";

export async function POST(req) {
    const formData = await req.formData()
    const title = formData.get("title")
    const excerpt = formData.get("excerpt")
    const content = formData.get("content")
    const image = formData.get('image')
    const reading_time = formData.get("reading_time")
    const tags = formData.get("tags")
    const user_string = formData.get("user")
    const user = JSON.parse(user_string)

    if (title && excerpt &&  content && image && user) {
        
        await connectDB()

        const newblog = new blogModel({
            image: image,
            content: content,
            excerpt: excerpt,
            title: title,
            reading_time: reading_time,
            uploaded_by: {
                user_id: user.user_id,
                user_image: user.user_image
            },
            tags: tags
        })

        try {

            const result = await newblog.save()

            return NextResponse.json({
                blog: result,
                success: true
            })

        } catch (err) {
            console.log(err)
            return NextResponse.json({
                success: false,
                message: "Please Fill All The Fields"
            })
        }


    } else {
        return NextResponse.json({
            success: false,
            message: "Please Fill All The Fields"
        })
    }
}