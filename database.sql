-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Mar 26, 2017 at 05:16 AM
-- Server version: 10.1.16-MariaDB
-- PHP Version: 7.0.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cs372`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL,
  `user` int(11) NOT NULL DEFAULT '0',
  `stylist` int(11) NOT NULL DEFAULT '0',
  `location` int(11) NOT NULL DEFAULT '0',
  `service` varchar(32) NOT NULL DEFAULT '0',
  `details` varchar(255) NOT NULL,
  `start` int(11) DEFAULT NULL,
  `end` int(11) DEFAULT NULL,
  `title` varchar(128) NOT NULL DEFAULT 'Appointment',
  `image` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `user`, `stylist`, `location`, `service`, `details`, `start`, `end`, `title`, `image`) VALUES
(1, 0, 5, 1, '', 'This is a test meeting.', 1490954400, 1490958000, 'Meeting', ''),
(2, 0, 5, 1, '', 'This is another test meeting.', 1491667200, 1491670800, 'Meeting', ''),
(3, 1, 2, 1, '1', 'Here are some test details.', 1491577200, 1491579000, 'Appointment', ''),
(4, 1, 2, 1, '2', '', 1491404400, 1491411600, 'Appointment', ''),
(5, 4, 3, 1, '3', '', 1490716800, 1490724000, 'Appointment', ''),
(6, 4, 3, 1, '1', 'Here are some details!', 1491487200, 1491489000, 'Appointment', '1490411749.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `availability`
--

CREATE TABLE `availability` (
  `id` int(11) NOT NULL,
  `stylist` int(11) NOT NULL DEFAULT '0',
  `sun` tinyint(1) NOT NULL DEFAULT '1',
  `mon` tinyint(1) NOT NULL DEFAULT '1',
  `tues` tinyint(1) NOT NULL DEFAULT '1',
  `wed` tinyint(1) NOT NULL DEFAULT '1',
  `thurs` tinyint(1) NOT NULL DEFAULT '1',
  `fri` tinyint(1) NOT NULL DEFAULT '1',
  `sat` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `availability`
--

INSERT INTO `availability` (`id`, `stylist`, `sun`, `mon`, `tues`, `wed`, `thurs`, `fri`, `sat`) VALUES
(1, 2, 0, 1, 0, 1, 0, 1, 0),
(2, 3, 0, 0, 1, 0, 1, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `businesshours`
--

CREATE TABLE `businesshours` (
  `id` int(11) NOT NULL,
  `location` int(11) DEFAULT '0',
  `sun` tinyint(1) NOT NULL DEFAULT '1',
  `mon` tinyint(1) NOT NULL DEFAULT '1',
  `tues` tinyint(1) NOT NULL DEFAULT '1',
  `wed` tinyint(1) NOT NULL DEFAULT '1',
  `thurs` tinyint(1) NOT NULL DEFAULT '1',
  `fri` tinyint(1) NOT NULL DEFAULT '1',
  `sat` tinyint(1) NOT NULL DEFAULT '1',
  `open` int(11) NOT NULL DEFAULT '10',
  `close` int(11) NOT NULL DEFAULT '18'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `businesshours`
--

INSERT INTO `businesshours` (`id`, `location`, `sun`, `mon`, `tues`, `wed`, `thurs`, `fri`, `sat`, `open`, `close`) VALUES
(1, 1, 0, 1, 1, 1, 1, 1, 1, 10, 18);

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` int(11) NOT NULL,
  `country` varchar(256) NOT NULL,
  `province` varchar(256) NOT NULL,
  `city` varchar(256) NOT NULL,
  `address` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `country`, `province`, `city`, `address`) VALUES
(1, 'Canada', 'Saskatchewan', 'Regina', 'Cornwall Centre');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `service` varchar(64) NOT NULL,
  `minutes` int(11) NOT NULL DEFAULT '30'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `service`, `minutes`) VALUES
(1, 'Haircut', 30),
(2, 'Dye', 120),
(3, 'Perm', 120);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `firstName` varchar(128) NOT NULL,
  `lastName` varchar(128) NOT NULL,
  `birthday` date NOT NULL,
  `country` varchar(128) NOT NULL,
  `province` varchar(128) NOT NULL,
  `city` varchar(128) NOT NULL,
  `rank` int(11) NOT NULL DEFAULT '0',
  `location` int(11) NOT NULL DEFAULT '0',
  `image` varchar(256) NOT NULL DEFAULT 'default.jpg'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `firstName`, `lastName`, `birthday`, `country`, `province`, `city`, `rank`, `location`, `image`) VALUES
(1, 'bobsmith@email.com', '$2y$10$MUiGbC2ArK6wFFeKXKGdNeKgs95DwKLsWoFhRQ1qK2Nwb.ciqK9B.', 'Bob', 'Smith', '1974-02-01', 'Canada', 'Saskatchewan', 'Regina', 0, 0, 'default.jpg'),
(2, 'janedoe@email.com', '$2y$10$xMUJ80ZPJe4rKUviBe1kCuK/io4TRg9MyFYu1dllbYVC7DLtvV/ae', 'Jane', 'Doe', '1988-01-01', 'Canada', 'Saskatchewan', 'Regina', 1, 1, '1490411751.jpg'),
(3, 'johndoe@email.com', '$2y$10$sSpqR89WZFUwpfz/naZKbeBy/V.EUEjlaDIAyM/RQvWO1/mZIQPu.', 'John', 'Doe', '1985-08-01', 'Canada', 'Saskatchewan', 'Regina', 1, 1, '1490411750.jpg'),
(4, 'alicesmith@email.com', '$2y$10$40bdjWY1u.hlCJlP6EOiwOh2JWn1v/lz3pY86TVH8eGK1eeLfxiPO', 'Alice', 'Smith', '1976-05-19', 'Canada', 'Saskatchewan', 'Regina', 0, 0, 'default.jpg'),
(5, 'edwards@email.com', '$2y$10$UUR0h5Qc.NWUPl7DfSOZp.IAUmHo7qefhRbj.BTqUvA/xHiS2Fouy', 'Edward', 'Scissorhands', '1990-12-06', 'Canada', 'Saskatchewan', 'Regina', 2, 1, 'default.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `availability`
--
ALTER TABLE `availability`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `businesshours`
--
ALTER TABLE `businesshours`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `availability`
--
ALTER TABLE `availability`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `businesshours`
--
ALTER TABLE `businesshours`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
