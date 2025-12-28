
import React from 'react';
import { ParkingLot } from './types';

export const INITIAL_LOTS: ParkingLot[] = [
  {
    id: 'lot-a',
    name: 'Lot A - Engineering Center',
    totalSpots: 250,
    availableSpots: 12,
    latitude: 37.8719,
    longitude: -122.2585,
    type: 'Student',
    occupancyTrend: 'increasing',
    colorCode: '#3b82f6'
  },
  {
    id: 'lot-b',
    name: 'Lot B - Humanities Plaza',
    totalSpots: 150,
    availableSpots: 45,
    latitude: 37.8729,
    longitude: -122.2595,
    type: 'Faculty',
    occupancyTrend: 'decreasing',
    colorCode: '#ef4444'
  },
  {
    id: 'lot-c',
    name: 'Lot C - Stadium West',
    totalSpots: 400,
    availableSpots: 8,
    latitude: 37.8709,
    longitude: -122.2605,
    type: 'Student',
    occupancyTrend: 'stable',
    colorCode: '#10b981'
  },
  {
    id: 'lot-d',
    name: 'Lot D - Science Lab',
    totalSpots: 80,
    availableSpots: 2,
    latitude: 37.8740,
    longitude: -122.2570,
    type: 'Visitor',
    occupancyTrend: 'increasing',
    colorCode: '#f59e0b'
  }
];

export const APP_THEME = {
  primary: 'blue-600',
  secondary: 'slate-600',
  accent: 'emerald-500',
  background: 'slate-50'
};
