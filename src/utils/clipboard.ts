/**
 * Safely copies text to the clipboard with fallback for non-secure contexts or older browsers.
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  // Modern Clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback below
    }
  }

  // Fallback using document.execCommand('copy')
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    textArea.style.left = '-9999px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}

export interface ShareDataPayload {
  title: string;
  text: string;
  url: string;
}

/**
 * Shares data via Web Share API if supported, or returns false if fallback needed.
 */
export async function shareContent(payload: ShareDataPayload): Promise<'shared' | 'fallback' | 'aborted'> {
  if (navigator.share && typeof navigator.share === 'function') {
    try {
      // Some platforms prefer url in text if url parameter is omitted or vice versa
      await navigator.share({
        title: payload.title,
        text: payload.text,
        url: payload.url,
      });
      return 'shared';
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        return 'aborted'; // User dismissed the share sheet intentionally
      }
      return 'fallback';
    }
  }
  return 'fallback';
}
