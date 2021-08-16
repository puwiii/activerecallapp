import React, { useState, useEffect } from "react";

import componentsStyles from "styles/ComponentsStyles.module.scss";

function Input({ spanValue, propsInput }) {
  const [inputValue, setInputValue] = useState(null);

  const component = (
    <div
      className={`${componentsStyles.input} ${
        inputValue.trim() !== "" && componentsStyles.input__withValue
      }`}
    >
      <label htmlFor="username">{spanValue}</label>
      <input
        className={styles.inputRounded}
        {...propsInput}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </div>
  );

  return [inputValue, component];
}

export default Input;
