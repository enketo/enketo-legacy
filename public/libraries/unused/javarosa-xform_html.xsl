<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xf="http://www.w3.org/2002/xforms" 
    xmlns:h="http://www.w3.org/1999/xhtml"
    xmlns:ev="http://www.w3.org/2001/xml-events" 
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:jr="http://openrosa.org/javarosa" version="1.0"
>

    <xsl:output method="xml" omit-xml-declaration="yes" version="1.0" encoding="UTF-8" indent="yes"/>

    <xsl:variable name="undefined">undefined</xsl:variable>
    <xsl:variable name="warning">warning</xsl:variable>
    <xsl:variable name="error">error</xsl:variable>
    
    <xsl:template match="/">
        <wrapper>
        <form>
            <xsl:attribute name="id">
                <xsl:value-of select="translate(/h:html/h:head/xf:model/xf:instance/child::node()/@id, ' ', '_' )" /><!-- not smart! -->
                <!-- replace with subdomain?? -->
            </xsl:attribute>
            <h2 id="form-title">
                <xsl:value-of select="/h:html/h:head/h:title"/>
            </h2>
            <ul id="form-languages">
                <xsl:apply-templates select="//xf:itext/xf:translation"/>
            </ul>
            <!-- create hidden input fields for preload items -->
            <xsl:if test="/h:html/h:head/xf:model/xf:bind[@jr:preload]" >
                <fieldset id="preload-items">
                    <xsl:apply-templates select="/h:html/h:head/xf:model/xf:bind[@jr:preload]"/>
                </fieldset>
            </xsl:if>
            <xsl:apply-templates select="/h:html/h:body//xf:group | /h:html/h:body//xf:repeat"/>
            
        </form>
        </wrapper>
    </xsl:template>
    
    <!-- WHAT IF THERE IS NO GROUP ELEMENT?? -->
    <xsl:template match="xf:group | xf:repeat">
        <fieldset>
            <xsl:if test="local-name() = 'repeat'">
                <xsl:attribute name="name">
                    <xsl:value-of select="@nodeset"/>
                </xsl:attribute>
                <xsl:attribute name="data-repeat-max"/>
                <!-- ADD data-repeat-max value if exists-->
            </xsl:if>

            <xsl:if test="string(./xf:label/@ref) or string (./xf:label)">
                <h3>
                    <xsl:call-template name="label"/>
                </h3>
            </xsl:if>
            
            <!-- the select statement prevents template from applying twice if only child is <repeat> -->
            <xsl:apply-templates select="./xf:input | ./xf:upload | ./xf:select1 | ./xf:select" />

        </fieldset>
    </xsl:template>

    <!-- create input fields for select lists -->
    <xsl:template match="xf:select1 | xf:select">
        <fieldset>
            <legend>
                <xsl:call-template name="label"/>
            </legend>
            <xsl:apply-templates select="xf:item"/>
        </fieldset>
    </xsl:template>

    <xsl:template match="xf:bind[@jr:preload] | xf:input | xf:upload | xf:item ">
        <label>
            <xsl:if test="not(local-name() = 'bind')">
                <xsl:call-template name="label" />
            </xsl:if>
            <!--<xsl:choose>
                <xsl:when test="local-name() = 'select1' or local-name() = 'select'" >
                    <xsl:for-each select="xf:item">
                        <xsl:call-template name="input" />
                    </xsl:for-each>
                </xsl:when>
                <xsl:otherwise>-->
            <xsl:call-template name="input"/>
            <!--
                </xsl:otherwise>
            </xsl:choose>-->
        </label>
    </xsl:template>

    <xsl:template name="label">
        <xsl:choose>
            <xsl:when test="not(string(xf:label/@ref))">
                <span lang="">
                    <xsl:value-of select="xf:label"/>
                </span>
            </xsl:when>
            <xsl:otherwise>
                <xsl:variable name="ref" select="xf:label/@ref"/>
                <xsl:variable name="refid"
                    select="substring(substring-after($ref, 'itext('),2,string-length(substring-after($ref, 'itext('))-3)"/>

                <xsl:call-template name="translations">
                    <xsl:with-param name="id" select="$refid"/>
                </xsl:call-template>
                <!--label: <xsl:value-of select="//xf:itext/xf:translation[@lang=$language]/xf:text[@id=$refid]/xf:value" />-->
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="input">
        
        <xsl:variable name="nodeset">
            <xsl:choose>
                <!-- first the simplest case (for preload fields taken from bind elements) -->
                <xsl:when test="local-name() = 'bind'">
                    <xsl:value-of select="./@nodeset"/>
                </xsl:when>
                <xsl:otherwise>
                    <!-- if there is a preceding repeat element, the input refs may be local paths -->
                    <xsl:variable name="repeat_path">
                        <!--<xsl:if test="ancestor::xf:repeat and contains(@ref, ancestor::xf:repeat/@nodeset) = false()">-->
                        <xsl:if test="ancestor::xf:repeat and not(local-name()= 'item') and contains(./@ref, ancestor::xf:repeat/@nodeset) = false()">
                            <!--<xsl:message>
                                there is an ancestor repeat element, 
                                the current node (=<xsl:value-of select="local-name()" />)'s ref attribute (=<xsl:value-of select="./@ref" />) does not 
                                contain its nodeset path (=<xsl:value-of select="ancestor::xf:repeat/@nodeset" />), so ref is relative
                            </xsl:message>-->
                            <xsl:choose>
                                <xsl:when test="ancestor::xf:repeat/@nodeset" >                               
                                    <xsl:value-of select="concat(ancestor::xf:repeat/@nodeset, '/')" />
                                </xsl:when> 
                                <xsl:otherwise>
                                    <xsl:value-of select="$error" />
                                    <!-- used assumption that @ref contains data element name and ancestor::xf:repeat contains the path-->
                                    <xsl:message>problem determining path/to/repeatelement</xsl:message>
                                </xsl:otherwise>
                            </xsl:choose>                    
                        </xsl:if>
                    </xsl:variable>
                    
                    <xsl:choose>
                        <!-- for 'select' or 'select1' input -->
                        <xsl:when test="local-name(..) = 'select1' or local-name(..) = 'select'">
                            <xsl:choose>
                                <!-- Kobo -->
                                <xsl:when test="../@bind">
                                    <xsl:variable name="id" select="../@bind"/>
                                    <xsl:value-of select="$repeat_path" />
                                    <xsl:value-of select="/h:html/h:head/xf:model/xf:bind[@id=$id]/@nodeset"/>
                                </xsl:when>
                                <!-- ODK -->
                                <xsl:when test="../@ref">
                                    <xsl:value-of select="$repeat_path" />
                                    <xsl:value-of select="../@ref" />
                                </xsl:when>
                            </xsl:choose>
                        </xsl:when>
                        <!-- first preference for 'normal' input (Kobo) -->
                        <xsl:when test="@bind">
                            <xsl:variable name="id" select="./@bind"/>
                            <xsl:value-of select="$repeat_path" />
                            <xsl:value-of select="/h:html/h:head/xf:model/xf:bind[@id=$id]/@nodeset"/>
                        </xsl:when>
                        <!-- second preference for 'normal' input (ODK) -->
                        <xsl:when test="@ref">
                            <xsl:value-of select="$repeat_path" />
                            <xsl:value-of select="./@ref" />
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:value-of select="$error"/>
                            <xsl:message>could not retrieve nodeset value from element</xsl:message>
                        </xsl:otherwise>                       
                    </xsl:choose>                 
                </xsl:otherwise>               
            </xsl:choose>
        </xsl:variable>
        
        <xsl:variable name="xml_type">
            <!-- XML (Schema) datatype used in bindings -->
            <xsl:variable name="xml_type_ns">
                <xsl:value-of select="/h:html/h:head/xf:model/xf:bind[@nodeset=$nodeset]/@type" />
            </xsl:variable>
            <xsl:choose>
                <xsl:when test="contains($xml_type_ns, ':')" >
                    <!-- crude check to see if type is namespaced -->
                    <xsl:value-of select="substring-after($xml_type_ns, ':')" />
                </xsl:when>
                <xsl:when test="string-length($xml_type_ns) &lt; 1" >
                    <xsl:value-of select="$error" />
                    <xsl:message>could not find data type in binding for nodeset: <xsl:value-of select="$nodeset" /></xsl:message>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of  select="$xml_type_ns" /> 
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>

        <!-- HTML5 'type' attribute of input field-->
        <xsl:variable name="html_type">  
            <xsl:choose>
                <!-- add ALL binding types (text remains last)-->
                <xsl:when test="local-name(..) = 'select1'">radio</xsl:when>
                <xsl:when test="local-name(..) = 'select'">checkbox</xsl:when>
                <xsl:when test="$xml_type = 'dateTime'">datetime</xsl:when>
                <xsl:when test="$xml_type = 'date'">date</xsl:when>
                <!-- note, it may not actually be possible to support 'file' with offline storage -->
                <xsl:when test="$xml_type = 'binary'">file</xsl:when>
                <xsl:when test="$xml_type = 'dateTime'">datetime</xsl:when>
                <xsl:when test="$xml_type = 'time'">time</xsl:when>
                <xsl:when
                    test="$xml_type = 'decimal' or $xml_type = 'float' or $xml_type = 'double' or $xml_type = 'int'"
                    >number</xsl:when>
                <xsl:when test="$xml_type = 'string'">text</xsl:when>
                <!-- temporary -->
                <xsl:when test="$xml_type = 'barcode' or $xml_type = 'geopoint'" >
                    <xsl:value-of select="string('text')" />
                    <xsl:message>xml data type '<xsl:value-of select="$xml_type" />' set to 'text' and will be dealt with in javascript</xsl:message>
                </xsl:when>  
                <!-- ********* -->
                <xsl:otherwise>
                    <xsl:value-of select="$error"/>
                    <xsl:message terminate="no">unsupported data type '<xsl:value-of select="$xml_type"/>' found in binding for nodeset: <xsl:value-of select="$nodeset"/></xsl:message>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>

        <xsl:element name="input">
            
            <!-- NOTE: for repeated data id is used too. This therefore needs to be fixed if fields are cloned in javascript -->
            <!-- consider removing id completely and using the 'name' attribute for all fields... -->
            <!--<xsl:attribute name="id">
                <xsl:choose>
                    <xsl:when test="not(local-name()='item')" >
                        <xsl:value-of select="$nodeset"/>
                    </xsl:when>
                </xsl:choose>
            </xsl:attribute>-->
            <xsl:if test="$html_type = 'file'">
                <xsl:if test="2 &lt; 1">
                    <xsl:attribute name="accept">
                        <!-- if $xml_type = image then value is 'image/*' -->
                        <!-- if $xml_type = video then value is 'video/*' -->
                        <!-- if $xml_type = audio then value is 'audio/*' -->     
                    </xsl:attribute>
                </xsl:if>
            </xsl:if>
            <xsl:if test="$html_type = 'image'" >
                <xsl:attribute name="alt"/>
            </xsl:if>
            <xsl:if test="$html_type = 'radio' or $html_type = 'checkbox'">
                <xsl:attribute name="checked"/> <!-- **SUPPORT** -->
            </xsl:if>
            
            <!-- not strictly necessary to disable hidden (preload) fields but seems better -->
            <!-- could also consider doing this for items with skip logic -->
            <xsl:if test="local-name() = 'bind'">
                <xsl:attribute name="disabled">disabled</xsl:attribute>
            </xsl:if>
            
            <!-- **SUPPORT** -->
            <!--<xsl:attribute name="form"/>-->
            <!--<xsl:attribute name="formaction"/>-->
            <!--<xsl:attribute name="formenctype"/>-->
            <!--<xsl:attribute name="formmethod"/>-->
            <!--<xsl:attribute name="formtarget"/>-->
            <!--<xsl:attribute name="height"/>-->
            <!--<xsl:attribute name="list"/>-->
            <xsl:if test="2 &lt; 1">
                <xsl:attribute name="max"/><!-- **SUPPORT** -->
            </xsl:if>
                       
            <xsl:if test="2 &lt; 1">
                <xsl:attribute name="maxlength"/><!-- **SUPPORT** -->
            </xsl:if>
            
            <xsl:if test="2 &lt; 1">
                <xsl:attribute name="min"/> <!-- **SUPPORT** -->
            </xsl:if>
            
            <!--<xsl:attribute name="multiple"/>--><!-- for type=email or file -->
            
            <!-- name attribute is the nodeset (path/to/data) for non-select input fields -->
            <xsl:attribute name="name">
                <!--<xsl:choose>    
                    <xsl:when test="local-name() = 'item'">-->     
                        <xsl:value-of select="$nodeset"/>
                 <!--   </xsl:when>
                    <xsl:otherwise>
                        <xsl:value-of select="$undefined" />
                    </xsl:otherwise>
                 </xsl:choose>-->
            </xsl:attribute>
            
            <xsl:if test="2 &lt; 1">
                <xsl:attribute name="pattern"><!-- **SUPPORT** -->
                
                </xsl:attribute>
            </xsl:if>
            
            <!--<xsl:attribute name="placeholder"/> could be used for short form of hint string in future -->
            
            <xsl:if test="2 &lt; 1">
                <xsl:attribute name="readonly"/><!-- **SUPPORT** -->
            </xsl:if>
        
            <xsl:if test="string-length(/h:html/h:head/xf:model/xf:bind[@nodeset=$nodeset]/@required) &gt; 0">
                <xsl:attribute name="required">
                    <xsl:choose>
                        <xsl:when test="/h:html/h:head/xf:model/xf:bind[@nodeset=$nodeset]/@required = 'true()'">required</xsl:when>
                        <xsl:otherwise>
                            <xsl:value-of select="$error" />
                            <xsl:message>did not understand the 'required' attribute in binding for nodeset: <xsl:value-of select="$nodeset"/></xsl:message>
                        </xsl:otherwise>
                    </xsl:choose>        
               </xsl:attribute>
            </xsl:if>
            
            <xsl:if test="2 &lt; 1">
                <xsl:attribute name="size"/>
            </xsl:if>
            
            <!--<xsl:attribute name="src"/>-->
            
            <xsl:if test="2 &lt; 1">
                <xsl:attribute name="step"/><!-- **SUPPORT** -->
            </xsl:if>

            <xsl:attribute name="type">
                <!-- **SUPPORT** -->
                <xsl:value-of select="$html_type"/>
            </xsl:attribute>
            
            <xsl:if test="local-name() = 'item'"><!-- add test for 'if default value exists' -->
                <xsl:attribute name="value">
                    <xsl:value-of select="xf:value"/>
                </xsl:attribute>
            </xsl:if>
            
            <!--<xsl:attribute name="width"/>-->

            <!-- ** the following are custom attributes to store NON-HTML5 preload, skip and repeat logic and other javarosa-style bindings **-->
            <xsl:attribute name="data-type-xml">
                <xsl:value-of select="$xml_type"/>
            </xsl:attribute>
         
            <xsl:attribute name="data-preload">
                <xsl:if test="local-name() = 'bind'">
                    <xsl:value-of select="./@jr:preload"/>
                </xsl:if>
            </xsl:attribute>
            
            <xsl:attribute name="data-preload-params">
                <xsl:if test="local-name()='bind'">
                    <xsl:value-of select="./@jr:preloadParams"/>
                </xsl:if>
            </xsl:attribute>
            
            <xsl:attribute name="data-skip-logic"/>
            <!-- **SUPPORT** -->
            <xsl:attribute name="data-repeat-max"/>
            <!-- **SUPPORT** -->
            <xsl:attribute name="data-unsupported-bindings"/>
            <!-- **SUPPORT** -->


            <!-- ADD DEFAULT VALUE FROM INSTANCE -->
        </xsl:element>
        <!-- ADD HINTS -->
    </xsl:template>

    <xsl:template name="translations">
        <xsl:param name="id"/>
        <!--passed parameter: <xsl:value-of select="$id" />-->
        <xsl:for-each select="//xf:itext/xf:translation/xf:text[@id=$id]">
            <xsl:variable name="thislang" select="ancestor::xf:translation/@lang"/>
            <span>
                <xsl:if test="string-length($thislang) &gt; 1" >
                    <xsl:attribute name="lang">
                        <xsl:value-of select="$thislang"/>
                        <!-- ADD LONG AS WELL AS SHORT 'FORMS' OF THE STRINGS -->
                    </xsl:attribute>
                </xsl:if>    
                <xsl:value-of select="xf:value"/>
            </span>
        </xsl:for-each>
    </xsl:template>

    <xsl:template match="xf:translation">
        <li>
            <xsl:attribute name="lang">
                <xsl:value-of select="@lang"/>
            </xsl:attribute>
            <xsl:value-of select="@lang"/>
        </li>
    </xsl:template>


</xsl:stylesheet>
