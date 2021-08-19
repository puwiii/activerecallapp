import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import styles from "styles/Texteditor.module.scss";

const JoditEditor = dynamic(
  () => import("jodit-react").then((module) => module.default),
  {
    ssr: false,
  }
);

function TextEditorV2() {
  const editor = useRef(null);
  const [content, setContent] = useState("");

  const config = {
    iframe: true,
    toolbarAdaptive: false,
    defaultMode: "1",
    uploader: {
      insertImageAsBase64URI: true,
    },
    defaultActionOnPaste: "insert_as_text",
    disablePlugins: "delete",
    buttons:
      "bold,italic,underline,strikethrough,eraser,superscript,subscript,ul,ol,indent,outdent,left,fontsize,paragraph,brush,image,fullsize",
    buttonsSM:
      "bold,italic,underline,strikethrough,eraser,superscript,subscript,ul,ol,indent,outdent,left,fontsize,paragraph,brush,image,fullsize",
    buttonsMD:
      "bold,italic,underline,strikethrough,eraser,superscript,subscript,ul,ol,indent,outdent,left,fontsize,paragraph,brush,image,fullsize",
    buttonsXS:
      "bold,italic,underline,strikethrough,eraser,superscript,subscript,ul,ol,indent,outdent,left,fontsize,paragraph,brush,image",
    maxHeight: parent.innerHeight * 0.4,
    height: parent.innerHeight * 0.4,
    maxWidth: 700,
    minWidth: 250,
  };

  const handleContent = (content) => {
    try {
      setContent(content);
      console.log(content);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.editor}>
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        // tabIndex={1} // tabIndex of textarea
        onBlur={(newContent) => handleContent(newContent)} // preferred to use only this option to update the content for performance reasons
        onLoad={(e) => console.log("cargando")}
        // onChange={newContent => {}}
      />
    </div>
  );
}

export default TextEditorV2;
