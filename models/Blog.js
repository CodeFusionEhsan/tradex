import mongoose, { mongo } from "mongoose";

const blogSchema = new mongoose.Schema({
    image: {type: String, required: true},
    content: {type: String, required: true},
    excerpt: {type: String, required: true},
    title: {type: String, required: true},
    reading_time: {type: String, required: true},
    uploaded_by: {
        user_id: {type: String},
        user_image: { type: String }
    },
    tags: { type: String},
    uploaded_at: {type: String, default: new Date().toLocaleDateString()}
})

blogSchema.index({content: 'text', title: 'text', excerpt: 'text', tags: 'text', uploaded_at: 'text'})

const blogModel = mongoose.models.blogs || mongoose.model('blogs', blogSchema)

export default blogModel