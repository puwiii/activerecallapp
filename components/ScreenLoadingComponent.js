import React from "react";
import { css } from "@emotion/react";
import Spinner from "react-spinners/BarLoader";
import LogoSvg from "svgs/LogoSvg";

const override = css`
  display: inline-block;
  margin: 0px;
`;

function ScreenLoadingComponent() {
  return (
    <div>
      <LogoSvg width={200} height={150} />
      <Spinner
        color={"#0876bb"}
        loading={true}
        css={override}
        height={4}
        width={150}
        speedMultiplier={1.5}
      />
      <style jsx>{`
        div {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}

export default ScreenLoadingComponent;
