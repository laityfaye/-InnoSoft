<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\SocialLink;

class SocialLinkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $socialLinks = [
            [
                'platform' => 'facebook',
                'name' => 'Facebook',
                'url' => 'https://facebook.com/innosoft',
                'icon_type' => 'lucide',
                'color_gradient' => 'from-blue-600 to-blue-700',
                'followers' => '12.5K',
                'order' => 0,
                'is_active' => true,
            ],
            [
                'platform' => 'twitter',
                'name' => 'Twitter',
                'url' => 'https://twitter.com/innosoft',
                'icon_type' => 'lucide',
                'color_gradient' => 'from-sky-500 to-sky-600',
                'followers' => '8.3K',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'platform' => 'instagram',
                'name' => 'Instagram',
                'url' => 'https://instagram.com/innosoft',
                'icon_type' => 'lucide',
                'color_gradient' => 'from-pink-500 via-purple-500 to-orange-500',
                'followers' => '15.2K',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'platform' => 'linkedin',
                'name' => 'LinkedIn',
                'url' => 'https://linkedin.com/company/innosoft',
                'icon_type' => 'lucide',
                'color_gradient' => 'from-blue-700 to-blue-800',
                'followers' => '5.8K',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'platform' => 'youtube',
                'name' => 'YouTube',
                'url' => 'https://youtube.com/@innosoft',
                'icon_type' => 'lucide',
                'color_gradient' => 'from-red-600 to-red-700',
                'followers' => '3.1K',
                'order' => 4,
                'is_active' => true,
            ],
            [
                'platform' => 'github',
                'name' => 'GitHub',
                'url' => 'https://github.com/innosoft',
                'icon_type' => 'lucide',
                'color_gradient' => 'from-gray-700 to-gray-800',
                'followers' => '2.4K',
                'order' => 5,
                'is_active' => true,
            ],
        ];

        foreach ($socialLinks as $socialLinkData) {
            SocialLink::firstOrCreate(
                ['platform' => $socialLinkData['platform'], 'url' => $socialLinkData['url']],
                $socialLinkData
            );
        }
    }
}

