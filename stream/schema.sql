-- ==============================================================================
-- The Act of Prayers and Deliverance Ministries International
-- Live Streaming & Multi-Camera Management System Database Schema
-- Compatible with MySQL 5.7+ / MySQL 8.0+ / MariaDB
-- ==============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Stream Settings & Global Live Broadcast State
CREATE TABLE IF NOT EXISTS `stream_settings` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `is_live` TINYINT(1) NOT NULL DEFAULT 0,
  `active_camera_id` VARCHAR(50) NOT NULL DEFAULT 'cam-1',
  `title` VARCHAR(255) NOT NULL DEFAULT 'Sunday Worship and Deliverance Service',
  `subject` VARCHAR(255) NOT NULL DEFAULT 'The Mystery of Answered Prayers & Deliverance',
  `speaker` VARCHAR(255) NOT NULL DEFAULT 'Pastor Israel Revelation',
  `active_source_type` ENUM('device_cam', 'webrtc', 'hls', 'direct_stream') NOT NULL DEFAULT 'device_cam',
  `stream_key` VARCHAR(100) NOT NULL DEFAULT 'revelation_stream_key_2026',
  `viewers_count` INT(11) NOT NULL DEFAULT 0,
  `notice_text` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Connected Camera Devices (Android Webcams, Studio Cams, IP Devices)
CREATE TABLE IF NOT EXISTS `stream_devices` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `device_type` ENUM('android_webcam', 'browser_cam', 'rtmp_encoder', 'ip_camera') NOT NULL DEFAULT 'android_webcam',
  `status` ENUM('online', 'offline', 'streaming') NOT NULL DEFAULT 'offline',
  `facing_mode` VARCHAR(20) DEFAULT 'environment',
  `fps` INT(11) DEFAULT 30,
  `resolution` VARCHAR(30) DEFAULT '1080p (Full HD)',
  `battery_level` VARCHAR(10) DEFAULT '100%',
  `signal_data` LONGTEXT NULL,
  `last_frame` LONGTEXT NULL,
  `last_heartbeat` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. WebRTC / P2P Real-time Signaling Table
CREATE TABLE IF NOT EXISTS `stream_signals` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `from_id` VARCHAR(50) NOT NULL,
  `to_id` VARCHAR(50) NOT NULL,
  `signal_type` ENUM('offer', 'answer', 'candidate', 'control') NOT NULL,
  `payload` LONGTEXT NOT NULL,
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_to_read` (`to_id`, `is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Real-time Live Viewers Tracking
CREATE TABLE IF NOT EXISTS `stream_viewers` (
  `session_id` VARCHAR(100) NOT NULL,
  `ip_address` VARCHAR(45) NULL,
  `user_agent` VARCHAR(255) NULL,
  `joined_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_ping` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`session_id`),
  KEY `idx_last_ping` (`last_ping`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Live Stream Chat Messages Table
CREATE TABLE IF NOT EXISTS `stream_chat` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `author` VARCHAR(100) NOT NULL,
  `message` TEXT NOT NULL,
  `is_pinned` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Seed Initial Settings & Cameras
-- -----------------------------------------------------------------------------
INSERT INTO `stream_settings` (`id`, `is_live`, `active_camera_id`, `title`, `subject`, `speaker`, `active_source_type`, `viewers_count`, `notice_text`)
VALUES (
  1,
  0,
  'cam-1',
  'Sunday Worship and Deliverance Service',
  'The Mystery of Answered Prayers & Deliverance',
  'Pastor Israel Revelation',
  'device_cam',
  0,
  'Welcome to The Act of Prayers & Deliverance Ministries International. Live broadcast will start shortly.'
)
ON DUPLICATE KEY UPDATE 
  `title` = VALUES(`title`),
  `speaker` = VALUES(`speaker`);

INSERT INTO `stream_devices` (`id`, `name`, `device_type`, `status`, `resolution`)
VALUES 
  ('cam-1', 'Camera 1 (Main Altar / Pulpit)', 'android_webcam', 'offline', '1080p (Full HD)'),
  ('cam-2', 'Camera 2 (Audience / Side Angle)', 'android_webcam', 'offline', '1080p (Full HD)'),
  ('cam-3', 'Camera 3 (Choir / Sanctuary Wide)', 'browser_cam', 'offline', '720p (HD)')
ON DUPLICATE KEY UPDATE 
  `name` = VALUES(`name`);

SET FOREIGN_KEY_CHECKS = 1;
