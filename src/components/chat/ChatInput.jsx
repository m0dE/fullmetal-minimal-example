import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedoAlt } from '@fortawesome/free-solid-svg-icons';
import { BiSend } from 'react-icons/bi';

const ChatInput = ({
  prompt,
  isResponseLoading,
  textboxRef,
  setPrompt,
  handleTextAreaKeyPress,
  submitHandler,
  queuedNumberMessage,
}) => {
  return (
    <div>
      <div className='main-bottom'>
        <div className='form-container'>
          <textarea
            ref={textboxRef}
            type='text'
            placeholder='Send a message.'
            spellCheck='false'
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
            readOnly={isResponseLoading}
            onKeyDown={handleTextAreaKeyPress}
            value={
              isResponseLoading
                ? `Loading... ${queuedNumberMessage}`
                : prompt.charAt(0).toUpperCase() + prompt.slice(1)
            }
          ></textarea>
          {!isResponseLoading && (
            <button type='button' onClick={submitHandler}>
              <BiSend size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
