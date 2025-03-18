export function isLocalHost() {
  if (typeof window !== "undefined") {
    return window.location.origin === 'http://localhost:3000';
  }
}