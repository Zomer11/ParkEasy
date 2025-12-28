
export interface ParkingLot {
  id: string;
  name: string;
  totalSpots: number;
  availableSpots: number;
  latitude: number;
  longitude: number;
  type: 'Student' | 'Faculty' | 'Visitor';
  occupancyTrend: 'increasing' | 'decreasing' | 'stable';
  colorCode: string;
}

export interface SpotReport {
  id: string;
  lotId: string;
  status: 'leaving_now' | 'leaving_5min' | 'leaving_10min';
  timestamp: Date;
  reportedBy: string;
  isClaimed: boolean;
}

export interface UserStats {
  points: number;
  spotsReported: number;
  timeSaved: number;
  rank: number;
}

export interface Prediction {
  lotId: string;
  predictedAvailable: number;
  confidence: number;
  reasoning: string;
}

export interface RewardItem {
  id: string;
  title: string;
  cost: number;
  description: string;
  category: 'Food' | 'Parking' | 'Merch';
  image: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'alert';
}
