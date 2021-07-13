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
    }
  }, []);

  return (
    <div
      className={`${wrapperClassName} ${styles.div} ${isView && styles.isView}`}
    >
      <Editor
        tabIndex="-1"
        editorState={editorState}
        toolbarClassName={styles.toolbar}
        wrapperClassName={styles.wrapper}
        editorClassName={styles.editor}
        onEditorStateChange={onEditorStateChange}
      />
      <style jsx>{``}</style>
    </div>
  );
}

export default TextEditor;
