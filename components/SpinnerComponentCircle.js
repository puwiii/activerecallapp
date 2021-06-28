import React from 'react'
import { css } from "@emotion/react";
import Spinner from "react-spinners/PuffLoader";

const override = css`
  display: inline-block;
  margin: 20px;
  border-color: #0876bb;
`;

function SpinnerComponentCircle() {
    return (
        <Spinner color={"#0876bb"} loading={true} css={override} size={50} />
    )
}

export default SpinnerComponentCircle