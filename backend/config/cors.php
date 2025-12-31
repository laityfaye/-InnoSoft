<?php

$allowedOrigins = env('CORS_ALLOWED_ORIGINS')
    ? explode(',', env('CORS_ALLOWED_ORIGINS'))
    : ['http://localhost:3000', 'http://localhost:5173'];

// Add frontend URL from environment if set
$frontendUrl = env('FRONTEND_URL');
if ($frontendUrl && !in_array($frontendUrl, $allowedOrigins)) {
    $allowedOrigins[] = $frontendUrl;
}

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => $allowedOrigins,

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];

