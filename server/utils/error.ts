export const formatErrorResponse = (message: string, details?: any) => {
  return { error: message, details };
};
