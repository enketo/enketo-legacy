<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xf="http://www.w3.org/2002/xforms" 
    xmlns:h="http://www.w3.org/1999/xhtml"
    xmlns:ev="http://www.w3.org/2001/xml-events" 
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:jr="http://openrosa.org/javarosa" 
    xmlns:exsl="http://exslt.org/common"
    extension-element-prefixes="exsl"
    version="1.0"
    >
    <!-- 
    *****************************************************************************************************
    XSLT Stylesheet that copies the instance from Kobo and ODK (X)Forms
    version:    0.1
    author:     Martijn van de Rijdt (Aid Web Solutions) 
    contact:    info@aidwebsolutions.com
    thanks to:  OpenRosa Consortium, Kobo Project and Open Data Kit
    copyright:  Aid Web Solutions - aidwebsolutions.com
    *****************************************************************************************************
    -->
    <xsl:output method="xml" indent="yes" omit-xml-declaration="yes" version="1.0" encoding="UTF-8" />
    
    <!--<xsl:template match="//xf:instance[1]/node()|@*"-->

    <xsl:template match="/">
    	<root>
            <model>
        	   <xsl:apply-templates select="//xf:model/xf:instance"/>
            </model>
        </root>
    </xsl:template>

    <xsl:template match="node()|@*" name="identity">
        <xsl:copy>
            <xsl:apply-templates select="node()|@*"/>
        </xsl:copy>
    </xsl:template>

    <xsl:template match="comment()"/>

</xsl:stylesheet>