-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jan 17, 2026 at 11:57 AM
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
  `remarks` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `deploys`
--

INSERT INTO `deploys` (`id`, `responder_id`, `station_id`, `incident_id`, `user_id`, `status`, `deployed_at`, `resolved_at`, `remarks`) VALUES
(43, 2, 1, NULL, NULL, 'resolved', '2026-01-16 07:56:13', '2026-01-16 07:57:53', 'goods po'),
(44, 2, 1, NULL, NULL, 'resolved', '2026-01-16 07:58:17', '2026-01-16 07:59:12', 'congrats');

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
  `responder_message` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `disaster_reports`
--

INSERT INTO `disaster_reports` (`id`, `user_id`, `disaster_type`, `reported_at`, `location`, `status`, `responder_id`, `latitude`, `longitude`, `responder_confirmed_at`, `user_confirmed_at`, `resolution_remarks`, `resolved_by`, `user_message`, `responder_message`) VALUES
(65, 37, 'Fire', '2026-01-16 08:52:17', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'pending', NULL, 10.69346796, 122.57210564, NULL, NULL, NULL, NULL, NULL, NULL),
(66, 37, 'Earthquake', '2026-01-16 08:52:35', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'pending', NULL, 10.69346796, 122.57210564, NULL, NULL, NULL, NULL, NULL, NULL),
(67, 37, 'Flood', '2026-01-16 08:52:46', 'Aduana Street, Iloilo City Civic Center, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'pending', NULL, 10.69352048, 122.57215060, NULL, NULL, NULL, NULL, NULL, NULL),
(68, 37, 'Fire', '2026-01-17 10:17:39', 'R. Mapa Street, San Rafael, Mandurriao, Navais, Iloilo City, Western Visayas, 5000, Philippines', 'pending', NULL, 10.70255200, 122.54364000, NULL, NULL, NULL, NULL, NULL, NULL),
(69, 37, 'Flood', '2026-01-17 10:17:56', 'R. Mapa Street, San Rafael, Mandurriao, Navais, Iloilo City, Western Visayas, 5000, Philippines', 'pending', NULL, 10.70255200, 122.54364000, NULL, NULL, NULL, NULL, NULL, NULL),
(70, 37, 'Flood', '2026-01-17 10:18:06', 'R. Mapa Street, San Rafael, Mandurriao, Navais, Iloilo City, Western Visayas, 5000, Philippines', 'pending', NULL, 10.70255200, 122.54364000, NULL, NULL, NULL, NULL, NULL, NULL),
(71, 37, 'Fire', '2026-01-17 10:18:48', 'R. Mapa Street, San Rafael, Mandurriao, Navais, Iloilo City, Western Visayas, 5000, Philippines', 'pending', NULL, 10.70255200, 122.54364000, NULL, NULL, NULL, NULL, NULL, NULL),
(72, 37, 'Fire', '2026-01-17 10:26:11', 'R. Mapa Street, San Rafael, Mandurriao, Navais, Iloilo City, Western Visayas, 5000, Philippines', 'pending', NULL, 10.70255200, 122.54364000, NULL, NULL, NULL, NULL, NULL, NULL),
(73, 37, 'Flood', '2026-01-17 10:26:25', 'R. Mapa Street, San Rafael, Mandurriao, Navais, Iloilo City, Western Visayas, 5000, Philippines', 'pending', NULL, 10.70255200, 122.54364000, NULL, NULL, NULL, NULL, NULL, NULL),
(74, 37, 'Fire', '2026-01-17 10:29:38', 'R. Mapa Street, San Rafael, Mandurriao, Navais, Iloilo City, Western Visayas, 5000, Philippines', 'pending', NULL, 10.70255200, 122.54364000, NULL, NULL, NULL, NULL, NULL, NULL),
(75, 37, 'Flood', '2026-01-17 10:29:45', 'R. Mapa Street, San Rafael, Mandurriao, Navais, Iloilo City, Western Visayas, 5000, Philippines', 'pending', NULL, 10.70255200, 122.54364000, NULL, NULL, NULL, NULL, NULL, NULL),
(76, 37, 'Flood', '2026-01-17 10:29:55', 'R. Mapa Street, San Rafael, Mandurriao, Navais, Iloilo City, Western Visayas, 5000, Philippines', 'pending', NULL, 10.70255200, 122.54364000, NULL, NULL, NULL, NULL, NULL, NULL),
(77, 37, 'Fire', '2026-01-17 10:30:11', 'R. Mapa Street, San Rafael, Mandurriao, Navais, Iloilo City, Western Visayas, 5000, Philippines', 'pending', NULL, 10.70255200, 122.54364000, NULL, NULL, NULL, NULL, NULL, NULL),
(78, 37, 'Fire', '2026-01-17 10:33:54', 'R. Mapa Street, San Rafael, Mandurriao, Navais, Iloilo City, Western Visayas, 5000, Philippines', 'pending', NULL, 10.70255200, 122.54364000, NULL, NULL, NULL, NULL, NULL, NULL),
(79, 37, 'Flood', '2026-01-17 10:39:22', 'R. Mapa Street, San Rafael, Mandurriao, Navais, Iloilo City, Western Visayas, 5000, Philippines', 'pending', NULL, 10.70255200, 122.54364000, NULL, NULL, NULL, NULL, NULL, NULL),
(80, 37, 'Flood', '2026-01-17 10:39:49', 'R. Mapa Street, San Rafael, Mandurriao, Navais, Iloilo City, Western Visayas, 5000, Philippines', 'pending', NULL, 10.70255200, 122.54364000, NULL, NULL, NULL, NULL, NULL, NULL),
(81, 37, 'Fire', '2026-01-17 10:40:10', 'R. Mapa Street, San Rafael, Mandurriao, Navais, Iloilo City, Western Visayas, 5000, Philippines', 'pending', NULL, 10.70255200, 122.54364000, NULL, NULL, NULL, NULL, NULL, NULL),
(82, 37, 'Flood', '2026-01-17 10:40:16', 'R. Mapa Street, San Rafael, Mandurriao, Navais, Iloilo City, Western Visayas, 5000, Philippines', 'pending', NULL, 10.70255200, 122.54364000, NULL, NULL, NULL, NULL, NULL, NULL),
(83, 37, 'Earthquake', '2026-01-17 10:40:26', 'R. Mapa Street, San Rafael, Mandurriao, Navais, Iloilo City, Western Visayas, 5000, Philippines', 'pending', NULL, 10.70255200, 122.54364000, NULL, NULL, NULL, NULL, NULL, NULL),
(84, 37, 'Landslide', '2026-01-17 10:40:31', 'R. Mapa Street, San Rafael, Mandurriao, Navais, Iloilo City, Western Visayas, 5000, Philippines', 'pending', NULL, 10.70255200, 122.54364000, NULL, NULL, NULL, NULL, NULL, NULL),
(85, 37, 'Flood', '2026-01-17 10:40:37', 'R. Mapa Street, San Rafael, Mandurriao, Navais, Iloilo City, Western Visayas, 5000, Philippines', 'pending', NULL, 10.70255200, 122.54364000, NULL, NULL, NULL, NULL, NULL, NULL),
(86, 37, 'Fire', '2026-01-17 10:40:45', 'R. Mapa Street, San Rafael, Mandurriao, Navais, Iloilo City, Western Visayas, 5000, Philippines', 'pending', NULL, 10.70255200, 122.54364000, NULL, NULL, NULL, NULL, NULL, NULL),
(87, 37, 'Flood', '2026-01-17 10:40:57', 'R. Mapa Street, San Rafael, Mandurriao, Navais, Iloilo City, Western Visayas, 5000, Philippines', 'pending', NULL, 10.70255200, 122.54364000, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `push_subscriptions`
--

CREATE TABLE `push_subscriptions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `responder_id` int(11) DEFAULT NULL,
  `endpoint` text NOT NULL,
  `keys_p256dh` text NOT NULL,
  `keys_auth` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `help_count` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `action` enum('standby','responding') DEFAULT 'standby',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `responders`
--

INSERT INTO `responders` (`id`, `firstname`, `lastname`, `username`, `password`, `contact_number`, `email`, `station_id`, `latitude`, `longitude`, `status`, `created_at`, `action`) VALUES
(2, 'john', 'doe', 'johndoe@responders.com', '$2b$10$axjoOc75/hBrjI.jwcWKpe669i41D6OSq2mP83f6/Gk6gWzqLFO7S', '09876543344', 'johndoe@responders.com', 1, 10.70255200, 122.54364000, 'offline', '2026-01-16 06:47:32', 'standby');

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
  `assessed_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `risk_assessments`
--

INSERT INTO `risk_assessments` (`id`, `user_id`, `near_river`, `near_fault`, `has_emergency_kit`, `has_evacuation_plan`, `risk_score`, `risk_level`, `assessed_at`) VALUES
(13, 37, 1, 0, 0, 1, 5, 'Moderate', '2026-01-16 16:53:19');

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
  `longitude` double NOT NULL,
  PRIMARY KEY (`id`) 
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
  `station_id` int(11) DEFAULT NULL,
  `verification_code` varchar(6) DEFAULT NULL,
  `verification_expiry` datetime DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT 0,
  `verification_method` enum('email','sms') DEFAULT 'email',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `street_address`, `barangay`, `city`, `province`, `postal_code`, `country`, `email`, `contact_number`, `landmark`, `address_type`, `additional_instructions`, `password`, `created_at`, `role`, `latitude`, `longitude`, `status`, `station_id`, `verification_code`, `verification_expiry`, `is_verified`, `verification_method`) VALUES
(28, 'System', 'Admin', 'City Hall', 'Poblacion', 'Iloilo City', 'Iloilo', '5000', 'Philippines', 'admin@citysafe.com', '09123456789', 'admin', 'Office', 'none', '$2b$10$1VloKngduGM2W.qZbYbOhu1KzJxLnu8pn600zBL9OjIDm4ZVrRd0O', '2026-01-16 06:36:21', 'admin', NULL, NULL, 'active', NULL, NULL, NULL, 0, 'email'),
(37, 'brime', 'lasting', NULL, NULL, NULL, NULL, NULL, NULL, 'brimelasting@gmail.com', '09939784619', NULL, NULL, NULL, '$2b$10$yeEuNTAEFxcCKIAcURMRMe87jrtV5ZrO.5STlSut9qFAyfeZ491GC', '2026-01-16 08:52:06', 'user', NULL, NULL, 'active', NULL, NULL, NULL, 1, 'email');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `deploys`
--
ALTER TABLE `deploys`
  ADD KEY `responder_id` (`responder_id`),
  ADD KEY `station_id` (`station_id`),
  ADD KEY `incident_id` (`incident_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `disaster_reports`
--
ALTER TABLE `disaster_reports`
  ADD KEY `user_id` (`user_id`),
  ADD KEY `fk_responder` (`responder_id`);

--
-- Indexes for table `push_subscriptions`
--
ALTER TABLE `push_subscriptions`
  ADD KEY `user_id` (`user_id`),
  ADD KEY `responder_id` (`responder_id`);

--
-- Indexes for table `requests`
--
ALTER TABLE `requests`
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `responders`
--
ALTER TABLE `responders`
  ADD KEY `station_id` (`station_id`);

--
-- Indexes for table `risk_assessments`
--
ALTER TABLE `risk_assessments`
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `stations`
--
-- ALTER TABLE `stations`
--   ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `disaster_reports`
--
ALTER TABLE `disaster_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- AUTO_INCREMENT for table `push_subscriptions`
--
ALTER TABLE `push_subscriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `requests`
--
ALTER TABLE `requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `responders`
--
ALTER TABLE `responders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `risk_assessments`
--
ALTER TABLE `risk_assessments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `stations`
--
ALTER TABLE `stations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

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
  ADD CONSTRAINT `fk_responder_correct` FOREIGN KEY (`responder_id`) REFERENCES `responders` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `push_subscriptions`
--
ALTER TABLE `push_subscriptions`
  ADD CONSTRAINT `push_subscriptions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `push_subscriptions_ibfk_2` FOREIGN KEY (`responder_id`) REFERENCES `responders` (`id`) ON DELETE CASCADE;

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
