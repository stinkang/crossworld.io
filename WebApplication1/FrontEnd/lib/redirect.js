let redirected = false;

export default (url, message) => {
  if (redirected) return;
  redirected = true;
  if (message) alert(message);
  if (typeof window !== 'undefined') {
    window.location.replace(url);
  }
};
