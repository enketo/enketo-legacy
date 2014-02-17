/**
 * @preserve Copyright 2013 Martijn van de Rijdt
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Deals with printing
 */

define( [ 'jquery' ], function( $ ) {
    "use strict";
    var dpi, styleSheet, $styleSheetLink;

    // make sure setDpi is not called until DOM is ready
    $( document ).ready( function() {
        setDpi();
        $styleSheetLink = $( 'link[media="print"]:eq(0)' );
    } );

    /**
     * Calculates the dots per inch and sets the dpi property
     */
    function setDpi() {
        var dpiO = {},
            e = document.body.appendChild( document.createElement( "DIV" ) );
        e.style.width = "1in";
        e.style.padding = "0";
        dpiO.v = e.offsetWidth;
        e.parentNode.removeChild( e );
        dpi = dpiO.v;
    }

    /**
     * Gets print stylesheets
     * @return {Element} [description]
     */
    function getStyleSheet() {
        for ( var i = 0; i < document.styleSheets.length; i++ ) {
            if ( document.styleSheets[ i ].media.mediaText === 'print' ) {
                return document.styleSheets[ i ];
            }
        }
        return null;
    }

    /**
     * Applies the print stylesheet to the current view by changing stylesheets media property to 'all'
     */
    function styleToAll() {
        //sometimes, setStylesheet fails upon loading
        if ( !styleSheet ) {
            styleSheet = getStyleSheet();
        }
        //Chrome:
        styleSheet.media.mediaText = 'all';
        //Firefox:
        $styleSheetLink.attr( 'media', 'all' );
    }

    /**
     * Resets the print stylesheet to only apply to media 'print'
     */
    function styleReset() {
        styleSheet.media.mediaText = 'print';
        $styleSheetLink.attr( 'media', 'print' );
    }

    /**
     * Prints the form after first setting page breaks (every time it is called)
     */
    function printForm() {
        removePageBreaks();
        removePossiblePageBreaks();
        styleToAll();
        addPageBreaks();
        styleReset();
        window.print();
    }

    /**
     * Removes all current page breaks
     */
    function removePageBreaks() {
        $( '.page-break' ).remove();
    }

    /**
     * Removes all potential page breaks
     */
    function removePossiblePageBreaks() {
        $( '.possible-break' ).remove();
    }

    /**
     * Adds a temporary potential page    break to each location in the form that is allowed to have one
     */
    function addPossiblePageBreaks() {
        var possible_break = $( "<hr>", {
            "class": "possible-break" /*, "style":"background-color:blue; height: 1px"*/
        } );

        removePossiblePageBreaks();

        $( 'form.or' ).before( possible_break.clone() ).after( possible_break.clone() )
            .find( 'fieldset>legend, label:not(.geo)>input:not(input:radio, input:checkbox), label>select, label>textarea,' +
                ' .trigger>*, h4>*, h3>*, .or-appearance-field-list>*' )
            .parent().each( function() {
                var $this, prev;
                $this = $( this );
                prev = $this.prev().get( 0 );
                //some exceptions
                if (
                    prev && ( prev.nodeName === "H3" || prev.nodeName === "H4" ) ||
                    $( prev ).hasClass( 'repeat-number' ) ||
                    $this.parents( '#or-calculated-items, #jr-preload-items' ).length > 0 ||
                    $this.parents( '.or-appearance-field-list' ).length > 0
                ) {
                    return null;
                } else {
                    return $this.before( possible_break.clone() );
                }
            } );

        //correction of placing two direct sibling breaks
        $( '.possible-break' ).each( function() {
            if ( $( this ).prev().hasClass( 'possible-break' ) ) {
                return $( this ).remove();
            }
        } );
    }

    /**
     * Adds page breaks intelligently
     * Thank you, Alex Dorey!
     */
    function addPageBreaks() {
        var i, page, page_a, page_h, pages, possible_break, possible_breaks, qgroup, qgroups, _i, _j, _k, _len, _len1, _ref,
            page_height_in_inches = 9.5,
            page_height_in_pixels = dpi * page_height_in_inches,
            pb = "<hr class='page-break' />",
            /*
            This is supposed to be a representation of a "Question Group", which exists only to
            calculate the height of the question group and to make it easy to prepend a pagebreak
            if necessary.
            */
            QGroup = ( function() {
                function QGroup( begin, end ) {
                    this.begin = $( begin );
                    this.begin_top = this.begin.offset().top;
                    this.end = $( end );
                    this.end_top = this.end.offset().top;
                    this.h = this.end_top - this.begin_top;
                    if ( this.h < 0 ) {
                        console.debug( 'begin (top: ' + this.begin_top + ')', begin );
                        console.debug( 'end (top: ' + this.end_top + ')', end );
                        throw new Error( "A question group has an invalid height." );
                    }
                }

                QGroup.prototype.break_before = function() {
                    var action, elem, prev, where_to_situate_breakpoint;
                    prev = this.begin.prev().get( 0 );
                    if ( !prev ) {
                        where_to_situate_breakpoint = [ 'before', this.begin.parent().get( 0 ) ];
                    } else {
                        where_to_situate_breakpoint = [ 'after', prev ];
                    }
                    action = where_to_situate_breakpoint[ 0 ];
                    elem = where_to_situate_breakpoint[ 1 ];
                    //console.debug('elem to place pb '+action+': ', elem);
                    return $( elem )[ action ]( pb );
                };

                return QGroup;
            } )();

        removePageBreaks();

        addPossiblePageBreaks();
        possible_breaks = $( '.possible-break' );

        qgroups = [];
        for ( i = 1; i < possible_breaks.length; i++ ) {
            qgroups.push( new QGroup( possible_breaks[ i - 1 ], possible_breaks[ i ] ) );
        }

        page_h = 0;
        page_a = [];
        pages = [];

        for ( _j = 0, _len = qgroups.length; _j < _len; _j++ ) {
            qgroup = qgroups[ _j ];
            if ( ( page_h + qgroup.h ) > page_height_in_pixels ) {
                pages.push( page_a );
                page_a = [ qgroup ];
                page_h = qgroup.h;
            } else {
                page_a.push( qgroup );
                page_h += qgroup.h;
            }
        }

        pages.push( page_a );

        console.debug( 'pages: ', pages );

        //skip the first page
        for ( _k = 1, _len1 = pages.length; _k < _len1; _k++ ) {
            page = pages[ _k ];
            if ( page.length > 0 ) {
                page[ 0 ].break_before();
            }
        }

        //remove the possible-breaks
        return $( '.possible-break' ).remove();
    }

    return printForm;
} );
