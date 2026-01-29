<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('command:expired')
    ->everyMinute()
    ->withoutOverlapping();

