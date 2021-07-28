import * as React from "react"

function InfoIcon(props) {
  return (
    <svg
      height={21}
      viewBox="0 0 21 21"
      width={21}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g fill="none" fillRule="evenodd" transform="translate(2 2)">
        <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <circle cx={8.5} cy={8.5} r={8} />
          <path d="M8.5 12.5v-4h-1M7.5 12.5h2" />
        </g>
        <circle cx={8.5} cy={5.5} fill="currentColor" r={1} />
      </g>
    </svg>
  )
}

export default InfoIcon
