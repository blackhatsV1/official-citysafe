-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jan 14, 2026 at 09:55 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `myapp`
--

-- --------------------------------------------------------

--
-- Table structure for table `deploys`
--

CREATE TABLE `deploys` (
  `id` int(11) NOT NULL,
  `responder_id` int(11) DEFAULT NULL,
  `station_id` int(11) DEFAULT NULL,
  `incident_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `status` enum('pending','resolved','cancelled by user','cancelled by admin') DEFAULT 'pending',
  `deployed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `resolved_at` timestamp NULL DEFAULT NULL,
  `remarks` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `deploys`
--

INSERT INTO `deploys` (`id`, `responder_id`, `station_id`, `incident_id`, `user_id`, `status`, `deployed_at`, `resolved_at`, `remarks`) VALUES
(1, 1, 6, NULL, 2, 'cancelled by admin', '2025-12-19 03:08:23', NULL, 'Admin Cancelled'),
(3, 1, 6, NULL, 2, 'pending', '2025-12-19 05:55:17', NULL, NULL),
(4, 1, 6, 21, 13, 'cancelled by admin', '2026-01-12 03:30:31', NULL, 'Admin Cancelled'),
(5, 1, 6, 22, 13, 'resolved', '2026-01-12 05:45:30', '2026-01-14 02:13:47', 'fire was put down'),
(6, 1, 6, 22, 13, 'resolved', '2026-01-12 05:46:13', '2026-01-14 02:13:47', 'fire was put down'),
(7, 1, 6, 22, 13, 'resolved', '2026-01-12 05:53:28', '2026-01-14 02:13:47', 'fire was put down'),
(8, 1, 6, 26, 13, 'resolved', '2026-01-14 02:59:17', '2026-01-14 03:00:33', 'Fire is put down'),
(9, 1, 6, 28, 8, 'resolved', '2026-01-14 03:05:12', '2026-01-14 03:07:24', 'fire is gone'),
(10, 1, 6, 29, 8, 'resolved', '2026-01-14 03:23:28', '2026-01-14 03:24:56', 'rescued the individuals'),
(11, 1, 6, 30, 8, 'resolved', '2026-01-14 03:30:32', '2026-01-14 03:32:01', 'buggy'),
(12, 1, 6, 31, 8, 'resolved', '2026-01-14 03:35:49', '2026-01-14 03:36:32', 'goods'),
(13, 1, 6, 32, 8, 'resolved', '2026-01-14 03:36:59', '2026-01-14 03:38:01', 'asdfasdf'),
(14, 1, 6, 33, 8, 'resolved', '2026-01-14 03:47:45', '2026-01-14 03:48:17', 'great'),
(15, 1, 6, 34, 8, 'resolved', '2026-01-14 03:48:59', '2026-01-14 03:49:09', 'asdfasdf'),
(16, 1, 6, 35, 13, 'resolved', '2026-01-14 04:08:03', '2026-01-14 04:08:39', 'asdf'),
(17, 1, 6, 25, 2, 'resolved', '2026-01-14 04:09:16', '2026-01-14 04:50:12', 'asdf'),
(18, 1, 6, 36, 2, 'resolved', '2026-01-14 05:19:37', '2026-01-14 05:23:56', 'asdf'),
(19, 1, 6, 37, 2, 'resolved', '2026-01-14 05:25:15', '2026-01-14 05:26:06', 'welccom'),
(20, 1, 6, 41, 2, 'resolved', '2026-01-14 06:12:30', '2026-01-14 06:13:06', 'thanks'),
(21, 1, 6, 40, 2, 'resolved', '2026-01-14 06:13:23', '2026-01-14 06:14:05', 'very gooooddd'),
(22, 1, 6, 38, 2, 'resolved', '2026-01-14 06:14:29', '2026-01-14 06:27:35', 'qwerty'),
(23, 1, 6, 39, 2, 'resolved', '2026-01-14 06:28:29', '2026-01-14 06:33:51', 'gooods'),
(24, 1, 6, 42, 2, 'cancelled by admin', '2026-01-14 06:40:21', NULL, 'Admin Cancelled'),
(25, 1, 6, 43, 2, 'resolved', '2026-01-14 06:41:00', '2026-01-14 06:41:43', 'asdf'),
(26, 1, 6, 44, 2, 'resolved', '2026-01-14 06:43:29', '2026-01-14 06:47:49', 'asdf'),
(27, 1, 6, 45, 2, 'resolved', '2026-01-14 06:49:45', '2026-01-14 06:50:20', 'thanks'),
(28, 1, 6, 46, 2, 'resolved', '2026-01-14 06:50:43', '2026-01-14 06:51:22', 'nice'),
(29, 1, 6, 47, 2, 'resolved', '2026-01-14 06:53:06', '2026-01-14 06:53:30', 'asdf'),
(30, 1, 6, 49, 2, 'resolved', '2026-01-14 07:06:27', '2026-01-14 07:38:18', 'asdf'),
(31, 1, 6, 48, 2, 'resolved', '2026-01-14 07:38:42', '2026-01-14 07:38:57', 'asdf'),
(32, 1, 6, 50, 2, 'resolved', '2026-01-14 07:40:00', '2026-01-14 07:40:20', 'qwerqwe'),
(33, 1, 6, 52, 2, 'resolved', '2026-01-14 07:49:46', '2026-01-14 07:59:07', 'asdfasdf'),
(34, 1, 6, 51, 2, 'resolved', '2026-01-14 07:59:19', '2026-01-14 08:00:05', 'asdfasdfasfqwre2'),
(35, 1, 6, 53, 2, 'cancelled by admin', '2026-01-14 08:09:49', NULL, 'Admin Cancelled'),
(36, 1, 6, 54, 2, 'cancelled by admin', '2026-01-14 08:12:19', NULL, 'Admin Cancelled'),
(37, 1, 6, 55, 2, 'cancelled by admin', '2026-01-14 08:12:52', NULL, 'Admin Cancelled'),
(38, 1, 6, 57, 2, 'resolved', '2026-01-14 08:13:52', '2026-01-14 08:14:42', 'asdfasdf'),
(39, 1, 6, 56, 2, 'resolved', '2026-01-14 08:14:51', '2026-01-14 08:15:12', 'asfqwer234qwerqwerwwer');

-- --------------------------------------------------------

--
-- Table structure for table `disaster_reports`
--

CREATE TABLE `disaster_reports` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `disaster_type` varchar(255) NOT NULL,
  `reported_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `location` text DEFAULT NULL,
  `status` enum('pending','responding','resolved','cancelled by user','cancelled by admin') DEFAULT 'pending',
  `responder_id` int(11) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `responder_confirmed_at` timestamp NULL DEFAULT NULL,
  `user_confirmed_at` timestamp NULL DEFAULT NULL,
  `resolution_remarks` text DEFAULT NULL,
  `resolved_by` varchar(255) DEFAULT NULL,
  `user_message` text DEFAULT NULL,
  `responder_message` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `disaster_reports`
--

INSERT INTO `disaster_reports` (`id`, `user_id`, `disaster_type`, `reported_at`, `location`, `status`, `responder_id`, `latitude`, `longitude`, `responder_confirmed_at`, `user_confirmed_at`, `resolution_remarks`, `resolved_by`, `user_message`, `responder_message`) VALUES
(21, 13, 'Flood', '2025-12-19 05:25:13', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'cancelled by admin', 1, 10.69343049, 122.57211747, NULL, NULL, NULL, NULL, NULL, NULL),
(22, 13, 'Fire', '2025-12-19 05:53:26', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'resolved', 1, 10.69342828, 122.57212624, '2026-01-14 02:13:47', '2026-01-14 02:02:35', NULL, NULL, NULL, NULL),
(23, 8, 'Flood', '2025-12-23 03:10:07', 'Taft Extension, Buhang Taft-North, Bolilao, Mandurriao, Calubihan, Iloilo City, Western Visayas, 5000, Philippines', 'cancelled by user', NULL, 10.71841940, 122.54857630, NULL, NULL, NULL, NULL, NULL, NULL),
(24, 13, 'Earthquake', '2025-12-23 03:17:03', 'J7 Hotel, Q. Abeto Street, Iloilo Business Park, Mandurriao, Pale Benidicto Rizal, Iloilo City, Western Visayas, 5000, Philippines', 'pending', NULL, 10.71765490, 122.53939480, NULL, '2026-01-14 03:06:05', NULL, NULL, '', NULL),
(25, 2, 'Fire', '2026-01-12 05:03:07', 'San Juan, Molo, Iloilo City, Western Visayas, 5000, Philippines', 'resolved', 1, 10.68910217, 122.54396820, '2026-01-14 04:50:12', '2026-01-14 04:50:03', 'Responder: asdf | User: goods', 'john  doe', 'goods', 'asdf'),
(26, 13, 'Fire', '2026-01-12 06:34:23', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'resolved', 1, 10.69348790, 122.57213713, '2026-01-14 02:59:51', '2026-01-14 03:00:33', 'Responder: Fire is put down | User: User confirmed via History', 'test test', 'User confirmed via History', 'Fire is put down'),
(27, 8, 'Fire', '2026-01-13 09:20:15', 'R. Mapa Street, San Rafael, Mandurriao, Navais, Iloilo City, Western Visayas, 5000, Philippines', 'cancelled by user', NULL, 10.70260800, 122.54366300, NULL, NULL, NULL, NULL, NULL, NULL),
(28, 8, 'Fire', '2026-01-14 02:50:27', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'resolved', 1, 10.69345517, 122.57210298, '2026-01-14 03:07:23', '2026-01-14 03:06:57', 'Responder: fire is gone | User: he arrived fast, thanks, fire is gone', 'john  doe', 'he arrived fast, thanks, fire is gone', 'fire is gone'),
(29, 8, 'Earthquake', '2026-01-14 03:20:35', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'resolved', 1, 10.69348148, 122.57213579, '2026-01-14 03:24:56', '2026-01-14 03:23:57', 'Responder: rescued the individuals | User: rescue arrived', 'john  doe', 'rescue arrived', 'rescued the individuals'),
(30, 8, 'Flood', '2026-01-14 03:30:12', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'resolved', 1, 10.69346306, 122.57209611, '2026-01-14 03:32:01', '2026-01-14 03:31:22', 'Responder: buggy | User: we are rescued, thanks', 'john  doe', 'we are rescued, thanks', 'buggy'),
(31, 8, 'Landslide', '2026-01-14 03:35:25', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'resolved', 1, 10.69344609, 122.57207378, '2026-01-14 03:36:32', '2026-01-14 03:36:21', 'Responder: goods | User: thanjs', 'john  doe', 'thanjs', 'goods'),
(32, 8, 'Fire', '2026-01-14 03:36:51', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'resolved', 1, 10.69346182, 122.57209957, '2026-01-14 03:38:01', '2026-01-14 03:37:18', 'Responder: asdfasdf | User: goooogdhd', 'john  doe', 'goooogdhd', 'asdfasdf'),
(33, 8, 'Fire', '2026-01-14 03:40:08', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'resolved', 1, 10.69346152, 122.57211934, '2026-01-14 03:48:17', '2026-01-14 03:47:58', 'Responder: great | User: goods', 'john  doe', 'goods', 'great'),
(34, 8, 'Landslide', '2026-01-14 03:47:28', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'resolved', 1, 10.69346577, 122.57211592, '2026-01-14 03:49:09', '2026-01-14 03:48:42', 'Responder: asdfasdf | User: im safe already', 'john  doe', 'im safe already', 'asdfasdf'),
(35, 13, 'Fire', '2026-01-14 04:07:55', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'resolved', 1, 10.69346918, 122.57211906, '2026-01-14 04:08:39', '2026-01-14 04:08:28', 'Responder: asdf | User: asdf', 'john  doe', 'asdf', 'asdf'),
(36, 2, 'Fire', '2026-01-14 05:18:38', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'resolved', 1, 10.69346064, 122.57206950, '2026-01-14 05:23:56', '2026-01-14 05:23:48', 'Responder: asdf | User: good', 'john  doe', 'good', 'asdf'),
(37, 2, 'Fire', '2026-01-14 05:25:03', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'resolved', 1, 10.69344912, 122.57209023, '2026-01-14 05:26:06', '2026-01-14 05:25:47', 'Responder: welccom | User: thanks', 'john  doe', 'thanks', 'welccom'),
(38, 2, 'Fire', '2026-01-14 05:57:23', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'resolved', 1, 10.69341206, 122.57211412, '2026-01-14 06:27:35', '2026-01-14 06:27:23', 'Responder: qwerty | User: asdf', 'john  doe', 'asdf', 'qwerty'),
(39, 2, 'Flood', '2026-01-14 06:03:49', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'resolved', 1, 10.69345498, 122.57208703, '2026-01-14 06:33:51', '2026-01-14 06:33:39', 'Responder: gooods | User: thanks', 'john  doe', 'thanks', 'gooods'),
(40, 2, 'Earthquake', '2026-01-14 06:07:00', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'resolved', 1, 10.69348148, 122.57213579, '2026-01-14 06:14:05', '2026-01-14 06:13:45', 'Responder: very gooooddd | User: niceeee', 'john  doe', 'niceeee', 'very gooooddd'),
(41, 2, 'Landslide', '2026-01-14 06:11:23', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'resolved', 1, 10.69346210, 122.57210668, '2026-01-14 06:13:06', '2026-01-14 06:12:51', 'Responder: thanks | User: goods', 'john  doe', 'goods', 'thanks'),
(42, 2, 'Flood', '2026-01-14 06:39:32', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'cancelled by admin', 1, 10.69346264, 122.57209470, NULL, NULL, NULL, NULL, NULL, NULL),
(43, 2, 'Fire', '2026-01-14 06:39:50', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'resolved', 1, 10.69346264, 122.57209470, '2026-01-14 06:41:43', '2026-01-14 06:41:27', 'Responder: asdf | User: asdf', 'john  doe', 'asdf', 'asdf'),
(44, 2, 'Earthquake', '2026-01-14 06:43:18', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'resolved', 1, 10.69346659, 122.57211534, '2026-01-14 06:47:49', '2026-01-14 06:47:42', 'Responder: asdf | User: asdf', 'john  doe', 'asdf', 'asdf'),
(45, 2, 'Fire', '2026-01-14 06:49:22', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'resolved', 1, 10.69348108, 122.57213807, '2026-01-14 06:50:20', '2026-01-14 06:50:10', 'Responder: thanks | User: good', 'john  doe', 'good', 'thanks'),
(46, 2, 'Fire', '2026-01-14 06:50:31', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'resolved', 1, 10.69348148, 122.57213579, '2026-01-14 06:51:22', '2026-01-14 06:51:13', 'Responder: nice | User: thanks', 'john  doe', 'thanks', 'nice'),
(47, 2, 'Fire', '2026-01-14 06:52:41', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'resolved', 1, 10.69346998, 122.57209704, '2026-01-14 06:53:30', '2026-01-14 06:53:21', 'Responder: asdf | User: asdf', 'john  doe', 'asdf', 'asdf'),
(48, 2, 'Fire', '2026-01-14 07:05:34', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'resolved', 1, 10.69347263, 122.57211657, '2026-01-14 07:38:57', '2026-01-14 07:38:52', 'Responder: asdf | User: asdf', 'john  doe', 'asdf', 'asdf'),
(49, 2, 'Flood', '2026-01-14 07:06:14', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'resolved', 1, 10.69347675, 122.57211646, '2026-01-14 07:38:18', '2026-01-14 07:33:02', 'Responder: asdf | User: asdf', 'john  doe', 'asdf', 'asdf'),
(50, 2, 'Earthquake', '2026-01-14 07:39:09', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'resolved', 1, 10.69345145, 122.57208666, '2026-01-14 07:40:20', '2026-01-14 07:40:15', 'Responder: qwerqwe | User: asdf', 'john  doe', 'asdf', 'qwerqwe'),
(51, 2, 'Flood', '2026-01-14 07:49:11', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'resolved', 1, 10.69347702, 122.57213504, '2026-01-14 08:00:05', '2026-01-14 07:59:50', 'Responder: asdfasdfasfqwre2 | User: asdfasdf', 'john  doe', 'asdfasdf', 'asdfasdfasfqwre2'),
(52, 2, 'Earthquake', '2026-01-14 07:49:26', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'resolved', 1, 10.69347045, 122.57213330, '2026-01-14 07:59:07', '2026-01-14 07:58:53', 'Responder: asdfasdf | User: asdf', 'john  doe', 'asdf', 'asdfasdf'),
(53, 2, 'Flood', '2026-01-14 08:08:48', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'cancelled by admin', 1, 10.69345972, 122.57211611, NULL, NULL, NULL, NULL, NULL, NULL),
(54, 2, 'Fire', '2026-01-14 08:09:30', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'cancelled by admin', 1, 10.69345972, 122.57211611, NULL, NULL, NULL, NULL, NULL, NULL),
(55, 2, 'Fire', '2026-01-14 08:12:41', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'cancelled by admin', 1, 10.69344912, 122.57209023, NULL, NULL, NULL, NULL, NULL, NULL),
(56, 2, 'Earthquake', '2026-01-14 08:13:16', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'resolved', 1, 10.69345636, 122.57210385, '2026-01-14 08:15:12', '2026-01-14 08:15:06', 'Responder: asfqwer234qwerqwerwwer | User: asdfasdfasdfasdfasdfaewrq2ewrqwer', 'john  doe', 'asdfasdfasdfasdfasdfaewrq2ewrqwer', 'asfqwer234qwerqwerwwer'),
(57, 2, 'Flood', '2026-01-14 08:13:25', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'resolved', 1, 10.69341033, 122.57213284, '2026-01-14 08:14:42', '2026-01-14 08:14:37', 'Responder: asdfasdf | User: adsfasdf', 'john  doe', 'adsfasdf', 'asdfasdf');

-- --------------------------------------------------------

--
-- Table structure for table `requests`
--

CREATE TABLE `requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `needs` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `help_count` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `requests`
--

INSERT INTO `requests` (`id`, `user_id`, `name`, `location`, `needs`, `created_at`, `help_count`) VALUES
(1, 2, 'Yasmine Talaman', 'San Juan, Molo, Iloilo City, Western Visayas, 5000, Philippines', 'need clothing fire', '2025-04-13 06:46:48', 2),
(2, 2, 'Yasmine Talaman', 'Western Visayas Medical Center, Q. Abeto Street, Iloilo Business Park, Mandurriao, Pale Benidicto Rizal, Iloilo City, Western Visayas, 5000, Philippines', 'water', '2025-04-13 07:35:56', 1),
(3, 13, 'test test1', 'Tayud, Cebu, Central Visayas, 6002, Philippines', 'foods', '2025-04-13 07:39:01', 0),
(4, 2, 'Yasmine Talaman', 'Western Visayas Medical Center, Q. Abeto Street, Iloilo Business Park, Mandurriao, Pale Benidicto Rizal, Iloilo City, Western Visayas, 5000, Philippines', 'Clothes\r\n', '2025-04-13 07:57:42', 0),
(5, 3, 'John Doe', 'Tayud, Cebu, Central Visayas, 6002, Philippines', 'need food please', '2025-04-13 11:32:26', 0),
(6, 4, 'Jane Smith', 'Western Visayas Medical Center, Q. Abeto Street, Iloilo Business Park, Mandurriao, Pale Benidicto Rizal, Iloilo City, Western Visayas, 5000, Philippines', 'Whiskey', '2025-04-13 14:13:27', 0),
(7, 9, 'James Garcia', 'San Juan, Molo, Iloilo City, Western Visayas, 5000, Philippines', 'shelter, clothing\r\n', '2025-04-14 09:33:15', 0),
(8, 9, 'James Garcia', 'San Juan, Molo, Iloilo City, Western Visayas, 5000, Philippines', 'Foods', '2025-04-14 09:40:54', 1),
(9, 13, 'test test1', 'San Juan, Molo, Iloilo City, Western Visayas, 5000, Philippines', 'food\r\n', '2025-04-14 13:49:55', 0),
(10, 8, 'Olivia Brown', 'Commission Civil Street, Jereos, San Pedro, Jaro, Calubihan, Iloilo City, Western Visayas, 5000, Philippines', 'i need clothes \r\n', '2025-04-23 07:17:37', 1),
(11, 2, 'Yasmine Talaman', 'Iloilo City Hall, I. de la Rama Street, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'relief, clothes', '2025-08-14 09:08:06', 0);

-- --------------------------------------------------------

--
-- Table structure for table `responders`
--

CREATE TABLE `responders` (
  `id` int(11) NOT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `contact_number` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `station_id` int(11) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `status` enum('active','inactive','deployed','offline') DEFAULT 'offline',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `action` enum('standby','responding') DEFAULT 'standby'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `responders`
--

INSERT INTO `responders` (`id`, `firstname`, `lastname`, `username`, `password`, `contact_number`, `email`, `station_id`, `latitude`, `longitude`, `status`, `created_at`, `action`) VALUES
(1, 'john ', 'doe', 'johndoe@responders.com', '123', '094746363445', 'johndoe@responders.com', 6, 10.69344912, 122.57209023, 'active', '2025-12-19 01:39:53', 'standby');

-- --------------------------------------------------------

--
-- Table structure for table `risk_assessments`
--

CREATE TABLE `risk_assessments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `near_river` tinyint(1) NOT NULL,
  `near_fault` tinyint(1) NOT NULL,
  `has_emergency_kit` tinyint(1) NOT NULL,
  `has_evacuation_plan` tinyint(1) NOT NULL,
  `risk_score` int(11) NOT NULL,
  `risk_level` varchar(20) NOT NULL,
  `assessed_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `risk_assessments`
--

INSERT INTO `risk_assessments` (`id`, `user_id`, `near_river`, `near_fault`, `has_emergency_kit`, `has_evacuation_plan`, `risk_score`, `risk_level`, `assessed_at`) VALUES
(2, 13, 1, 0, 0, 1, 5, 'Moderate', '2025-04-13 18:19:08'),
(3, 13, 1, 1, 1, 1, 6, 'Moderate', '2025-04-13 19:14:29'),
(4, 3, 1, 0, 1, 1, 3, 'Low', '2025-04-13 19:31:38'),
(5, 2, 0, 0, 0, 1, 2, 'Low', '2025-04-13 20:22:50'),
(6, 4, 1, 1, 0, 0, 10, 'High', '2025-04-13 22:12:58'),
(7, 2, 1, 1, 1, 1, 6, 'Moderate', '2025-04-14 03:24:47'),
(8, 9, 1, 1, 0, 1, 8, 'High', '2025-04-14 17:44:52'),
(9, 8, 1, 1, 0, 0, 10, 'High', '2025-04-23 15:20:48'),
(10, 9, 0, 0, 1, 1, 0, 'Low', '2025-04-23 15:32:52'),
(11, 16, 1, 1, 1, 1, 6, 'Moderate', '2025-04-28 19:28:27'),
(12, 2, 1, 0, 0, 0, 7, 'Moderate', '2025-08-14 17:07:38');

-- --------------------------------------------------------

--
-- Table structure for table `stations`
--

CREATE TABLE `stations` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('PNP','BFP') NOT NULL,
  `address` varchar(255) NOT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stations`
--

INSERT INTO `stations` (`id`, `name`, `type`, `address`, `latitude`, `longitude`) VALUES
(1, 'Molo District Police Station', 'PNP', 'Molo, Iloilo City', 10.702577704829702, 122.54524721212897),
(2, 'Arevalo Police Station', 'PNP', 'Villa Arevalo, Iloilo City', 10.68935915151069, 122.51657110973035),
(3, 'PNP Station 5', 'PNP', 'Mandurriao, Iloilo City', 10.718606349123561, 122.53707085605258),
(4, 'Iloilo City Police Station 10', 'PNP', 'Mandurriao, Iloilo City', 10.705703842025798, 122.5541731091961),
(5, 'Iloilo City Police Office', 'PNP', 'Mandurriao, Iloilo City', 10.702239047821504, 122.56352819973596),
(6, 'POLICE STATION 3', 'PNP', 'Luna St. Jaro, Iloilo City', 10.71637147858059, 122.56250731158228),
(7, 'Iloilo City Police Station 3', 'PNP', 'Jaro, Iloilo City', 10.727275249070377, 122.55753827685025),
(8, 'Iloilo City Police Station 8', 'PNP', 'Sampaguita St, Lapuz, Iloilo City, Iloilo', 10.697309491012305, 122.58514996232637),
(9, 'Philippine National Police Western Visayas Regional Headquarters', 'PNP', 'Iloilo City Proper, Iloilo City, 5000 Iloilo', 10.69145157414182, 122.58088533707652),
(10, 'Philipine National Police - RD PRO 6', 'PNP', 'Camp Martin Delgado, Fort San Pedro Drive, Iloilo City, 5000, Iloilo', 10.691463432743692, 122.58048708982415),
(11, 'Arevalo Fire Sub-Station', 'BFP', 'Villa Arevalo District, Iloilo City, 5000 Iloilo', 10.68803077326833, 122.51673847140576),
(12, '(OLD)Molo Fire Station', 'BFP', 'Locsin St, Molo, Iloilo City, 5000 Iloilo', 10.697476892069218, 122.54420429175273),
(13, 'Molo Fire Sub Station, BFP Iloilo City', 'BFP', 'Brgy Taal, Molo, Iloilo City, Iloilo', 10.696923185712782, 122.54797465357223),
(14, 'Bureau of Fire Protection', 'BFP', 'Macario Peralta Street, Iloilo City Proper, Iloilo City, Iloilo', 10.694069105333908, 122.57255837802192),
(15, 'NEW BFP BLDG.', 'BFP', 'Fort San Pedro Dr, Iloilo City Proper, Iloilo City, Iloilo', 10.689374358960329, 122.58151053465244),
(16, 'Iloilo City Fire Station', 'BFP', 'Fort San Pedro Dr, Iloilo City Proper, Iloilo City, Iloilo', 10.690353933763825, 122.58221564132928),
(17, 'BO.OBRERO FIRE SUB-STATION', 'BFP', 'Dahlia St, Lapuz, Iloilo City, Iloilo', 10.699540066181463, 122.58756406938278),
(18, 'La Paz Fire Sub-Station', 'BFP', 'La Paz, Iloilo City, Iloilo', 10.710991846100452, 122.56986447036857),
(19, 'BUREAU OF FIRE PROTECTION JARO FIRE SUB STATION', 'BFP', 'Plaza Rizal St, Jaro, Iloilo City, Iloilo, Iloilo', 10.725320702555917, 122.55750782376005),
(20, 'Bureau of Fire Protection RHQ 6', 'BFP', '4th Main Ave, Jaro, Iloilo City, Iloilo', 10.73970031909681, 122.56651567896992),
(21, 'Iloilo City Ungka Fire Sub-Station', 'BFP', 'Jaro, Iloilo City, Iloilo', 10.746821847269024, 122.53897978786522);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstname` varchar(150) DEFAULT NULL,
  `lastname` varchar(150) DEFAULT NULL,
  `street_address` varchar(255) DEFAULT NULL,
  `barangay` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `contact_number` varchar(25) DEFAULT NULL,
  `landmark` varchar(255) DEFAULT NULL,
  `address_type` varchar(50) DEFAULT NULL,
  `additional_instructions` text DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` enum('user','admin','responder') NOT NULL DEFAULT 'user',
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `status` enum('active','busy','deployed','offline') DEFAULT 'offline',
  `station_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `street_address`, `barangay`, `city`, `province`, `postal_code`, `country`, `email`, `contact_number`, `landmark`, `address_type`, `additional_instructions`, `password`, `created_at`, `role`, `latitude`, `longitude`, `status`, `station_id`) VALUES
(1, 'Jayrold', 'Tabalina', '124 R. Mapa Street', 'Tabucan', 'Iloilo city', 'Iloilo', '5000', 'Philippines', 'jayroldtabalina@gmail.com', '09499619011', 'near Patahan sa Tabucan1', 'Home', 'none', '123', '2025-04-11 12:54:46', 'admin', NULL, NULL, 'offline', NULL),
(2, 'Yasmine', 'Talaman', 'Blk 15, Lot 6 ', 'Housing', 'Iloilo city', 'Iloilo', '5000', 'Philippines', 'yasminetalaman@gmail.com', '09876543210', 'near Garzon appartment', 'home', 'mandurriao housing1', '123', '2025-04-11 14:47:41', 'user', NULL, NULL, 'active', NULL),
(3, 'John', 'Doe', '123 Main St', 'Barangay 1', 'Cityville', 'Province A', '12345', 'Country X', 'john.doe@example.com', '09123456789', 'Near park', 'Home', 'Leave at the door', 'password123', '2025-04-11 16:30:52', 'user', NULL, NULL, 'offline', NULL),
(4, 'Jane', 'Smith', '456 Oak Ave', 'Barangay 2', 'Townsville', 'Province B', '67890', 'Country Y', 'jane.smith@example.com', '09234567890', 'Near school', 'Home', 'Ring the bell', 'password123', '2025-04-11 16:30:52', 'user', NULL, NULL, 'offline', NULL),
(5, 'Michael', 'Johnson', '789 Pine Rd', 'Barangay 3', 'Villagetown', 'Province C', '11223', 'Country Z', 'michael.johnson@example.com', '09345678901', 'Next to hospital', 'Home', 'Call first', 'password123', '2025-04-11 16:30:52', 'user', NULL, NULL, 'offline', NULL),
(6, 'Emily', 'Davis', '101 Maple Blvd', 'Barangay 4', 'Metropolis', 'Province D', '44556', 'Country W', 'emily.davis@example.com', '09456789012', 'Behind mall', 'Home', 'Do not disturb', 'password123', '2025-04-11 16:30:52', 'user', NULL, NULL, 'offline', NULL),
(7, 'William', 'Martinez', '202 Cedar Ln', 'Barangay 5', 'Bigcity', 'Province E', '77889', 'Country V', 'william.martinez@example.com', '09567890123', 'Near restaurant', 'Office', 'Leave on doorstep', 'password123', '2025-04-11 16:30:52', 'user', NULL, NULL, 'offline', NULL),
(8, 'Olivia', 'Brown', '303 Birch Dr', 'Barangay 6', 'Smalltown', 'Province F', '33445', 'Country U', 'olivia.brown@example.com', '09678901234', 'Beside bank', 'Home', 'Ring bell', 'password123', '2025-04-11 16:30:52', 'user', NULL, NULL, 'offline', NULL),
(9, 'James', 'Garcia', '404 Elm St', 'Barangay 7', 'Largetown', 'Province G', '55667', 'Country T', 'james.garcia@example.com', '09789012345', 'In front of library', 'Office', 'Knock on door', 'password123', '2025-04-11 16:30:52', 'user', NULL, NULL, 'offline', NULL),
(13, 'test', 'test', '', '', '', '', '5000', 'Philippines', '', '091234567890', '', '', '', '123', '2025-04-13 04:42:49', 'user', NULL, NULL, 'offline', NULL),
(15, 'admin', 'admin', '', '', '', '', '', '', 'admin@gmail.com', '', '', '', '', '123', '2025-04-13 12:33:33', 'admin', NULL, NULL, 'active', NULL),
(16, 'user', 'user', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '09111111111', NULL, NULL, NULL, '123', '2025-04-28 11:10:48', 'user', NULL, NULL, 'offline', NULL),
(17, 'Mark', 'Jabao', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '09630426657', NULL, NULL, NULL, 'Mark12345', '2025-08-15 01:36:23', 'user', NULL, NULL, 'offline', NULL),
(20, 'sample', 'user', '', '', '', '', '', '', 'sampleuser@gmail.com', '0954321789', '', '', '', '123', '2025-08-21 14:02:12', 'user', NULL, NULL, 'offline', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `deploys`
--
ALTER TABLE `deploys`
  ADD PRIMARY KEY (`id`),
  ADD KEY `responder_id` (`responder_id`),
  ADD KEY `station_id` (`station_id`),
  ADD KEY `incident_id` (`incident_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `disaster_reports`
--
ALTER TABLE `disaster_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `fk_responder` (`responder_id`);

--
-- Indexes for table `requests`
--
ALTER TABLE `requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `responders`
--
ALTER TABLE `responders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `station_id` (`station_id`);

--
-- Indexes for table `risk_assessments`
--
ALTER TABLE `risk_assessments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `stations`
--
ALTER TABLE `stations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `contact_number` (`contact_number`),
  ADD KEY `fk_station` (`station_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `deploys`
--
ALTER TABLE `deploys`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `disaster_reports`
--
ALTER TABLE `disaster_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `requests`
--
ALTER TABLE `requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `responders`
--
ALTER TABLE `responders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `risk_assessments`
--
ALTER TABLE `risk_assessments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `stations`
--
ALTER TABLE `stations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `deploys`
--
ALTER TABLE `deploys`
  ADD CONSTRAINT `deploys_ibfk_1` FOREIGN KEY (`responder_id`) REFERENCES `responders` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `deploys_ibfk_2` FOREIGN KEY (`station_id`) REFERENCES `stations` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `deploys_ibfk_3` FOREIGN KEY (`incident_id`) REFERENCES `disaster_reports` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `deploys_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `disaster_reports`
--
ALTER TABLE `disaster_reports`
  ADD CONSTRAINT `disaster_reports_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_responder` FOREIGN KEY (`responder_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `requests`
--
ALTER TABLE `requests`
  ADD CONSTRAINT `requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `responders`
--
ALTER TABLE `responders`
  ADD CONSTRAINT `responders_ibfk_1` FOREIGN KEY (`station_id`) REFERENCES `stations` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `risk_assessments`
--
ALTER TABLE `risk_assessments`
  ADD CONSTRAINT `risk_assessments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_station` FOREIGN KEY (`station_id`) REFERENCES `stations` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
