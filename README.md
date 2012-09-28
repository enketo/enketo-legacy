Enketo
======

Enketo is a lightweight web application that is compatible with JavaRosa/OpenRosa XForm-derived format and compliant servers. It is 'offline-cable' which means it is able to launch offline (after 1 successful online launch) and is able to persistently store survey data inside the browser (to be uploaded once a connection becomes available). This capability makes it particularly suitable for situations where Internet Access is unreliable (though sometimes available). _THE CORE FEATURES OF ENKETO ARE NOT YET COMPLETE._ More info: [blog](http://blog.aidwebsolutions.com)

Browser support
---------------
- IE is not supported (does not support the required technologies). Support for the app without offline-launch cability may follow in the future or when IE catches up.
- Chrome, Firefox, Safari for both desktop and mobile devices will be supported

Prerequisites
-----------
- LAMP stack (apache:mode_rewrite, apache: mod_expires, php:php5-xsl, php:curl, php:allow_url_fopen)
- XPathJS_javarosa (build/xpathjs_javarosa.min.js is the only file that is required)

Installation
-----------
See [bare Ubunutu 12.04 installation.txt](https://github.com/modilabs/enketo/devinfo/bare%20Ubuntu%2012.04%20installation.txt)

Frequently Asked Questions
---------------------------
to follow

Development
-----------
* [Source Code](https://github.com/MartijnR/enketo)
* [Issue Tracker](https://github.com/MartijnR/enketo/issues)
* [Documentation] still to be generated

Tools required:
- SASS/SCSS compiler to compile css (e.g. Compass)
- Apache ANT to compile javascript 

Instructions for developers:
- create a symlink at public/js-source to src/js (when environment is set to 'development' in index.php, it will automatically load the uncompiled javascript files)

Code contributions are very welcome!

License
-------
To promote further adoption of the JavaRosa/OpenRosa XForm-derived form format, Enketo is made available under the Apache 2.0 license. See [LICENSE.TXT](https://github.com/MartijnR/enketo/blob/master/LICENSE.TXT). 

Related Projects
----------------
* [XPathJS_javarosa](https://github.com/MartijnR/xpathjs_javarosa)
* [Manifest Builder](https://github.com/MartijnR/Manifest-Builder)

Acknowledgements
----------------
I would like to acknowledge and thank the indirect contribution by the creators of the following excellent works that were used in the project:
* [Code Igniter by EllisLab](http://codeigniter.com)
* [XPathJS by Andrej Pavlovic](https://github.com/andrejpavlovic/xpathjs)
* [JQuery & JQuery UI](http://jquery.com)
* [Modernizr](http://modernizr.com)
* [vkbeautify by Vadim Kiryukhin](https://github.com/vkiryukhin/vkBeautify)