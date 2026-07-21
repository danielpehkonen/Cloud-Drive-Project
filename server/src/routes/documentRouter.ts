import {Router, Request, Response} from "express"
import { DriveDocument, IDriveDocument } from "../models/Document";
import { validateToken, CustomRequest } from "../../middleware/validateToken";
import { body, Result, ValidationError, validationResult } from "express-validator";
import { addEditorValidators } from "../../validators/inputValidation";
import { User } from "../models/User";
import crypto from "crypto"

const documentRouter: Router = Router();


// Get all documents associated with the user
documentRouter.get("/get", validateToken, async (req: CustomRequest, res: Response) => {
    try {
        // Get all documents with owner's ID and sort it by last updated and get username by ID
        const documents: IDriveDocument[] | null = await DriveDocument.find({
            $or: [
                {ownerId: req.user?._id},
                {editorIds: req.user?._id}
            ]
            
        })
        .sort({updatedAt: -1})
        .populate("ownerId", "username");

        return res.status(200).json(documents);
    } catch (error: any) {
        console.log(error)
        return res.status(500).json({message: "Internal server error"})
    }
})

// Save a new document for the user in the database
documentRouter.post("/create", validateToken, async (req: CustomRequest, res: Response) => {
    try {
        const newDocument: IDriveDocument | null = new DriveDocument({
            ownerId: req.user?._id
        })

        await newDocument.save();

        return res.status(200).json({documentId: newDocument._id});

    } catch (error: any) {
        console.log(error)
        return res.status(500).json({message: "Internal server error"})
    }
})

// Find and delete a document with mathcing documentId and ownerId from token
documentRouter.delete("/:documentId", validateToken, async (req: CustomRequest, res: Response) => {
    try {
        const deletedDocument = await DriveDocument.findOneAndDelete({
            _id: req.params.documentId,
            ownerId: req.user?._id
        });

        if(!deletedDocument) {
            return res.status(404).json({
                message: "Document not found"
            })
        }

        return res.status(200).json({message: "Document deleted successfully"})
    } catch (error: any) {
        console.log(error)
        return res.status(500).json({message: "Internal server error"});
    }
})

// Get a specific document
documentRouter.get("/:documentId", validateToken, async (req: CustomRequest, res: Response) => {
    try {
        // Find document with matching id and user's id in either owner or editorIds
        const document = await DriveDocument.findOne({
            _id: req.params.documentId,
            $or: [ 
                { ownerId: req.user?._id},
                { editorIds: req.user?._id}
            ]
        });

        if(!document) {
            return res.status(404).json({
                message: "Document not found"
            })
        }

        return res.status(200).json(document)
    } catch (error: any) {
        console.log(error)
        return res.status(500).json({message: "Internal server error"});
    }
})

// Save document changes
documentRouter.put("/:documentId", validateToken, async (req: CustomRequest, res: Response) => {
    try {

        const updatedDocument = await DriveDocument.findOneAndUpdate({
            _id: req.params.documentId,
            $or: [
                { ownerId: req.user?._id},
                { editorIds: req.user?._id}
            ]
            },
            {
            $set: {
                title: req.body.title.trim() || "Document",
                content: req.body.content
            }
            },
            {
            returnDocument: "after",
            runValidators: true
        });

        if (!updatedDocument) {
            return res.status(404).json({message: "Document not found or access denied"});
        }

        return res.status(200).json({
            message: "Document saved successfully",
            document: updatedDocument
        })
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }
})

documentRouter.patch("/:documentId/editors", validateToken, addEditorValidators, async (req: CustomRequest, res: Response) => {
    const errors: Result<ValidationError> = validationResult(req);
    
    //Return only the first validation error from each field instead of whole list.
    if(!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).json({
            errors: errors.array({
            onlyFirstError: true
                })
            });
        }

    try {
        const editor = await User.findOne({email: req.body.email});

        if (!editor) {
            return res.status(404).json({message: "User not found"})
        }

        const document = await DriveDocument.findOneAndUpdate({
            _id: req.params.documentId,
            ownerId: req.user?._id
        },
        {
            $addToSet: {
                editorIds: editor._id
            }
        },
        {
            returnDocument: "after"
        }
        );

        if (!document) {
            return res.status(404).json({message: "Document not found or access denied"})
        }

        return res.status(200).json({message: "Editor added successfully"})


    } catch (error: any) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }
})

// Set document to public and create a token for a public document URL
documentRouter.patch("/:documentId/public-share", validateToken, async (req: CustomRequest, res: Response) => {
    try {
        const document = await DriveDocument.findOne({
            _id: req.params.documentId,
            ownerId: req.user?._id
        });

        if (!document) {
            return res.status(404).json({message: "Document not found or access denied"})
        }

        document.public = true;
        
        // Creata 32 random bytes for the public document URL
        if (!document.publicShareToken) {
            document.publicShareToken = crypto.randomBytes(32).toString("hex");
        }

        await document.save()

        return res.status(200).json({shareToken: document.publicShareToken})
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }
})
// Get a public document
documentRouter.get("/public/:shareToken", async (req: Request, res: Response) => {
    try {
        const document = await DriveDocument.findOne({
             publicShareToken: req.params.shareToken,
             public: true
        }).select(
            "title content updatedAt"
        );

        if (!document) {
            return res.status(404).json({message: "Shared document not found"})
        }

        return res.status(200).json(document)
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }
})

export default documentRouter