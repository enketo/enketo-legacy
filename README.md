Enketo
======

Enketo is a lightweigth web application that is compatible with JavaRosa/OpenRosa XForm-derived format and compliant servers. It is 'offline-cable' which means it is able to launch offline (after 1 successful online launch) and is able to persistently store survey data inside the browser (to be uploaded once a connection becomes available). This capability makes it particularly suitable for situations where Internet Access is unreliable (though sometimes available). _THE CORE FEATURES OF ENKETO ARE NOT YET COMPLETE._ More info: [blog](http://blog.aidwebsolutions.com)

Browser support
---------------
- IE is not supported (does not support the required technologies). Support for the app without offline-launch cability may follow in the future or when IE catches up.
- Chrome, Firefox, Safari for both desktop and mobile devices will be supported

Prerequisites
-----------
- LAMP stack (enabled: mode_rewrite, php5-xsl, curl)
- Code Igniter (latest)
- XPathJS_javarosa (build/xpathjs_javarosa.js is only file that is required)
- (JQuery & JQuery UI)?

Installation
-----------
1. Install Code Igniter e.g. with the following structure:
	enketo____ Code_Igniter
		|			|______ application
		|			|______ system
		|
		|_____ public (this is the webroot that contains index.php)
2. Edit two paths in index.php, test if installation works, application/logs and application/cache should be writeable
3. Replace application directory 
4. Copy enketo files in /public (except index.php)
5. Add XPathJS_javarosa to the /public/libraries folder
5. Create wildcard subdomain that points to /public
6. Import database structure into MYSQL database (most queries are done with the Active Record Class so any supported db should do with minimal fixes)
7. Set up config/database.php with appropriate db user name and password
8. Set environment in index.php to 'production'

//Frequently Asked Questions
---------------------------


Development
-----------
* [Source Code](https://github.com/MartijnR/enketo)
* [Issue Tracker](https://github.com/MartijnR/enketo/issues)
* [Documentation] still to be generated

Prerequisites for developers:
- SASS/SCSS compiler to compile css (e.g. Compass)
- Apache ANT to compile javascript 
- (Google Closure Compiler)?

Instructions for developers:
- create a symlink at public/js-source to src/js

Contributions are very welcome!

License
-------
To promote further adoption of the JavaRosa/OpenRosa XForm-derived form format, Enketo is made available under the Apache 2.0 license. See [LICENSE.TXT](https://github.com/MartijnR/LICENSE.TXT). 

Related Projects
----------------
*[XPathJS_javarosa](https://github.com/MartijnR/xpathjs_javarosa)
*[Manifest Builder](https://github.com/MartijnR/Manifest-Builder)

Acknowledgements
----------------
I would like to acknowledge and thank the indirect contribution by the creators of the excellent works that were used in the project:
* [Code Igniter]()
* [XPathJS]()
* [JQuery & JQuery UI]()
* []()
* []()