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

const cardStates = {
  0: "Nueva",
  1: "Estudiada",
  2: "Aprendida",
};

function CardContainer({ cardId, data, createdAt, type = null, state = null }) {
  return (
    <div className={styles.card}>
      <div className={styles.card__info}>
        {type && (
          <span>
            <CaptureIcon />
            {type}
          </span>
        )}
        <span>·</span>
        <span>{cardStates[state]}</span>
      </div>
      <TextEditor isView={true} data={data} />
      {/* 
      <style jsx>{`
        .${styles.card} {
          ${state === 0 && "background: #b6b31211;"}
          ${state === 1 && "background: #0876bb11;"}
          ${state === 2 && "background: #21a04711;"}
        }
      `}</style> */}
    </div>
  );
}

export default CardContainer;
