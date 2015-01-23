
/*
 * Funktionen, die etwas tun...
 *
 */

// Knoten und vollständige URL ermitteln

function initCast() {
	pauseResume = document.getElementById("pauseresume");
	volumeSelect = document.getElementById("volume");
	myUrl = document.URL;
	console.log("OK, initialized");
}

// Cast API initialisieren - Chromecast Erweiterung muss installiert sein!

function initializeCastApi() {
	var sessionRequest = new chrome.cast.SessionRequest(chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID);
	var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
		sessionListener,
		receiverListener,
		chrome.cast.AutoJoinPolicy.TAB_AND_ORIGIN_SCOPED);
	chrome.cast.initialize(apiConfig, onInitSuccess, onError);
	console.log("Cast API initialized");
}

// Verbindung zu einer Chromecast herstellen

function launchApp() {
	console.log('Launching app...');
	chrome.cast.requestSession(onRequestSessionSuccess, onError);
}

// Verbindung mit einer Chromecast aufheben

function stopApp() {
	console.log('Stopping app...');
	session.stop(onStopAppSuccess, onError);
}

// Filmdatei aus URL laden und Abspielen vorbereiten

function loadMedia(mediaURL) {
	if (!session) {
		console.log('no session');
		return;
	}
	console.log('loading...' + mediaURL);
	var mediaInfo = new chrome.cast.media.MediaInfo(mediaURL);
	mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
	mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC;
	mediaInfo.contentType = 'video/mp4';
	mediaInfo.metadata.title = "Test";
	var request = new chrome.cast.media.LoadRequest(mediaInfo);
	request.autoplay = true;
	request.currentTime = 0;
	session.loadMedia(request,
		onMediaDiscovered.bind(this, 'loadMedia'), 
		onMediaError);
}

// Ausgewählte Filmdatei ermitteln und auf der Chromecast laden, dort starten

function playMedia() {
	var mediaList = document.getElementsByClassName("media");
	var mediaUrl = null;
	for (var i=0; i<mediaList.length; i++) {
		if (mediaList[i].checked) {
			mediaUrl = myUrl + mediaList[i].parentNode.
				getElementsByTagName("a")[0].
				getAttribute("href");
		}
	}
	loadMedia(mediaUrl); 
}

// Stop

function stopMedia() {
	if (!currentMediaSession)
		return;
	currentMediaSession.stop(null,
		mediaCommandSuccessCallback.bind(this, 'Stopped ' +
		currentMediaSession.sessionId),
		onError);
	pauseResume.innerHTML = 'Pause';
}

// Pause und Fortsetzen

function pauseResumeMedia() {
	if (!currentMediaSession)
		return;
	if (pauseResume.innerHTML == 'Pause') {
		currentMediaSession.pause(null,
			mediaCommandSuccessCallback.bind(this, 'Paused ' +
			currentMediaSession.sessionId),
			onError);
		pauseResume.innerHTML = 'Resume';
	} else {
		currentMediaSession.play(null,
			mediaCommandSuccessCallback.bind(this, 'Resumed ' +
			currentMediaSession.sessionId),
			onError);
		pauseResume.innerHTML = 'Pause';
	}
}

// Lautstärke ermitteln und ändern

function changeVolume() {
	var opts = volumeSelect.getElementsByTagName("option");
	for (var i=0; i<opts.length; i++) {
		if (opts[i].selected)
			setMediaVolume(opts[i].innerHTML / 100.0); 
	}
}

// Lautstärke auf Chromecast setzen

function setMediaVolume(level) {
	if (!currentMediaSession)
		return;
	var volume = new chrome.cast.Volume();
	volume.level = level;
	currentVolume = volume.level;
	var request = new chrome.cast.media.VolumeRequest();
	request.volume = volume;
	currentMediaSession.setVolume(request,
		mediaCommandSuccessCallback.bind(this, 'media set-volume done'),
		onError);
}

/*
 * Einfache Callback-Funktionen (Ausgabe, Variablenzuweisung)
 *
 */

function sessionListener(e) {
	session = e; 
	console.log('New session ID: ' + e.sessionId);
}

function receiverListener(e) {
	if (e === 'available') {
		console.log('receiver found');
	} else {
		console.log('receiver list empty');
	}
}

function onInitSuccess() {
	console.log('Init succeeded');
}

function onError(e) {
	console.log('Error ' + e);
}

function onRequestSessionSuccess(e) {
	console.log('Session success: ' + e.sessionId);
	session = e;
}

function onStopAppSuccess() {
	console.log('Session stop succeeded');
}

function onMediaDiscovered(how, mediaSession) {
	console.log('New media session ID:' + mediaSession.mediaSessionId);
	currentMediaSession = mediaSession; 
	if (!currentMediaSession)
		return;
	currentMediaSession.play(null,
		mediaCommandSuccessCallback.bind(this, 'Playing started for ' +
		currentMediaSession.sessionId),
		onError);
}

function onMediaError(e) {
	console.log('Media error');
}

function mediaCommandSuccessCallback(info) {
	console.log(info);
}	

/*
 * Hier geht es los: Globale variablen und Startup-Funktionen 
 *
 */

var session = null;
var pauseResume = null;
var currentMediaSession = null;
var myUrl = null;
var volumeSelect = null;

if (!chrome.cast || !chrome.cast.isAvailable) {
	setTimeout(initializeCastApi, 2000);
}

