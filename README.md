[Enketo Smart Paper](http://enketo.org) [![Build Status](https://travis-ci.org/MartijnR/enketo.png)](https://travis-ci.org/MartijnR/enketo)
======

Enketo Smart Paper runs next generation web forms that were built according to the open-source OpenRosa XForm format. This is the advanced and popular form format used by [ODK](http://opendatakit.org), [Formhub](https://formhub.org) and [CommCare](http://www.commcarehq.org/home/). 

This repository is a PHP-wrapper around [Enketo Core](https://github.com/MartijnR/enketo-core) that adds the ability to launch offline and persistently store data offline in the browser. It also provides the communication with OpenRosa compliant servers such as [ODK Aggregate](http://opendatakit.org/use/aggregate/) and [Formhub](https://formhub.org). The OpenRosa APIs are described [here](https://bitbucket.org/javarosa/javarosa/wiki/OpenRosaAPI).

Enketo is currently deployed as a paid service on [enketo.org](http://enketo.org) and as a free service on [formhub.org](http://formhub.org). Follow the latest news about enketo on our [blog](http://blog.enketo.org) and on twitter [@enketo](https://twitter.com/enketo).

Related Projects
-----------
* [Enketo Core](https://github.com/MartijnR/enketo-core) - used inside this repo
* [XPathJS OpenRosa](https://github.com/MartijnR/xpathjs_javarosa) - XPath Evaluator used inside enketo-core
* [Wicked Good XPath OpenRosa](https://github.com/kirang20/wgxp-java-rosa) - a much faster replacement XPath Evaluator under development
* [Enketo XSLT](https://github.com/MartijnR/enketo-xslt) - used inside this repo
* [Enketo Dristhi](https://github.com/MartijnR/enketo-dristhi) used in [Dristhi](https://play.google.com/store/apps/details?id=org.ei.drishti)
* [Manifest Builder](https://github.com/MartijnR/Manifest-Builder) - used inside this repo
* [File Manager](https://github.com/MartijnR/file-manager) - used inside this repo
* [enketo-xslt-transformer-php](https://github.com/MartijnR/enketo-xslt-transformer-php) - sample app that transforms Xforms in HTML
* [enketo-xslt-transformer-node] - To follow

API Documentation
--------------
Instead of installing and maintaining Enketo yourself you should consider using [enketo.org](https://enketo.org)'s API after opening an enketo.org [account](https://accounts.enketo.org). The [API documentation](http://apidocs.enketo.org) describes how you can easily achieve the same level of integration that currently exists on [formhub.org](https://formhub.org) and in [ODK Aggregate 1.4.1+](http://opendatakit.org/use/aggregate/) to any other OpenRosa-compliant server.

Browser support
---------------
* IE is only supported from version 10 onwards (older versions do not support the required technologies). For performance reasons, we cannot recommend this browser though (it has no native XPath Evaluator)
* Chrome, Firefox, Safari for both desktop and mobile devices are supported. Chrome is recommended at the moment.

Frequently Asked Questions
---------------------------
##### How to install this thing?
To better encourage code contributions and at the same time try to create a stable source of revenue to continue development on this project, a new strategy was adopted to make the Enketo project sustainable. We are no longer encouraging or supporting self-installation of this PHP app. 

Instead, the main Enketo repository has been split up into various easy-to-use open-source libraries that can serve as building blocks for developers to create their own enketo-powered app (see [Related Projects](#related-projects) above). We would like to encourage developers to use these libraries, would welcome contributions and will gladly help out if you experience issues. 

If you're not interested in extending enketo but would just like to use it and at the same time support the Enketo project, the best option is to use the service at [enketo.org](https://enketo.org) which can be linked to your own installation of ODK Aggregate or Formhub so that it appears to be integrated. You can even use your own branding.

License of this PHP app is subject to change in the future. Note that the Form Authentication module deployed on [enketo.org](https://enketo.org) and [formhub.org](https://formhub.org) is not included in the master branch and is not open-source. 

##### Why are file-upload inputs greyed out and not usable?
File uploads are only experimentially supported on Chrome (except on iOS) and Opera desktop at the moment. It uses the still experimental FileSytem API to ensure that Enketo forms work offline. If file uploads (images/sound/video) are important, ODK Collect may be a better option. Alternatively, it would be easy to develop an online-only version of Enketo using [Enketo Core](https://github.com/MartijnR/enketo-core) with full cross-browser support for file uploads.
##### Why is form authentication not working on my own installation?
This is a separate module that is currently not open-source. 

Development
-----------
* Code contributions for [Enketo Core](https://github.com/MartijnR/enketo-core) and its dependencies (see above under Related Projects) are very welcome. See those repos for more information.
* [Issue Tracker](https://github.com/MartijnR/enketo/issues)

Acknowledgements
----------------

Enketo development is sponsored by:

* [Sustainable Engineering Lab at Columbia University](http://modi.mech.columbia.edu/)
* [WHO - HRP project](http://www.who.int/reproductivehealth/topics/mhealth/en/index.html)
* [Santa Fe Insitute & Slum/Shack Dwellers International](http://www.santafe.edu/)
* [Enketo LLC](http://www.linkedin.com/company/enketo-llc)

I would like to also acknowledge and thank the indirect contribution by the creators of the following excellent works that were used in the project:

* [Code Igniter](http://codeigniter.com) by EllisLab
* [vkbeautify](https://github.com/vkiryukhin/vkBeautify) by Vadim Kiryukhin
* many more (see the various enketo libraries used in this repo)
