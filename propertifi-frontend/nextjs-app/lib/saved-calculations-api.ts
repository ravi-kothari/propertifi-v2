/**
 * API client for saved calculations
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface SavedCalculation {
  id: number;
  user_id: number;
  calculator_type: 'roi' | 'pm-fee' | 'rent-estimate' | 'rehab-cost';
  name: string;
  input_data: any;
  result_data: any;
  created_at: string;
  updated_at: string;
}

export interface SaveCalculationPayload {
  calculator_type: string;
  name?: string;
  input_data: any;
  result_data?: any;
}

/**
 * Get all saved calculations for the authenticated user
 */
export async function getSavedCalculations(
  token: string,
  calculatorType?: string
): Promise<SavedCalculation[]> {
  const url = new URL(`${API_URL}/api/saved-calculations`);
  if (calculatorType) {
    url.searchParams.append('calculator_type', calculatorType);
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch saved calculations');
  }

  const data = await response.json();
  return data.calculations;
}

/**
 * Get a specific saved calculation
 */
export async function getSavedCalculation(
  token: string,
  calculationId: number
): Promise<SavedCalculation> {
  const response = await fetch(`${API_URL}/api/saved-calculations/${calculationId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch saved calculation');
  }

  const data = await response.json();
  return data.calculation;
}

/**
 * Save a new calculation
 */
export async function saveCalculation(
  token: string,
  payload: SaveCalculationPayload
): Promise<SavedCalculation> {
  const response = await fetch(`${API_URL}/api/saved-calculations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to save calculation');
  }

  const data = await response.json();
  return data.calculation;
}

/**
 * Update an existing saved calculation
 */
export async function updateSavedCalculation(
  token: string,
  calculationId: number,
  payload: Partial<SaveCalculationPayload>
): Promise<SavedCalculation> {
  const response = await fetch(`${API_URL}/api/saved-calculations/${calculationId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update calculation');
  }

  const data = await response.json();
  return data.calculation;
}

/**
 * Delete a saved calculation
 */
export async function deleteSavedCalculation(
  token: string,
  calculationId: number
): Promise<void> {
  const response = await fetch(`${API_URL}/api/saved-calculations/${calculationId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete calculation');
  }
}
