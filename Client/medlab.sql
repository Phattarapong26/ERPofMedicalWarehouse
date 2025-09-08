-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Apr 21, 2024 at 08:21 AM
-- Server version: 5.7.39
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `medlab`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `category_id` int(5) NOT NULL,
  `category_name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`category_id`, `category_name`) VALUES
(1, 'ยาทั่วไป'),
(2, 'ยาอันตราย');

-- --------------------------------------------------------

--
-- Table structure for table `export`
--

CREATE TABLE `export` (
  `export_id` int(5) UNSIGNED ZEROFILL NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `exporter` varchar(20) NOT NULL,
  `receiver` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `export`
--

INSERT INTO `export` (`export_id`, `date`, `exporter`, `receiver`) VALUES
(00001, '2024-04-09 03:10:32', 'Test Account', 'Test ');

-- --------------------------------------------------------

--
-- Table structure for table `export_detail`
--

CREATE TABLE `export_detail` (
  `id` int(5) NOT NULL,
  `export_id` int(5) UNSIGNED ZEROFILL NOT NULL,
  `lot_id` int(20) NOT NULL,
  `p_id` varchar(20) NOT NULL,
  `quantity` int(11) NOT NULL,
  `location_id` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `export_detail`
--

INSERT INTO `export_detail` (`id`, `export_id`, `lot_id`, `p_id`, `quantity`, `location_id`) VALUES
(1, 00001, 1, '1', 50, 1),
(2, 00001, 2, '2', 150, 2);

-- --------------------------------------------------------

--
-- Table structure for table `import`
--

CREATE TABLE `import` (
  `import_id` int(5) UNSIGNED ZEROFILL NOT NULL,
  `purchase_id` int(5) UNSIGNED ZEROFILL NOT NULL,
  `importer` varchar(20) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `import`
--

INSERT INTO `import` (`import_id`, `purchase_id`, `importer`, `date`) VALUES
(00001, 00001, 'Test Account', '2024-04-08 14:50:26'),
(00003, 00002, 'Test Account', '2024-04-14 15:11:13');

-- --------------------------------------------------------

--
-- Table structure for table `location`
--

CREATE TABLE `location` (
  `location_id` int(5) UNSIGNED ZEROFILL NOT NULL,
  `Location_name` varchar(20) NOT NULL,
  `warehouse_id` int(5) UNSIGNED ZEROFILL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `location`
--

INSERT INTO `location` (`location_id`, `Location_name`, `warehouse_id`) VALUES
(00001, 'A1', 00001),
(00002, 'A2', 00001),
(00003, 'B1', 00002),
(00004, 'B2', 00002),
(00005, 'A3', 00001),
(00006, 'B3', 00002);

-- --------------------------------------------------------

--
-- Table structure for table `lot`
--

CREATE TABLE `lot` (
  `lot_id` int(5) UNSIGNED ZEROFILL NOT NULL,
  `p_id` varchar(20) NOT NULL,
  `quantity` int(11) NOT NULL,
  `due_date` date DEFAULT NULL,
  `exp_date` date DEFAULT NULL,
  `before_date` int(5) DEFAULT '30',
  `location_id` int(5) UNSIGNED ZEROFILL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `lot`
--

INSERT INTO `lot` (`lot_id`, `p_id`, `quantity`, `due_date`, `exp_date`, `before_date`, `location_id`) VALUES
(00001, '1', 50, '2024-04-01', '2024-04-30', 50, 00001),
(00002, '2', 100, '2024-04-01', '2024-04-30', 50, 00002),
(00003, '3', 150, '2024-04-09', '2024-05-31', 30, 00005),
(00004, '4', 150, '2024-04-09', '2024-05-31', 30, 00003),
(00005, '1', 50, NULL, NULL, 30, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` varchar(20) NOT NULL,
  `name` varchar(20) NOT NULL,
  `unit` int(5) NOT NULL,
  `type` int(5) NOT NULL,
  `category` int(5) NOT NULL,
  `detail` text,
  `direction` text,
  `low_stock` int(5) NOT NULL DEFAULT '50'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `name`, `unit`, `type`, `category`, `detail`, `direction`, `low_stock`) VALUES
('1', 'Test 1', 2, 2, 1, '1', '1', 50),
('2', 'Test 2', 1, 2, 1, '2', '2', 150),
('3', 'Test 3', 3, 3, 2, '3', '3', 50),
('4', 'Test 4', 1, 2, 2, '4', '4', 50),
('5', 'Test 5', 3, 3, 2, '5', '5', 50);

-- --------------------------------------------------------

--
-- Table structure for table `purchase`
--

