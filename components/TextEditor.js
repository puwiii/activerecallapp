import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";

//styles
// import "node_modules/blabla/blabla.css";

import "node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import styles from "styles/Texteditor.module.scss";

// //fa
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCoffee } from "@fortawesome/free-solid-svg-icons";

// import ExploreIcon from "components/icons/ExploreIcon";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((module) => module.Editor),
  {
    ssr: false,
  }
);

const toolbarConfig = {
  options: [
    "link",
    "image",
    "fontFamily",
    "fontSize",
    "colorPicker",
    "inline",
    "blockType",
    "textAlign",
    "list",
    "history",
  ],

  inline: {
    inDropdown: false,
    className: styles.toolbarButtons,
    dropdownClassName: undefined,
    options: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "monospace",
      "superscript",
      "subscript",
    ],
    bold: {
      icon: "/toolbarIcons/bold.svg",
      className: styles.toolbarButton,
    },
    italic: {
      icon: "/toolbarIcons/italic.svg",
      className: styles.toolbarButton,
    },
    underline: {
      icon: "/toolbarIcons/underline.svg",
      className: styles.toolbarButton,
    },
    strikethrough: {
      icon: "/toolbarIcons/strikethrough.svg",
      className: styles.toolbarButton,
    },
    monospace: {
      //icon: "/toolbarIcons/superscript.svg",
      className: styles.toolbarButton,
    },
    superscript: {
      icon: "/toolbarIcons/superscript.svg",
      className: styles.toolbarButton,
    },
    subscript: {
      icon: "/toolbarIcons/subscript.svg",
      className: styles.toolbarButton,
    },
  },

  blockType: {
    inDropdown: true,
    options: [
      "Normal",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
      "Blockquote",
      "Code",
    ],
    className: styles.toolbarDropdown,
    dropdownClassName: styles.toolbarDropdownList,
  },

  fontSize: {
    //icon: "/toolbarIcons/fontsize.svg",
    options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
    className: styles.toolbarDropdown,
    dropdownClassName: styles.toolbarDropdownList,
  },

  fontFamily: {
    options: [
      "Abril Fatface",
      "Arial",
      "Georgia",
      "Lato",
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
    className: styles.toolbarDropdown,
    dropdownClassName: styles.toolbarDropdownList,
  },

  list: {
    inDropdown: false,
    className: styles.toolbarButtons,
    options: ["unordered", "ordered", "indent", "outdent"],
    unordered: {
      icon: "/toolbarIcons/list-ul.svg",
      className: styles.toolbarButton,
    },
    ordered: {
      icon: "/toolbarIcons/list-ol.svg",
      className: styles.toolbarButton,
    },
    indent: {
      icon: "/toolbarIcons/indent.svg",
      className: styles.toolbarButton,
    },
    outdent: {
      icon: "/toolbarIcons/outdent.svg",
      className: styles.toolbarButton,
    },
  },

  textAlign: {
    className: styles.toolbarButtons,
    options: ["left", "center", "right", "justify"],
    left: {
      icon: "/toolbarIcons/align-left.svg",
      className: styles.toolbarButton,
    },
    center: {
      icon: "/toolbarIcons/align-center.svg",
      className: styles.toolbarButton,
    },
    right: {
      icon: "/toolbarIcons/align-right.svg",
      className: styles.toolbarButton,
    },
    justify: {
      icon: "/toolbarIcons/align-justify.svg",
      className: styles.toolbarButton,
    },
  },

  colorPicker: {
    icon: "/toolbarIcons/palette.svg",
    className: styles.toolbarButton,
    colors: [
      "rgb(97,189,109)",
      "rgb(26,188,156)",
      "rgb(84,172,210)",
      "rgb(44,130,201)",
      "rgb(147,101,184)",
      "rgb(71,85,119)",
      "rgb(204,204,204)",
      "rgb(65,168,95)",
      "rgb(0,168,133)",
      "rgb(61,142,185)",
      "rgb(41,105,176)",
      "rgb(85,57,130)",
      "rgb(40,50,78)",
      "rgb(0,0,0)",
      "rgb(247,218,100)",
      "rgb(251,160,38)",
      "rgb(235,107,86)",
      "rgb(226,80,65)",
      "rgb(163,143,132)",
      "rgb(239,239,239)",
      "rgb(255,255,255)",
      "rgb(250,197,28)",
      "rgb(243,121,52)",
      "rgb(209,72,65)",
      "rgb(184,49,47)",
      "rgb(124,112,107)",
      "rgb(209,213,216)",
    ],
  },

  link: {
    className: styles.toolbarButtons,
    popupClassName: styles.popup,
    dropdownClassName: styles.popup,
    link: {
      icon: "/toolbarIcons/link.svg",
      className: styles.toolbarButton,
    },
    unlink: {
      icon: "/toolbarIcons/unlink.svg",
      className: styles.toolbarButton,
    },
  },

  image: {
    icon: "/toolbarIcons/image.svg",
    className: styles.toolbarButton,
    popupClassName: styles.popup,
    urlEnabled: true,
    uploadEnabled: true,
    alignmentEnabled: true,
    uploadCallback: undefined,
    previewImage: true,
    inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
    alt: { present: false, mandatory: false },
    defaultSize: {
      height: "auto",
      width: "auto",
    },
  },

  history: {
    className: styles.toolbarButtons,
    options: ["undo", "redo"],
    undo: {
      icon: "/toolbarIcons/undo.svg",
      className: styles.toolbarButton,
    },
    redo: {
      icon: "/toolbarIcons/redo.svg",
      className: styles.toolbarButton,
    },
  },
};

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
  }, [data]);

  return (
    <div
      // ${isView && styles.isView}
      className={`${wrapperClassName} ${styles.div} ${isView && styles.isView}`}
    >
      <Editor
        // tabIndex="-1"
        editorState={editorState}
        toolbarClassName={styles.toolbar}
        wrapperClassName={styles.wrapper}
        editorClassName={styles.editor}
        readOnly={isView}
        toolbarHidden={isView}
        onEditorStateChange={onEditorStateChange}
        toolbar={toolbarConfig}
        placeholder="Comienza a escribir aquí..."
      />
      <style jsx>{``}</style>
    </div>
  );
}

export default TextEditor;
