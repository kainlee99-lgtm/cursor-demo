/**
 * 문자열 앞뒤 공백을 제거하고 첫 글자만 대문자로 바꿉니다.
 * @param {string} value - 변환할 문자열
 * @returns {string} 첫 글자가 대문자인 문자열
 */
export function capitalize(value) {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
        return '';
    }

    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

/**
 * 문자열이 최대 길이를 넘으면 말줄임표(...)를 붙여 잘라냅니다.
 * @param {string} value - 자를 문자열
 * @param {number} maxLength - 허용 최대 길이
 * @returns {string} 잘린 문자열
 */
export function truncate(value, maxLength) {
    if (value.length <= maxLength) {
        return value;
    }

    return `${value.slice(0, maxLength)}...`;
}
