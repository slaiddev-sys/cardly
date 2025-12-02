const crypto = require('crypto');

const privateKey = `-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgiLeepLCVZoXFoofe
GBg5776Zlicz4kClqk5kdljC3hSgCgYIKoZIzj0DAQehRANCAAQMqPQGroFJ0aBm
joowqxpOyPatzItVK/D6GXIQPs3hugJlXfDBgMdu1ueLnTFh+/TxnYNf7NAU8n5t
j9Ai/THD
-----END PRIVATE KEY-----`;

const teamId = '4TRX782P9P';
const keyId = 'WTQN4T2233';
const clientId = 'com.love.cardly.app';

const header = {
    alg: 'ES256',
    kid: keyId
};

const now = Math.floor(Date.now() / 1000);
const exp = now + (86400 * 180); // 180 days

const payload = {
    iss: teamId,
    iat: now,
    exp: exp,
    aud: 'https://appleid.apple.com',
    sub: clientId
};

function sign(header, payload, privateKey) {
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const data = `${encodedHeader}.${encodedPayload}`;

    const signature = crypto.createSign('SHA256').update(data).sign({
        key: privateKey,
        dsaEncoding: 'ieee-p1363'
    });

    return `${data}.${signature.toString('base64url')}`;
}

try {
    const token = sign(header, payload, privateKey);
    console.log('GENERATED_JWT_START');
    console.log(token);
    console.log('GENERATED_JWT_END');
} catch (error) {
    console.error('Error generating token:', error);
}
