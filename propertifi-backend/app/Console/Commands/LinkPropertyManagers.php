<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\PropertyManager;

class LinkPropertyManagers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'link:pms';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Link existing PM users to PropertyManager records based on email match';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $users = User::whereIn('type', ['manager', 'pm'])
            ->whereNull('property_manager_id')
            ->get();

        if ($users->isEmpty()) {
            $this->info('No unlinked PM users found.');
            return 0;
        }

        $this->info("Found {$users->count()} unlinked PM users. Attempting to link...");

        $bar = $this->output->createProgressBar($users->count());
        $linkedCount = 0;

        $bar->start();

        foreach ($users as $user) {
            if (!$user->email) {
                $bar->advance();
                continue;
            }

            $pm = PropertyManager::where('email', $user->email)->first();

            if ($pm) {
                $user->property_manager_id = $pm->id;
                $user->save();
                $linkedCount++;
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();

        $this->info("Successfully linked {$linkedCount} users to Property Manager records.");

        return 0;
    }
}
