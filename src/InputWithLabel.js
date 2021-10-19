import React from "react";

const InputWithLabel = ({title, isFocused, onTitleChange, children}) => {
  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  });

  return (
    <>
      <label htmlFor='todoTitle'>{children}</label>
      &nbsp;
      <input
        ref={inputRef}
        id='todoTitle'
        name='title'
        type='text'
        value={title}
        onChange={onTitleChange}
      />
    </>
  );
};

export default InputWithLabel;