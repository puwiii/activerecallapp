import * as React from "react";

function PlusIcon(props) {
  return (
    <svg
      height={21}
      viewBox="0 0 21 21"
      width={21}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g
        fill="none"
        fillRule="evenodd"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5.5 10.5h10M10.5 5.5v10" />
      </g>
    </svg>
  );
}

export default PlusIcon;
