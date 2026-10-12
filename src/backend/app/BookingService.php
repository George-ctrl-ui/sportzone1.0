<?php
declare(strict_types=1);

final class BookingService
{
    public function __construct(private PDO $db) {}

    public function create(array $input, string $sessionId): string
    {
        $limits = ['name' => 100, 'phone' => 25, 'email' => 254, 'sport' => 30, 'date' => 10, 'time' => 5, 'message' => 2000, 'website' => 200];
        $values = [];
        foreach ($limits as $key => $limit) {
            $value = $input[$key] ?? '';
            if (!is_string($value) || strlen($value) > $limit) {
                throw new InvalidArgumentException('Invalid ' . $key . '.');
            }
            $values[$key] = trim($value);
        }
        if ($values['website'] !== '') throw new InvalidArgumentException('Request rejected.');
        if (strlen($values['name']) < 2) throw new InvalidArgumentException('Enter your full name.');
        if (!preg_match('/^(?:\+63|0)9\d{9}$/', preg_replace('/[\s()-]/', '', $values['phone']))) {
            throw new InvalidArgumentException('Enter a Philippine mobile number, such as 0917 123 4567.');
        }
        if ($values['email'] !== '' && !filter_var($values['email'], FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException('Enter a valid email address.');
        }
        $query = $this->db->prepare('SELECT id FROM sports WHERE id = ?');
        $query->execute([$values['sport']]);
        if (!$query->fetch()) throw new InvalidArgumentException('Choose a valid sport.');
        $duration = $input['duration'] ?? null;
        if (!is_int($duration) || $duration < 1 || $duration > 4) throw new InvalidArgumentException('Choose a duration of 1–4 hours.');
        $zone = new DateTimeZone('Asia/Manila');
        $date = DateTimeImmutable::createFromFormat('!Y-m-d', $values['date'], $zone);
        if (!$date || $date->format('Y-m-d') !== $values['date']) throw new InvalidArgumentException('Choose a valid date.');
        $now = new DateTimeImmutable('now', $zone);
        if ($date < $now->setTime(0, 0) || $date > $now->modify('+1 year')) throw new InvalidArgumentException('Choose a date within the next year.');
        if (!preg_match('/^(?:[01]\d|2[0-3]):(?:00|30)$/', $values['time'])) throw new InvalidArgumentException('Choose a start time in 30-minute intervals.');
        [$hour, $minute] = array_map('intval', explode(':', $values['time']));
        $start = $hour * 60 + $minute;
        $weekend = (int)$date->format('N') >= 6;
        $open = $weekend ? 330 : 360;
        $close = $weekend ? 1350 : 1320;
        if ($start < $open || $start + $duration * 60 > $close) throw new InvalidArgumentException('Your session must fit within our opening hours.');
        if ($date->setTime($hour, $minute) <= $now) throw new InvalidArgumentException('Choose a session in the future.');

        $hash = hash('sha256', $sessionId);
        $this->db->exec('BEGIN IMMEDIATE');
        try {
            $this->db->prepare('DELETE FROM request_limits WHERE created_at < ?')->execute([time() - 3600]);
            $query = $this->db->prepare('SELECT COUNT(*) FROM request_limits WHERE session_hash = ?');
            $query->execute([$hash]);
            if ((int)$query->fetchColumn() >= 5) throw new OverflowException('Too many requests. Try again in an hour or call us.');
            $reference = 'SZ-' . strtoupper(bin2hex(random_bytes(5)));
            $query = $this->db->prepare('INSERT INTO booking_requests (reference, name, phone, email, sport_id, preferred_date, start_time, duration, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
            $query->execute([$reference, $values['name'], $values['phone'], $values['email'] ?: null, $values['sport'], $values['date'], $values['time'], $duration, $values['message']]);
            $this->db->prepare('INSERT INTO request_limits (session_hash, created_at) VALUES (?, ?)')->execute([$hash, time()]);
            $this->db->exec('COMMIT');
            return $reference;
        } catch (Throwable $error) {
            $this->db->exec('ROLLBACK');
            throw $error;
        }
    }
}
