import React, { useState } from 'react';
import MarkDown from '../markDown/MarkDown';

const ChatHistory = ({ previousChats, scrollToLastItem }) => {
  return (
    <div className='main-header'>
      {previousChats.length ? (
        <ul>
          {previousChats?.map((chatMsg, idx) => (
            <React.Fragment key={idx}>
              <div>
                <li
                  className='fullmetal-chat-li'
                  ref={scrollToLastItem}
                  style={
                    chatMsg.role === 'user' ? { backgroundColor: 'unset' } : {}
                  }
                >
                  <img
                    src={
                      chatMsg.role === 'user'
                        ? '/face_logo.svg'
                        : '/fullmetal.png'
                    }
                    alt={chatMsg.role === 'user' ? 'Face icon' : 'ChatGPT icon'}
                    style={{
                      backgroundColor: chatMsg.role === 'user' && '#ECECF1',
                    }}
                  />
                  <div
                    style={{
                      wordWrap: 'break-word',
                      whiteSpace: 'pre-wrap',
                      width: '-webkit-fill-available',
                    }}
                  >
                    <MarkDown chatMsgContent={chatMsg.content} />
                  </div>
                </li>
                {chatMsg.role !== 'user' &&
                  chatMsg.model &&
                  chatMsg.speed &&
                  chatMsg.elapsedTime && (
                    <li
                      className='fullmetal-chat-li'
                      style={{
                        textAlign: 'right',
                        display: 'block',
                        padding: '2px',
                        backgroundColor: 'transparent',
                      }}
                    >
                      <small style={{ color: '#1acb1a' }}>
                        Model={chatMsg.model}, Speed={chatMsg.speed}, Elapsed
                        Time={chatMsg.elapsedTime}
                      </small>
                    </li>
                  )}
              </div>
            </React.Fragment>
          ))}
        </ul>
      ) : (
        <div style={{ width: '35vw', margin: '10vh auto' }}>
          <p>
            <a
              href='http://fullmetal.ai/'
              target='_blank'
              rel='noreferrer'
              style={{ color: 'lightblue' }}
            >
              Fullmetal.Ai
            </a>{' '}
            is a distributed network of publicly-powered, self-hosted Large
            Language Models (LLMs). Our mission is to provide enhanced usability
            of open-source LLMs in terms of quality, performance, and
            accessibility.
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
