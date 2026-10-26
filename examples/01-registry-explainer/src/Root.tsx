import React from 'react';
import { Composition } from 'remotion';
import { Explainer } from './Explainer';
export const RemotionRoot: React.FC = () => (
  <Composition id="Explainer" component={Explainer} durationInFrames={360} fps={30} width={1080} height={1080} />
);
