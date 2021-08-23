import { useState, useEffect } from "react";

import componentsStyles from "styles/ComponentsStyles.module.scss";

//icons
import EyeClosed from "icons/EyeClosed";
import EyeOpen from "icons/EyeOpen";

function useInput(spanValue, propsInput, isTextArea = false) {
  const [inputValue, setInputValue] = useState("");
  const [input, setInput] = useState(propsInput);
  const [hidePassword, setHidePassword] = useState(true);

  const handleHidePassword = () => {
    if (hidePassword === true) {
      input.type = "text";
      setHidePassword(false);
    } else {
      input.type = "password";
      setHidePassword(true);
    }
  };

  const setFocus = () => {
    const inputElement = document.querySelector(`#${input.id}`);
    inputElement.focus();
  };
  // useEffect(()=>{
  //   if(propsInput.defaultValue) {
  //     setInputValue(propsInput.defaultValue)
  //     // const Input = document.getElementById(propsInput.id)
  //     // Input.focus()
  //     // Input.select()
  //   }
  // },[propsInput])

  const component = (
    <div
      className={`${componentsStyles.input} ${
        inputValue.trim() !== "" && componentsStyles.input__withValue
      }`}
    >
      <label htmlFor="username">{spanValue}</label>
      {isTextArea ? (
        <textarea
          className={componentsStyles.inputRounded}
          {...input}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      ) : (
        <input
          className={componentsStyles.inputRounded}
          {...input}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      )}
      {propsInput.type === "password" && (
        <span
          className={componentsStyles.input__passwordIcon}
          onClick={handleHidePassword}
        >
          {hidePassword ? <EyeClosed /> : <EyeOpen />}
        </span>
      )}
    </div>
  );

  return [inputValue.trim(), component, setFocus];
}

export default useInput;
