const { test } = require('node:test');
const assert = require('node:assert/strict');
const { extractEmails, isValidEmail, getValidEmails } = require('./email');

test('extractEmails returns email addresses from members', () => {
    const members = [
        { name: 'Alice', email: 'alice@example.com' },
        { name: 'Bob', email: 'bob@example.com' },
    ];
    assert.deepEqual(extractEmails(members), ['alice@example.com', 'bob@example.com']);
});

test('isValidEmail accepts valid addresses and rejects invalid ones', () => {
    assert.equal(isValidEmail('alice@example.com'), true);
    assert.equal(isValidEmail('user+tag@example.com'), true);
    assert.equal(isValidEmail('"alice.smith"@example.com'), true);
    assert.equal(isValidEmail('"a..b"@example.com'), true);
    assert.equal(isValidEmail('not-an-email'), false);
    assert.equal(isValidEmail(''), false);
    assert.equal(isValidEmail('a..b@example.com'), false);
});

test('getValidEmails returns only valid email addresses', () => {
    const members = [
        { name: 'Alice', email: 'alice@example.com' },
        { name: 'Bob', email: 'invalid' },
        { name: 'Carol' },
        { name: 'Dave', email: 'dave@example.com' },
    ];
    assert.deepEqual(getValidEmails(members), ['alice@example.com', 'dave@example.com']);
});
