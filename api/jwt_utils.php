<?php
// api/jwt_utils.php

class JWT {
    /**
     * Generates a JWT token.
     *
     * @param array $payload The data to encode in the token.
     * @param string $secret The secret key for signing.
     * @param int $expiry Seconds until expiration (default 3600 = 1 hour).
     * @return string The encoded JWT.
     */
    public static function encode(array $payload, string $secret, int $expiry = 3600): string {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);

        $payload['iat'] = time();
        $payload['exp'] = time() + $expiry;

        $base64UrlHeader = self::base64UrlEncode($header);
        $base64UrlPayload = self::base64UrlEncode(json_encode($payload));

        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
        $base64UrlSignature = self::base64UrlEncode($signature);

        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    /**
     * Decodes and validates a JWT token.
     *
     * @param string $token The JWT token string.
     * @param string $secret The secret key used for signing.
     * @return array|null The decoded payload if valid, or null if invalid/expired.
     */
    public static function decode(string $token, string $secret): ?array {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        list($base64UrlHeader, $base64UrlPayload, $base64UrlSignature) = $parts;

        $signature = self::base64UrlDecode($base64UrlSignature);
        $expectedSignature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);

        if (!hash_equals($signature, $expectedSignature)) {
            return null; // Invalid signature
        }

        $payload = json_decode(self::base64UrlDecode($base64UrlPayload), true);

        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return null; // Expired
        }

        return $payload;
    }

    private static function base64UrlEncode(string $data): string {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $data): string {
        return base64_decode(str_pad(strtr($data, '-_', '+/'), strlen($data) % 4, '=', STR_PAD_RIGHT));
    }
}
