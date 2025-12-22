/**
 * Utility functions for frontend security and input sanitization.
 */

export class SecurityUtils {
  /**
   * Sanitizes a string input to prevent XSS and other injection attacks.
   * Note: This is a frontend layer of defense. Backend validation is always required.
   */
  static sanitizeInput(input: string | null | undefined): string {
    if (!input) return '';

    // Remove common script tags and event handlers
    let sanitized = input
      .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, '')
      .replace(/on\w+="[^"]*"/gim, '')
      .replace(/on\w+='[^']*'/gim, '')
      .replace(/on\w+=[^\s>]+/gim, '')
      .replace(/javascript:[^\s>]+/gim, '');

    // Escape basic HTML characters to prevent rendering as tags
    const entityMap: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
    };

    return sanitized.replace(/[&<>"'`=\/]/g, (s) => entityMap[s]);
  }

  /**
   * Sanitizes all string properties of an object.
   */
  static sanitizeObject<T extends object>(obj: T): T {
    const result = { ...obj } as any;
    for (const key in result) {
      if (typeof result[key] === 'string') {
        result[key] = this.sanitizeInput(result[key]);
      } else if (typeof result[key] === 'object' && result[key] !== null) {
        result[key] = this.sanitizeObject(result[key]);
      }
    }
    return result;
  }
}
