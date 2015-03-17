[Enketo Smart Paper](http://enketo.org) [![Build Status](https://travis-ci.org/enketo/enketo-legacy.svg)](https://travis-ci.org/enketo/enketo-legacy) [![devDependency Status](https://david-dm.org/enketo/enketo-legacy/dev-status.svg)](https://david-dm.org/enketo/enketo-legacy#info=devDependencies)
======

###This App is no longer being actively developed. It is being replaced by [Enketo Express](https://github.com/enketo/enketo-express) which offers [several advantages](https://github.com/kobotoolbox/enketo-express#differences-with-enketoenketo-legacy-and-enketoorg).

Enketo Smart Paper runs next generation web forms that were built according to the open-source OpenRosa XForm format. This is the advanced and popular form format used by [ODK](http://opendatakit.org), [Ona](https://ona.io), [KoBo Toolbox](http://kobotoolbox.org), [Formhub](https://formhub.org) and [CommCare](http://www.commcarehq.org/home/). 

This repository is a PHP app around [Enketo Core](https://github.com/MartijnR/enketo-core) that has the ability to launch forms offline and persistently store data offline in the browser. It also provides the communication with OpenRosa compliant servers such as [ODK Aggregate](http://opendatakit.org/use/aggregate/), [KoBoToolbox](http://kobotoolbox.org), [Ona](https://ona.io), and [Formhub](https://formhub.org). The OpenRosa APIs are described [here](https://bitbucket.org/javarosa/javarosa/wiki/OpenRosaAPI).

Enketo is built into [many tools](https://enketo.org/#tools). Read more at [enketo.org](https://enketo.org) and follow the latest news about enketo on our [blog](http://blog.enketo.org) and on twitter [@enketo](https://twitter.com/enketo).

Related Projects
-----------
* [Enketo Core](https://github.com/enketo/enketo-core) - Enketo form engine used inside this repo and many other apps
* [Enketo Express](https://github.com/enketo/enketo-express) - A new Node.js version of the Enketo Web Application (will replace enketo-legacy)
* [Enketo XPathJS](https://github.com/enketo/enketo-xpathjs) - XPath Evaluator used inside enketo-core
* [Enketo XSLT](https://github.com/enketo/enketo-xslt) - used inside this repo
* [Enketo Dristhi](https://github.com/enketo/enketo-dristhi) used in [Dristhi](https://play.google.com/store/apps/details?id=org.ei.drishti)
* [enketo-xslt-transformer-php](https://github.com/enketo/enketo-xslt-transformer-php) - sample app that transforms Xforms in HTML

API Documentation
--------------
Enketo integration with ODK Aggregate, formhub, Ona, KoboToolbox etc is done via Enketo's API. See the [API documentation](http://apidocs.enketo.org).

Browser support
---------------
* IE is only supported from version 10 onwards (older versions do not support the required technologies). For performance reasons, we cannot recommend this browser though (it has no native XPath Evaluator)
* Chrome, Firefox, Safari for both desktop and mobile devices are supported. Chrome is recommended at the moment.

Frequently Asked Questions
---------------------------
##### How to install this thing?
Don't. Install [Enketo-express](https://github.com/enketo/enketo-express) instead or use one of the [many services](http://enketo.org/#tools) that have Enketo built in. Enketo Legacy is a **beast** to install and this was one of the reasons to develop Enketo Express from scratch and abandon Enketo Legacy.

##### Why are file-upload inputs greyed out and not usable?
File uploads are only experimentially supported on Chrome (except on iOS) and Opera desktop. It uses the still experimental FileSytem API to ensure that Enketo forms work offline. If file uploads (images/sound/video) are important, [Enketo Express](https://github.com/enketo/enketo-express) or ODK Collect may be a better option. 

Development
-----------
* Code contributions for [all Enketo libraries](https://github.com/enketo) except enketo-legacy are very welcome 
* [Issue Tracker](https://github.com/enketo/enketo-legacy/issues). Note that since development has stopped, most issue will be marked as 'wontfix'

Sponsors
----------------

The development of this app and [enketo-core](https://github.com/enketo/enketo-core) was sponsored by:

* [Sustainable Engineering Lab at Columbia University](http://modi.mech.columbia.edu/)
* [WHO - HRP project](http://www.who.int/reproductivehealth/topics/mhealth/en/index.html)
* [Santa Fe Insitute & Slum/Shack Dwellers International](http://www.santafe.edu/)
* [Enketo LLC](http://www.linkedin.com/company/enketo-llc)
* [iMMAP](http://immap.org)