CREATE TABLE `purchase` (
  `purchase_id` int(5) UNSIGNED ZEROFILL NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `purcher` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `purchase`
--

INSERT INTO `purchase` (`purchase_id`, `date`, `purcher`) VALUES
(00001, '2024-01-01 14:49:06', 'Test Account'),
(00002, '2024-04-09 03:01:45', 'Test Account'),
(00003, '2024-04-12 16:51:03', 'Test Account');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_detail`
--

CREATE TABLE `purchase_detail` (
  `id` int(5) NOT NULL,
  `purchase_id` int(5) UNSIGNED ZEROFILL NOT NULL,
  `lot_id` int(20) NOT NULL,
  `p_id` varchar(20) NOT NULL,
  `quantity` int(11) DEFAULT NULL,
  `location_id` int(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `purchase_detail`
--

INSERT INTO `purchase_detail` (`id`, `purchase_id`, `lot_id`, `p_id`, `quantity`, `location_id`) VALUES
(1, 00001, 1, '1', 100, 1),
(2, 00001, 2, '2', 250, 2),
(3, 00002, 3, '3', 150, 5),
(4, 00002, 4, '4', 150, 3),
(5, 00003, 5, '1', 50, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `type`
--

CREATE TABLE `type` (
  `type_id` int(5) NOT NULL,
  `type_name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `type`
--

INSERT INTO `type` (`type_id`, `type_name`) VALUES
(1, 'ยาน้ำ'),
(2, 'ยาเม็ด'),
(3, 'ยาสอด');

-- --------------------------------------------------------

--
-- Table structure for table `unit`
--

CREATE TABLE `unit` (
  `unit_id` int(5) NOT NULL,
  `unit_name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `unit`
--

INSERT INTO `unit` (`unit_id`, `unit_name`) VALUES
(1, 'ลัง'),
(2, 'กล่อง'),
(3, 'โหล');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_name` varchar(20) NOT NULL,
  `user_password` text NOT NULL,
  `name` varchar(20) NOT NULL,
  `surname` varchar(20) NOT NULL,
  `role` int(5) NOT NULL,
  `withdraw` tinyint(1) NOT NULL DEFAULT '0',
  `add_new` tinyint(1) NOT NULL DEFAULT '0',
  `purchase` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_name`, `user_password`, `name`, `surname`, `role`, `withdraw`, `add_new`, `purchase`) VALUES
('65039089', '$2b$10$MSxxqHS.vfm5y0AxKI0PhODFcDVQElWFvmT82BWXF75wp.O/Xi8Ge', 'Narisara', 'Changsadao', 2, 1, 1, 0),
('Admin', '$2b$10$2Wy035BANg1REJtcnVFx4ehPMXGrJaC0Yi0a.uWSOGevJ2nZUzqQi', 'Admin', 'Account', 1, 1, 1, 0),
('EMP', '$2b$10$li.x1ZTBx7jHA83je.los.ksZT6SGLFRzZKWmCWKtq.E8nxk2nQzW', 'User2', 'Account', 2, 0, 0, 0),
('Manager', '$2b$10$TsR0R1mhtpAJy9FmsAAUMOBqxdsrrmUqCbheWa3gNch0F.0WMBRHy', 'User', 'Account', 2, 1, 1, 1),
('Test', '$2b$10$UgjvKYhxLnGPss2z4hxQf.FghuvFqK2NdhJFvVtu3mkzIAoXEbvMa', 'Test', 'Account', 2, 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_role`
--

CREATE TABLE `user_role` (
  `role_id` int(5) NOT NULL,
  `role_name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_role`
--

INSERT INTO `user_role` (`role_id`, `role_name`) VALUES
(1, 'admin'),
(2, 'user');

-- --------------------------------------------------------

--
-- Table structure for table `warehouse`
--

CREATE TABLE `warehouse` (
  `warehouse_id` int(5) UNSIGNED ZEROFILL NOT NULL,
  `warehouse_name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `warehouse`
--

INSERT INTO `warehouse` (`warehouse_id`, `warehouse_name`) VALUES
(00001, 'A'),
(00002, 'B'),
(00003, 'C');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `export`
--
ALTER TABLE `export`
  ADD PRIMARY KEY (`export_id`);

--
-- Indexes for table `export_detail`
--
ALTER TABLE `export_detail`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `import`
--
ALTER TABLE `import`
  ADD PRIMARY KEY (`import_id`);

--
-- Indexes for table `location`
--
ALTER TABLE `location`
  ADD PRIMARY KEY (`location_id`);

--
-- Indexes for table `lot`
--
ALTER TABLE `lot`
  ADD PRIMARY KEY (`lot_id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_type` (`type`),
  ADD KEY `fk_category` (`category`),
  ADD KEY `fk_unit` (`unit`);

--
-- Indexes for table `purchase`
--
ALTER TABLE `purchase`
  ADD PRIMARY KEY (`purchase_id`);

--
-- Indexes for table `purchase_detail`
--
ALTER TABLE `purchase_detail`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `type`
--
ALTER TABLE `type`
  ADD PRIMARY KEY (`type_id`);

--
-- Indexes for table `unit`
--
ALTER TABLE `unit`
  ADD PRIMARY KEY (`unit_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_name`),
  ADD KEY `fk_role` (`role`);

--
-- Indexes for table `user_role`
--
ALTER TABLE `user_role`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `warehouse`
--
ALTER TABLE `warehouse`
  ADD PRIMARY KEY (`warehouse_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `category_id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `export`
--
ALTER TABLE `export`
  MODIFY `export_id` int(5) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `export_detail`
--
ALTER TABLE `export_detail`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `import`
--
ALTER TABLE `import`
  MODIFY `import_id` int(5) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `location`
--
ALTER TABLE `location`
  MODIFY `location_id` int(5) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `lot`
--
ALTER TABLE `lot`
  MODIFY `lot_id` int(5) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `purchase`
--
ALTER TABLE `purchase`
  MODIFY `purchase_id` int(5) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `purchase_detail`
--
ALTER TABLE `purchase_detail`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `type`
--
ALTER TABLE `type`
  MODIFY `type_id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `unit`
--
ALTER TABLE `unit`
  MODIFY `unit_id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user_role`
--
ALTER TABLE `user_role`
  MODIFY `role_id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `warehouse`
--
ALTER TABLE `warehouse`
  MODIFY `warehouse_id` int(5) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `fk_category` FOREIGN KEY (`category`) REFERENCES `category` (`category_id`),
  ADD CONSTRAINT `fk_type` FOREIGN KEY (`type`) REFERENCES `type` (`type_id`),
  ADD CONSTRAINT `fk_unit` FOREIGN KEY (`unit`) REFERENCES `unit` (`unit_id`);

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `fk_role` FOREIGN KEY (`role`) REFERENCES `user_role` (`role_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
