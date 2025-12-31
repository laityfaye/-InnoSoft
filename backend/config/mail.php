<?php

return [
    'default' => env('MAIL_MAILER', 'smtp'),
    'mailers' => [
        'smtp' => [
            'transport' => 'smtp',
            'host' => env('MAIL_HOST', 'smtp.gmail.com'),
            'port' => env('MAIL_PORT', 587),
            'encryption' => env('MAIL_ENCRYPTION', 'tls'),
            'username' => env('MAIL_USERNAME', 'innosoftcreation@gmail.com'),
            'password' => env('MAIL_PASSWORD', 'jbpz apuv wfca cflk'),
            'timeout' => null,
            'local_domain' => env('MAIL_EHLO_DOMAIN'),
        ],
    ],
    'from' => [
        'address' => env('MAIL_FROM_ADDRESS', 'innosoftcreation@gmail.com'),
        'name' => env('MAIL_FROM_NAME', 'InnoSoft Creation'),
    ],
    'admin' => [
        'address' => env('MAIL_ADMIN_ADDRESS', env('MAIL_FROM_ADDRESS', 'innosoftcreation@gmail.com')),
    ],
];

