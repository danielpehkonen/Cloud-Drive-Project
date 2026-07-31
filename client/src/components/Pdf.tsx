import { Document, Page, StyleSheet } from "@react-pdf/renderer"
import Html from "react-pdf-html"

interface PdfProps {
    content: string
}

const styles = StyleSheet.create({
    page: {
        padding: 40
    }
})

const htmlStyles = {
    body: {
        fontSize: 12,
        lineHeight: 1.5
    },
    
    // Add Quill-specific text alignments
    ".ql-align-center": {
        textAlign: "center"
    },

    ".ql-align-right": {
        textAlign: "right"
    },

    ".ql-align-justify": {
        textAlign: "justify"
    }
}

export const Pdf = ({content}: PdfProps) => {
    return (
        <Document>
            <Page
                size="A4"
                style={styles.page}>
                <Html
                    style={{ fontSize: 12}}
                    stylesheet={htmlStyles}    
                >
                    {content}
                </Html>
            </Page>
        </Document>
    )
}