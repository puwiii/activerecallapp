import React from "react";
import { css } from "@emotion/react";
import Spinner from "react-spinners/ClipLoader";

const override = css`
  display: inline-block;
  margin: 0px;
  border-color: #0876bb;
  margin: auto;
`;

function SpinnerComponentCircle({ withoutText = false, propsCss = null }) {
  return (
    <div>
      <Spinner
        color={"#0876bb"}
        loading={true}
        // css={override}
        size={50}
        speedMultiplier={1.6}
      />

      {!withoutText && <span>cargando</span>}

      <style jsx>{`
        div {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2em;
        }

        span {
          font-size: 1.28rem;
          color: #0876bb;
          font-weight: 700;
        }

        div {
          ${propsCss}
        }
      `}</style>
    </div>
  );
}

export default SpinnerComponentCircle;
