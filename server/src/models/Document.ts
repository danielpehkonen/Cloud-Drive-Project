import mongoose, {Schema, Document, Types} from "mongoose"



interface IDriveDocument extends Document {
    title?: string,
    content?: string,
    ownerId: Types.ObjectId,
    editorIds?: Types.ObjectId[],
    public?: boolean,
    publicShareToken?: string,
    createdAt?: Date,
    updatedAt?: Date
    lockedBy?: Types.ObjectId,
    lockExpiration?: Date
}

// Using 'timestamps' to set createdAt and keep updatedAt up-to-date
// ref: "User" on ownerId allows username by id to show on the document owner column in the frontend

const driveDocumentSchema = new Schema(
    {
        title: {type: String, default: "Document"},
        content: {type: String, default: ""},
        ownerId: {type: Schema.Types.ObjectId, ref: "User", required: true},
        editorIds: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "User"
                }
            ],
            default: []
        },
        public: {type: Boolean, default: false},
        publicShareToken: {type: String, unique: true, sparse: true},
        lockedBy: {type: Schema.Types.ObjectId, ref: "User", default: null},
        lockExpiration: {type: Date, default: null}
        
    }, {timestamps: true}
);

const DriveDocument: mongoose.Model<IDriveDocument> = mongoose.model<IDriveDocument>("DriveDocument", driveDocumentSchema)

export {DriveDocument, IDriveDocument}