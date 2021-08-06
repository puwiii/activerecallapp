import * as React from "react";

function SortAscCalIcon(props) {
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
        d="M11.125 5h6.75C18.496 5 19 5.504 19 6.125v6.75c0 .621-.504 1.125-1.125 1.125h-6.75A1.125 1.125 0 0110 12.875v-6.75C10 5.504 10.504 5 11.125 5z"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 7.25h9M2 11l3 4 3-4M5 5v10"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default SortAscCalIcon;
