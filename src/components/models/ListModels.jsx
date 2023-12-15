import React from 'react';

const ModelSelection = ({ models, setSelectedModel, selectedModel }) => {
  return (
    models && (
      <div style={{ display: 'flex' }}>
        <span style={{ margin: '20px 10px' }}>Model: </span>
        <select
          onChange={(e) => setSelectedModel(e.target.value)}
          value={selectedModel}
          style={{ margin: '10px 0', padding: '5px 10px' }}
        >
          {models.map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>
    )
  );
};

export default ModelSelection;
