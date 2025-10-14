export interface ApiErrorShape {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  errorCode?: string;
  path?: string;
  details?: Record<string, string>;
}

export function extractApiError(err: any): ApiErrorShape {
  const body = (err && err.error) ? err.error : err;
  const shape: ApiErrorShape = {
    timestamp: body?.timestamp,
    status: body?.status,
    error: body?.error,
    message: body?.message,
    errorCode: body?.errorCode,
    path: body?.path,
    details: body?.details || {},
  };
  return shape;
}

export function getFieldErrors(err: any): Record<string, string> {
  const shape = extractApiError(err);
  return shape.details || {};
}

export function getGeneralMessage(err: any, fallback = 'Greška na serveru. Pokušajte ponovo.') {
  const shape = extractApiError(err);
  return shape.message || fallback;
}

