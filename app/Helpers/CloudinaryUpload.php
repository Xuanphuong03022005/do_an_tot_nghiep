<?php
namespace App\Helpers;

use Illuminate\Support\Facades\Http;

class CloudinaryUpload 
{
    public static function upload($file, $folder, $name){
        $timestamp = time();
        $imageName = $name . '_' . date('YmdHis', $timestamp);
        $signatureString = "folder={$folder}&public_id={$imageName}&timestamp={$timestamp}" . env('CLOUDINARY_SECRET');
        $signatureHash = sha1($signatureString);
        $responsive = Http::asMultipart()->post(env('CLOUDINARY_URL'), [
            [
                'name' => 'file',
                'contents' => fopen($file->getRealPath(), 'r'),
            ],

            [
                'name' => 'api_key',
                'contents' => env('CLOUDINARY_KEY')
            ],  

            [ 
                'name' => 'timestamp',
                'contents' => $timestamp 
            ],

            [
                'name' => 'signature',
                'contents' => $signatureHash
            ],

            [
                'name' => 'folder',
                'contents' => $folder
            ],
            [
                'name' => 'public_id',
                'contents' => $imageName,
            ],
        ]);
         
        return $responsive->successful() ?  $responsive->json() : null;
    }
}