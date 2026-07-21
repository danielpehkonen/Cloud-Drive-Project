import mongoose, { Schema, Document} from "mongoose"

interface IUser extends Document {
    email: string,
    username: string,
    password: string,
    profilePicturePath?: string | null

}

let userSchema = new Schema({
    email: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, reqiured: true},
    profilePicturePath: {type: String, default: null}
    
})

const User: mongoose.Model<IUser> = mongoose.model<IUser>("User", userSchema);

export {User, IUser}