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
 * CenteredCanvas (on resize) & fullscreen handler
 * Basic actor (position, move strategy, imageKey) ?
 * Menu

Existing Components : 
---------------------

* ImageManager : SpriteSheet with basic animation support.
* InputManager : Smart mouse, touch and keyboard managment. ICade comming soon.
* SoundManager : Basic MP3 play capabilities.
* Storage : Mapped around Cookies.
* AStar : Graph or Grid based pathfinder. 
* DomHelper : Some DOM utilities.
* JsonLevelLoader : Basic tool for loading and delegating level building.
* ControllerManager : Basic main controller and framework for customized concrete controllers.
* Looper : Simple wrapper for setInterval, with frame duration.
