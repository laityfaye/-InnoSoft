<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Store Location Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration pour la localisation du magasin et les paramètres de livraison
    |
    */

    'name' => env('STORE_NAME', 'InnoSoft Creation'),
    
    'address' => env('STORE_ADDRESS', ''),
    
    'latitude' => env('STORE_LATITUDE', 14.7886), // Coordonnées de Thiès, Sénégal (à ajuster selon votre adresse exacte)
    'longitude' => env('STORE_LONGITUDE', -16.9261),
    
    'google_maps_url' => env('STORE_GOOGLE_MAPS_URL', 'https://share.google/erNi7FbNEewPH3DlH'),
    
    /*
    |--------------------------------------------------------------------------
    | Delivery Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration pour les frais de livraison
    |
    */
    
    'delivery_fee_per_km' => env('DELIVERY_FEE_PER_KM', 250), // Frais par kilomètre en FCFA
    
    'min_delivery_distance' => env('MIN_DELIVERY_DISTANCE', 0), // Distance minimale en km
    'max_delivery_distance' => env('MAX_DELIVERY_DISTANCE', 100), // Distance maximale en km
];

