export function success(data: any) {
  return {
    success: true,
    timestamp: new Date().toISOString(),
    data,
  };
}
