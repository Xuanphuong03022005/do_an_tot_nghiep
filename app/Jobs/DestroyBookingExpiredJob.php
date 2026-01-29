<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use App\Models\Bookings;
use Carbon\Carbon;

class DestroyBookingExpiredJob implements ShouldQueue
{
    
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
         try{
            Log::info('DestroyBookingExpiredJob is processing ok...');
            
            $expiredBookings = Bookings::where('status', 'draft')
                ->where('expired_at', '<', Carbon::now()->subMinutes(10))
                ->get();
            
            foreach ($expiredBookings as $booking) {
                $booking->delete();
            }
        }catch(Exception $e){
             Log::info( $e->getMessage());
        }
    }
}
