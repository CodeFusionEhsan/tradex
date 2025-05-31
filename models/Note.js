import mongoose from 'mongoose'

const noteSchema = new mongoose.Schema({
    title: { type: String },
    content: { type: String },
    uploaded_at: {type: String, default: new Date().toLocaleDateString()},
    uploaded_by: {
        user_id: { type: String },
        user_image: { type: String}
    }
})

const noteModel = mongoose.models.notes || mongoose.model("notes", noteSchema)

export default noteModel