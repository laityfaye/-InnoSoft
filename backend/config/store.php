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
    | Tarif : 500 F pour les 3 premiers km, puis 250 F par km supplémentaire
    |
    */
    
    'delivery_base_fee' => env('DELIVERY_BASE_FEE', 500), // Frais de base pour les 3 premiers km en FCFA
    'delivery_base_distance' => env('DELIVERY_BASE_DISTANCE', 3), // Distance de base (3 km)
    'delivery_fee_per_km' => env('DELIVERY_FEE_PER_KM', 167), // Frais par kilomètre supplémentaire en FCFA (500/3 ≈ 167 F/km)
    
    'min_delivery_distance' => env('MIN_DELIVERY_DISTANCE', 0), // Distance minimale en km
    'max_delivery_distance' => env('MAX_DELIVERY_DISTANCE', 100), // Distance maximale en km
];

