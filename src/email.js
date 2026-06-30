// RFC 5322 addr-spec (CFWS, BWS, and obs-* rules omitted), ECMAScript form.
// https://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address/14075810
// https://stackoverflow.com/questions/13992403/regex-validation-of-email-addresses-according-to-rfc5321-rfc5322
const RFC5322_EMAIL_REGEX = /^("(?:[!#-\[\]-~]|\\[\t -~])*"|[!#-'*+\/-9=?A-Z^-~](?:\.?[!#-'*+\/-9=?A-Z^-~])*)@([!#-'*+\/-9=?A-Z^-~](?:\.?[!#-'*+\/-9=?A-Z^-~])*|\[[!-Z^-~]*\])$/;

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
