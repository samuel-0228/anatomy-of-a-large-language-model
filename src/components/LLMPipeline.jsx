import React from 'react';
import LayerSlab from './LayerSlab';
import { llmData } from '../data/llmData';

const LLMPipeline = ({ activeLayer, setActiveLayer }) => {
  return (
    <group>
      {llmData.map((data, index) => (
        <LayerSlab 
          key={data.id} 
          data={data} 
          index={index} 
          activeLayer={activeLayer}
          setActiveLayer={setActiveLayer}
        />
      ))}
    </group>
  );
};

export default LLMPipeline;
