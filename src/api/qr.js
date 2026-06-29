// src/api/qr.js
const SECRET = "slf_demo_secret_change_me_before_backend"; // demo only (frontend secret is not secure)

function b64urlEncodeBytes(bytes) {
  let str = "";
  bytes.forEach((b) => (str += String.fromCharCode(b)));
  const b64 = btoa(str);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function b64urlDecodeToBytes(b64url) {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((b64url.length + 3) % 4);
  const str = atob(b64);
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i);
  return bytes;
}

function utf8ToBytes(s) {
  return new TextEncoder().encode(s);
}

function bytesToUtf8(bytes) {
  return new TextDecoder().decode(bytes);
}

async function hmacSha256(message) {
  const key = await crypto.subtle.importKey(
    "raw",
    utf8ToBytes(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, utf8ToBytes(message));
  return new Uint8Array(sig);
}

function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

function randomNonce(len = 16) {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return b64urlEncodeBytes(bytes);
}

export async function createQrString(lotId) {
  const payload = {
    lotId,
    iat: Date.now(),
    nonce: randomNonce(18),
  };

  const payloadJson = JSON.stringify(payload);
  const payloadB64 = b64urlEncodeBytes(utf8ToBytes(payloadJson));
  const sigBytes = await hmacSha256(payloadB64);
  const sigB64 = b64urlEncodeBytes(sigBytes);

  return `slf1.${payloadB64}.${sigB64}`;
}

export async function verifyQrString(qrString) {
  if (!qrString || typeof qrString !== "string") throw new Error("Invalid QR string");
  const parts = qrString.trim().split(".");
  if (parts.length !== 3 || parts[0] !== "slf1") throw new Error("Bad QR format");

  const payloadB64 = parts[1];
  const sigB64 = parts[2];

  const expectedSig = b64urlEncodeBytes(await hmacSha256(payloadB64));
  if (!constantTimeEqual(expectedSig, sigB64)) throw new Error("Signature mismatch");

  const payloadJson = bytesToUtf8(b64urlDecodeToBytes(payloadB64));
  const payload = JSON.parse(payloadJson);

  if (!payload.lotId) throw new Error("QR missing lotId");
  return payload;
}