<? require 'elements/html_start.php' ?>		
		
</head>
<body>
<? 
	if (ENVIRONMENT === 'production'){include_once 'elements/tracking.php';}
	require 'elements/header.php'; 
	require 'elements/page.php';
?>
	<div class="main">

		<p style="margin-top: 50%; font-size: 12px; text-align: center; font-family: arial;">Just a whole lot of nothingness... read about the progress on the <a href="http://blog.aidwebsolutions.com/tag/enketo/">Aid Web Solutions Blog</a>.</p>

	</div>

<? require 'elements/page_contact.php'; ?>	

<? require 'elements/footer++.php' ?>

