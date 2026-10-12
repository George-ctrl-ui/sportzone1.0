<?php
declare(strict_types=1);
require_once dirname(__DIR__) . '/app/bootstrap.php';
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($path === '/api/health' && $method === 'GET') {
        $db = Database::connect();
        jsonResponse(['status' => 'ok', 'php' => PHP_VERSION, 'sqlite' => $db->query('SELECT sqlite_version()')->fetchColumn()]);
    }
    if ($path === '/api/sports' && $method === 'GET') {
        $db = Database::connect();
        $sports = $db->query('SELECT id, name, category, description, court, min_rate AS minRate, max_rate AS maxRate, image, image_alt AS imageAlt FROM sports ORDER BY sort_order')->fetchAll();
        jsonResponse($sports);
    }
    if ($path === '/api/session' && $method === 'GET') {
        startSession();
        $_SESSION['csrf'] ??= bin2hex(random_bytes(32));
        jsonResponse(['token' => $_SESSION['csrf']]);
    }
    if ($path === '/api/bookings' && $method === 'POST') {
        if (($_SERVER['CONTENT_LENGTH'] ?? 0) > 16384) jsonResponse(['error' => 'Request too large.'], 413);
        if (!str_starts_with(strtolower($_SERVER['CONTENT_TYPE'] ?? ''), 'application/json')) jsonResponse(['error' => 'Send application/json.'], 415);
        startSession();
        if (!isset($_SESSION['csrf']) || !hash_equals($_SESSION['csrf'], $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '')) jsonResponse(['error' => 'Session expired. Please submit again.'], 403);
        $body = file_get_contents('php://input', false, null, 0, 16385);
        if (strlen($body) > 16384) jsonResponse(['error' => 'Request too large.'], 413);
        $input = json_decode($body, true, 32, JSON_THROW_ON_ERROR);
        if (!is_array($input) || array_is_list($input)) jsonResponse(['error' => 'Invalid request body.'], 400);
        $reference = (new BookingService(Database::connect()))->create($input, session_id());
        jsonResponse(['reference' => $reference, 'status' => 'pending'], 201);
    }
    if (str_starts_with($path, '/api/')) {
        if (in_array($path, ['/api/health', '/api/sports', '/api/session', '/api/bookings'], true)) {
            header('Allow: ' . ($path === '/api/bookings' ? 'POST' : 'GET'));
            jsonResponse(['error' => 'Method not allowed.'], 405);
        }
        jsonResponse(['error' => 'Not found.'], 404);
    }
    $pagePath = rtrim($path, '/') ?: '/';
    if ($pagePath === '/about') { header('Location: /#about', true, 308); exit; }
    $isPage = in_array($pagePath, ['/', '/court', '/gallery', '/booking', '/index.html'], true);
    if (!$isPage && !in_array($path, ['/favicon.svg'], true) && !str_starts_with($path, '/assets/') && !str_starts_with($path, '/images/')) { http_response_code(404); echo 'Not found'; exit; }
    $dist = realpath(dirname(__DIR__, 3) . '/dist');
    if (!$dist) { http_response_code(503); echo 'Build the frontend with bun run build, or open Vite at http://localhost:3000 during development.'; exit; }
    $requested = $isPage ? '/index.html' : rawurldecode($path);
    $file = realpath($dist . $requested);
    $extension = $file ? strtolower(pathinfo($file, PATHINFO_EXTENSION)) : '';
    $types = ['html' => 'text/html; charset=utf-8', 'js' => 'text/javascript', 'css' => 'text/css', 'svg' => 'image/svg+xml', 'png' => 'image/png', 'jpg' => 'image/jpeg', 'webp' => 'image/webp', 'woff2' => 'font/woff2'];
    if (!$file || !str_starts_with($file, $dist . DIRECTORY_SEPARATOR) || !is_file($file) || !isset($types[$extension])) { http_response_code(404); echo 'Not found'; exit; }
    header('Content-Type: ' . $types[$extension]);
    header('Cache-Control: ' . ($extension === 'html' ? 'no-cache' : 'public, max-age=86400'));
    readfile($file);
} catch (JsonException $error) {
    jsonResponse(['error' => 'Invalid JSON.'], 400);
} catch (InvalidArgumentException $error) {
    jsonResponse(['error' => $error->getMessage()], 422);
} catch (OverflowException $error) {
    jsonResponse(['error' => $error->getMessage()], 429);
} catch (Throwable $error) {
    error_log((string)$error);
    jsonResponse(['error' => 'Booking service unavailable. Call 0917 555 7768.'], 503);
}
