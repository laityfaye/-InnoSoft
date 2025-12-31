<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Certification;

class CertificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $certifications = [
            [
                'name' => 'ISO 27001',
                'description' => 'Certification Sécurité de l\'Information',
                'icon_type' => 'shield',
                'color' => 'from-blue-500 to-blue-600',
                'issuer' => 'ISO',
                'issued_date' => '2023-01-15',
                'expiry_date' => '2026-01-15',
                'order' => 0,
                'is_active' => true,
            ],
            [
                'name' => 'Google Partner',
                'description' => 'Partenaire certifié Google',
                'icon_type' => 'star',
                'color' => 'from-yellow-500 to-orange-500',
                'issuer' => 'Google',
                'issued_date' => '2023-03-20',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Microsoft Certified',
                'description' => 'Partenaire Microsoft certifié',
                'icon_type' => 'award',
                'color' => 'from-blue-400 to-blue-500',
                'issuer' => 'Microsoft',
                'issued_date' => '2023-05-10',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'AWS Partner',
                'description' => 'Partenaire Amazon Web Services',
                'icon_type' => 'check-circle',
                'color' => 'from-orange-500 to-orange-600',
                'issuer' => 'Amazon Web Services',
                'issued_date' => '2023-07-05',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Agile Certified',
                'description' => 'Méthodologies Agiles certifiées',
                'icon_type' => 'award',
                'color' => 'from-green-500 to-green-600',
                'issuer' => 'Scrum Alliance',
                'issued_date' => '2023-09-12',
                'order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'Quality Assurance',
                'description' => 'Certification Qualité Logicielle',
                'icon_type' => 'shield',
                'color' => 'from-purple-500 to-purple-600',
                'issuer' => 'ISTQB',
                'issued_date' => '2023-11-08',
                'order' => 5,
                'is_active' => true,
            ],
        ];

        foreach ($certifications as $certification) {
            Certification::firstOrCreate(
                ['name' => $certification['name']],
                $certification
            );
        }
    }
}

