import React from "react";
import { css } from "@emotion/react";
import Spinner from "react-spinners/PuffLoader";

const override = css`
  display: inline-block;
  margin: 0px;
  border-color: #0876bb;
  margin: auto;
`;

function SpinnerComponentCircle(props) {
  return (
    <Spinner
      color={"#0876bb"}
      loading={true}
      css={override}
      size={50}
      {...props}
    />
  );
}

export default SpinnerComponentCircle;
