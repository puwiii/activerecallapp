import React from 'react'
import { css } from "@emotion/react";
import Spinner from "react-spinners/PulseLoader";

const override = css`
  display: block;
  margin: 20px;
  border-color: #0e98ee;
`;

function SpinnerComponent() {
    return (
        <Spinner color={"#0e98ee"} loading={true} css={override} size={6} />
    )
}

export default SpinnerComponent
