<?php
declare(strict_types=1);

final class Database
{
    public static function connect(): PDO
    {
        $path = getenv('DATABASE_PATH') ?: dirname(__DIR__) . '/storage/sports-zone.sqlite';
        $directory = dirname($path);
        if (!is_dir($directory) && !mkdir($directory, 0700, true) && !is_dir($directory)) {
            throw new RuntimeException('Cannot create database directory.');
        }
        $pdo = new PDO('sqlite:' . $path, null, null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        $pdo->exec('PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000; PRAGMA journal_mode = WAL;');
        $pdo->exec(file_get_contents(dirname(__DIR__) . '/database/schema.sql'));
        $pdo->exec(file_get_contents(dirname(__DIR__) . '/database/seed.sql'));
        return $pdo;
    }
}
