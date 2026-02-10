export function error(message: string, code = 400) {
  return {
    success: false,
    error: { message, code },
  };
}
