import * as React from "react";

function SortDescCalIcon(props) {
  return (
    <svg
      width={21}
      height={21}
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M11.125 6h6.75C18.496 6 19 6.504 19 7.125v6.75c0 .621-.504 1.125-1.125 1.125h-6.75A1.125 1.125 0 0110 13.875v-6.75C10 6.504 10.504 6 11.125 6z"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 8.25h9M8 9L5 6 2 8.998M5 6v9"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default SortDescCalIcon;
