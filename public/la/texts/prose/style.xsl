<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
<html>
	<head>
		<link rel="stylesheet" href="../style.css"/>
		<link rel="stylesheet" href="/docs/fa5.css"/>
		<script src="/docs/jquery.js"></script>
		<script src="../script.js"></script>
		<title><xsl:value-of select="page/title" /></title>
	</head>
<body>
	<center>
		<h2 class="title"><xsl:value-of select="page/title" /></h2>
		<i>&#8592; <a href="../">Back</a> | &#8595; <a href="#bottom">Bottom</a></i>
		<xsl:if test="/page/doclinks/link/text != ''">
			<xsl:for-each select="page/doclinks/link">
				| &#128279; <a class="doc_link">
				<xsl:attribute name="href"><xsl:value-of select="url" /></xsl:attribute>
				<xsl:value-of select="text" />
			</a>
			</xsl:for-each>
		</xsl:if>
	</center>
	<xsl:for-each select="page/line">
		<div class="line">
			<span class="line_number">Line <xsl:value-of select="number" /></span>
			<xsl:if test="note != ''">
				<span class="line_note"><i class="fas fa-exclamation-circle"></i> <xsl:value-of select="note" /></span>
			</xsl:if>
			<p class="latin"><xsl:value-of select="latin" /></p>
			<p class="eng"><xsl:value-of select="english" /></p>
			<a class="line-open" href="javascript:void(0)" onclick="line_open(this)">
				<xsl:attribute name="id">aopen<xsl:value-of select="number"/></xsl:attribute>
				<xsl:attribute name="no"><xsl:value-of select="number"/></xsl:attribute>
				<i class="br_1">+</i>
				View Notes
			</a>
			<a class="line-close" hidden="true" href="javascript:void(0)" onclick="line_close(this)">
				<xsl:attribute name="id">aclose<xsl:value-of select="number"/></xsl:attribute>
				<xsl:attribute name="no"><xsl:value-of select="number"/></xsl:attribute>
				<i class="br_2">-</i>
				Hide Notes
			</a>
			<fieldset hidden="true">
				<xsl:attribute name="id">notesfor<xsl:value-of select="number"/></xsl:attribute>
				<legend>Notes</legend>
				<i><xsl:value-of select="notes/title" /></i>
				<ul>
					<xsl:for-each select="notes/point">
						<li>
							<b><xsl:value-of select="main" /></b>
							<i><xsl:value-of select="text" /></i>
						</li>
					</xsl:for-each>
				</ul>
			</fieldset>
		</div>
	</xsl:for-each>
	<center>
		<a id="bottom" href="#top">&#8593; Top</a>
	</center>
</body>
</html>
</xsl:template>
</xsl:stylesheet>

