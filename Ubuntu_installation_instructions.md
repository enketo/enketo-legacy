---
layout: page
title: Enketo installation instructions on Ubuntu
nav: installation
---

Installation on bare Ubuntu 12.04 server (AWS)
=======

#### Apache:
- `sudo apt-get update`
- `sudo apt-get install apache2`
- check for 'It Works!' message when visiting domain or IP-address
- `sudo a2enmod expires rewrite`

#### PHP, APC & git:
- `sudo apt-get install php5 libapache2-mod-php5 php5-xsl php5-curl git php-apc`

#### MySQL:
- `sudo apt-get install mysql-server`
  * set root password
- `sudo apt-get install libapache2-mod-auth-mysql php5-mysql phpmyadmin`
  * select Apache2
  * select dbconfig-common
  * enter root password created earlier
- add this line: `Include /etc/phpmyadmin/apache.conf` to: /etc/apache2/apache2.conf
- restart apache: `sudo /etc/init.d/apache2 restart`
- in a browser to go http://[YOUR-IP-ADDRESS-OR-DOMAIN]/phpmyadmin
- log in as root with password set earlier

#### Enketo:
- create a new database, e.g. named 'enketo'
- add a user account (Privileges -> Add new user) with localhost as Host (in the future use this account to log in)
- import surveys.sql, instances.sql, properties.sql and languages.sql into the enketo database from phpmyadmin (find these files in /devinfo)
- `sudo mkdir /var/www/enketo`
- `cd /var/www/enketo`
- `sudo git init`
- `sudo git pull https://github.com/modilabs/enketo.git` (or `sudo git pull https://github.com/MartijnR/enketo.git` )
- `sudo git submodule update --init`
- enter database info in /var/www/enketo/Code_Igniter/application/config/database.php (username, password, database)
- enter other info in /var/www/enketo/Code_Igniter/application/config/enketo.php
- set environment in index.php to 'production' if it isn't already
- change permissions `sudo chmod 777 /var/www/enketo/Code_Igniter/application/cache` and `sudo chmod 777 /var/www/enketo/Code_Igniter/application/logs` (double-check that this actually works, may require `sudo chown -R ubuntu /var/www/enketo` first)
- open /etc/apache2/sites-available/default for editing:
  * change DocumentRoot to /var/www/enketo/public in /etc/apache2/sites-available/default
  * change 2nd `<Directory /var/www>` to: `<Directory /var/www/enketo/public>`
  * set AllowOverride All (I did this in both `<Directory>`s)
- `sudo apt-get upgrade`
- restart apache: `sudo /etc/init.d/apache2 restart`

#### DNS / hosts file:
- if public site, point example.com and *.example.com to IP Address
- if running locally edit the hosts file (each subdomain will get its own line), and
- if running on a local virtual machine, edit the VM's hosts file as well...

#### Maintenance (for production server):
- set up automatic security updates: https://help.ubuntu.com/community/AutomaticSecurityUpdates
- set up a backup system (at least for database) e.g. https://github.com/woxxy/MySQL-backup-to-Amazon-S3

