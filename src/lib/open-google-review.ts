/** Google blocks iframes on g.page review URLs — open a centered popup or navigate on mobile. */
export function openGoogleReview(url: string) {
  if (typeof window === "undefined") return;

  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  if (isMobile) {
    window.location.assign(url);
    return;
  }

  const width = 540;
  const height = 760;
  const left = Math.max(0, window.screenX + (window.outerWidth - width) / 2);
  const top = Math.max(0, window.screenY + (window.outerHeight - height) / 2);
  const features = `popup=yes,width=${width},height=${height},left=${left},top=${top},noopener,noreferrer`;
  const popup = window.open(url, "visriva_google_review", features);
  if (!popup) window.location.assign(url);
}