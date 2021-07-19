import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { EditorState, convertFromRaw } from "draft-js";

//styles
import "node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import styles from "styles/Card.module.scss";
import TextEditor from "components/TextEditor";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((module) => module.Editor),
  {
    ssr: false,
  }
);

function CardContainer({ cardId, front, back, createdAt }) {
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(convertFromRaw(front))
  );

  const onEditorStateChange = (editorState) => {};

  //   useEffect(() => {
  //     console.log(front);
  //     console.log(convertFromRaw(front));
  //     setEditorState(convertFromRaw(front));
  //   });

  return (
    <div className={styles.card}>
      <TextEditor isView={true} data={front} />
    </div>
  );
}

export default CardContainer;
