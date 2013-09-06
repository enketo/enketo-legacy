---
layout: page
title: About enketo
nav: readme
---


[Enketo Smart Paper](http://enketo.org)
======

Enketo is a lightweight web application that is compatible with JavaRosa/OpenRosa XForm-derived format and compliant servers. It is 'offline-cable' which means it is able to launch offline (after 1 successful online launch) and is able to persistently store survey data inside the browser (to be uploaded once a connection becomes available). This capability makes it particularly suitable for situations where Internet Access is unreliable (though sometimes available). Enketo is integrated inside [formhub.org](http://formhub.org) and available as a paid service on [enketo.org](http://enketo.org). More info on [blog](http://blog.enketo.org) and [@enketo](https://twitter.com/enketo).

API Documentation
--------------
Instead of installing and maintaining Enketo yourself you could also use [enketo.org](https://enketo.org)'s API if you have an [account](https://accounts.enketo.org). The [API documentation](http://apidocs.enketo.org) describes how you can easily achieve the same level of integration that currently exists on [formhub.org](https://formhub.org)


Browser support
---------------
- IE is only supported from version 10 onwards (older versions do not support the required technologies). 
- Chrome, Firefox, Safari for both desktop and mobile devices are. Chrome is recommended.

Prerequisites
-----------
- LAMP stack

Installation
-----------
See [Ubuntu_installation_instructions.md](https://github.com/modilabs/enketo/blob/master/Ubuntu_installation_instructions.md)

Frequently Asked Questions
---------------------------
##### Why are file-upload inputs greyed out and not usable?
File uploads are only experimentially supported on Chrome at the moment until other browser catch up with support for the FileSytem API. If file uploads (images/sound/video) are important, ODK Collect may be a better option.


Development
-----------
* [Source Code](https://github.com/MartijnR/enketo)
* [Issue Tracker on /mobilabs](https://github.com/modilabs/enketo/issues) and on [/martijnr](https://github.com/MartijnR/enketo/issues)
* [Documentation] still to be generated

Tools required:

* SASS/SCSS compiler to compile css (e.g. Compass)
* Apache ANT to compile javascript 

Code contributions will be actively facilitated once the Form engine is separated from the main repo. You will then be able to easily run enketo forms locally, extend them and build your own applications around them. TO FOLLOW later in 2013.

License
-------
To promote further adoption of the JavaRosa/OpenRosa XForm-derived form format, Enketo is made available under the permissive Apache 2.0 license. See [LICENSE.TXT](https://github.com/MartijnR/enketo/blob/master/LICENSE.TXT). 

Related Projects
----------------
* [XPathJS_javarosa](https://github.com/MartijnR/xpathjs_javarosa)
* [Manifest Builder](https://github.com/MartijnR/Manifest-Builder)

Acknowledgements
----------------
I would like to acknowledge and thank the indirect contribution by the creators of the following excellent works that were used in the project:

* [Code Igniter by EllisLab](http://codeigniter.com)
* [XPathJS by Andrej Pavlovic](https://github.com/andrejpavlovic/xpathjs)
* [JQuery](http://jquery.com)
* [Modernizr](http://modernizr.com)
* [vkbeautify by Vadim Kiryukhin](https://github.com/vkiryukhin/vkBeautify)
* [Bootstrap](http://twitter.github.com/bootstrap/)
* [Bootstrap Datepicker by eternicode](https://github.com/eternicode/bootstrap-datepicker)