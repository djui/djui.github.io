<?php
/**
 * Keyboard Shortcut Exporter for OS X
 * 
 * (c) 2009 Kreisquadratur (uwe@dauernheim.net)
 * 
 * Changelog:
 * 
 * v1.0.0.0
 * [+] Initial release
 *
 * Todo:
 * 
 * [1] Get rid of manual UTF conversion
 * 
 */

$US = new NSUserKeys();
$US->generateShellScript();
#$US->generateList();

class NSUserKeys {
	private static $command = "defaults find NSUserKeyEquivalents";
	private static $outputCommandText = "defaults write %s NSUserKeyEquivalents -dict-add \"%s\" \"%s\"";
	private static $outputText = "#!/bin/bash\n\n%s\ndefaults write com.apple.universalaccess com.apple.custommenu.apps -array %s\n";
	private static $pattern = "/Found (\d+) keys in domain '(.*?)': \{.*?\{(.*?)([\)\}];\})/";
	private static $UTFMap = array(
		"from" => array("\\\\", "\$",   "\\t", "\U00f6", "\U00e4", "\U00fc", "\U2190", "\U2192", "\U21a9", "\U201e", "\U201c"),
		"into" => array("\\",   "\\\$", "\t",  "ö",      "ä",      "ü",      "←",      "→",      "↩",      "„",      "“"));
	private $userShortcuts;
	
	
	public function NSUserKeys() {
		$this->userShortcuts = array();

		$foundShortcuts = $this->fetchShortcuts();
		$this->parse($foundShortcuts);		
	}
	
	private function fetchShortcuts() {
		exec(NSUserKeys::$command, $foundShortcutsExport);
		
		return implode("", $foundShortcutsExport);
	}
	
	private function parse($foundShortcuts) {
		# Cut down the keyboard shortcut findings
		preg_match_all(NSUserKeys::$pattern, $foundShortcuts, $domainMatches);
		$domainNames = $domainMatches[2];
		$domainEntries = $domainMatches[3];

		# Go through every found domain entry and get its keyboard shortcuts
		for ($i = 0; $i < count($domainEntries); $i++) {
			preg_match_all("/(.*?);/", $domainEntries[$i], $shortcutMatches);
			$userShortcut = array();
	
			# Go through every shortcut entry and get its assign pairs (name => key)
			for ($j = 0; $j < count($shortcutMatches[1]); $j++) {
				preg_match_all("/(.*?) = \"(.*?)\"/", $shortcutMatches[1][$j], $assignMatches);
				if (empty($assignMatches[1]) || empty($assignMatches[2]))
					continue;
		
				# String preparation and some beautification
				$userShortcut = array(
					"domain" => $domainNames[$i],
					"name" => $this->tidy($assignMatches[1][0]),
					"key" => $this->tidy($assignMatches[2][0]));
		
				array_push($this->userShortcuts, $userShortcut);
			}
		}		
	}

	private function tidy($str) {
		$str = trim($str, "\t\n\" ");
		$str = str_replace(NSUserKeys::$UTFMap['from'], NSUserKeys::$UTFMap['into'], $str);
		
		return $str;
	}
	
	public function generateList($return = false) {
		if ($return)
			return $this->userShortcuts;
		else
			foreach ($this->userShortcuts as $userShortcut)
				printf("Domain: \"%s\"\nName: \"%s\"\nKey: \"%s\"\n\n", 
					$userShortcut['domain'], 
					$userShortcut['name'], 
					$userShortcut['key']);
	}

	public function generateShellScript($return = false) {	
		$outputBufferEntries = "";
		$outputBufferDomains = "";

		foreach ($this->userShortcuts as $userShortcut) {
			$outputBufferDomains .= "\"".$userShortcut['domain']."\" ";
			$outputBufferEntries .= sprintf(NSUserKeys::$outputCommandText."\n", 
				$userShortcut['domain'], 
				$userShortcut['name'], 
				$userShortcut['key']);
		}
		
		if ($return)
			return sprintf(NSUserKeys::$outputText, $outputBufferEntries, $outputBufferDomains);
		else
			printf(NSUserKeys::$outputText, $outputBufferEntries, $outputBufferDomains);
	}
}
?>