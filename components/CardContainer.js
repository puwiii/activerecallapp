import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { EditorState, convertFromRaw } from "draft-js";

//styles
import "node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import styles from "styles/Card.module.scss";

//components
import TextEditor from "components/TextEditor";

//icons
import CaptureIcon from "icons/CaptureIcon";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((module) => module.Editor),
  {
    ssr: false,
  }
);

function CardContainer({ cardId, data, createdAt, type = null }) {
  return (
    <div className={styles.card}>
      {type && (
        <span>
          <CaptureIcon />
          {type}
        </span>
      )}
      <TextEditor isView={true} data={data} />
    </div>
  );
}

export default CardContainer;
