import * as React from "react"

function CloseIcon(props) {
  return (
    <svg
      height={25}
      viewBox="0 0 21 21"
      width={25}
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
        <path d="M7.5 7.5l6 6M13.5 7.5l-6 6" />
      </g>
    </svg>
  )
}

export default CloseIcon
