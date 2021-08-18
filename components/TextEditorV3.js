import React, { useRef } from "react";
import dynamic from "next/dynamic";
import styles from "styles/Texteditor.module.scss";
import { Editor } from "@tinymce/tinymce-react";

// const Editor = dynamic(
//   () => import("@tinymce/tinymce-react").then((module) => module.default),
//   {
//     ssr: false,
//   }
// );

function TextEditorV3() {
  const editorRef = useRef(null);

  const logASHE = () => {
    console.log("ASHE");
    // if (editorRef.current) {
    //   console.log(editorRef.current.getContent());
    // }
  };

  return (
    <>
      <Editor
        apiKey="kxn1q8r983c4h9p1p9jh1tvo7dftrpvj5igqsa6vh968nlnj"
        config={{
          plugins: "link image lists print preview",
          toolbar:
            "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist",
        }}
      />
      <button onClick={logASHE}>Log editor content</button>
    </>
  );
}

export default TextEditorV3;
