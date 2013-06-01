<?php
/**
 * Get a list of disk space used by not really needed files/folders.
 *
 * Changelog:
 *
 * 1.0.0.0
 * Initial release.
 *
 * Requirements:
 *
 * PHP 5+, Mac OS X 10.x+, Bash (rxvt/aterm)
 * 
 * @author     Uwe Dauernheim
 * @copyright  Kreisquadratur 2008
 * @version    1.0.0.0
 */
 define("NEWLINE", "\n");

$potentialItems = array(
	array("APPLICATION", "Mail Downloads", "~/Library/Mail Downloads/*"),
	array("APPLICATION", "iPhoto iPod Photo Cache", "~/Pictures/iPhoto Library/iPod Photo Cache/*"),
	array("APPLICATION", "iTunes iPhone Software Updates", "~/Library/iTunes/iPhone Software Updates/*"),
	array("APPLICATION", "iTunes Downloads", "~/Music/iTunes/iTunes Media/Downloads/*"),
	array("APPLICATION", "iTunes Mobile Applications", "~/Music/iTunes/iTunes Media/Mobile Applications/*"),
	array("APPLICATION", "iTunes Podcasts", "~/Music/iTunes/iTunes Media/Podcasts/*"),
	array("APPLICATION", "Second Life Cache", "~/Library/Application Support/SecondLife/cache/*"),
	array("USER", "User Temp Files", "/private/tmp/*"),
	array("USER", "User Caches", "~/Library/Caches/*"),
	array("USER", "User Cookies", "~/Library/Cookies/*"),
	array("USER", "User Logs", "~/Library/Logs/*"),
	array("SYSTEM USER", "System User Caches", "/Library/Caches/*"),
	array("SYSTEM USER", "System User Logs", "/Library/Logs/*"),
	array("SYSTEM", "System Caches", "/System/Library/Caches/*"),
	array("SYSTEM", "System Temp Files", "/private/var/tmp/*"),
	array("SYSTEM", "System Logs", "/private/var/log/*"),
	array("SYSTEM", "System Swap Files", "/private/var/vm/swapfile*"),
	array("SYSTEM", "System Sleep Image", "/private/var/vm/sleepimage"),
	array("SYSTEM", "System Crash Restore Files", "/private/var/folders/*"),
	array("SYSTEM", "Core dumps", "/cores/*"),	
);

$sizeBorders = array(0, 1024*1024*100, 1024*1024*1024);

////////////////////////////////////////////////////////////////////////////////

function color($color, $text)
{
	return $color.$text."\033[0m";
}

function format_filesize($number, $decimals = 3, $force_unit = FALSE, $dec_char = '.', $thousands_char = ',')
{
	$units = array('B', 'KB', 'MB', 'GB', 'TB');

	if($force_unit === FALSE)
		$unit = floor(log($number, 2) / 10);
	else
		$unit = $force_unit;
	if($unit == 0)
		$decimals = 0;

	return number_format($number / pow(1024, $unit), $decimals, $dec_char, $thousands_char).' '.$units[$unit];
}

////////////////////////////////////////////////////////////////////////////////

function deleteItem($i)
{
	global $potentialItems;
	
	// unlink();
}

function getSizeOverall()
{
	global $potentialItems, $sizeBorders;
	$sum = 0; // kb

	for ($i = 0; $i < count($potentialItems); $i++)
	{
		$target = str_replace(" ", "\\ ", $potentialItems[$i][2]);
		exec("du 2> /dev/null -ck ".$target, $return);
		$total = array_pop($return);
		$result = preg_match("/^[0-9]+/", $total, $size);
		$size = ((double)$size[0]) * 1024; 
		$sum += $size;
		echo str_pad($potentialItems[$i][1], 30, " ")." ";
		echo str_pad($potentialItems[$i][2], 49, " ")." ";
		if ($size >= $sizeBorders[2])
			echo str_pad(color("\033[31m", format_filesize($size, 0, 2)), 22, " ", STR_PAD_LEFT).NEWLINE;
		else if ($size >= $sizeBorders[1])
			echo str_pad(color("\033[33m", format_filesize($size, 0, 2)), 22, " ", STR_PAD_LEFT).NEWLINE;
		else if ($size >= $sizeBorders[0])
			echo str_pad(color("\033[32m", format_filesize($size, 0, 2)), 22, " ", STR_PAD_LEFT).NEWLINE;
		else
			echo str_pad(format_filesize($size, 0, 2), 14, " ", STR_PAD_LEFT).NEWLINE;
	}
	
	echo str_repeat("=", 94).NEWLINE
		."Summe: ".format_filesize($sum, 0, 2).NEWLINE;
}

////////////////////////////////////////////////////////////////////////////////

getSizeOverall();

?>