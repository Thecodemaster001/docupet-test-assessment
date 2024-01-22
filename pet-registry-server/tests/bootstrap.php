<?php

use Symfony\Component\Dotenv\Dotenv;

require dirname(__DIR__).'/vendor/autoload.php';

// The suite needs no secrets, so a fresh checkout can run it against the example file.
$envFile = is_file(dirname(__DIR__).'/.env') ? '/.env' : '/.env.example';
(new Dotenv())->bootEnv(dirname(__DIR__).$envFile);

if ($_SERVER['APP_DEBUG']) {
    umask(0000);
}
