<?php

namespace App\Supports;

class Responder
{
    public static function success($data, string $message)
    {
        return response()->json([
            'data' => $data,
            'message' => $message,
            'status' => true
        ]);
    }

    public static function fail($data, $message)
    {
        return response()->json([
            'data' => $data,
            'message' => $message,
            'status' => false
        ]);
    }
}
