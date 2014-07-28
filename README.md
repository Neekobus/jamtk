JAMTK
=====

Using as submodule :
--------------------

* git submodule add -b master  git@github.com:Neekobus/jamtk.git jamtk
* git submodule init
* git submodule update

TBD : 
-----
 * universalPreloader
 * BresenhamFinder (vector array as response)
 * LevelLoader (with custom levelBuilder)
 * CenteredCanvas (on resize) & fullscreen handler
 * Basic actor (position, move strategy, imageKey) ?
 * menu

Existing Components : 
---------------------

* ImageManager : SpriteSheet with basic animation support.
* InputManager : Smart mouse, touch and keyboard managment. ICade comming soon.
* SoundManager : Basic MP3 play capabilities.
* Storage : Mapped around Cookies.
* AStar : Graph or Grid based pathfinder. 
* DomHelper : Some DOM utilities.


