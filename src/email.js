// RFC 5322 General Email Regex (emailregex.com "Official Standard").
// IP 리터럴 옥텟 검증은 emailregex.com 원본의 00 허용 버그를 수정한 Stack Overflow 권장안을 따른다.
// https://emailregex.com/index.html
// https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression
const RFC5322_EMAIL_REGEX = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5d\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;

function extractEmails(members) {
    return members.map(member => member.email);
}

function isValidEmail(email) {
    return typeof email === 'string' && RFC5322_EMAIL_REGEX.test(email);
}

function getValidEmails(members) {
    return extractEmails(members).filter(isValidEmail);
}

module.exports = {
    extractEmails,
    isValidEmail,
    getValidEmails,
};
