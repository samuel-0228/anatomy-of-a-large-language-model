import React from 'react';
import { llmData } from '../data/llmData';
import { ArrowLeft, Box, Cpu, Database, Layers, GitMerge, Activity } from 'lucide-react';

// Icons mapped to layers for a more sophisticated look
const layerIcons = [Box, Database, Layers, Cpu, GitMerge, Activity];

const UIOverlay = ({ learningMode, setLearningMode, activeLayer, setActiveLayer }) => {
  const activeData = activeLayer !== null ? llmData[activeLayer] : null;

  return (
    <div className="overlay-container">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="title-container glass-panel" style={{ padding: '16px 24px' }}>
          <h1>Anatomy of an LLM</h1>
          <p>Interactive 3D Pipeline Explorer</p>
        </div>

        <div className="mode-toggle">
          <button 
            className={`mode-btn ${learningMode === 'simple' ? 'active' : ''}`}
            onClick={() => setLearningMode('simple')}
          >
            Simple Mode
          </button>
          <button 
            className={`mode-btn ${learningMode === 'technical' ? 'active' : ''}`}
            onClick={() => setLearningMode('technical')}
          >
            Technical Mode
          </button>
        </div>
      </div>

      {/* Mini-map / Progress Bar (Left side) */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '32px',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        pointerEvents: 'auto'
      }}>
        {llmData.map((data, idx) => {
          const Icon = layerIcons[idx];
          const isSelected = activeLayer === idx;
          return (
            <div 
              key={data.id}
              onClick={() => setActiveLayer(isSelected ? null : idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                opacity: activeLayer === null || isSelected ? 1 : 0.3,
                transition: 'opacity 0.3s'
              }}
            >
              <div style={{
                width: isSelected ? '32px' : '24px',
                height: isSelected ? '32px' : '24px',
                borderRadius: '50%',
                background: isSelected ? data.color : 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s',
                border: `1px solid ${isSelected ? data.color : 'rgba(255,255,255,0.2)'}`,
                boxShadow: isSelected ? `0 0 15px ${data.color}` : 'none'
              }}>
                <Icon size={isSelected ? 16 : 12} color={isSelected ? '#fff' : '#888'} />
              </div>
              {isSelected && (
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: data.color }}>
                  {data.title.split('. ')[1]}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Back Button (Only in Focus Mode) */}
      {activeLayer !== null && (
        <button className="back-btn glass-panel" style={{ top: '120px' }} onClick={() => setActiveLayer(null)}>
          <ArrowLeft size={16} />
          Back to Overview
        </button>
      )}

      {/* Bottom Information Panel */}
      <div className="bottom-panel">
        <div 
          className="info-card glass-panel" 
          style={{ 
            opacity: activeData ? 1 : 0, 
            pointerEvents: activeData ? 'auto' : 'none',
            maxWidth: '400px',
            transform: activeData ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          {activeData && (
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Box color={activeData.color} size={24} />
                <h2 style={{ margin: 0, fontSize: '20px', color: activeData.color }}>
                  {activeData.title}
                </h2>
              </div>
              
              <p style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '16px', color: 'rgba(255,255,255,0.9)' }}>
                {activeData[learningMode].desc}
              </p>

              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '8px', marginBottom: '16px', borderLeft: `3px solid ${activeData.color}` }}>
                <span style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>System Example</span>
                <p style={{ margin: '6px 0 0 0', fontSize: '13px', fontFamily: 'monospace', color: '#4ade80' }}>
                  {activeData[learningMode].example}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>Core Mechanics</span>
                <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
                  {activeData[learningMode].keyPoints.map((pt, i) => (
                    <li key={i} style={{ marginBottom: '6px' }}>{pt}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UIOverlay;
