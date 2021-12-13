<?php
if(!defined('ALLOW_ACCESS')) exit(header('Location: /')); //Only allow access to this file through the router

//MySQL server and database configuration for the entire site
$config['mysql']['host'] = '127.0.0.1';
$config['mysql']['port'] = '3306';
$config['mysql']['database'] = 'cs372';
$config['mysql']['username'] = 'root';
$config['mysql']['password'] = '';