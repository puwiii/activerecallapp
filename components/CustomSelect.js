import DownArrowIcon from "icons/DownArrowIcon";
import React, { useState, useEffect } from "react";
import styles from "styles/CustomSelect.module.scss";

function CustomSelect({ options, setActualState, defaultAction }) {
  const [selectState, setSelectState] = useState(options[0]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    defaultAction();
  }, []);

  return (
    <div className={styles.select}>
      <div
        className={`${styles.select__value} ${
          open && styles.select__value__focus
        }`}
        onClick={(e) => setOpen(!open)}
      >
        {selectState.component}
        <DownArrowIcon />
      </div>
      <div
        className={`${styles.select__options} ${open && styles.select__opened}`}
      >
        {options.map((option) => (
          <div
            key={option.value}
            className={styles.select__option}
            onClick={(e) => {
              setSelectState(option);
              setActualState(option.value);
              option.action();
              setOpen(false);
            }}
          >
            {option.component}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomSelect;
