import React, { useEffect, useRef, useState } from 'react';
import ChatHistory from '../chat/ChatHistory';
import ModelSelection from '../models/ListModels';
import ChatInput from '../chat/ChatInput';
import fetchModelsUtility from '../../utils/FetchModels';
import {
  connectWebSocket,
  disconnectWebSocket,
  emitPrompt,
} from '../../utils/WebSocketService';

const ChatPage = () => {
  const [previousChats, setPreviousChats] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [message, setMessage] = useState('');
  const [isResponseLoading, setIsResponseLoading] = useState(false);
  const [summaryDetail, setSummaryDetail] = useState();
  const [queuedNumberMessage, setQueuedNumberMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [resRefId, setResRefId] = useState('');
  const [models, setModels] = useState([]);
  const scrollToLastItem = useRef(null);
  const textboxRef = useRef(null);

  let socketId;

  useEffect(() => {
    textboxRef && textboxRef.current && textboxRef.current.focus();

    (async () => {
      const modelsArray = await fetchModelsUtility();
      setModels(modelsArray);
    })();
  }, []);

  useEffect(() => {
    if (models) {
      setSelectedModel(models[0]);
    }
  }, [models]);

  /**
   * The `submitHandler` function is an asynchronous function that handles chat submission and displays
   * error messages on UI using toast message if necessary.
   * @returns The function does not have a return statement, so it does not explicitly return anything.
   */
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!selectedModel) {
      toast.error('Please select model');
      return;
    }

    if (!prompt) {
      toast.error('Please enter prompt');
      return;
    }

    try {
      SendPrompt();
    } catch (e) {
      console.error(e);
    }
  };

  const SendPrompt = () => {
    let tempPrompt = prompt;

    connectWebSocket(
      (socketId) => {
        console.log('Connected to WebSocket server', socketId);
      },
      (response) => {
        // @ts-ignore
        scrollToLastItem.current?.lastElementChild?.scrollIntoView({
          behavior: 'smooth',
        });

        setQueuedNumberMessage('');
        //if (response && response.length) {
        if (response.completed) {
          setSummaryDetail(response);
          setMessage('');
          setIsResponseLoading(false);
          setPrompt('');
          textboxRef && textboxRef.current && textboxRef.current.focus();

          // disconnect after response is over
          disconnectWebSocket();
        } else {
          setMessage((prev) => prev + response.token);
        }
      },
      (message) => {
        toast.error(message);
        setMessage('');
        setIsResponseLoading(false);
        setPrompt('');
        setQueuedNumberMessage('');
        textboxRef && textboxRef.current && textboxRef.current.focus();
        // disconnect after response is over
        newSocket.disconnect();
      },
      (queuedNumber) => {
        if (queuedNumber) {
          setQueuedNumberMessage(
            `Prompt successfully queued. There are ${queuedNumber} prompts ahead of you.`
          );
        }
      }
    );

    emitPrompt(prompt, selectedModel);
    setIsResponseLoading(true);

    setPreviousChats((prevChats) => [
      ...prevChats,
      {
        role: 'user',
        content: prompt,
      },
      {
        role: 'assistant',
        content: '',
      },
    ]);

    // const newSocket = io(ChatBackendScoketUrl, {
    //   path: '/socket.io/',
    //   forceNew: true,
    //   reconnectionAttempts: 3,
    //   timeout: 2000,
    // });

    // newSocket.on('connect', () => {
    //   newSocket.emit('prompt', {
    //     prompt: tempPrompt,
    //     model: selectedModel,
    //   });
    //   setIsResponseLoading(true);

    //   setPreviousChats((prevChats) => [
    //     ...prevChats,
    //     {
    //       role: 'user',
    //       content: tempPrompt,
    //     },
    //     {
    //       role: 'assistant',
    //       content: '',
    //     },
    //   ]);

    //   console.log('Connected to WebSocket server', newSocket.id);
    //   socketId = newSocket.id;
    // @ts-ignore
    //   newSocket.on('response', (response) => {
    //     // @ts-ignore
    //     scrollToLastItem.current?.lastElementChild?.scrollIntoView({
    //       behavior: 'smooth',
    //     });

    //     setQueuedNumberMessage('');
    //     //if (response && response.length) {
    //     if (response.completed) {
    //       setSummaryDetail(response);
    //       setMessage('');
    //       setIsResponseLoading(false);
    //       setPrompt('');
    //       textboxRef && textboxRef.current && textboxRef.current.focus();

    //       // disconnect after response is over
    //       newSocket.disconnect();
    //     } else {
    //       setMessage((prev) => prev + response.token);
    //     }
    //   });
    //   newSocket.on('error', (message) => {
    //     toast.error(message);
    //     setMessage('');
    //     setIsResponseLoading(false);
    //     setPrompt('');
    //     setQueuedNumberMessage('');
    //     textboxRef && textboxRef.current && textboxRef.current.focus();
    //     // disconnect after response is over
    //     newSocket.disconnect();
    //   });

    //   newSocket.on('responseQueuedNumber', (queuedNumber) => {
    //     if (queuedNumber) {
    //       setQueuedNumberMessage(
    //         `Prompt successfully queued. There are ${queuedNumber} prompts ahead of you.`
    //       );
    //     }
    //   });
    //   newSocket.on('disconnect', () => {
    //     console.log('Disconnected', socketId);
    //   });
    // });
  };

  const handleTextAreaKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent adding a new line
      submitHandler(e); // Submit the form
    }
  };

  useEffect(() => {
    if (prompt && message) {
      const newOutput = previousChats;
      // @ts-ignore
      newOutput[previousChats.length - 1].content = message;
      // @ts-ignore
      setPreviousChats(newOutput);
    }
  }, [message]);

  useEffect(() => {
    if (summaryDetail) {
      console.log(summaryDetail);
      const newOutput = [...previousChats];

      // @ts-ignore
      newOutput[previousChats.length - 1].model = summaryDetail.model;
      newOutput[
        previousChats.length - 1
      ].speed = `${summaryDetail.speed} token/s`;
      newOutput[
        previousChats.length - 1
      ].elapsedTime = `${summaryDetail.elapsedTime}s`;
      setResRefId(summaryDetail.responseRefId);
      newOutput[
        previousChats.length - 1
      ].responseRefId = `${summaryDetail.responseRefId}`;
      newOutput[
        previousChats.length - 1
      ].completed = `${summaryDetail.completed}`;

      // @ts-ignore
      setPreviousChats(newOutput);
    }
  }, [summaryDetail]);

  return (
    <>
      <ModelSelection
        models={models}
        setSelectedModel={setSelectedModel}
        selectedModel={selectedModel}
      />
      <ChatHistory
        previousChats={previousChats}
        scrollToLastItem={scrollToLastItem}
      />

      <ChatInput
        prompt={prompt}
        isResponseLoading={isResponseLoading}
        previousChats={previousChats}
        setPrompt={setPrompt}
        handleTextAreaKeyPress={handleTextAreaKeyPress}
        submitHandler={submitHandler}
        queuedNumberMessage={queuedNumberMessage}
      />
    </>
  );
};

export default ChatPage;