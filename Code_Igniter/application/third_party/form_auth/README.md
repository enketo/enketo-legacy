enketo_form_auth
================

Form Authentication Package for Enketo

1. Add as submodule in /Code_Igniter/application/third_party/form_auth
2. Import session.sql table into database
3. install MCrypt: `sudo apt-get install php5-mcrypt` (on Ubuntu 14.04 it may require additional work. See http://askubuntu.com/questions/460837/mcrypt-extension-is-missing-in-14-04-server-for-mysql. I think simply `php5enmod mcrypt` and restarting Apache does the trick.)
4. set `config['encryption_key']` (32 characters)
5. set `config['cookie_domain']` in config.php (e.g. `.enketo.org`)
6. host on https only (forced with .htaccess)

=========

##General Design:

Using Code Igniter sessions and its encrypted cookies to maintain state. Usernames and passwords are not stored in the browser cookie.
Cookies/sessions are valid for whole domain and all subdomains (all forms) but this can be changed (we could do per form).

Sessions are saved in server database, including the username and password. Both username and password are encrypted by the Code Igniter Encryption class using the default MCRYPT_RIJNDAEL_256 cipher.

A brute force attack if the database were comprised would require cracking each username and password for each session individually.

//There are 2 types of sessions. 'Remember' sessions are persistent for 7 days. The default session ends when the browser closes.

##SSL .htaccess edit
RewriteCond %{HTTPS} off
RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI} [R,L]
and see https://www.digitalocean.com/community/articles/how-to-create-a-ssl-certificate-on-apache-for-ubuntu-12-04
