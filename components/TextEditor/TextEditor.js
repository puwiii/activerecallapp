import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
//styles
import "node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import styles from "./style.module.scss";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((module) => module.Editor),
  {
    ssr: false,
  }
);

function TextEditor({ wrapperClassName, callback, isView, data }) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (editorState) => {
    if (!isView) {
      setEditorState(editorState);
      if (editorState.getCurrentContent().hasText()) {
        callback(convertToRaw(editorState.getCurrentContent()));
      } else {
        callback(null);
      }
    }
  };

  useEffect(() => {
    if (isView) {
      setEditorState(EditorState.createWithContent(convertFromRaw(data)));
      //console.log(editorState.getCurrentContent().getPlainText());
    }
  }, []);

  return (
    <div
      // ${isView && styles.isView}
      className={`${wrapperClassName} ${styles.div} ${isView && styles.isView}`}
    >
      <Editor
        tabIndex="-1"
        editorState={editorState}
        toolbarClassName={styles.toolbar}
        wrapperClassName={styles.wrapper}
        editorClassName={styles.editor}
        readOnly={isView}
        toolbarHidden={isView}
        onEditorStateChange={onEditorStateChange}
        toolbar={{
          inline: { inDropdown: false },
          list: { inDropdown: true },
          textAlign: { inDropdown: true },
          link: { inDropdown: true },
          fontFamily: {
            options: [
              "Arial",
              "Georgia",
              "Lora", //1.3
              "Nunito", //7.8
              "Open Sans", //7
              "Poppins",
              "Quicksand", //7,7
              "Roboto",
              "Roboto Slab",
              "Rubik", //5
              "Source Sans Pro", //3
              "Tahoma",
              "Times New Roman",
              "Verdana",
            ],
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
          },
        }}
      />
      <style jsx>{``}</style>
    </div>
  );
}

export default TextEditor;
