export class UrlUtils {
  static formatUrl(url: string | null | undefined): string {
    if (!url) return '';
    return url.replace(/^https?:\/\//, '');
  }

  /**
   * Ensures a URL has a protocol (http:// or https://) for proper linking
   * @param url The URL to ensure has a protocol
   * @returns The URL with a protocol
   */
  static ensureProtocol(url: string | null | undefined): string {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) {
      return url;
    }
    return `https://${url}`;
  }
}
