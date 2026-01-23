<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class UploadController extends Controller
{
    public function uploadImage(Request $request)
{
    $request->validate([
        'image' => 'required|image|max:4096'
    ]);

    if (!$request->hasFile('image')) {
        return response()->json(['error' => 'Không nhận được file upload'], 400);
    }

    // ✅ Upload bằng uploadImage()
    $result = Cloudinary::uploadImage(
        $request->file('image')->getRealPath(),
        [
            'folder' => 'my_laravel_uploads', // tuỳ chọn
        ]
    );

    // ✅ Lấy URL an toàn
    $uploadedUrl = $result->getSecurePath();

    return response()->json([
        'message' => 'Upload thành công',
        'url' => $uploadedUrl
    ]);
}

}
