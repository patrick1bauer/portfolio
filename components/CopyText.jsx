import React from "react";

const CopyText = ({ text, children, feedbackMessage }) => {
  const copyText = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        // Optional feedback
        if (feedbackMessage) {
          alert(feedbackMessage);
        }
      })
      .catch(err => {
        console.error('Failed to copy text to clipboard', err);
      });
  };

  const handleClick = (event) => {
    // Prevent the default action to ensure the text is copied correctly
    event.preventDefault();
    copyText(text || event.target.innerText);
  };

  return (
    <a onClick={handleClick}>
        {children || text}
    </a>
  );
};

export default CopyText;