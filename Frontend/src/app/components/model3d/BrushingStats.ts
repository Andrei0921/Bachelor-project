
import * as THREE from 'three';

export type ToothQuality = 'poor' | 'ok' | 'good' | 'unknown';

export type ToothStats = {
  totalTime: number;
  movements: number;
  speedSum: number;
  speedVariance: number;
  circularRatio: number;
  coverage: number;

  speedMean: number;
  speedM2: number;


  lastAngle: number | null;
  circularHits: number;
  angleSamples: number;
  lastTime: number | null;
  brushingStart: number | null;
  lastContact: number | null;

  coverageGrid: Set<string>;
  bboxMin: THREE.Vector3;
  bboxMax: THREE.Vector3;
};
