import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { usePasswordStrength } from '../usePasswordStrength';

// Setup and teardown
beforeEach(() => {
    GlobalRegistrator.register();
});

afterEach(() => {
    GlobalRegistrator.unregister();
});

describe("usePasswordStrength", () => {
    test("should initialize with weak strength for empty password", () => {
        const { result } = renderHook(() => usePasswordStrength(""));
        expect(result.current.strength).toBe('weak');
        expect(result.current.score).toBe(0);
        expect(result.current.criteria).toEqual({
            minLength: false,
            hasUpperCase: false,
            hasLowerCase: false,
            hasNumber: false,
            hasSpecialChar: false
        });
    });

    test("should correctly evaluate password criteria", () => {
        const { result } = renderHook(() => usePasswordStrength("Test123!@#"));
        expect(result.current.criteria).toEqual({
            minLength: true,
            hasUpperCase: true,
            hasLowerCase: true,
            hasNumber: true,
            hasSpecialChar: true
        });
    });

    test("should respect custom minimum length", () => {
        const { result } = renderHook(() => 
            usePasswordStrength("Test123!", { minLength: 10 })
        );
        expect(result.current.criteria.minLength).toBe(false);

        const { result: result2 } = renderHook(() => 
            usePasswordStrength("Test123!@#$", { minLength: 10 })
        );
        expect(result2.current.criteria.minLength).toBe(true);
    });

    test("should handle optional requirements correctly", () => {
        const { result } = renderHook(() => 
            usePasswordStrength("testpassword", {
                requireSpecialChar: false,
                requireNumber: false,
                requireMixedCase: false
            })
        );
        expect(result.current.strength).toBe('very-strong');
        expect(result.current.score).toBe(100);
    });

    test("should calculate strength levels correctly", () => {
        // Weak password (score < 50)
        const { result: weak } = renderHook(() => 
            usePasswordStrength("test")
        );
        expect(weak.current.strength).toBe('weak');
        expect(weak.current.score).toBeLessThan(50);

        // Medium password (50 <= score < 80)
        const { result: medium } = renderHook(() => 
            usePasswordStrength("t1", { requireSpecialChar: false, requireMixedCase: false })
        );
        expect(medium.current.strength).toBe('medium');
        expect(medium.current.score).toBeGreaterThanOrEqual(50);
        expect(medium.current.score).toBeLessThan(80);

        // Strong password (80 <= score < 100)
        const { result: strong } = renderHook(() => 
            usePasswordStrength("Test123", { requireSpecialChar: false })
        );
        expect(strong.current.strength).toBe('strong');
        expect(strong.current.score).toBeGreaterThanOrEqual(80);
        expect(strong.current.score).toBeLessThan(100);

        // Very strong password (score = 100)
        const { result: veryStrong } = renderHook(() => 
            usePasswordStrength("Test123!@#")
        );
        expect(veryStrong.current.strength).toBe('very-strong');
        expect(veryStrong.current.score).toBe(100);
    });

    test("should detect special characters correctly", () => {
        const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
        const { result } = renderHook(() => 
            usePasswordStrength(`Test123${specialChars}`)
        );
        expect(result.current.criteria.hasSpecialChar).toBe(true);
    });

    test("should handle mixed case requirements", () => {
        const { result: mixedCase } = renderHook(() => 
            usePasswordStrength("TestPASSWORD", { requireMixedCase: true })
        );
        expect(mixedCase.current.criteria.hasUpperCase).toBe(true);
        expect(mixedCase.current.criteria.hasLowerCase).toBe(true);

        const { result: lowerOnly } = renderHook(() => 
            usePasswordStrength("testpassword", { requireMixedCase: true })
        );
        expect(lowerOnly.current.criteria.hasUpperCase).toBe(false);
        expect(lowerOnly.current.criteria.hasLowerCase).toBe(true);
    });

    test("should handle number requirements", () => {
        const { result: withNumbers } = renderHook(() => 
            usePasswordStrength("Test123", { requireNumber: true })
        );
        expect(withNumbers.current.criteria.hasNumber).toBe(true);

        const { result: withoutNumbers } = renderHook(() => 
            usePasswordStrength("TestPass", { requireNumber: true })
        );
        expect(withoutNumbers.current.criteria.hasNumber).toBe(false);
    });

    test("should calculate score proportionally to password length", () => {
        const { result: short } = renderHook(() => 
            usePasswordStrength("Ts1!", { minLength: 8 })
        );
        const { result: long } = renderHook(() => 
            usePasswordStrength("TestPass123!", { minLength: 8 })
        );
        expect(short.current.score).toBeLessThan(long.current.score);
    });

    test("should handle all requirements disabled", () => {
        const { result } = renderHook(() => 
            usePasswordStrength("test", {
                requireSpecialChar: false,
                requireNumber: false,
                requireMixedCase: false,
                minLength: 4
            })
        );
        expect(result.current.strength).toBe('very-strong');
        expect(result.current.score).toBe(100);
    });
}); 