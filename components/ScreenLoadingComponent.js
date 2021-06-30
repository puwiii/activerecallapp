import React from 'react'
import { css } from "@emotion/react";
import Spinner from "react-spinners/BarLoader";

const override = css`
  display: inline-block;
  margin: 0px;
`;

function ScreenLoadingComponent() {
    return (
    <div>
        <Spinner color={"#0876bb"} loading={true} css={override} size={6} />
        <style jsx>{`
            div{
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: grid;
                place-items: center;
            }
        `}</style>
    </div>
    )
}

export default ScreenLoadingComponent