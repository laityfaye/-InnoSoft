<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            NewsSeeder::class,
            TeamSeeder::class,
            CertificationSeeder::class,
            AwardSeeder::class,
            VideoSeeder::class,
            SocialLinkSeeder::class,
            ProjectSeeder::class,
            TestimonialSeeder::class,
        ]);
    }
}

