[Enketo Smart Paper](http://enketo.org) [![Build Status](https://travis-ci.org/MartijnR/enketo.png)](https://travis-ci.org/MartijnR/enketo-core)
======

Enketo Smart Paper runs next generation web forms that were built according to the open-source OpenRosa XForm format. This is the advanced and popular form format used by [ODK](http://opendatakit.org), [Formhub](https://formhub.org) and [CommCare](http://www.commcarehq.org/home/). 

This repository forms a PHP-wrapper around Enketo Smart Paper and adds the ability to launch offline and persistently store data offline in the browser. It also provides the communication with OpenRosa compliant servers such as [ODK Aggregate](http://opendatakit.org/use/aggregate/) and [Formhub](https://formhub.org). The OpenRosa APIs are described [here](https://bitbucket.org/javarosa/javarosa/wiki/OpenRosaAPI).

Enketo is currently deployed as a paid service on [enketo.org](http://enketo.org) and as a free service on [formhub.org](http://formhub.org). Follow the latest news about enketo on our [blog](http://blog.enketo.org) and on [@enketo](https://twitter.com/enketo).

Related Projects
-----------
* [Enketo Core](https://github.com/MartijnR/enketo-core) - used inside this repo
* [XPathJS JavaRosa](https://github.com/MartijnR/xpathjs_javarosa) - used inside enketo-core
* [Enketo XSLT](https://github.com/MartijnR/enketo-xslt) - used inside this repo
* [Enketo Dristhi](https://github.com/MartijnR/enketo-dristhi) used in [Dristhi](https://play.google.com/store/apps/details?id=org.ei.drishti)
* [Manifest Builder](https://github.com/MartijnR/Manifest-Builder) - used inside this repo
* [File Manager](https://github.com/MartijnR/file-manager) - used inside this repo
* [enketo-xslt-transformer-php] - To follow
* [enketo-xslt-transformer-node] - To follow

API Documentation
--------------
Instead of installing and maintaining Enketo yourself you could also consider using [enketo.org](https://enketo.org)'s API if you have an enketo.org [account](https://accounts.enketo.org). The [API documentation](http://apidocs.enketo.org) describes how you can easily achieve the same level of integration that currently exists on [formhub.org](https://formhub.org) with ODK Aggregate or any other OpenRosa-compliant server.

Browser support
---------------
* IE is only supported from version 10 onwards (older versions do not support the required technologies). 
* Chrome, Firefox, Safari for both desktop and mobile devices are supported. Chrome is recommended at the mome.

Prerequisites
-----------
* LAMP stack
* Node, Grunt, Ruby, Sass.

Frequently Asked Questions
---------------------------
##### Why are file-upload inputs greyed out and not usable?
File uploads are only experimentially supported on Chrome at the moment until other browser catch up with support for the FileSytem API. If file uploads (images/sound/video) are important, ODK Collect may be a better option.
##### Why is form authentication not working on my own installation?
This is a separate module that is currently not open-source. 

Development
-----------
* Code contributions for [enketo-core](https://github.com/MartijnR/enketo-core) and [enketo-xslt](https://github.com/MartijnR/enketo-xslt) are very welcome. See those repos for more information. 
* PHP style guide: http://pear.php.net/manual/en/standards.php
* [Issue Tracker on /mobilabs](https://github.com/modilabs/enketo/issues) and on [/martijnr](https://github.com/MartijnR/enketo/issues)

Acknowledgements
----------------
I would like to acknowledge and thank the indirect contribution by the creators of the following excellent works that were used in the project:

* [Code Igniter](http://codeigniter.com) by EllisLab
* [vkbeautify](https://github.com/vkiryukhin/vkBeautify) by Vadim Kiryukhin
* many more