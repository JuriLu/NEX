import { SecurityUtils } from './security.utils';

describe('SecurityUtils', () => {
  describe('sanitizeInput', () => {
    it('should return empty string for null or undefined', () => {
      expect(SecurityUtils.sanitizeInput(null)).toBe('');
      expect(SecurityUtils.sanitizeInput(undefined)).toBe('');
    });

    it('should skip sanitization for Base64 image data URLs', () => {
      const imageData =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
      expect(SecurityUtils.sanitizeInput(imageData)).toBe(imageData);
    });

    it('should remove script tags', () => {
      const input = 'Hello <script>alert("XSS")</script> World';
      // The output will have escaped HTML entities for basic characters like < >
      // After script removal: "Hello  World"
      // Then escape: "Hello  World" (no special chars left in "Hello  World")
      expect(SecurityUtils.sanitizeInput(input)).toBe('Hello  World');
    });

    it('should remove event handlers', () => {
      const input = '<img src="x" onerror="alert(1)">';
      // sanitizeInput removes 'onerror="..."'
      // Resulting string: "<img src="x" >"
      // Then escape: "&lt;img src&#x3D;&quot;x&quot; &gt;"
      expect(SecurityUtils.sanitizeInput(input)).toBe('&lt;img src&#x3D;&quot;x&quot; &gt;');
    });

    it('should remove javascript: URIs', () => {
      const input = '<a href="javascript:alert(1)">Click me</a>';
      // removes "javascript:alert(1)"
      // Result: "<a href="">Click me</a>" -> escaping...
      expect(SecurityUtils.sanitizeInput(input)).toBe(
        '&lt;a href&#x3D;&quot;&quot;&gt;Click me&lt;&#x2F;a&gt;'
      );
    });

    it('should remove non-image data URIs', () => {
      const input = 'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==';
      // The regex replace(/data\s*:[^\s>]+;base64[^\s>]+/gim, ...) will check if it starts with data:image/
      // Since it's data:text/html, it returns empty string.
      expect(SecurityUtils.sanitizeInput(input)).toBe('');
    });

    it('should remove iframes and objects', () => {
      const input = '<iframe></iframe><object></object>';
      expect(SecurityUtils.sanitizeInput(input)).toBe('');
    });

    it('should escape HTML special characters', () => {
      const input = '& < > " \' / ` =';
      const expected = '&amp; &lt; &gt; &quot; &#39; &#x2F; &#x60; &#x3D;';
      expect(SecurityUtils.sanitizeInput(input)).toBe(expected);
    });
  });

  describe('sanitizeObject', () => {
    it('should sanitize all string properties in an object', () => {
      const input = {
        name: '<b>John</b>',
        description: '<script>alert(1)</script>',
        age: 30,
        active: true,
      };
      const result = SecurityUtils.sanitizeObject(input);
      expect(result.name).toBe('&lt;b&gt;John&lt;&#x2F;b&gt;');
      expect(result.description).toBe('');
      expect(result.age).toBe(30);
      expect(result.active).toBe(true);
    });

    it('should skip password and token fields', () => {
      const input = {
        password: 'RawPassword&123',
        token: 'SecretToken<Data>',
        other: '<script>alert(1)</script>',
      };
      const result = SecurityUtils.sanitizeObject(input);
      expect(result.password).toBe('RawPassword&123');
      expect(result.token).toBe('SecretToken<Data>');
      expect(result.other).toBe('');
    });

    it('should recursively sanitize nested objects', () => {
      const input = {
        user: {
          firstName: '<img src=x onerror=alert(1)>',
          address: {
            city: '<script>alert("city")</script>Paris',
          },
        },
      };
      const result = SecurityUtils.sanitizeObject(input);
      expect(result.user.firstName).toBe('&lt;img src&#x3D;x &gt;');
      expect(result.user.address.city).toBe('Paris');
    });

    it('should handle null properties correctly', () => {
      const input = { prop: null };
      const result = SecurityUtils.sanitizeObject(input);
      expect(result.prop).toBeNull();
    });
  });
});
