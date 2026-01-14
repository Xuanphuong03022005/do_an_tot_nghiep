-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: book_flight_tickets
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `airlines`
--

DROP TABLE IF EXISTS `airlines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `airlines` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `registration_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `seat_rows` int NOT NULL,
  `seat_per_row` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `airlines_code_unique` (`code`),
  UNIQUE KEY `airlines_registration_code_unique` (`registration_code`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `airlines`
--

LOCK TABLES `airlines` WRITE;
/*!40000 ALTER TABLE `airlines` DISABLE KEYS */;
INSERT INTO `airlines` VALUES (3,'VIETJET AIR','VN','airline_20251008051953.jpg','Airbus 370','6454-765-12341',50,6,'2025-10-07 22:19:59','2025-10-08 00:44:47',NULL),(4,'BAMBOO AIRWAYS','QH','airline_20251204200745.jpg','Airbus A321','9988-321-55555',45,6,'2025-12-04 13:07:50','2025-12-04 13:07:50',NULL),(11,'VIETNAM AIRLINEE','BLE','airline_20251229211217.jpg','Boeing 7877','7777-111-222222',60,9,'2025-12-29 21:12:20','2025-12-29 21:12:20',NULL);
/*!40000 ALTER TABLE `airlines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `airports`
--

DROP TABLE IF EXISTS `airports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `airports` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `airports`
--

LOCK TABLES `airports` WRITE;
/*!40000 ALTER TABLE `airports` DISABLE KEYS */;
INSERT INTO `airports` VALUES (1,'Tân Sơn Nhất','HO CHI MINH','VIET NAM','TSN','2025-10-13 05:36:23','2025-10-13 05:42:51',NULL),(2,'Đà Nẵng','ĐA NANG','VIET NAM','ĐN','2025-12-02 22:51:57','2025-12-02 22:51:57',NULL),(3,'Hà Nội','HA NOI','VIET NAM','HAN','2025-12-29 20:51:31','2025-12-29 20:51:31',NULL);
/*!40000 ALTER TABLE `airports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `baggage_packages`
--

DROP TABLE IF EXISTS `baggage_packages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `baggage_packages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `weight` decimal(5,2) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `max_length` int DEFAULT NULL,
  `max_width` int DEFAULT NULL,
  `max_height` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `baggage_packages`
--

LOCK TABLES `baggage_packages` WRITE;
/*!40000 ALTER TABLE `baggage_packages` DISABLE KEYS */;
/*!40000 ALTER TABLE `baggage_packages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `baggage_rules`
--

DROP TABLE IF EXISTS `baggage_rules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `baggage_rules` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `class_id` bigint unsigned NOT NULL,
  `free_weight` decimal(5,2) NOT NULL DEFAULT '0.00',
  `max_weight` decimal(5,2) NOT NULL DEFAULT '0.00',
  `max_length` int DEFAULT NULL,
  `max_width` int DEFAULT NULL,
  `max_height` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `baggage_rules_class_id_foreign` (`class_id`),
  CONSTRAINT `baggage_rules_class_id_foreign` FOREIGN KEY (`class_id`) REFERENCES `seat_classes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `baggage_rules`
--

LOCK TABLES `baggage_rules` WRITE;
/*!40000 ALTER TABLE `baggage_rules` DISABLE KEYS */;
/*!40000 ALTER TABLE `baggage_rules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `baggages`
--

DROP TABLE IF EXISTS `baggages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `baggages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `booking_ticket_id` bigint unsigned NOT NULL,
  `type` enum('carry_on','checked') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'carry_on',
  `weight` decimal(10,2) NOT NULL,
  `size` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` int NOT NULL DEFAULT '0',
  `note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `baggages_booking_ticket_id_foreign` (`booking_ticket_id`),
  CONSTRAINT `baggages_booking_ticket_id_foreign` FOREIGN KEY (`booking_ticket_id`) REFERENCES `booking_tickets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `baggages`
--

LOCK TABLES `baggages` WRITE;
/*!40000 ALTER TABLE `baggages` DISABLE KEYS */;
/*!40000 ALTER TABLE `baggages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_tickets`
--

DROP TABLE IF EXISTS `booking_tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_tickets` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `booking_id` bigint unsigned NOT NULL,
  `ticket_id` bigint unsigned NOT NULL,
  `passenger_id` bigint unsigned NOT NULL,
  `seat_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `booking_tickets_booking_id_foreign` (`booking_id`),
  KEY `booking_tickets_passenger_id_foreign` (`passenger_id`),
  KEY `booking_tickets_ticket_id_foreign` (`ticket_id`),
  CONSTRAINT `booking_tickets_booking_id_foreign` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `booking_tickets_passenger_id_foreign` FOREIGN KEY (`passenger_id`) REFERENCES `passengers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `booking_tickets_ticket_id_foreign` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_tickets`
--

LOCK TABLES `booking_tickets` WRITE;
/*!40000 ALTER TABLE `booking_tickets` DISABLE KEYS */;
/*!40000 ALTER TABLE `booking_tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `flight_id` bigint unsigned NOT NULL,
  `pnr_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_amount` int NOT NULL,
  `discount_id` bigint unsigned DEFAULT NULL,
  `discount_value` int DEFAULT NULL,
  `total_final` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `bookings_discount_id_foreign` (`discount_id`),
  KEY `bookings_flight_id_foreign` (`flight_id`),
  KEY `bookings_user_id_foreign` (`user_id`),
  CONSTRAINT `bookings_discount_id_foreign` FOREIGN KEY (`discount_id`) REFERENCES `discounts` (`id`),
  CONSTRAINT `bookings_flight_id_foreign` FOREIGN KEY (`flight_id`) REFERENCES `flights` (`id`),
  CONSTRAINT `bookings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discounts`
--

DROP TABLE IF EXISTS `discounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discounts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('percentage','fixed_amount') COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `min_order_amount` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `usage_limit` int NOT NULL,
  `used_count` int NOT NULL DEFAULT '0',
  `status` enum('active','expired','inactive') COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discounts`
--

LOCK TABLES `discounts` WRITE;
/*!40000 ALTER TABLE `discounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `discounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flights`
--

DROP TABLE IF EXISTS `flights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flights` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `airline_id` bigint unsigned NOT NULL,
  `departure_airport_id` bigint unsigned NOT NULL,
  `arrival_airport_id` bigint unsigned NOT NULL,
  `departure_time` datetime NOT NULL,
  `arrival_time` datetime NOT NULL,
  `flight_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `flights_departure_airport_id_foreign` (`departure_airport_id`),
  KEY `flights_arrival_airport_id_foreign` (`arrival_airport_id`),
  KEY `flights_airline_id_foreign` (`airline_id`),
  KEY `fk_flights_parent` (`parent_id`),
  CONSTRAINT `fk_flights_parent` FOREIGN KEY (`parent_id`) REFERENCES `flights` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `flights_airline_id_foreign` FOREIGN KEY (`airline_id`) REFERENCES `airlines` (`id`) ON DELETE CASCADE,
  CONSTRAINT `flights_arrival_airport_id_foreign` FOREIGN KEY (`arrival_airport_id`) REFERENCES `airports` (`id`) ON DELETE CASCADE,
  CONSTRAINT `flights_departure_airport_id_foreign` FOREIGN KEY (`departure_airport_id`) REFERENCES `airports` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flights`
--

LOCK TABLES `flights` WRITE;
/*!40000 ALTER TABLE `flights` DISABLE KEYS */;
INSERT INTO `flights` VALUES (54,3,1,2,'2026-01-10 08:00:00','2026-01-10 09:30:00','TSN-ĐN-1767056699','2025-12-30 08:04:59','2025-12-30 08:04:59',NULL,'2',NULL),(55,3,2,1,'2026-01-11 15:00:00','2026-01-11 16:30:00','ĐN-TSN-1767056699','2025-12-30 08:04:59','2025-12-30 08:04:59',NULL,'2',54);
/*!40000 ALTER TABLE `flights` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (73,'0001_01_01_000001_create_cache_table',1),(74,'0001_01_01_000002_create_jobs_table',1),(75,'0001_01_01_000003_create_users_table',1),(76,'2025_10_06_022913_create_passengers_table',1),(77,'2025_10_06_023447_create_airlines_table',1),(78,'2025_10_06_023832_create_airports_table',1),(79,'2025_10_06_024427_create_flights_table',1),(80,'2025_10_06_042529_create_seat_classes_table',1),(81,'2025_10_06_042608_create_seats_table',1),(82,'2025_10_06_043231_create_tickets_table',1),(83,'2025_10_06_044133_create_discounts_table',1),(84,'2025_10_06_045220_create_bookings_table',1),(85,'2025_10_06_063343_create_booking_tickets_table',1),(86,'2025_10_06_064334_create_payments_table',1),(87,'2025_10_06_084845_create_baggages_table',1),(88,'2025_10_06_090645_create_baggage_rules_table',1),(89,'2025_10_06_090748_create_baggage_packages_table',1),(90,'2025_10_07_012739_create_seat_flights_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `passengers`
--

DROP TABLE IF EXISTS `passengers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `passengers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` enum('male','female','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `identity_type` enum('CCCD','Passport','birth_certificate') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CCCD',
  `identity_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `passengers`
--

LOCK TABLES `passengers` WRITE;
/*!40000 ALTER TABLE `passengers` DISABLE KEYS */;
/*!40000 ALTER TABLE `passengers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `booking_id` bigint unsigned NOT NULL,
  `method` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` int NOT NULL,
  `status` enum('pending','success','failed') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `payments_booking_id_foreign` (`booking_id`),
  CONSTRAINT `payments_booking_id_foreign` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seat_classes`
--

DROP TABLE IF EXISTS `seat_classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seat_classes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seat_classes`
--

LOCK TABLES `seat_classes` WRITE;
/*!40000 ALTER TABLE `seat_classes` DISABLE KEYS */;
INSERT INTO `seat_classes` VALUES (5,'Business','Hạng thương gia, Ghế ngả thành giường nằm, dịch vụ ăn uống cao cấp, phòng chờ VIP tại sân bay.','2025-10-07 22:49:46','2025-10-07 22:49:46',NULL),(6,'Premium Economy','Phổ thông cao cấp, Ghế rộng hơn, chỗ để chân thoải mái hơn, dịch vụ tốt hơn so với Economy.','2025-10-07 22:50:30','2025-10-07 22:50:30',NULL),(7,'Economy','Phổ thông, Đây là hạng ghế cơ bản nhất, giá vé thấp, tiện ích tiêu chuẩn.','2025-10-07 22:50:43','2025-10-07 22:50:43',NULL),(8,'First','Hạng nhất,Hạng cao cấp nhất, thường chỉ có trên đường bay quốc tế dài.','2025-10-07 22:50:53','2025-10-07 22:51:32',NULL);
/*!40000 ALTER TABLE `seat_classes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seat_flights`
--

DROP TABLE IF EXISTS `seat_flights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seat_flights` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `flight_id` bigint unsigned NOT NULL,
  `seat_id` bigint unsigned NOT NULL,
  `seat_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `seat_flights_flight_id_foreign` (`flight_id`),
  KEY `seat_flights_seat_id_foreign` (`seat_id`),
  CONSTRAINT `seat_flights_flight_id_foreign` FOREIGN KEY (`flight_id`) REFERENCES `flights` (`id`),
  CONSTRAINT `seat_flights_seat_id_foreign` FOREIGN KEY (`seat_id`) REFERENCES `seats` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6151 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seat_flights`
--

LOCK TABLES `seat_flights` WRITE;
/*!40000 ALTER TABLE `seat_flights` DISABLE KEYS */;
INSERT INTO `seat_flights` VALUES (5851,54,61,'11A',900000,NULL,NULL),(5852,54,62,'11B',900000,NULL,NULL),(5853,54,63,'11C',900000,NULL,NULL),(5854,54,64,'11D',900000,NULL,NULL),(5855,54,65,'11E',900000,NULL,NULL),(5856,54,66,'11F',900000,NULL,NULL),(5857,54,67,'12A',900000,NULL,NULL),(5858,54,68,'12B',900000,NULL,NULL),(5859,54,69,'12C',900000,NULL,NULL),(5860,54,70,'12D',900000,NULL,NULL),(5861,54,71,'12E',900000,NULL,NULL),(5862,54,72,'12F',900000,NULL,NULL),(5863,54,73,'13A',900000,NULL,NULL),(5864,54,74,'13B',900000,NULL,NULL),(5865,54,75,'13C',900000,NULL,NULL),(5866,54,76,'13D',900000,NULL,NULL),(5867,54,77,'13E',900000,NULL,NULL),(5868,54,78,'13F',900000,NULL,NULL),(5869,54,79,'14A',900000,NULL,NULL),(5870,54,80,'14B',900000,NULL,NULL),(5871,54,81,'14C',900000,NULL,NULL),(5872,54,82,'14D',900000,NULL,NULL),(5873,54,83,'14E',900000,NULL,NULL),(5874,54,84,'14F',900000,NULL,NULL),(5875,54,85,'15A',900000,NULL,NULL),(5876,54,86,'15B',900000,NULL,NULL),(5877,54,87,'15C',900000,NULL,NULL),(5878,54,88,'15D',900000,NULL,NULL),(5879,54,89,'15E',900000,NULL,NULL),(5880,54,90,'15F',900000,NULL,NULL),(5881,54,91,'16A',900000,NULL,NULL),(5882,54,92,'16B',900000,NULL,NULL),(5883,54,93,'16C',900000,NULL,NULL),(5884,54,94,'16D',900000,NULL,NULL),(5885,54,95,'16E',900000,NULL,NULL),(5886,54,96,'16F',900000,NULL,NULL),(5887,54,97,'17A',900000,NULL,NULL),(5888,54,98,'17B',900000,NULL,NULL),(5889,54,99,'17C',900000,NULL,NULL),(5890,54,100,'17D',900000,NULL,NULL),(5891,54,101,'17E',900000,NULL,NULL),(5892,54,102,'17F',900000,NULL,NULL),(5893,54,103,'18A',900000,NULL,NULL),(5894,54,104,'18B',900000,NULL,NULL),(5895,54,105,'18C',900000,NULL,NULL),(5896,54,106,'18D',900000,NULL,NULL),(5897,54,107,'18E',900000,NULL,NULL),(5898,54,108,'18F',900000,NULL,NULL),(5899,54,109,'19A',900000,NULL,NULL),(5900,54,110,'19B',900000,NULL,NULL),(5901,54,111,'19C',900000,NULL,NULL),(5902,54,112,'19D',900000,NULL,NULL),(5903,54,113,'19E',900000,NULL,NULL),(5904,54,114,'19F',900000,NULL,NULL),(5905,54,115,'20A',900000,NULL,NULL),(5906,54,116,'20B',900000,NULL,NULL),(5907,54,117,'20C',900000,NULL,NULL),(5908,54,118,'20D',900000,NULL,NULL),(5909,54,119,'20E',900000,NULL,NULL),(5910,54,120,'20F',900000,NULL,NULL),(5911,54,121,'21A',700000,NULL,NULL),(5912,54,122,'21B',700000,NULL,NULL),(5913,54,123,'21C',700000,NULL,NULL),(5914,54,124,'21D',700000,NULL,NULL),(5915,54,125,'21E',700000,NULL,NULL),(5916,54,126,'21F',700000,NULL,NULL),(5917,54,127,'22A',700000,NULL,NULL),(5918,54,128,'22B',700000,NULL,NULL),(5919,54,129,'22C',700000,NULL,NULL),(5920,54,130,'22D',700000,NULL,NULL),(5921,54,131,'22E',700000,NULL,NULL),(5922,54,132,'22F',700000,NULL,NULL),(5923,54,133,'23A',700000,NULL,NULL),(5924,54,134,'23B',700000,NULL,NULL),(5925,54,135,'23C',700000,NULL,NULL),(5926,54,136,'23D',700000,NULL,NULL),(5927,54,137,'23E',700000,NULL,NULL),(5928,54,138,'23F',700000,NULL,NULL),(5929,54,139,'24A',700000,NULL,NULL),(5930,54,140,'24B',700000,NULL,NULL),(5931,54,141,'24C',700000,NULL,NULL),(5932,54,142,'24D',700000,NULL,NULL),(5933,54,143,'24E',700000,NULL,NULL),(5934,54,144,'24F',700000,NULL,NULL),(5935,54,145,'25A',700000,NULL,NULL),(5936,54,146,'25B',700000,NULL,NULL),(5937,54,147,'25C',700000,NULL,NULL),(5938,54,148,'25D',700000,NULL,NULL),(5939,54,149,'25E',700000,NULL,NULL),(5940,54,150,'25F',700000,NULL,NULL),(5941,54,151,'26A',700000,NULL,NULL),(5942,54,152,'26B',700000,NULL,NULL),(5943,54,153,'26C',700000,NULL,NULL),(5944,54,154,'26D',700000,NULL,NULL),(5945,54,155,'26E',700000,NULL,NULL),(5946,54,156,'26F',700000,NULL,NULL),(5947,54,157,'27A',700000,NULL,NULL),(5948,54,158,'27B',700000,NULL,NULL),(5949,54,159,'27C',700000,NULL,NULL),(5950,54,160,'27D',700000,NULL,NULL),(5951,54,161,'27E',700000,NULL,NULL),(5952,54,162,'27F',700000,NULL,NULL),(5953,54,163,'28A',700000,NULL,NULL),(5954,54,164,'28B',700000,NULL,NULL),(5955,54,165,'28C',700000,NULL,NULL),(5956,54,166,'28D',700000,NULL,NULL),(5957,54,167,'28E',700000,NULL,NULL),(5958,54,168,'28F',700000,NULL,NULL),(5959,54,169,'29A',700000,NULL,NULL),(5960,54,170,'29B',700000,NULL,NULL),(5961,54,171,'29C',700000,NULL,NULL),(5962,54,172,'29D',700000,NULL,NULL),(5963,54,173,'29E',700000,NULL,NULL),(5964,54,174,'29F',700000,NULL,NULL),(5965,54,175,'30A',700000,NULL,NULL),(5966,54,176,'30B',700000,NULL,NULL),(5967,54,177,'30C',700000,NULL,NULL),(5968,54,178,'30D',700000,NULL,NULL),(5969,54,179,'30E',700000,NULL,NULL),(5970,54,180,'30F',700000,NULL,NULL),(5971,54,181,'31A',700000,NULL,NULL),(5972,54,182,'31B',700000,NULL,NULL),(5973,54,183,'31C',700000,NULL,NULL),(5974,54,184,'31D',700000,NULL,NULL),(5975,54,185,'31E',700000,NULL,NULL),(5976,54,186,'31F',700000,NULL,NULL),(5977,54,187,'32A',700000,NULL,NULL),(5978,54,188,'32B',700000,NULL,NULL),(5979,54,189,'32C',700000,NULL,NULL),(5980,54,190,'32D',700000,NULL,NULL),(5981,54,191,'32E',700000,NULL,NULL),(5982,54,192,'32F',700000,NULL,NULL),(5983,54,193,'33A',700000,NULL,NULL),(5984,54,194,'33B',700000,NULL,NULL),(5985,54,195,'33C',700000,NULL,NULL),(5986,54,196,'33D',700000,NULL,NULL),(5987,54,197,'33E',700000,NULL,NULL),(5988,54,198,'33F',700000,NULL,NULL),(5989,54,199,'34A',700000,NULL,NULL),(5990,54,200,'34B',700000,NULL,NULL),(5991,54,201,'34C',700000,NULL,NULL),(5992,54,202,'34D',700000,NULL,NULL),(5993,54,203,'34E',700000,NULL,NULL),(5994,54,204,'34F',700000,NULL,NULL),(5995,54,205,'35A',700000,NULL,NULL),(5996,54,206,'35B',700000,NULL,NULL),(5997,54,207,'35C',700000,NULL,NULL),(5998,54,208,'35D',700000,NULL,NULL),(5999,54,209,'35E',700000,NULL,NULL),(6000,54,210,'35F',700000,NULL,NULL),(6001,55,61,'11A',1050000,NULL,NULL),(6002,55,62,'11B',1050000,NULL,NULL),(6003,55,63,'11C',1050000,NULL,NULL),(6004,55,64,'11D',1050000,NULL,NULL),(6005,55,65,'11E',1050000,NULL,NULL),(6006,55,66,'11F',1050000,NULL,NULL),(6007,55,67,'12A',1050000,NULL,NULL),(6008,55,68,'12B',1050000,NULL,NULL),(6009,55,69,'12C',1050000,NULL,NULL),(6010,55,70,'12D',1050000,NULL,NULL),(6011,55,71,'12E',1050000,NULL,NULL),(6012,55,72,'12F',1050000,NULL,NULL),(6013,55,73,'13A',1050000,NULL,NULL),(6014,55,74,'13B',1050000,NULL,NULL),(6015,55,75,'13C',1050000,NULL,NULL),(6016,55,76,'13D',1050000,NULL,NULL),(6017,55,77,'13E',1050000,NULL,NULL),(6018,55,78,'13F',1050000,NULL,NULL),(6019,55,79,'14A',1050000,NULL,NULL),(6020,55,80,'14B',1050000,NULL,NULL),(6021,55,81,'14C',1050000,NULL,NULL),(6022,55,82,'14D',1050000,NULL,NULL),(6023,55,83,'14E',1050000,NULL,NULL),(6024,55,84,'14F',1050000,NULL,NULL),(6025,55,85,'15A',1050000,NULL,NULL),(6026,55,86,'15B',1050000,NULL,NULL),(6027,55,87,'15C',1050000,NULL,NULL),(6028,55,88,'15D',1050000,NULL,NULL),(6029,55,89,'15E',1050000,NULL,NULL),(6030,55,90,'15F',1050000,NULL,NULL),(6031,55,91,'16A',1050000,NULL,NULL),(6032,55,92,'16B',1050000,NULL,NULL),(6033,55,93,'16C',1050000,NULL,NULL),(6034,55,94,'16D',1050000,NULL,NULL),(6035,55,95,'16E',1050000,NULL,NULL),(6036,55,96,'16F',1050000,NULL,NULL),(6037,55,97,'17A',1050000,NULL,NULL),(6038,55,98,'17B',1050000,NULL,NULL),(6039,55,99,'17C',1050000,NULL,NULL),(6040,55,100,'17D',1050000,NULL,NULL),(6041,55,101,'17E',1050000,NULL,NULL),(6042,55,102,'17F',1050000,NULL,NULL),(6043,55,103,'18A',1050000,NULL,NULL),(6044,55,104,'18B',1050000,NULL,NULL),(6045,55,105,'18C',1050000,NULL,NULL),(6046,55,106,'18D',1050000,NULL,NULL),(6047,55,107,'18E',1050000,NULL,NULL),(6048,55,108,'18F',1050000,NULL,NULL),(6049,55,109,'19A',1050000,NULL,NULL),(6050,55,110,'19B',1050000,NULL,NULL),(6051,55,111,'19C',1050000,NULL,NULL),(6052,55,112,'19D',1050000,NULL,NULL),(6053,55,113,'19E',1050000,NULL,NULL),(6054,55,114,'19F',1050000,NULL,NULL),(6055,55,115,'20A',1050000,NULL,NULL),(6056,55,116,'20B',1050000,NULL,NULL),(6057,55,117,'20C',1050000,NULL,NULL),(6058,55,118,'20D',1050000,NULL,NULL),(6059,55,119,'20E',1050000,NULL,NULL),(6060,55,120,'20F',1050000,NULL,NULL),(6061,55,121,'21A',850000,NULL,NULL),(6062,55,122,'21B',850000,NULL,NULL),(6063,55,123,'21C',850000,NULL,NULL),(6064,55,124,'21D',850000,NULL,NULL),(6065,55,125,'21E',850000,NULL,NULL),(6066,55,126,'21F',850000,NULL,NULL),(6067,55,127,'22A',850000,NULL,NULL),(6068,55,128,'22B',850000,NULL,NULL),(6069,55,129,'22C',850000,NULL,NULL),(6070,55,130,'22D',850000,NULL,NULL),(6071,55,131,'22E',850000,NULL,NULL),(6072,55,132,'22F',850000,NULL,NULL),(6073,55,133,'23A',850000,NULL,NULL),(6074,55,134,'23B',850000,NULL,NULL),(6075,55,135,'23C',850000,NULL,NULL),(6076,55,136,'23D',850000,NULL,NULL),(6077,55,137,'23E',850000,NULL,NULL),(6078,55,138,'23F',850000,NULL,NULL),(6079,55,139,'24A',850000,NULL,NULL),(6080,55,140,'24B',850000,NULL,NULL),(6081,55,141,'24C',850000,NULL,NULL),(6082,55,142,'24D',850000,NULL,NULL),(6083,55,143,'24E',850000,NULL,NULL),(6084,55,144,'24F',850000,NULL,NULL),(6085,55,145,'25A',850000,NULL,NULL),(6086,55,146,'25B',850000,NULL,NULL),(6087,55,147,'25C',850000,NULL,NULL),(6088,55,148,'25D',850000,NULL,NULL),(6089,55,149,'25E',850000,NULL,NULL),(6090,55,150,'25F',850000,NULL,NULL),(6091,55,151,'26A',850000,NULL,NULL),(6092,55,152,'26B',850000,NULL,NULL),(6093,55,153,'26C',850000,NULL,NULL),(6094,55,154,'26D',850000,NULL,NULL),(6095,55,155,'26E',850000,NULL,NULL),(6096,55,156,'26F',850000,NULL,NULL),(6097,55,157,'27A',850000,NULL,NULL),(6098,55,158,'27B',850000,NULL,NULL),(6099,55,159,'27C',850000,NULL,NULL),(6100,55,160,'27D',850000,NULL,NULL),(6101,55,161,'27E',850000,NULL,NULL),(6102,55,162,'27F',850000,NULL,NULL),(6103,55,163,'28A',850000,NULL,NULL),(6104,55,164,'28B',850000,NULL,NULL),(6105,55,165,'28C',850000,NULL,NULL),(6106,55,166,'28D',850000,NULL,NULL),(6107,55,167,'28E',850000,NULL,NULL),(6108,55,168,'28F',850000,NULL,NULL),(6109,55,169,'29A',850000,NULL,NULL),(6110,55,170,'29B',850000,NULL,NULL),(6111,55,171,'29C',850000,NULL,NULL),(6112,55,172,'29D',850000,NULL,NULL),(6113,55,173,'29E',850000,NULL,NULL),(6114,55,174,'29F',850000,NULL,NULL),(6115,55,175,'30A',850000,NULL,NULL),(6116,55,176,'30B',850000,NULL,NULL),(6117,55,177,'30C',850000,NULL,NULL),(6118,55,178,'30D',850000,NULL,NULL),(6119,55,179,'30E',850000,NULL,NULL),(6120,55,180,'30F',850000,NULL,NULL),(6121,55,181,'31A',850000,NULL,NULL),(6122,55,182,'31B',850000,NULL,NULL),(6123,55,183,'31C',850000,NULL,NULL),(6124,55,184,'31D',850000,NULL,NULL),(6125,55,185,'31E',850000,NULL,NULL),(6126,55,186,'31F',850000,NULL,NULL),(6127,55,187,'32A',850000,NULL,NULL),(6128,55,188,'32B',850000,NULL,NULL),(6129,55,189,'32C',850000,NULL,NULL),(6130,55,190,'32D',850000,NULL,NULL),(6131,55,191,'32E',850000,NULL,NULL),(6132,55,192,'32F',850000,NULL,NULL),(6133,55,193,'33A',850000,NULL,NULL),(6134,55,194,'33B',850000,NULL,NULL),(6135,55,195,'33C',850000,NULL,NULL),(6136,55,196,'33D',850000,NULL,NULL),(6137,55,197,'33E',850000,NULL,NULL),(6138,55,198,'33F',850000,NULL,NULL),(6139,55,199,'34A',850000,NULL,NULL),(6140,55,200,'34B',850000,NULL,NULL),(6141,55,201,'34C',850000,NULL,NULL),(6142,55,202,'34D',850000,NULL,NULL),(6143,55,203,'34E',850000,NULL,NULL),(6144,55,204,'34F',850000,NULL,NULL),(6145,55,205,'35A',850000,NULL,NULL),(6146,55,206,'35B',850000,NULL,NULL),(6147,55,207,'35C',850000,NULL,NULL),(6148,55,208,'35D',850000,NULL,NULL),(6149,55,209,'35E',850000,NULL,NULL),(6150,55,210,'35F',850000,NULL,NULL);
/*!40000 ALTER TABLE `seat_flights` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seats`
--

DROP TABLE IF EXISTS `seats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seats` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `airline_id` bigint unsigned NOT NULL,
  `seat_class_id` bigint unsigned NOT NULL,
  `row_number` int NOT NULL,
  `seat_position` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `seat_number` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('usable','disabled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'usable',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `seats_airline_id_foreign` (`airline_id`),
  CONSTRAINT `seats_airline_id_foreign` FOREIGN KEY (`airline_id`) REFERENCES `airlines` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=301 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seats`
--

LOCK TABLES `seats` WRITE;
/*!40000 ALTER TABLE `seats` DISABLE KEYS */;
INSERT INTO `seats` VALUES (1,3,5,1,'A','1A','usable','2025-10-07 23:54:31','2025-10-08 00:44:47',NULL),(2,3,5,1,'B','1B','usable','2025-10-07 23:54:31','2025-10-08 00:44:47',NULL),(3,3,5,1,'C','1C','usable','2025-10-07 23:54:31','2025-10-08 00:44:47',NULL),(4,3,5,1,'D','1D','usable','2025-10-07 23:54:31','2025-10-08 00:44:47',NULL),(5,3,5,1,'E','1E','usable','2025-10-07 23:54:31','2025-10-08 00:44:47',NULL),(6,3,5,1,'F','1F','usable','2025-10-07 23:54:31','2025-10-08 00:44:47',NULL),(7,3,5,2,'A','2A','usable','2025-10-07 23:54:31','2025-10-08 00:44:47',NULL),(8,3,5,2,'B','2B','usable','2025-10-07 23:54:31','2025-10-08 00:44:47',NULL),(9,3,5,2,'C','2C','usable','2025-10-07 23:54:31','2025-10-08 00:44:47',NULL),(10,3,5,2,'D','2D','usable','2025-10-07 23:54:31','2025-10-08 00:44:47',NULL),(11,3,5,2,'E','2E','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(12,3,5,2,'F','2F','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(13,3,5,3,'A','3A','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(14,3,5,3,'B','3B','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(15,3,5,3,'C','3C','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(16,3,5,3,'D','3D','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(17,3,5,3,'E','3E','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(18,3,5,3,'F','3F','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(19,3,5,4,'A','4A','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(20,3,5,4,'B','4B','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(21,3,5,4,'C','4C','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(22,3,5,4,'D','4D','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(23,3,5,4,'E','4E','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(24,3,5,4,'F','4F','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(25,3,5,5,'A','5A','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(26,3,5,5,'B','5B','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(27,3,5,5,'C','5C','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(28,3,5,5,'D','5D','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(29,3,5,5,'E','5E','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(30,3,5,5,'F','5F','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(31,3,5,6,'A','6A','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(32,3,5,6,'B','6B','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(33,3,5,6,'C','6C','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(34,3,5,6,'D','6D','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(35,3,5,6,'E','6E','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(36,3,5,6,'F','6F','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(37,3,5,7,'A','7A','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(38,3,5,7,'B','7B','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(39,3,5,7,'C','7C','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(40,3,5,7,'D','7D','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(41,3,5,7,'E','7E','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(42,3,5,7,'F','7F','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(43,3,5,8,'A','8A','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(44,3,5,8,'B','8B','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(45,3,5,8,'C','8C','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(46,3,5,8,'D','8D','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(47,3,5,8,'E','8E','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(48,3,5,8,'F','8F','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(49,3,5,9,'A','9A','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(50,3,5,9,'B','9B','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(51,3,5,9,'C','9C','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(52,3,5,9,'D','9D','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(53,3,5,9,'E','9E','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(54,3,5,9,'F','9F','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(55,3,5,10,'A','10A','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(56,3,5,10,'B','10B','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(57,3,5,10,'C','10C','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(58,3,5,10,'D','10D','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(59,3,5,10,'E','10E','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(60,3,5,10,'F','10F','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(61,3,6,11,'A','11A','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(62,3,6,11,'B','11B','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(63,3,6,11,'C','11C','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(64,3,6,11,'D','11D','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(65,3,6,11,'E','11E','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(66,3,6,11,'F','11F','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(67,3,6,12,'A','12A','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(68,3,6,12,'B','12B','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(69,3,6,12,'C','12C','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(70,3,6,12,'D','12D','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(71,3,6,12,'E','12E','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(72,3,6,12,'F','12F','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(73,3,6,13,'A','13A','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(74,3,6,13,'B','13B','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(75,3,6,13,'C','13C','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(76,3,6,13,'D','13D','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(77,3,6,13,'E','13E','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(78,3,6,13,'F','13F','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(79,3,6,14,'A','14A','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(80,3,6,14,'B','14B','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(81,3,6,14,'C','14C','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(82,3,6,14,'D','14D','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(83,3,6,14,'E','14E','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(84,3,6,14,'F','14F','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(85,3,6,15,'A','15A','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(86,3,6,15,'B','15B','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(87,3,6,15,'C','15C','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(88,3,6,15,'D','15D','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(89,3,6,15,'E','15E','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(90,3,6,15,'F','15F','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(91,3,6,16,'A','16A','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(92,3,6,16,'B','16B','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(93,3,6,16,'C','16C','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(94,3,6,16,'D','16D','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(95,3,6,16,'E','16E','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(96,3,6,16,'F','16F','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(97,3,6,17,'A','17A','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(98,3,6,17,'B','17B','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(99,3,6,17,'C','17C','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(100,3,6,17,'D','17D','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(101,3,6,17,'E','17E','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(102,3,6,17,'F','17F','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(103,3,6,18,'A','18A','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(104,3,6,18,'B','18B','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(105,3,6,18,'C','18C','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(106,3,6,18,'D','18D','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(107,3,6,18,'E','18E','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(108,3,6,18,'F','18F','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(109,3,6,19,'A','19A','usable','2025-10-07 23:54:32','2025-10-08 00:44:47',NULL),(110,3,6,19,'B','19B','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(111,3,6,19,'C','19C','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(112,3,6,19,'D','19D','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(113,3,6,19,'E','19E','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(114,3,6,19,'F','19F','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(115,3,6,20,'A','20A','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(116,3,6,20,'B','20B','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(117,3,6,20,'C','20C','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(118,3,6,20,'D','20D','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(119,3,6,20,'E','20E','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(120,3,6,20,'F','20F','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(121,3,7,21,'A','21A','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(122,3,7,21,'B','21B','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(123,3,7,21,'C','21C','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(124,3,7,21,'D','21D','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(125,3,7,21,'E','21E','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(126,3,7,21,'F','21F','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(127,3,7,22,'A','22A','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(128,3,7,22,'B','22B','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(129,3,7,22,'C','22C','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(130,3,7,22,'D','22D','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(131,3,7,22,'E','22E','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(132,3,7,22,'F','22F','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(133,3,7,23,'A','23A','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(134,3,7,23,'B','23B','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(135,3,7,23,'C','23C','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(136,3,7,23,'D','23D','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(137,3,7,23,'E','23E','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(138,3,7,23,'F','23F','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(139,3,7,24,'A','24A','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(140,3,7,24,'B','24B','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(141,3,7,24,'C','24C','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(142,3,7,24,'D','24D','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(143,3,7,24,'E','24E','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(144,3,7,24,'F','24F','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(145,3,7,25,'A','25A','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(146,3,7,25,'B','25B','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(147,3,7,25,'C','25C','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(148,3,7,25,'D','25D','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(149,3,7,25,'E','25E','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(150,3,7,25,'F','25F','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(151,3,7,26,'A','26A','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(152,3,7,26,'B','26B','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(153,3,7,26,'C','26C','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(154,3,7,26,'D','26D','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(155,3,7,26,'E','26E','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(156,3,7,26,'F','26F','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(157,3,7,27,'A','27A','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(158,3,7,27,'B','27B','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(159,3,7,27,'C','27C','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(160,3,7,27,'D','27D','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(161,3,7,27,'E','27E','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(162,3,7,27,'F','27F','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(163,3,7,28,'A','28A','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(164,3,7,28,'B','28B','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(165,3,7,28,'C','28C','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(166,3,7,28,'D','28D','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(167,3,7,28,'E','28E','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(168,3,7,28,'F','28F','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(169,3,7,29,'A','29A','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(170,3,7,29,'B','29B','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(171,3,7,29,'C','29C','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(172,3,7,29,'D','29D','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(173,3,7,29,'E','29E','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(174,3,7,29,'F','29F','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(175,3,7,30,'A','30A','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(176,3,7,30,'B','30B','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(177,3,7,30,'C','30C','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(178,3,7,30,'D','30D','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(179,3,7,30,'E','30E','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(180,3,7,30,'F','30F','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(181,3,7,31,'A','31A','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(182,3,7,31,'B','31B','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(183,3,7,31,'C','31C','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(184,3,7,31,'D','31D','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(185,3,7,31,'E','31E','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(186,3,7,31,'F','31F','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(187,3,7,32,'A','32A','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(188,3,7,32,'B','32B','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(189,3,7,32,'C','32C','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(190,3,7,32,'D','32D','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(191,3,7,32,'E','32E','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(192,3,7,32,'F','32F','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(193,3,7,33,'A','33A','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(194,3,7,33,'B','33B','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(195,3,7,33,'C','33C','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(196,3,7,33,'D','33D','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(197,3,7,33,'E','33E','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(198,3,7,33,'F','33F','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(199,3,7,34,'A','34A','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(200,3,7,34,'B','34B','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(201,3,7,34,'C','34C','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(202,3,7,34,'D','34D','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(203,3,7,34,'E','34E','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(204,3,7,34,'F','34F','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(205,3,7,35,'A','35A','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(206,3,7,35,'B','35B','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(207,3,7,35,'C','35C','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(208,3,7,35,'D','35D','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(209,3,7,35,'E','35E','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(210,3,7,35,'F','35F','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(211,3,8,36,'A','36A','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(212,3,8,36,'B','36B','usable','2025-10-07 23:54:33','2025-10-08 00:44:47',NULL),(213,3,8,36,'C','36C','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(214,3,8,36,'D','36D','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(215,3,8,36,'E','36E','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(216,3,8,36,'F','36F','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(217,3,8,37,'A','37A','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(218,3,8,37,'B','37B','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(219,3,8,37,'C','37C','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(220,3,8,37,'D','37D','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(221,3,8,37,'E','37E','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(222,3,8,37,'F','37F','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(223,3,8,38,'A','38A','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(224,3,8,38,'B','38B','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(225,3,8,38,'C','38C','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(226,3,8,38,'D','38D','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(227,3,8,38,'E','38E','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(228,3,8,38,'F','38F','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(229,3,8,39,'A','39A','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(230,3,8,39,'B','39B','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(231,3,8,39,'C','39C','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(232,3,8,39,'D','39D','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(233,3,8,39,'E','39E','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(234,3,8,39,'F','39F','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(235,3,8,40,'A','40A','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(236,3,8,40,'B','40B','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(237,3,8,40,'C','40C','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(238,3,8,40,'D','40D','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(239,3,8,40,'E','40E','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(240,3,8,40,'F','40F','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(241,3,8,41,'A','41A','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(242,3,8,41,'B','41B','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(243,3,8,41,'C','41C','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(244,3,8,41,'D','41D','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(245,3,8,41,'E','41E','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(246,3,8,41,'F','41F','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(247,3,8,42,'A','42A','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(248,3,8,42,'B','42B','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(249,3,8,42,'C','42C','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(250,3,8,42,'D','42D','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(251,3,8,42,'E','42E','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(252,3,8,42,'F','42F','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(253,3,8,43,'A','43A','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(254,3,8,43,'B','43B','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(255,3,8,43,'C','43C','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(256,3,8,43,'D','43D','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(257,3,8,43,'E','43E','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(258,3,8,43,'F','43F','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(259,3,8,44,'A','44A','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(260,3,8,44,'B','44B','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(261,3,8,44,'C','44C','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(262,3,8,44,'D','44D','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(263,3,8,44,'E','44E','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(264,3,8,44,'F','44F','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(265,3,8,45,'A','45A','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(266,3,8,45,'B','45B','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(267,3,8,45,'C','45C','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(268,3,8,45,'D','45D','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(269,3,8,45,'E','45E','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(270,3,8,45,'F','45F','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(271,3,8,46,'A','46A','usable','2025-10-07 23:54:34','2025-10-08 00:44:47',NULL),(272,3,8,46,'B','46B','usable','2025-10-07 23:54:35','2025-10-08 00:44:47',NULL),(273,3,8,46,'C','46C','usable','2025-10-07 23:54:35','2025-10-08 00:44:47',NULL),(274,3,8,46,'D','46D','usable','2025-10-07 23:54:35','2025-10-08 00:44:47',NULL),(275,3,8,46,'E','46E','usable','2025-10-07 23:54:35','2025-10-08 00:44:47',NULL),(276,3,8,46,'F','46F','usable','2025-10-07 23:54:35','2025-10-08 00:44:47',NULL),(277,3,8,47,'A','47A','usable','2025-10-07 23:54:35','2025-10-08 00:44:47',NULL),(278,3,8,47,'B','47B','usable','2025-10-07 23:54:35','2025-10-08 00:44:47',NULL),(279,3,8,47,'C','47C','usable','2025-10-07 23:54:35','2025-10-08 00:44:47',NULL),(280,3,8,47,'D','47D','usable','2025-10-07 23:54:35','2025-10-08 00:44:47',NULL),(281,3,8,47,'E','47E','usable','2025-10-07 23:54:35','2025-10-08 00:44:47',NULL),(282,3,8,47,'F','47F','usable','2025-10-07 23:54:35','2025-10-08 00:44:47',NULL),(283,3,8,48,'A','48A','usable','2025-10-07 23:54:35','2025-10-08 00:44:47',NULL),(284,3,8,48,'B','48B','usable','2025-10-07 23:54:35','2025-10-08 00:44:47',NULL),(285,3,8,48,'C','48C','usable','2025-10-07 23:54:35','2025-10-08 00:44:47',NULL),(286,3,8,48,'D','48D','usable','2025-10-07 23:54:35','2025-10-08 00:44:47',NULL),(287,3,8,48,'E','48E','usable','2025-10-07 23:54:35','2025-10-08 00:44:47',NULL),(288,3,8,48,'F','48F','usable','2025-10-07 23:54:35','2025-10-08 00:44:47',NULL),(289,3,8,49,'A','49A','usable','2025-10-07 23:54:35','2025-10-08 00:44:47',NULL),(290,3,8,49,'B','49B','usable','2025-10-07 23:54:35','2025-10-08 00:44:47',NULL),(291,3,8,49,'C','49C','usable','2025-10-07 23:54:35','2025-10-08 00:44:47',NULL),(292,3,8,49,'D','49D','usable','2025-10-07 23:54:35','2025-10-08 00:44:47',NULL),(293,3,8,49,'E','49E','usable','2025-10-07 23:54:35','2025-10-08 00:44:47',NULL),(294,3,8,49,'F','49F','usable','2025-10-07 23:54:35','2025-10-08 00:44:47',NULL),(295,3,8,50,'A','50A','usable','2025-10-07 23:54:35','2025-10-08 00:44:47',NULL),(296,3,8,50,'B','50B','usable','2025-10-07 23:54:35','2025-10-08 00:44:47',NULL),(297,3,8,50,'C','50C','usable','2025-10-07 23:54:35','2025-10-08 00:44:47',NULL),(298,3,8,50,'D','50D','usable','2025-10-07 23:54:35','2025-10-08 00:44:47',NULL),(299,3,8,50,'E','50E','usable','2025-10-07 23:54:35','2025-10-08 00:44:47',NULL),(300,3,8,50,'F','50F','usable','2025-10-07 23:54:35','2025-10-08 00:44:47',NULL);
/*!40000 ALTER TABLE `seats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('24HYZv8PYf1cHdpOjYqFgWMdlt5dHlpkfR40rLRy',NULL,'127.0.0.1','PostmanRuntime/7.48.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiZFdqUnRQbHlWeUpndmh5ZFJSVU5CS2s5T0ZvZkV3MWdmekl4c1lJRCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1759902551),('Z7438zHB4yPs12dtir4ofiHjLzEXjpE2xJRszgbi',NULL,'127.0.0.1','PostmanRuntime/7.49.1','YTozOntzOjY6Il90b2tlbiI7czo0MDoiMFo0Sm5MampGaFF6RFg5cUJ4c0IzRGxETXlMV0NONGVXaFNuQ2trcyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1764759705);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `flight_id` bigint unsigned NOT NULL,
  `class_id` bigint unsigned NOT NULL,
  `price` int NOT NULL,
  `total_seats` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `available_seats` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tickets_flight_id_foreign` (`flight_id`),
  KEY `tickets_class_id_foreign` (`class_id`),
  CONSTRAINT `tickets_class_id_foreign` FOREIGN KEY (`class_id`) REFERENCES `seat_classes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tickets_flight_id_foreign` FOREIGN KEY (`flight_id`) REFERENCES `flights` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
INSERT INTO `tickets` VALUES (35,54,6,900000,60,NULL,NULL,NULL,60),(36,54,7,700000,90,NULL,NULL,NULL,90),(37,55,6,1050000,60,NULL,NULL,NULL,60),(38,55,7,850000,90,NULL,NULL,NULL,90);
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birthday` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_phone_unique` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'book_flight_tickets'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-30  9:22:35
