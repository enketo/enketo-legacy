<?xml version="1.0" encoding="UTF-8"?>

<!--
 * Copyright 2012 Martijn van de Rijdt
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
 -->
<!--
*****************************************************************************************************
XSLT Stylesheet that transforms OpenRosa style (X)Forms into valid HTMl5 forms
(exception: when non-IANA lang attributes are used the form will not validate (but that's not serious))
*****************************************************************************************************
-->

<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xf="http://www.w3.org/2002/xforms"
    xmlns:h="http://www.w3.org/1999/xhtml"
    xmlns:ev="http://www.w3.org/2001/xml-events"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:jr="http://openrosa.org/javarosa"
    xmlns:exsl="http://exslt.org/common"
    xmlns:str="http://exslt.org/strings"
    extension-element-prefixes="exsl str"
    version="1.0"
    >

    <xsl:output method="xml" omit-xml-declaration="yes" encoding="UTF-8" indent="yes"/><!-- for xml: version="1.0" -->

    <xsl:variable name="upper-case" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'" />
    <xsl:variable name="lower-case" select="'abcdefghijklmnopqrstuvwxyz'" />
    <xsl:variable name="undefined">undefined</xsl:variable>
    <xsl:variable name="warning">warning</xsl:variable>
    <xsl:variable name="error">error</xsl:variable>
    <xsl:variable name="translated"><!-- assumes that either a whole form is translated or nothing (= real life) -->
        <xsl:if test="count(//xf:itext/xf:translation) &gt; 1" >
            <xsl:value-of select="string('true')" /><!-- no time to figure out how to use real boolean values -->
        </xsl:if>
    </xsl:variable>
    <xsl:variable name="default-lang">
        <xsl:value-of select="h:html/h:head/xf:model/xf:itext/xf:translation[@default]/@lang" />
    </xsl:variable>

    <xsl:template match="/">
    	<xsl:if test="not(function-available('exsl:node-set'))">
            <xsl:message terminate="yes">FATAL ERROR: Node-set function is not available in this XSLT processor</xsl:message>
        </xsl:if>
        <xsl:if test="not(function-available('str:tokenize'))">
            <xsl:message terminate="yes">FATAL ERROR: Tokenize function is not available in this XSLT processor</xsl:message>
        </xsl:if>
        <xsl:for-each select="//xf:bind">
        	<xsl:if test="not(substring(./@nodeset, 1, 1) = '/')">
        		<xsl:message terminate="no">WARNING: Found binding(s) with relative (= bad!) nodeset attribute <!--on element: <xsl:value-of select="./@nodeset" />--> (form may work correctly if relative nodesets were used consistently throughout xml form in bindings as well as body, otherwise it will certainly be messed up). </xsl:message>
        	</xsl:if>
        </xsl:for-each>
       <!--> <xsl:text disable-output-escaping='yes'>&lt;!DOCTYPE html&gt;</xsl:text>
        <html>
            <head>
                <title>
                    <xsl:text>Transformation of JR (X)Form to HTML5</xsl:text>
                </title>
                <script src="jquery.min.js" type="text/javascript" ><xsl:text> </xsl:text></script>
                <script type="text/javascript">
                    <xsl:text disable-output-escaping='yes'>
		              $(function() {
				            $('#form-languages a').click(function(){
					           $('form [lang]').show().not('[lang="'+$(this).attr('lang')+'"], [lang=""], #form-languages a').hide();
				            });
				      });</xsl:text>
                </script>
            </head>-->
            <root>
	            <form class="jr" autocomplete="off">
	                <xsl:attribute name="id">
                        <xsl:choose>
                            <xsl:when test="/h:html/h:head/xf:model/xf:instance[1]/child::node()/@id">
	                            <xsl:value-of select="translate(/h:html/h:head/xf:model/xf:instance/child::node()/@id, ' ', '_' )" /><!-- not smart! -->
                            </xsl:when>
                            <xsl:when test="/h:html/h:head/xf:model/xf:instance/child::node()/@xmlns">
                                <xsl:value-of select="translate(/h:html/h:head/xf:model/xf:instance/child::node()/@xmlns, ' ', '_')" />
                            </xsl:when>
                            <xsl:otherwise>
                                <xsl:text>_</xsl:text>
                            </xsl:otherwise>
                        </xsl:choose>
	                </xsl:attribute>
	                <xsl:text>&#10;</xsl:text>
	                <xsl:comment>This form was created by transforming a javaRosa-style (X)Form using an XSLT sheet created by Aid Web Solutions.</xsl:comment>
                    <section class="form-logo">
                        <xsl:text> </xsl:text>
                    </section>
	                <h3 id="form-title">
	                    <xsl:choose>
                            <xsl:when test="/h:html/h:head/h:title">
                                <xsl:value-of select="/h:html/h:head/h:title"/>
                            </xsl:when>
                            <xsl:otherwise>
                                <xsl:text>No Title</xsl:text>
                            </xsl:otherwise>
                        </xsl:choose>
	                </h3>
                    <div id="stats" style="display: none;">
                        <span id="jrSelect"><xsl:value-of select="count(/h:html/h:body//xf:select)"/></span>
                        <span id="jrSelect1"><xsl:value-of select="count(/h:html/h:body//xf:select)"/></span>
                        <span id="jrItem"><xsl:value-of select="count(/h:html/h:body//xf:item)"/></span>
                        <span id="jrInput"><xsl:value-of select="count(/h:html/h:body//xf:input)"/></span>
                        <span id="jrUpload"><xsl:value-of select="count(/h:html/h:body//xf:upload)"/></span>
                        <span id="jrTrigger"><xsl:value-of select="count(/h:html/h:body//xf:trigger)"/></span>
                        <span id="jrRepeat"><xsl:value-of select="count(/h:html/h:body//xf:repeat)"/></span>
                        <span id="jrRelevant"><xsl:value-of select="count(/h:html/h:head/xf:model/xf:bind[@relevant])"/></span>
                        <span id="jrConstraint"><xsl:value-of select="count(/h:html/h:head/xf:model/xf:bind[@constraint])"/></span>
                        <span id="jrCalculate"><xsl:value-of select="count(/h:html/h:head/xf:model/xf:bind[@calculate])"/></span>
                        <span id="jrPreload"><xsl:value-of select="count(/h:html/h:head/xf:model/xf:bind[@jr:preload])"/></span>

                    </div>
	                <xsl:if test="//*/@lang" >
	                    <div id="form-languages">
	                    	<xsl:if test="$translated != 'true'">
	                        	<xsl:attribute name="style">display:none;</xsl:attribute>
	                        </xsl:if>
	                        <xsl:if test="$default-lang">
	                            <xsl:attribute name="data-default-lang">
	                                <xsl:value-of select="$default-lang" />
	                            </xsl:attribute>
	                        </xsl:if>
	                        <xsl:call-template name="languages" />
	                    </div>
	                </xsl:if>
	                <!-- create hidden input fields for preload items -->
	                <xsl:if test="/h:html/h:head/xf:model/xf:bind[@jr:preload]" >
	                    <fieldset id="jr-preload-items" style="display:none;">
	                        <xsl:apply-templates select="/h:html/h:head/xf:model/xf:bind[@jr:preload]"/>
	                    </fieldset>
	                </xsl:if>

	                <xsl:apply-templates />

	                <!-- create hidden input fields for calculated items -->
	                <xsl:if test="/h:html/h:head/xf:model/xf:bind[@calculate]">
	                    <fieldset id="jr-calculated-items" style="display:none;">
	                        <!-- note: this breaks the order of the instance elements -->
	                        <xsl:apply-templates select="/h:html/h:head/xf:model/xf:bind[@calculate]" />
	                        <!--<xsl:message>WARNING: Found calculated item(s). Support for this will be limited.</xsl:message>-->
	                    </fieldset>
	                </xsl:if>
	                <xsl:if test="/h:html/h:body//xf:output">
	                    <xsl:message>WARNING: Output element(s) added but with limited support. Only /absolute/path/to/node is properly supported as "value" attribute of outputs. Please test to make sure they do what you want.</xsl:message>
	                </xsl:if>
                    <xsl:if test="/h:html/h:body//xf:itemset">
                        <xsl:message terminate="yes">ERROR: No support for itemset yet. Form will fail until this is supported.</xsl:message>
                    </xsl:if>
                    <xsl:if test="//xf:submission">
                        <xsl:message>ERROR: Submissions element(s) not supported yet.</xsl:message>
                    </xsl:if>
	            </form>
            </root>
        <!--</html>-->
        </xsl:template>

    <xsl:template match="h:head"/> <!--[not(self::xf:model/xf:bind[@jr:preload])]" />-->

    <xsl:template match="xf:group">
        <fieldset>
            <xsl:attribute name="class">
                <!-- only add jr-group if label is present or if it has a repeat as child-->
                <xsl:if test="string(xf:label/@ref) or string(xf:label) or boolean(./xf:repeat)">
                    <xsl:value-of select="string('jr-group')" />
                    <xsl:text> </xsl:text>
                </xsl:if>
                <xsl:call-template name="appearance" />
            </xsl:attribute>

            <xsl:variable name="nodeset_used">
                <xsl:call-template name="nodeset_used" />
            </xsl:variable>
           
            <!--<xsl:if test="string(@ref)">-->
            <xsl:if test="string($nodeset_used)">
                <!-- the correct absolute nodeset as used in HTML -->
                <xsl:variable name="nodeset">
                     <xsl:call-template name="nodeset_absolute">
                         <xsl:with-param name="nodeset_u" select="$nodeset_used"/>
                     </xsl:call-template>
                </xsl:variable>
               
                <!-- note that bindings are not required -->
                <xsl:variable name="binding" select="/h:html/h:head/xf:model/xf:bind[@nodeset=$nodeset_used] | /h:html/h:head/xf:model/xf:bind[@nodeset=$nodeset]"/>

                <!--<xsl:variable name="nodeset" select="@ref" />-->
                <xsl:attribute name="name">
                    <!--<xsl:value-of select="@ref"/>-->
                    <xsl:value-of select="$nodeset"/>
                </xsl:attribute>
                <!--<xsl:if test="/h:html/h:head/xf:model/xf:bind[@nodeset=$nodeset]/@relevant">-->
                <xsl:if test="$binding/@relevant">
                    <xsl:attribute name="data-relevant">
                        <!--<xsl:value-of select="/h:html/h:head/xf:model/xf:bind[@nodeset=$nodeset]/@relevant" />-->
                        <xsl:value-of select="$binding/@relevant"/>
                    </xsl:attribute>
                </xsl:if>
            </xsl:if>
            <xsl:if test="string(./xf:label/@ref) or string (./xf:label)">
                <h4>
                    <xsl:apply-templates select="xf:label" />
                </h4>
            </xsl:if>
            <xsl:apply-templates select="*[not(self::xf:label or self::xf:hint)]"/>
            <xsl:text>
            </xsl:text>
        </fieldset><xsl:comment>end of group <xsl:value-of select="@nodeset" /> </xsl:comment>
    </xsl:template>

    <xsl:template match="xf:repeat">
        <!--<xsl:variable name="nodeset" select="@nodeset" />
        <xsl:variable name="binding" select="/h:html/h:head/xf:model/xf:bind[@nodeset=$nodeset]" />-->
        
        <xsl:variable name="nodeset_used">
            <xsl:call-template name="nodeset_used" />
        </xsl:variable>
       
        <!-- the correct absolute nodeset as used in HTML -->
        <xsl:variable name="nodeset">
             <xsl:call-template name="nodeset_absolute">
                 <xsl:with-param name="nodeset_u" select="$nodeset_used"/>
             </xsl:call-template>
        </xsl:variable>
       
        <!-- note that bindings are not required -->
        <xsl:variable name="binding" select="/h:html/h:head/xf:model/xf:bind[@nodeset=$nodeset_used] | /h:html/h:head/xf:model/xf:bind[@nodeset=$nodeset]" />

        <fieldset>
            <xsl:attribute name="class">
                <xsl:value-of select="string('jr-repeat')" />
                <xsl:text> </xsl:text>
                <xsl:call-template name="appearance" />
            </xsl:attribute>
            <xsl:attribute name="name">
                <xsl:value-of select="$nodeset"/>
            </xsl:attribute>
            <xsl:if test="@jr:count">
                <xsl:attribute name="data-repeat-count">
                    <xsl:value-of select="@jr:count" />
                </xsl:attribute>
            </xsl:if>
            <xsl:if test="@jr:noAddRemove">
                <xsl:attribute name="data-repeat-fixed">
                     <xsl:value-of select="string('fixed')"/>
                </xsl:attribute>
            </xsl:if>
            <xsl:if test="string($binding/@constraint)">
                <xsl:attribute name="data-constraint">
                    <xsl:value-of select="$binding/@constraint"/>
                </xsl:attribute>
            </xsl:if>
            <xsl:if test="string(./xf:label/@ref) or string (./xf:label)">
                <h4>
                    <xsl:apply-templates select="xf:label" />
                </h4>
            </xsl:if>

            <xsl:apply-templates select="*[not(self::xf:label or self::xf:hint)]"/>
            <xsl:text>
            </xsl:text>
        </fieldset><xsl:comment>end of repeat fieldset with name <xsl:value-of select="@nodeset" /> </xsl:comment>
    </xsl:template>

    <xsl:template name="appearance">
        <xsl:if test="@appearance">
             <xsl:value-of select="concat('jr-appearance-', translate(@appearance, $upper-case, $lower-case))"/>
        </xsl:if>
    </xsl:template>

    <!--
    <xsl:template name="default">
        <xsl:param name="nodeset"/>
        <xsl:variable name="path">
            <xsl:value-of select="concat('/h:html/h:head/xf:model/xf:instance', replace($nodeset,'/','/xf:'))" />
        </xsl:variable>
    </xsl:template>
   -->

    <xsl:template match="xf:input | xf:upload | xf:item | xf:bind[@jr:preload] | xf:bind[@calculate]">
        <xsl:variable name="nodeset_used">
            <xsl:call-template name="nodeset_used" />
        </xsl:variable>
        <!--<xsl:message>INFO: nodeset found: <xsl:value-of select="$nodeset_used"/></xsl:message>-->

        <!-- the correct absolute nodeset as used in HTML -->
        <xsl:variable name="nodeset">
             <xsl:call-template name="nodeset_absolute">
                 <xsl:with-param name="nodeset_u" select="$nodeset_used"/>
             </xsl:call-template>
        </xsl:variable>
       
        <!-- note that bindings are not required -->
        <!--<xsl:variable name="binding" select="/h:html/h:head/xf:model/xf:bind[@nodeset=$nodeset]" />-->
        <!--***** SUPPORT CODE FOR RELATIVE NODESET BINDING *******-->
        <xsl:variable name="binding" select="/h:html/h:head/xf:model/xf:bind[@nodeset=$nodeset_used] | /h:html/h:head/xf:model/xf:bind[@nodeset=$nodeset]" />
        <!--    <xsl:choose>
                <xsl:when test="local-name() = 'bind'">
                    <xsl:copy-of select="." />
                </xsl:when>-->
                <!-- first try to see if absolute nodeset returns a result, nothing to loose -->        
         <!--       <xsl:when test="/h:html/h:head/xf:model/xf:bind[@nodeset=$nodeset]">
                    <xsl:copy-of select="/h:html/h:head/xf:model/xf:bind[@nodeset=$nodeset]" />
                </xsl:when>
                <xsl:otherwise>
                    <xsl:copy-of select="/h:html/h:head/xf:model/xf:bind[@nodeset=$nodeset_used]" />
                </xsl:otherwise>
            </xsl:choose>            
        </xsl:variable>-->
        <!--*******************************************************-->


        <xsl:variable name="xml_type">
            <!--<xsl:call-template name="xml_type" >
                <xsl:with-param name="nodeset" select="$nodeset_used"/>
            </xsl:call-template>-->
            <xsl:choose>
                <xsl:when test="string-length($binding/@type) &lt; 1" >string</xsl:when>
                <xsl:otherwise>
                    <xsl:call-template name="strip_namespace">
                        <xsl:with-param name="string">
                            <xsl:value-of select="$binding/@type"/>
                        </xsl:with-param>
                    </xsl:call-template>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:variable name="html_type">
            <xsl:call-template name="html_type">
                <xsl:with-param name="xml_type" select="$xml_type" />
            </xsl:call-template>
        </xsl:variable>
        <xsl:variable name="constraint" select="$binding/@constraint" />
        <!--
        <xsl:variable name="constraintTokens">
            <xsl:for-each select="str:tokenize($constraint, ' |\(|\)')">
                <xsl:if test="string-length() &gt; 0">
                    <token>
                        <xsl:value-of select="."/>
                    </token>
                </xsl:if>
            </xsl:for-each>
        </xsl:variable>
        -->
        <!--
        <xsl:variable name="default">
            <xsl:call-template name="default">
                <xsl:with-param name="nodeset" select="$nodeset" />
            </xsl:call-template>
        </xsl:variable>
         -->
        <label>
            <xsl:if test="@appearance"><!--only expected for input elements-->
                <!--<xsl:variable name="appearance">
                    <xsl:call-template name="appearance" />
                </xsl:variable>--> 
                <xsl:attribute name="class">
                    <xsl:call-template name="appearance" />
                </xsl:attribute>
            </xsl:if> 
            <!-- if "$html_type = 'radio' or $html_type = 'checkbox'"-->
            <xsl:if test="not(local-name() = 'item')">
                <xsl:apply-templates select="$binding/@jr:constraintMsg" />
            </xsl:if>
            <xsl:apply-templates select="xf:label" />
            <!-- note: Hints should actually be placed in title attribute (of input).
                However, to support multiple languages and parse all of them (to be available offline)
                they are placed in the label instead.-->
            <xsl:apply-templates select="xf:hint" />
            <xsl:variable name="appearance">
                <xsl:value-of select="translate(@appearance, $upper-case, $lower-case)"/>
            </xsl:variable>
            <xsl:variable name="element">
                <xsl:choose>
                    <xsl:when test="$html_type = 'text' and $appearance = 'multi-line' or $appearance = 'multiline' or $appearance = 'text-area' or $appearance = 'big' or $appearance = 'big-text' or $appearance = 'textarea'">
                        <xsl:value-of select="string('textarea')" />
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:value-of select="string('input')" />
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:variable>
            <xsl:element name="{$element}">
                <xsl:attribute name="autocomplete">off</xsl:attribute>
                <!-- ****** ACCEPT ****** -->
                <xsl:if test="$html_type = 'file'">
                    <xsl:if test="@mediatype">
                        <xsl:attribute name="accept">
                            <xsl:value-of select="@mediatype" />
                            <!-- image/*, video/* or audio/* -->
                        </xsl:attribute>
                    </xsl:if>
                </xsl:if>
                <!--
                <xsl:if test="$html_type = 'image'" >
                    <xsl:attribute name="alt">image</xsl:attribute>
                </xsl:if>
                -->

                <!-- ****** CHECKED ****** -->
                <xsl:if test="$html_type = 'radio' or $html_type = 'checkbox'">
                    <!--<xsl:if test="$default &lt; 0">-->
                        <!--<xsl:attribute name="checked"/> -->
                    <!--</xsl:if>-->
                </xsl:if>

                <!-- ****** DISABLED ****** -->
                <!-- not strictly necessary to disable (@preload & @calculate) fields but seems better -->
                <!--<xsl:if test="(local-name() = 'bind')">
                    <xsl:attribute name="disabled">disabled</xsl:attribute>
                </xsl:if>-->

                <!--<xsl:attribute name="form"/>-->
                <!--<xsl:attribute name="formaction"/>-->
                <!--<xsl:attribute name="formenctype"/>-->
                <!--<xsl:attribute name="formmethod"/>-->
                <!--<xsl:attribute name="formtarget"/>-->
                <!--<xsl:attribute name="height"/>-->
                <!--<xsl:attribute name="list"/>-->

                <!-- ****** MAX ****** -->
                <!-- DISABLED AS IT IS NOT SMART
                <xsl:variable name="operator1">&lt;</xsl:variable>
                <xsl:if test="contains($constraint, $operator1)">
                    <xsl:choose>
                        <xsl:when test="$html_type = 'number'">
                            <xsl:attribute name="max">
                                <xsl:variable name="max" select="exsl:node-set($constraintTokens)/token[contains(text(), $operator1)]/following-sibling::*/text()"/>
                                <xsl:choose>
                                    <xsl:when test="(string-length($max) &gt; 0) and (number($max) = $max)" >
                                        <xsl:value-of select="$max" />
                                        <xsl:if test="not(contains($constraint, concat($operator1,'=')))">
                                            <xsl:message>WARNING [<xsl:value-of select="$nodeset"/>] max constraint operator1 was changed from <xsl:value-of select="$operator1" /> to <xsl:value-of select="concat($operator1, '=')" />.</xsl:message>
                                        </xsl:if>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <xsl:message>ERROR [<xsl:value-of select="$nodeset"/>] could not process 'max' constraint with value <xsl:value-of select="$max" /> (ignored).</xsl:message>
                                     </xsl:otherwise>
                                </xsl:choose>
                            </xsl:attribute>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:message>NO SUPPORT [<xsl:value-of select="$nodeset"/>] max constraint value is not supported for this data type (ignored).</xsl:message>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:if>
                -->

                <!-- ****** MAXLENGTH ****** -->
                <!--<xsl:attribute name="maxlength"/>--><!-- ODK describes this as a regex pattern, for now ignore this attribute and copy pattern to pattern attribute -->

                <!-- ****** MIN ****** -->
                <!-- DISABLED AS IT IS NOT SMART
                <xsl:variable name="operator2">&gt;</xsl:variable>
                <xsl:if test="contains($constraint, $operator2)">
                    <xsl:choose>
                        <xsl:when test="$html_type = 'number'">
                            <xsl:attribute name="min">
                                <xsl:variable name="min" select="exsl:node-set($constraintTokens)/token[contains(text(), $operator2)]/following-sibling::*/text()"/>
                                <xsl:choose>
                                    <xsl:when test="(string-length($min) &gt; 0) and (number($min) = $min)" >
                                        <xsl:value-of select="$min" />
                                        <xsl:if test="not(contains($constraint, concat($operator2,'=')))">
                                            <xsl:message >WARNING [<xsl:value-of select="$nodeset"/>] min constraint operator2 was changed from <xsl:value-of select="$operator2" /> to <xsl:value-of select="concat($operator2, '=')" />.</xsl:message>
                                        </xsl:if>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <xsl:message>ERROR [<xsl:value-of select="$nodeset"/>] could not process 'min' constraint with value.<xsl:value-of select="$min" /> </xsl:message>
                                    </xsl:otherwise>
                                </xsl:choose>
                            </xsl:attribute>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:message>NO SUPPORT [<xsl:value-of select="$nodeset"/>] min constraint value is not supported for this data type (ignored).</xsl:message>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:if>
                -->

                <!-- ****** MULTIPLE ****** -->
                <!--<xsl:attribute name="multiple"/>--><!-- for type=email or file -->

                <!-- name attribute is the nodeset (path/to/data) for non-select input fields -->
                <xsl:attribute name="name">
                    <xsl:value-of select="$nodeset"/>
                </xsl:attribute>

                <!-- ****** PATTERN ****** -->
                <!-- DISABLED AS IT IS NOT SMART
                <xsl:if test="contains($constraint, 'regex')">
                    <xsl:attribute name="pattern">
                        <xsl:choose>
                            <xsl:when test="contains($constraint, '&quot;')">
                                <xsl:variable name="pattern" select="substring-before(substring-after($constraint, '&quot;'), '&quot;')" />
                                <xsl:value-of select="$pattern" />
                            </xsl:when>
                            <xsl:when test='contains($constraint, "&apos;")'>
                                <xsl:variable name="pattern" select='substring-before(substring-after($constraint, "&apos;"), "&apos;")' />
                                <xsl:value-of select="$pattern" />
                            </xsl:when>
                            <xsl:otherwise>
                                <xsl:message>ERROR [<xsl:value-of select="$nodeset"/>] unable to extract regex pattern from '<xsl:value-of select="$constraint" /> (ignored).'</xsl:message>
                            </xsl:otherwise>
                        </xsl:choose>
                    </xsl:attribute>
                </xsl:if>
                -->

                <!-- ****** PLACEHOLDER ****** -->
                <!--<xsl:attribute name="placeholder"/> could be used for short form of hint string in future -->

                <!-- ****** READONLY ****** -->
                <xsl:if test="string-length($binding/@readonly) &gt;0">
                    <xsl:choose>
                        <xsl:when test="$binding/@readonly = 'true()'" >
                            <xsl:attribute name="readonly">readonly</xsl:attribute>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:message>ERROR [<xsl:value-of select="$nodeset"/>] unknown value for readonly attribute (ignored).</xsl:message>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:if>

                <!-- ****** REQUIRED ****** -->
                <xsl:if test="($binding/@required = 'true()') and (not(local-name() = 'bind'))">
                    <xsl:attribute name="required">
                        <xsl:text>required</xsl:text>
                    </xsl:attribute>
                </xsl:if>

                <!-- ****** SIZE ****** -->
                <!--<xsl:attribute name="size"/>-->

                <!-- ****** SRC ****** -->
                <!--<xsl:attribute name="src"/>-->

                <!-- ****** STEP ****** -->
                <!--<xsl:attribute name="step"/>-->

                <!-- ****** TYPE ****** -->
                <xsl:if test="not($element='textarea')">
                    <xsl:attribute name="type">
                        <xsl:value-of select="$html_type" />
                    </xsl:attribute>
                </xsl:if>



                <!-- ****** VALUE ****** -->
                <xsl:if test="local-name() = 'item'"><!-- add test for 'if default value exists' -->
                    <xsl:attribute name="value">
                        <xsl:value-of select="xf:value"/>
                    </xsl:attribute>
                </xsl:if>

                <!--<xsl:attribute name="width"/>-->

                <!-- ** the following are custom attributes to store NON-HTML5 preload, skip and repeat logic and other javarosa-style bindings **-->
                
                <!-- ****** CONSTRAINT ****** -->
                <!-- it is not feasible to reliably extract min, max, pattern from the constraint attribute if this contains a complex expression e.g.(if(/data/a = 'this', (. &lt; 50), (regex(., /#$#@$@/))))-->
                <!-- ****** CALCULATE ****** -->
                <xsl:if test="string-length($binding/@constraint) &gt; 0">
                     <xsl:attribute name="data-constraint">
                         <xsl:value-of select="$binding/@constraint" />
                     </xsl:attribute>
                </xsl:if>
    
                <!-- ****** CALCULATE ****** -->
                <xsl:if test="string-length($binding/@calculate) &gt; 0">
                     <xsl:attribute name="data-calculate">
                         <xsl:value-of select="$binding/@calculate" />
                     </xsl:attribute>
                </xsl:if>

                <!-- ****** PRELOAD ****** -->
                <xsl:if test="string-length($binding/@jr:preload) &gt; 0">
                    <xsl:choose>
                        <xsl:when test="not( $binding/@jr:preload = 'patient' )" >
                            <xsl:attribute name="data-preload">
                                <xsl:value-of select="./@jr:preload"/>
                            </xsl:attribute>
                            <xsl:attribute name="data-preload-params">
                                <xsl:value-of select="./@jr:preloadParams"/>
                            </xsl:attribute>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:message>NO SUPPORT: Patient preload item is not supported (ignored).</xsl:message>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:if>

                <!-- ****** DATA TYPE ****** -->
                <xsl:attribute name="data-type-xml">
                    <xsl:value-of select="$xml_type"/>
                </xsl:attribute>

                <!-- ****** SKIP LOGIC ****** -->
                <xsl:if test="string-length($binding/@relevant) &gt; 0">
                    <xsl:attribute name="data-relevant">
                        <xsl:value-of select="$binding/@relevant"/>
                    </xsl:attribute>
                </xsl:if>

                <!-- avoid self-closing textarea -->
                <xsl:if test="$element='textarea'">
                    <xsl:text> </xsl:text>
                </xsl:if>
            </xsl:element>
        </label>
    </xsl:template>

    <xsl:template match="xf:item" mode="select-option">
        <xsl:variable name="label_translations">
            <xsl:apply-templates select="xf:label" />
        </xsl:variable>
        <xsl:variable name="value">
            <xsl:choose>
                <xsl:when test="string(xf:value) and not(contains(xf:value, ' '))">
                    <xsl:value-of select="xf:value" />
                </xsl:when>
                <xsl:otherwise>
                    <xsl:if test="contains(xf:value, ' ')">
                        <xsl:message terminate="yes">ERROR: Select item found with a value that contains spaces!</xsl:message>
                    </xsl:if>
                    <xsl:if test="not(string(xf:value))">
                        <xsl:message terminate="no">WARNING: Select item found without a value!</xsl:message>
                    </xsl:if>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <option>
            <!--<xsl:variable name="default">

            </xsl:variable>-->
            <xsl:if test="2 &lt; 1"><!-- IF READONLY? -->
                <xsl:attribute name="disabled"></xsl:attribute>
            </xsl:if>
            <!--<xsl:attribute name="label"/>-->
           <!-- <xsl:if test="string($default)">
                <xsl:attribute name="selected">selected</xsl:attribute>
            </xsl:if>-->
            <xsl:attribute name="value">
                <xsl:choose>
                    <xsl:when test="string($value)">
                        <xsl:value-of select="$value" />
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:message>ERROR: Could not determine value of list option.</xsl:message>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:attribute>
            <!-- better to use default language if defined and otherwise span[1] -->
            <xsl:choose>
                <xsl:when test="exsl:node-set($label_translations)/span[@lang=$default-lang]">
                    <xsl:value-of select="exsl:node-set($label_translations)/span[@lang=$default-lang] " />
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="exsl:node-set($label_translations)/span[1] " />
                </xsl:otherwise>
            </xsl:choose>

        </option>
        <xsl:for-each select="exsl:node-set($label_translations)/span" >
            <span>
                <xsl:attribute name="data-option-value">
                    <xsl:value-of select="$value" />
                </xsl:attribute>
                <xsl:attribute name="lang">
                    <xsl:value-of select="@lang" />
                </xsl:attribute>
                <xsl:value-of select="."/>
            </span>
        </xsl:for-each>
    </xsl:template>


    <xsl:template match="xf:select | xf:select1">
        <xsl:variable name="nodeset_used">
            <xsl:call-template name="nodeset_used" />
        </xsl:variable>
        <xsl:variable name="nodeset">
            <xsl:call-template name="nodeset_absolute">
                <xsl:with-param name="nodeset_u" select="$nodeset_used"/>
            </xsl:call-template>
        </xsl:variable>

        <xsl:variable name="binding" select="/h:html/h:head/xf:model/xf:bind[@nodeset=$nodeset_used] | /h:html/h:head/xf:model/xf:bind[@nodeset=$nodeset]" />

        <!-- using 'appearance' attribute to decide whether to use radiobuttons and checkboxes or pulldown lists -->
        <xsl:choose>
            <!--<xsl:when test="count(xf:item) &gt; 4">-->
            <xsl:when test="@appearance = 'minimal' or @appearance = 'autocomplete'">
                <xsl:variable name="options">
                    <xsl:apply-templates select="xf:item" mode="select-option" />
                </xsl:variable>
                <!-- **** test -->
                
                <!-- *** end test -->
                <label>
                    <!--<xsl:if test="@appearance">-->
                        <xsl:attribute name="class">
                            <xsl:call-template name="appearance" />
                        </xsl:attribute>
                    <!--</xsl:if>-->
                    <xsl:apply-templates select="$binding/@jr:constraintMsg" />
                    <xsl:apply-templates select="xf:label" />
                    <xsl:apply-templates select="xf:hint" />
                    <select>
                        <!--**<xsl:attribute name="autofocus" />**-->
                        <xsl:if test="2 &lt; 1">
                            <xsl:attribute name="disabled" /><!-- ADD THIS FUNCTIONALITY! -->
                        </xsl:if>
                        <!--**<xsl: attribute name="form" />**-->
                        <xsl:if test="local-name() = 'select'">
                            <xsl:attribute name="multiple">multiple</xsl:attribute>
                        </xsl:if>
                        <xsl:attribute name="name">
                        	<xsl:value-of select="$nodeset" />
                        </xsl:attribute>
                        <xsl:if test="$binding/@required">
                            <xsl:attribute name="required">required</xsl:attribute>
                        </xsl:if>
                        <!-- ****** CONSTRAINT ****** -->
                        <xsl:if test="string-length($binding/@constraint) &gt; 0">
                            <xsl:attribute name="data-constraint">
                                <xsl:value-of select="$binding/@constraint" />
                            </xsl:attribute>
                        </xsl:if>
                        <!--**<xsl:attribute name="size" />**-->
                        <!-- ****** SKIP LOGIC ****** -->
		                <xsl:if test="string-length($binding/@relevant) &gt; 0">
		                    <xsl:attribute name="data-relevant">
                                <xsl:value-of select="$binding/@relevant"/>
                            </xsl:attribute>
		                </xsl:if>
                        <!-- add empty first option for select1 -->
                        <xsl:if test="local-name() = 'select1'">
                            <option value="">...</option>
                        </xsl:if>
                        <xsl:for-each select="exsl:node-set($options)/option">
                            <xsl:copy-of select="."/>
                        </xsl:for-each>
                    </select>
                    <xsl:if test="$translated = 'true'">
                        <span class="jr-option-translations" style="display:none;">
                            <xsl:for-each select="exsl:node-set($options)/span">
                                <xsl:copy-of select="." />
                            </xsl:for-each>
                            <!--<xsl:apply-templates select="xf:item/xf:label" />-->
                        </span>
                    </xsl:if>
                </label>
            </xsl:when>
            <xsl:otherwise>
                <fieldset>
                    <xsl:if test="@appearance">
                        <xsl:attribute name="class">
                            <xsl:call-template name="appearance" />
                        </xsl:attribute>
                    </xsl:if>
                    <legend>
                        <xsl:apply-templates select="$binding/@jr:constraintMsg" />
                        <xsl:apply-templates select="xf:label" />
                        <xsl:apply-templates select="xf:hint" />
                    </legend>
                    <xsl:apply-templates select="xf:item" />
                </fieldset>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template match="xf:label | xf:hint | xf:bind/@jr:constraintMsg">
        <xsl:variable name="class">
            <xsl:if test="local-name() = 'constraintMsg'">
                <xsl:value-of select="string('jr-constraint-msg')" />
            </xsl:if>
            <xsl:if test="local-name() = 'hint'">
                <xsl:value-of select="string('jr-hint')" />
            </xsl:if>
            
        </xsl:variable>
        <xsl:choose>
            <xsl:when test="not(string(./@ref)) and string(.) and not(contains(.,'itext('))">
                <span lang="">                    
                    <xsl:attribute name="class">
                        <xsl:value-of select="$class" />
                    </xsl:attribute>
                    <xsl:call-template name="text-content" />
                </span>
            </xsl:when>
            <xsl:otherwise>
                <xsl:variable name="ref">
                   <xsl:choose>
                        <xsl:when test="@ref">
                            <xsl:value-of select="@ref" />
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:value-of select="." />
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:variable>
                
                <xsl:variable name="refid"
                    select="substring(substring-after($ref, 'itext('),2,string-length(substring-after($ref, 'itext('))-3)"/>
                <xsl:if test="not(//xf:itext/xf:translation/xf:text[@id=$refid])">
                    <xsl:message>ERROR: itext(id) found with non-existing id: "<xsl:value-of select="$refid"/>". Maybe itext(path/to/node) construct was used, which is not yet supported.</xsl:message>
                </xsl:if>
                <!--<xsl:variable name="apos" select='"&apos;"' />
                <xsl:choose> 
                    <xsl:when test="contains($refid, $apos)">-->
                        <xsl:call-template name="translations">
                            <xsl:with-param name="id" select="$refid"/>
                            <xsl:with-param name="class" select="$class"/>
                        </xsl:call-template>
                   <!-- </xsl:when>
                   
                    <xsl:otherwise>
                        <span class="jr-output">
                            <xsl:attribute name="data-value">
                                <xsl:value-of select="$refid"/>
                            </xsl:attribute>
                            <xsl:text>
                            </xsl:text>
                        </span>
                    </xsl:otherwise>
                </xsl:choose>-->
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template match="xf:trigger">
        <fieldset class="trigger" style="">
            <xsl:variable name="nodeset_used">
                <xsl:call-template name="nodeset_used" />
            </xsl:variable>
            <!--<xsl:if test="string(@ref)">-->
            <xsl:if test="string($nodeset_used)">
                <!-- the correct absolute nodeset as used in HTML -->
                <xsl:variable name="nodeset">
                     <xsl:call-template name="nodeset_absolute">
                         <xsl:with-param name="nodeset_u" select="$nodeset_used"/>
                     </xsl:call-template>
                </xsl:variable>
               
                <!-- note that bindings are not required -->
                <xsl:variable name="binding" select="/h:html/h:head/xf:model/xf:bind[@nodeset=$nodeset_used] | /h:html/h:head/xf:model/xf:bind[@nodeset=$nodeset]" />           
                <!--<xsl:variable name="nodeset" select="@ref" />-->
                <xsl:attribute name="name">
                    <!--<xsl:value-of select="@ref"/>-->
                    <xsl:value-of select="$nodeset"/>
                </xsl:attribute>
                <!--<xsl:if test="/h:html/h:head/xf:model/xf:bind[@nodeset=$nodeset]/@relevant">-->
                <xsl:if test="$binding/@relevant">
                    <xsl:attribute name="data-relevant">
                        <!--<xsl:value-of select="/h:html/h:head/xf:model/xf:bind[@nodeset=$nodeset]/@relevant" />-->
                        <xsl:value-of select="$binding/@relevant"/>
                    </xsl:attribute>
                </xsl:if>
            </xsl:if>
        	<xsl:apply-templates select="xf:label | xf:hint" />
        </fieldset>
        <xsl:message>WARNING: Trigger(s) added but but with little support. Please test to make sure they do what you want.</xsl:message>
    </xsl:template>

     <xsl:template match="xf:output">
        <span class="jr-output">
            <xsl:variable name="itext"
                    select="substring(substring-after(@value, 'itext('),2,string-length(substring-after(@value, 'itext('))-3)"/>
            <xsl:attribute name="data-value">
                <!-- this is just a quick hack! Need a robust itext processor that can make a distinction 
                between id and node and figure out with instance to take node from with multiple instances -->
                <xsl:choose>
                    <xsl:when test="string-length($itext) > 0" >
                        <xsl:value-of select="$itext"/>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:value-of select="@value"/>
                    </xsl:otherwise>
                </xsl:choose>    
            </xsl:attribute>
            <xsl:text><!-- avoids self-closing tags on empty elements -->
            </xsl:text>
        </span>
    </xsl:template>

    <xsl:template name="text-content">
        <xsl:if test="string-length(.) = 0">
            <xsl:text><!-- avoids self-closing tags on empty elements -->
            </xsl:text>
        </xsl:if>
        <xsl:apply-templates /><!-- call xf:output template if output is present -->
    </xsl:template>

    <xsl:template name="translations">
        <xsl:param name="id"/>
        <xsl:param name="class"/>
        <xsl:for-each select="//xf:itext/xf:translation/xf:text[@id=$id]">
            <xsl:variable name="lang" select="ancestor::xf:translation/@lang"/>
            <xsl:for-each select="xf:value" >
                <!--<xsl:if test="string-length(.) &gt; 0">-->
                    <xsl:choose>
                        <xsl:when test="@form = 'long' or @form = 'short' or not(@form) ">
                            <span>
                                <xsl:if test="string($lang)" >
                                    <xsl:attribute name="lang">
                                        <xsl:value-of select="$lang"/>
                                    </xsl:attribute>
                                </xsl:if>
                                <xsl:if test="string($class)">
                                    <xsl:attribute name="class">
                                        <xsl:value-of select="$class" />
                                    </xsl:attribute>
                                </xsl:if>
                                <xsl:if test="@form">
                                    <xsl:attribute name="class">
                                        <xsl:value-of select="concat(' jr-form-', @form)" />
                                    </xsl:attribute>
                                </xsl:if>
                                <!--<xsl:if test="@form = 'short'" >
                                    <xsl:attribute name="style">display:none;</xsl:attribute>
                                </xsl:if>-->
                                <xsl:call-template name="text-content" />
                            </span>
                        </xsl:when>
                        <xsl:when test="@form = 'image'" >
                            <img>
                                <xsl:attribute name="src">
                                    <xsl:call-template name="strip_namespace_media">
                                        <xsl:with-param name="string" select="." />
                                    </xsl:call-template>
                                </xsl:attribute>
                                <xsl:attribute name="alt">image</xsl:attribute>
                            </img>
                        </xsl:when>
                        <xsl:when test="@form = 'audio' ">
                            <audio controls="controls">
                                <xsl:attribute name="src">
                                    <xsl:call-template name="strip_namespace_media">
                                        <xsl:with-param name="string" select="." />
                                    </xsl:call-template>
                                </xsl:attribute>
                                <xsl:text>Your browser does not support HTML5 audio.</xsl:text>
                            </audio>
                        </xsl:when>
                        <xsl:when test="@form = 'video' ">
                            <video controls="controls">
                                <xsl:attribute name="src">
                                    <xsl:call-template name="strip_namespace_media">
                                        <xsl:with-param name="string" select="." />
                                    </xsl:call-template>
                                </xsl:attribute>
                                <xsl:text>Your browser does not support HTML5 video.</xsl:text>
                            </video>
                        </xsl:when>
                    </xsl:choose>
                <!--</xsl:if>-->
            </xsl:for-each>
        </xsl:for-each>
    </xsl:template>

    <xsl:template name="strip_namespace">
        <xsl:param name="string" />
        <xsl:choose>
            <xsl:when test="contains($string, ':')" >
                <!-- crude check, should be improved -->
                <xsl:value-of select="substring-after($string, ':')" />
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="$string" />
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="strip_namespace_media">
        <xsl:param name="string" />
        <xsl:variable name="stripped_string">
            <xsl:call-template name="strip_namespace">
                <xsl:with-param name="string" select="$string" />
            </xsl:call-template>
        </xsl:variable>
        <xsl:choose>
            <xsl:when test="starts-with($stripped_string, '//images/')">
                <xsl:value-of select="substring-after($stripped_string, '//images/')"/>
            </xsl:when>
            <xsl:when test="starts-with($stripped_string, '//video/')">
                <xsl:value-of select="substring-after($stripped_string, '//video/')"/>
            </xsl:when>
            <xsl:when test="starts-with($stripped_string, '//audio/')">
                <xsl:value-of select="substring-after($stripped_string, '//audio/')"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="$stripped_string"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="languages">
        <xsl:for-each select="//xf:itext/xf:translation" >
            <a href="#">
                <xsl:attribute name="lang">
                    <xsl:value-of select="@lang"/>
                </xsl:attribute>
                <!--<xsl:value-of select="@lang" />REMOVED FOR RAPAIDE, BUT SHOULD BE RE-ADDED FOR GENERIC APP-->
            </a>
            <xsl:text> </xsl:text>
        </xsl:for-each>
    </xsl:template>

    <!-- future support for itext node parameters -->
    <xsl:template name="itext-helper">

    </xsl:template>

    <xsl:template name="node-path-helper">
        <xsl:param name="input-node"/>
        <xsl:choose>
            <xsl:when test="$input-node/@bind">
                <xsl:variable name="id" select="$input-node/@bind" />
                <xsl:value-of select="/h:html/h:head/xf:model/xf:bind[@id=$id]/@nodeset"/>
            </xsl:when>
            <xsl:when test="$input-node/@ref or $input-node/@nodeset">
                <xsl:variable name="path" select="$input-node/@ref | $input-node/@nodeset" />
                <xsl:variable name="inputname" select="local-name()"/>
                <xsl:if test="not(substring($path, 1, 1) = '/') and not(parent::h:body)" >
                    <!-- path is relative, so we need context -->
                    <!--<xsl:choose>-->
                    	<!-- should ancestor:: be replaced with parent:: ??? TEST -->
                       <!-- <xsl:when test="parent::xf:repeat/@nodeset">
                            <xsl:value-of select="concat(ancestor::xf:repeat/@nodeset, '/')" />
                        </xsl:when>
                        <xsl:when test="parent::xf:repeat/@ref">
                            <xsl:value-of select="concat(ancestor::xf:repeat/@ref, '/')" />
                        </xsl:when>
                        <xsl:when test="parent::xf:group/@nodeset">
                            <xsl:value-of select="concat(ancestor::xf:group/@nodeset, '/')" />
                        </xsl:when>
                        <xsl:when test="parent::xf:group/@ref">
                            <xsl:value-of select="concat(ancestor::xf:group/@ref, '/')" />
                        </xsl:when>-->
                        <!-- and use top level instance node, if the ancestor is h:body -->
                        <!--<xsl:when test="parent::h:body">-->
                      		<!-- start with the top level element of the instance, e.g. /data/ -->
            			<!--	<xsl:value-of select="concat('/', local-name(//xf:instance/child::*[1]), '/')" />-->
            				<!--<xsl:message>INFO: tried to add top level node of instance:<xsl:value-of select="local-name(//xf:instance/child::*[1])"/></xsl:message>-->
            			<!--</xsl:when>-->
                        <!--<xsl:otherwise>
                            <xsl:message>ERROR: Could not determine context node for relative path.</xsl:message>
                        </xsl:otherwise>
                    </xsl:choose>-->
                    <xsl:for-each select="ancestor::*">
                       <!-- <xsl:if test="not(substring($path, 1, 1) = '/') and not(local-name() = 'body') ">-->
                       
                        <!--<xsl:message>ancestor: <xsl:value-of select="local-name()" /></xsl:message>-->
                        <xsl:if test="(local-name() = 'repeat' or local-name() = 'group')">
                                
                                <!--substring(@nodeset, 1, 1) = '/' or substring(@ref, 1, 1) = '/' 
                                        )">-->
                            <!--<xsl:for-each select="descendant::*">
                                <xsl:if test="local-name() = 'group' or local-name() = 'repeat'">-->
                                <xsl:if test="string-length(@ref)>0 or string-length(@nodeset)>0">
                                    <xsl:value-of select="concat(@ref,@nodeset, '/')" />
                                </xsl:if>
                            <!--    </xsl:if>        
                            </xsl:for-each>-->
                            <!-- not totally foolproof (will fail if nested group use both local and absolute paths) but probably okay, test this with multiple nested groups -->
                        </xsl:if>
                        <!--</xsl:if>-->
                    </xsl:for-each>
                </xsl:if>
                <xsl:value-of select="$path"/>
            </xsl:when>
            <!--<xsl:otherwise>
                <xsl:message>ERROR: Could not determine node path for <xsl:value-of select="local-name($input-node)" /></xsl:message>
            </xsl:otherwise>-->
        </xsl:choose>
    </xsl:template>

    <!--<xsl:template name="one-step-back">
        <xsl:param name="path" />
        <xsl:param name="node" />
        <xsl:variable name="newpath">
            <xsl:choose>
                <xsl:when test="parent::xf:repeat/@nodeset">
                    <xsl:value-of select="concat(ancestor::xf:repeat/@nodeset, '/', $path)" />
                </xsl:when>
                <xsl:when test="parent::xf:repeat/@ref">
                    <xsl:value-of select="concat(ancestor::xf:repeat/@ref, '/', $path)" />
                </xsl:when>
                <xsl:when test="parent::xf:group/@nodeset">
                    <xsl:value-of select="concat(ancestor::xf:group/@nodeset, '/', $path)" />
                </xsl:when>
                <xsl:when test="parent::xf:group/@ref">
                    <xsl:value-of select="concat(ancestor::xf:group/@ref, '/', $path)" />
                </xsl:when>
                <xsl:otherwise>
                    strictly speaking, if the parent group or repeat doesn't have a ref/nodeset, we should go
                    one level higher. Not implemented here. 
                    <xsl:message>ERROR: Could not determine context node for relative path.</xsl:message>
                </xsl:otherwise>
            <xsl:choose>
        </xsl:variable>
        <xsl:if test="not(substring($path, 1, 1) = '/') and not(parent::h:body)">
            <xsl:call-template name="one-step-back" >
                <xsl:with-param name="path" select="$newpath"/>
                <xsl:with-param name="node" select="parent::*"/>
            </xsl:call-template>
        </xsl:if>
        <xsl:value-of select="$newpath" />
    </xsl:template>-->
    

    <xsl:template name="nodeset_used">
        <xsl:choose>
            <!-- first the simplest case (for preload or calculated fields taken from bind elements) -->
            <xsl:when test="local-name() = 'bind'">
            	<!--<xsl:choose>-->
            		<!-- if nodeset value is relative -->
            		<!--<xsl:when test="not(substring(./@nodeset, 1, 1) = '/')">-->
            			<!-- start with the top level element of the instance, e.g. /data/ -->
            		<!--	<xsl:value-of select="concat('/', local-name(//xf:instance/child::*[1]), '/')" />
            		</xsl:when>
            		<xsl:otherwise />
            	</xsl:choose>-->
                <xsl:value-of select="./@nodeset"/>
            </xsl:when>
            <!-- then for input elements -->
            <xsl:otherwise>
                <xsl:variable name="intermediate">
                    <xsl:choose>
                        <xsl:when test="local-name(..) = 'select1' or local-name(..) = 'select'">
                            <xsl:call-template name="node-path-helper">
                                <xsl:with-param name="input-node" select=".." />
                            </xsl:call-template>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:call-template name="node-path-helper">
                                <xsl:with-param name="input-node" select="." />
                            </xsl:call-template>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:variable>
                <!-- now strip anything preceding a // which occurs e.g. in widgets.xml-->
                <!-- note that this goes only 1 level deep so is not reliable enough -->
                <xsl:choose>
                    <xsl:when test="contains($intermediate, '//')">
                        <xsl:value-of select="concat('/', substring-after($intermediate, '//'))"/>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:value-of select="$intermediate"/>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="nodeset_absolute">
        <xsl:param name="nodeset_u"/>
        <xsl:variable name="nodeset_a">
            <xsl:choose>
                <xsl:when test="not(substring($nodeset_u, 1, 1) = '/')">
                    <xsl:value-of select="concat('/', local-name(//xf:instance/child::*[1]), '/', $nodeset_u)"/>
            <!--<xsl:message terminate="yes">ERROR: Could not determine absolute path/to/instance/node (terminated transformation), found: <xsl:value-of select="$nodeset" />.</xsl:message>-->
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="$nodeset_u" />
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:if test="not($nodeset_u = $nodeset_a)">
            <!--<xsl:message>INFO: changed relative nodeset: <xsl:value-of select="$nodeset_u"/> to: <xsl:value-of select="$nodeset_a" /></xsl:message>-->
        </xsl:if>
        <xsl:value-of select="$nodeset_a"/>
    </xsl:template>

   <!-- <xsl:template name="xml_type">
        <xsl:param name="nodeset" />
        <xsl:variable name="xml_type">
            <xsl:value-of select="/h:html/h:head/xf:model/xf:bind[@nodeset=$nodeset]/@type" />
        </xsl:variable>
        <xsl:choose>
            <xsl:when test="string-length($xml_type) &lt; 1" >string</xsl:when>
            <xsl:otherwise>
                <xsl:call-template name="strip_namespace">
                    <xsl:with-param name="string">
                        <xsl:value-of select="$xml_type"/>
                    </xsl:with-param>
                </xsl:call-template>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>-->

    <xsl:template name="html_type">
        <xsl:param name="xml_type" />
        <xsl:choose>
            <xsl:when test="local-name(..) = 'select1'">radio</xsl:when>
            <xsl:when test="local-name(..) = 'select'">checkbox</xsl:when>
            <xsl:when test="local-name() = 'bind'">hidden</xsl:when>
            <xsl:when test="$xml_type = 'dateTime'">datetime</xsl:when>
            <xsl:when test="$xml_type = 'date'">date</xsl:when>
            <!-- note, it may not actually be possible to support 'file' with offline storage -->
            <xsl:when test="$xml_type = 'binary'">file</xsl:when>
            <xsl:when test="$xml_type = 'time'">time</xsl:when>
            <xsl:when
                test="$xml_type = 'decimal' or $xml_type = 'float' or $xml_type = 'double' or $xml_type = 'int' or $xml_type = 'integer'"
                >number</xsl:when>
            <xsl:when test="$xml_type = 'string'">text</xsl:when>
            <!-- temporary -->
            <xsl:when test="$xml_type = 'barcode' or $xml_type = 'geopoint'" >
                <xsl:value-of select="string('text')" />
            </xsl:when>
            <!-- ********* -->
            <xsl:otherwise>
                <xsl:value-of select="$error"/>
                <xsl:message terminate="no">ERROR: Unsupported data type '<xsl:value-of select="$xml_type"/>' found.</xsl:message>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
</xsl:stylesheet>