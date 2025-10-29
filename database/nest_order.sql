/*
 Navicat Premium Data Transfer

 Source Server         : laravel本地開發環境
 Source Server Type    : MySQL
 Source Server Version : 80039 (8.0.39)
 Source Host           : localhost:3306
 Source Schema         : nest_order

 Target Server Type    : MySQL
 Target Server Version : 80039 (8.0.39)
 File Encoding         : 65001

 Date: 30/10/2025 06:24:23
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for order_items
-- ----------------------------
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL COMMENT '订单ID',
  `product_id` bigint DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `currency` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CNY',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_items_order_id_foreign` (`order_id`),
  CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of order_items
-- ----------------------------
BEGIN;
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `currency`, `price`, `created_at`, `updated_at`) VALUES (20, 14, 1, 1, 'TWD', 2999.00, NULL, NULL);
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `currency`, `price`, `created_at`, `updated_at`) VALUES (21, 14, 2, 2, 'TWD', 49.99, NULL, NULL);
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `currency`, `price`, `created_at`, `updated_at`) VALUES (22, 15, 2, 10, 'TWD', 49.99, NULL, NULL);
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `currency`, `price`, `created_at`, `updated_at`) VALUES (24, 17, 1, 10, 'TWD', 2999.00, NULL, NULL);
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `currency`, `price`, `created_at`, `updated_at`) VALUES (25, 17, 2, 1, 'TWD', 49.99, NULL, NULL);
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `currency`, `price`, `created_at`, `updated_at`) VALUES (26, 18, 1, 1, 'TWD', 2999.00, NULL, NULL);
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `currency`, `price`, `created_at`, `updated_at`) VALUES (27, 19, 1, 1, 'TWD', 2999.00, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '订单号',
  `user_id` bigint unsigned DEFAULT NULL COMMENT '下单用户ID',
  `customer_phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '客户电话',
  `customer_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '收货地址',
  `total_amount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '总金额',
  `currency` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CNY',
  `discount_amount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '优惠金额',
  `pay_amount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '实付金额',
  `payment_method` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '支付方式',
  `status` enum('pending','paid','shipped','completed','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending' COMMENT '订单状态',
  `paid_at` timestamp NULL DEFAULT NULL COMMENT '支付时间',
  `shipped_at` timestamp NULL DEFAULT NULL COMMENT '发货时间',
  `completed_at` timestamp NULL DEFAULT NULL COMMENT '完成时间',
  `remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '备注',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders_order_number_unique` (`order_number`),
  KEY `orders_user_id_index` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of orders
-- ----------------------------
BEGIN;
INSERT INTO `orders` (`id`, `order_number`, `user_id`, `customer_phone`, `customer_address`, `total_amount`, `currency`, `discount_amount`, `pay_amount`, `payment_method`, `status`, `paid_at`, `shipped_at`, `completed_at`, `remarks`, `created_at`, `updated_at`) VALUES (14, 'ORD-1761480573746297', 2, '13601844677', '上海市黃浦區', 3098.98, 'TWD', 0.00, 0.00, 'alipay', 'paid', NULL, NULL, NULL, '', '2025-10-26 12:09:33', '2025-10-26 16:06:43');
INSERT INTO `orders` (`id`, `order_number`, `user_id`, `customer_phone`, `customer_address`, `total_amount`, `currency`, `discount_amount`, `pay_amount`, `payment_method`, `status`, `paid_at`, `shipped_at`, `completed_at`, `remarks`, `created_at`, `updated_at`) VALUES (15, 'ORD-176148062139947', 3, '13601844677', '上海市新天地', 499.90, 'TWD', 0.00, 0.00, 'wechat', 'pending', NULL, NULL, NULL, NULL, '2025-10-26 12:10:21', '2025-10-26 12:10:21');
INSERT INTO `orders` (`id`, `order_number`, `user_id`, `customer_phone`, `customer_address`, `total_amount`, `currency`, `discount_amount`, `pay_amount`, `payment_method`, `status`, `paid_at`, `shipped_at`, `completed_at`, `remarks`, `created_at`, `updated_at`) VALUES (17, 'ORD-1761698903478924', 3, '0912345678', '上海市黃浦區', 30039.99, 'TWD', 0.00, 0.00, 'wechat', 'shipped', NULL, NULL, NULL, '測試訂單狀態', '2025-10-29 00:48:23', '2025-10-29 00:48:52');
INSERT INTO `orders` (`id`, `order_number`, `user_id`, `customer_phone`, `customer_address`, `total_amount`, `currency`, `discount_amount`, `pay_amount`, `payment_method`, `status`, `paid_at`, `shipped_at`, `completed_at`, `remarks`, `created_at`, `updated_at`) VALUES (18, 'ORD-1761732442192762', 2, '', '上海市黃浦區', 2999.00, 'TWD', 0.00, 0.00, 'alipay', 'pending', NULL, NULL, NULL, NULL, '2025-10-29 10:07:22', '2025-10-29 10:07:22');
INSERT INTO `orders` (`id`, `order_number`, `user_id`, `customer_phone`, `customer_address`, `total_amount`, `currency`, `discount_amount`, `pay_amount`, `payment_method`, `status`, `paid_at`, `shipped_at`, `completed_at`, `remarks`, `created_at`, `updated_at`) VALUES (19, 'ORD-1761776274654959', 3, '', '上海市黃浦區', 2999.00, 'TWD', 0.00, 0.00, 'alipay', 'pending', NULL, NULL, NULL, NULL, '2025-10-29 22:17:54', '2025-10-29 22:17:54');
COMMIT;

-- ----------------------------
-- Table structure for products
-- ----------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `currency` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CNY',
  `price` decimal(10,2) NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of products
-- ----------------------------
BEGIN;
INSERT INTO `products` (`id`, `name`, `currency`, `price`, `description`, `created_at`, `updated_at`) VALUES (1, '牙齿矫正套装', 'TWD', 2999.00, '适合青少年使用的标准矫正套装。', '2025-10-16 14:50:48', '2025-10-16 14:50:48');
INSERT INTO `products` (`id`, `name`, `currency`, `price`, `description`, `created_at`, `updated_at`) VALUES (2, '专业牙刷套装', 'TWD', 49.99, '美国进口，柔软刷毛。', '2025-10-16 14:50:48', '2025-10-16 14:50:48');
INSERT INTO `products` (`id`, `name`, `currency`, `price`, `description`, `created_at`, `updated_at`) VALUES (3, '口腔护理喷雾', 'TWD', 19.50, '便携型口腔清新喷雾。', '2025-10-16 14:50:48', '2025-10-16 14:50:48');
COMMIT;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES (1, '家豪', 'zhangsan@example.com', NULL, '13800000001', NULL, NULL, NULL);
INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES (2, '俊宏', 'lisi@example.com', NULL, '13800000002', NULL, NULL, NULL);
INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES (3, '美玲', 'wangwu@example.com', NULL, '13800000003', NULL, NULL, NULL);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
