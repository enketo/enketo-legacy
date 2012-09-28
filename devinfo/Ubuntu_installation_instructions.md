Installation on bare Ubuntu 12.04 server (AWS)
=======

Apache:
- sudo apt-get update
- sudo apt-get install apache2
- sudo a2enmod expires
- sudo a2enmod rewrite

PHP
- sudo apt-get install php5 libapache2-mod-php5
- sudo apt-get install php5-xsl
- sudo apt-get install php5-curl

Other packages:
- sudo apt-get install git

MySQL
- sudo apt-get install mysql-server
  * set root password
- sudo apt-get install libapache2-mod-auth-mysql php5-mysql phpmyadmin
  * select Apache2
  * select dbconfig-common
  * enter root password created earlier
- add this line: Include /etc/phpmyadmin/apache.conf to: /etc/apache2/apache2.conf
- restart apache: sudo /etc/init.d/apache2 restart
- in a browser to go http://[YOUR-IP-ADDRESS-OR-DOMAIN]/phpmyadmin
- log in as root with password set earlier
- create a new database, e.g. named 'enketo'
- add a user account (Privileges -> Add new user) with localhost as Host (in the future use this to log in)

Site:
- import surveys.sql and languages.sql into the enketo database from phpmyadmin (find these files in /devinfo)
- sudo mkdir /var/www/enketo
- cd /var/www/enketo
- sudo git init
- sudo git pull https://github.com/modilabs/enketo.git
- enter database info in /var/www/enketo/Code_Igniter/application/config/database.php (username, password, database)
- replace /var/www/enketo/Code_Igniter/application/views/elements/tracking.php with your own tracking code
- set environment in index.php to 'production' if it isn't already
- change permissions of /var/www/enketo/Code_Igniter/application/cache and /var/www/enketo/Code_Igniter/application/logs to 777
- copy XpathJS_javarosa.min.js to /var/www/enketo/public/libraries (sudo chown ubuntu /var/www/enketo/public/libraries may be required first where 'ubuntu' is the user name)
- open /etc/apache2/sites-available/default for editing:
  * change DocumentRoot to /var/www/enketo/public in /etc/apache2/sites-available/default
  * change 2nd <Directory /var/www> to: <Directory /var/www/enketo/public>
  * set AllowOverride All (I did this in both <directories>)
- sudo apt-get upgrade
- restart apache: sudo /etc/init.d/apache2 restart

DNS / hosts file:
- if public site, point example.com and *.example.com to IP Address
- if running locally edit the hosts file (each subdomain will get its own line), and
- if running on a local virtual machine, edit the VM's hosts file as well...

Maintenance:
- set up automatic security updates: https://help.ubuntu.com/community/AutomaticSecurityUpdates
- set up a backup system (at least for database)

