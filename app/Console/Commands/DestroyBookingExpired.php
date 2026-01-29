<?php

namespace App\Console\Commands;

use App\Jobs\DestroyBookingExpiredJob;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class DestroyBookingExpired extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:expired';

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
        Log::info('TEST Command IS RUNNING');
      DestroyBookingExpiredJob::dispatch();
    }
}
