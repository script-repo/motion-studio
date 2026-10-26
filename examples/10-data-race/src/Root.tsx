import React from 'react';
import { Composition } from 'remotion';
import { Race } from './Race';
export const RemotionRoot: React.FC = () => <Composition id="Race" component={Race} durationInFrames={360} fps={30} width={1080} height={1080} />;
