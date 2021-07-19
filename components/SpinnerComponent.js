import React from "react";
import { css } from "@emotion/react";
import Spinner from "react-spinners/PulseLoader";

const override = css`
  display: inline-block;
  margin: 15px;
  border-color: #0876bb;
`;

function SpinnerComponent() {
  return <Spinner color={"#0876bb"} loading={true} css={override} size={6} />;
}

export default SpinnerComponent;
