<?php 

class SheetGenerator {

	public $source;
	public $outputFile;
	public $format = "png";
	public $sep = "-";
	
	public $actors = array(
	);
	
	public $output = array();
	public $padding = 0;
	
	function run($source, $dest){
		$this->source = $source;
		$this->outputFile = $dest;

		$this->populateActors();
		$this->process($this->actors, array(null));
		
		$size = $this->calculateOutputSize($this->out);
		$this->createSheet($this->out, $size);

		$this->saveData($this->out);

	}

	function log($message) {
		echo $message . " \n";
	}

	function populateActors(){
		$files = scandir( $this->source );
		
		foreach ($files as $file) {
			$name = str_replace( "." . $this->format , "", $file);
			$pos = strrpos($name, $this->sep);

			if ($pos <= 0) {
				continue;
			}

			$key = substr($name, 0, $pos);
			$this->actors[] = $key;	
		}
 		
		$this->actors = array_unique($this->actors);
		$this->log("Found " . ( count($this->actors) ) . " keys.");
	}

	function process($files, $variants) {
		foreach ($files as $file) {
			foreach ($variants as $variant) {
				for ($i=1; $i < 16; $i++) { 

					$key = is_null($variant) ? $file : $file . $this->sep . $variant;

					if (! $this->generate($file, $key, $i)){
						continue 2;
					}

				}		
			}	
		}
	}
	
	function generate($file, $key, $index) {

		$filename = $this->source . "/" . $key . $this->sep . $index . "." . $this->format;

		if (! file_exists($filename)) {
			$this->log ("NOT FOUND $filename");
			return false;
		}

		if (! isset($this->out[$key])) {
			$this->out[$key] = array();
		}

		$this->log("FOUND $filename");
		$this->log("KEY : $key");

		list($width, $height, $type, $attr) = getimagesize($filename);
		
		$this->out[$key][] = array(
			//'base' => $this->baseTile,
			'file' => $filename,
			'width' => $width,
			'height' => $height,
			'key' => $key
		);

		return true;
	}


	function calculateOutputSize(&$data){

		$totalHeight=0;
		$maxWidth=0;
		
		$currentWidth=0;
		$currentHeight=0;

		foreach ($data as &$images) {

			foreach ($images as &$image) {
				$image['x'] = $currentWidth;	
				$image['y'] = $currentHeight;

				$currentWidth += $image['width'] + $this->padding;
				$maxWidth = ($currentWidth > $maxWidth) ? $currentWidth : $maxWidth;
				
			}

			$currentHeight += $images[0]['height'] + $this->padding;
			$totalHeight = $currentHeight;

			$currentWidth = 0;

		}

		return array($totalHeight - $this->padding, $maxWidth - $this->padding);
	}

	function createSheet($data, $size){
		$sheet = $this->processTransparence(imagecreatetruecolor($size[1], $size[0]));
		
		foreach ($data as $images) {

			foreach ($images as $image) {
				$x = $image['x'];
				$y = $image['y'];
				$w = $image['width'];
				$h = $image['height'];
				
				$file = $image['file'];
				$sprite = imagecreatefrompng($file);
				
				imagecopy($sheet, $sprite, $x, $y, 0, 0, $w, $h);
				imagedestroy($sprite);
			}
		}

		imagepng($sheet, $this->outputFile . ".png");
		imagedestroy($sheet);
		
	}

	function processTransparence($image){
		imagealphablending($image, false);
		$colorTransparent = imagecolorallocatealpha($image, 0, 0, 0, 127);
		imagefill($image, 0, 0, $colorTransparent);
		imagesavealpha($image, true);

		return $image;
	}

	function saveData($data){

		$json = json_encode($data);//, JSON_PRETTY_PRINT);
		file_put_contents($this->outputFile . ".json", $json);

	}

}


echo "GENERATE STYLE SHEET \n";

if (count($argv) != 3) {
	echo "Usage : script <medias path> <sheet destination and name> \n";
	echo "Exemple : '<script> work/ medias/sprites' will generate medias/sprites.json and medias/sprites.png \n"; 
	exit(1);
} 

$generator = new SheetGenerator();
$generator->run($argv[1], $argv[2]);


echo "DONE GENERATING STYLE SHEET \n";


?>