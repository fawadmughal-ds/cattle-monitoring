import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Cow {
  id: string;
  temperature: number;
  anomaly_score: number;
  status: 'normal' | 'warning' | 'high-risk';
  thi?: number;
  imu_variance?: number;
}

export interface CowDetail {
  id: string;
  temperature_history: Array<{ timestamp: string; value: number }>;
  anomaly_score_history: Array<{ timestamp: string; value: number }>;
  imu_history?: Array<{ timestamp: string; value: number }>;
  current_temperature: number;
  current_anomaly_score: number;
  status: 'normal' | 'warning' | 'high-risk';
  summary?: string;
}

export interface SimulationInput {
  body_temperature: number;
  imu_variance: number;
  thi: number;
}

export interface SimulationResult {
  anomaly_score: number;
  status: 'normal' | 'warning' | 'high-risk';
  explanation: string;
}

// Fetch all cows for dashboard
export async function getAllCows(): Promise<Cow[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/get_sample_data`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cows:', error);
    throw error;
  }
}

// Fetch details for a specific cow
export async function getCowDetails(cowId: string): Promise<CowDetail> {
  try {
    const response = await axios.get(`${API_BASE_URL}/cow/${cowId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cow details:', error);
    throw error;
  }
}

// Run simulation/prediction
export async function runSimulation(input: SimulationInput): Promise<SimulationResult> {
  try {
    const response = await axios.post(`${API_BASE_URL}/predict`, input);
    return response.data;
  } catch (error) {
    console.error('Error running simulation:', error);
    throw error;
  }
}

