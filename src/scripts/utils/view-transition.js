export const performViewTransition = (updateCallback) => {
  if (!document.startViewTransition) {
    updateCallback();
    return;
  }
  document.startViewTransition(updateCallback);
};