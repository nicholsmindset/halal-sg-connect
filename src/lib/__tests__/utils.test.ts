import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('Utils', () => {
  describe('cn function', () => {
    it('merges class names correctly', () => {
      const result = cn('class1', 'class2');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
    });

    it('handles conditional classes', () => {
      const condition = false;
      const result = cn('base', condition && 'conditional', 'always');
      expect(result).toContain('base');
      expect(result).toContain('always');
      expect(result).not.toContain('conditional');
    });

    it('merges tailwind classes without conflicts', () => {
      const result = cn('px-2 py-1', 'px-4');
      // Should prefer the last px value
      expect(result).toContain('px-4');
      expect(result).toContain('py-1');
    });

    it('handles undefined and null values', () => {
      const result = cn('class1', undefined, null, 'class2');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
    });

    it('returns empty string for no arguments', () => {
      const result = cn();
      expect(result).toBe('');
    });
  });
});
