import React from 'react'
import dynamic from 'next/dynamic'

//styles
import 'node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const Editor = dynamic(() => 
    import("react-draft-wysiwyg")
    .then((module) => module.Editor),
    {
        ssr: false,
    }
) 

function TextEditor({wrapperClassName}) {
    return (
        <Editor
            toolbarClassName="toolbarClassName"
            wrapperClassName={wrapperClassName}
            editorClassName="editorClassName"
        />
    )
}

export default TextEditor
