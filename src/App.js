import React from 'react';
import './App.scss';

function App() {
  return (
    <div className="App">
      <Navbar>
        <NavItem />
      </Navbar>
    </div>
  );
}

function Navbar(props) {
  return (
    <nav className="navbar">
      <ul>
        { props.children }
      </ul>
    </nav>
  )
}

function NavItem(props) {
  return (
    <li className="nav-item">
      <div className="control-container" onClick={toggleFullscreen}>
        <img src="/images/icons/start_fullscreen.svg" alt="Toggle Fullscreen" />
      </div>
    </li>
  )
}

var is_fullscreen = false;

function toggleFullscreen() {
  if (is_fullscreen) {
    closeFullscreen()
  } else {
    startFullscreen()
  }
}

function startFullscreen() {
  const element = document.querySelector('#big-container')

  if (element.requestFullScreen) {
    element.requestFullScreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }

  is_fullscreen = true
}

function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }

  is_fullscreen = false
} 

export default App;
