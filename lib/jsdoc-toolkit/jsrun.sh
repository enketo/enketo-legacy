#!/bin/ksh

# launcher script for jsdoc
# Author: Avi Deitcher
#
# This program is released under the MIT License as follows:

# Copyright (c) 2008-2009 Atomic Inc <avi@jsorm.com>
#
#Permission is hereby granted, free of charge, to any person
#obtaining a copy of this software and associated documentation
#files (the "Software"), to deal in the Software without
#restriction, including without limitation the rights to use,
#copy, modify, merge, publish, distribute, sublicense, and/or sell
#copies of the Software, and to permit persons to whom the
#Software is furnished to do so, subject to the following
#conditions:
##
#The above copyright notice and this permission notice shall be
#included in all copies or substantial portions of the Software.
#
#THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
#EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
#OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
#NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
#HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
#WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
#FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
#OTHER DEALINGS IN THE SOFTWARE.
#

# run from project root like this: 
# lib/jsdoc-toolkit/jsrun.sh -d=devinfo/jsdocs src/js/__cache.js src/js/__common.js src/js/__connection.js src/js/__form.js src/js/__formlist.js src/js/__storage.js src/js/__survey_controls.js src/js/__test.js 


JSDOCDIR="lib/jsdoc-toolkit"
JSDOCTEMPLATEDIR="$JSDOCDIR/templates/JsDoc2-Template-Bootstrap-master"

if [[ -n "$JSDOCDIR" ]]; then
        _DOCDIR="-Djsdoc.dir=$JSDOCDIR"
        _APPDIR="$JSDOCDIR/app"
	_BASEDIR="$JSDOCDIR"
else
        _DOCDIR=""
        _APPDIR="./app"
	_BASEDIR="."
fi

if [[ -n "$JSDOCTEMPLATEDIR" ]]; then
        _TDIR="-Djsdoc.template.dir=$JSDOCTEMPLATEDIR"
else
        _TDIR=""
fi



CMD="java $_DOCDIR $_TDIR -jar $_BASEDIR/jsrun.jar $_APPDIR/run.js $@"
echo $CMD
$CMD

