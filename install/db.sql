CREATE TABLE `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `created` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `category_report` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `report_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `company` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `created` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `reports` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) NOT NULL,
  `created` int(11) NOT NULL,
  `updated` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

 CREATE TABLE `report` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employee` varchar(255) NOT NULL,
  `currency` varchar(5) DEFAULT NULL,
  `value` float DEFAULT NULL,
  `rate` float DEFAULT NULL,
  `category_id` int(11) NOT NULL,
  `created` int(11) NOT NULL,
  `updated` int(11) NOT NULL,
  `report_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8

CREATE TABLE `report_files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `report_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `size` int(11) NOT NULL,
  `created` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into category(id,name,created) values(1,'Accr warranty',unix_timestamp());
insert into category(id,name,created) values(2,'Building-Equipment Maintenance',unix_timestamp());
insert into category(id,name,created) values(3,'Advertising expense',unix_timestamp());
insert into category(id,name,created) values(4,'Computer expense',unix_timestamp());
insert into category(id,name,created) values(5,'Dues & Subsccriptions',unix_timestamp());
insert into category(id,name,created) values(6,'Employee relations & Training',unix_timestamp());
insert into category(id,name,created) values(7,'Legal & audit',unix_timestamp());
insert into category(id,name,created) values(8,'Licence & Goverment Fees',unix_timestamp());
insert into category(id,name,created) values(9,'Meals & Entertaiment',unix_timestamp());
insert into category(id,name,created) values(10,'Miscellaneous expense',unix_timestamp());
insert into category(id,name,created) values(11,'Postage expense',unix_timestamp());
insert into category(id,name,created) values(12,'Reqruitment & Relocation',unix_timestamp());
insert into category(id,name,created) values(13,'Software expense',unix_timestamp());
insert into category(id,name,created) values(14,'Supplies expense',unix_timestamp());
insert into category(id,name,created) values(15,'Telephone & Utility expense',unix_timestamp());
insert into category(id,name,created) values(16,'Travel expense - Airfare/Hotel',unix_timestamp());
insert into category(id,name,created) values(17,'Travel expense - Auto',unix_timestamp());
insert into category(id,name,created) values(18,'Tuition Reimbusement',unix_timestamp());

insert into company(id,name,created) values(1,'WEM Headquarters',unix_timestamp());
insert into company(id,name,created) values(2,'GTG - Global Tech Group',unix_timestamp());
insert into company(id,name,created) values(3,'WEM Aftermarket',unix_timestamp());
insert into company(id,name,created) values(4,'WEM Cass city',unix_timestamp());
insert into company(id,name,created) values(5,'WEM Los Mochis USD',unix_timestamp());
insert into company(id,name,created) values(6,'WEM Los Mochis Peso',unix_timestamp());
insert into company(id,name,created) values(7,'WEM China',unix_timestamp());
insert into company(id,name,created) values(8,'WEM Japan',unix_timestamp());
insert into company(id,name,created) values(9,'WEM Thailand',unix_timestamp());

