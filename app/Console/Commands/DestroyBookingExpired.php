<?php

namespace App\Console\Commands;

use App\Jobs\DestroyBookingExpiredJob;
use Illuminate\Console\Command;

class DestroyBookingExpired extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:destroy-booking-expired';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        DestroyBookingExpiredJob::dispatch();
    }
}
