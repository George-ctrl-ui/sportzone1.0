<?php
declare(strict_types=1);
date_default_timezone_set('Asia/Manila');
ini_set('display_errors', '0');
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/BookingService.php';

function jsonResponse(array $data, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);
    exit;
}

function startSession(): void
{
    $directory = dirname(__DIR__) . '/storage/sessions';
    if (!is_dir($directory)) mkdir($directory, 0700, true);
    session_save_path($directory);
    session_name('sports_zone_session');
    session_start([
        'use_strict_mode' => true,
        'cookie_httponly' => true,
        'cookie_secure' => getenv('COOKIE_SECURE') === '1' || (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
        'cookie_samesite' => 'Lax',
        'cookie_path' => '/',
    ]);
}
