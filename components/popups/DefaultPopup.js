import React from "react";

function DefaultPopup({ isOpen, closeWindow, title, desc }) {
  return (
    <div className={popupStyles.windowBg + " " + (isOpen && "is-open")}>
      <div className={popupStyles.window}>
        <button onClick={closeWindow} className={popupStyles.closeBtn}>
          <CloseIcon />
        </button>
        <h1 className={popupStyles.title}>{title}</h1>
        <p className={popupStyles.description}>{desc}</p>
        <div className={popupStyles.buttons}>
          <button onClick={closeWindow} className={popupStyles.primaryButton}>
            <BackIcon />
            Cerrar
          </button>
        </div>
      </div>

      <style jsx>{`
        .is-open {
          display: grid !important;
        }

        h1 {
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default DefaultPopup;
