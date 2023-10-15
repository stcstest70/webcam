import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';
import Webcam from 'react-webcam';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import './homepage.css';
import { saveAs } from 'file-saver';
// import { MediaRecorder } from 'react-media-recorder';

const HomePage = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext);
  const [name, setName] = useState('');
  const CheckTokenValid = async () => {
    const token = sessionStorage.getItem('UserToken');
    const res = await fetch('/checkTokenValid', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token
      })
    });
    if (res.status === 200) {
      const data = await res.json();
      dispatch({ type: "USER", payload: true });
      const { decoded } = data;
      setName(decoded.name);
    }
    else if (res.status === 401) {
      navigate('/login');
    }
  }
  useEffect(() => {
    CheckTokenValid();
  }, []);

  const [webcamRef, setWebcamRef] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isWebCam, setIsWebCam] = useState(false);

  useEffect(() => {
    async function askForPermissions() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const webcamFound = devices.some(device => device.kind === 'videoinput');

        if (webcamFound) {
          setIsWebCam(true);
        } else {
          console.log('No webcam found on this device.');
        }
      } catch (error) {
        console.error('Permission denied or device enumeration error:', error);
      }
    }
    askForPermissions();
  }, []);

  const handleRecording = () => {
    setIsRecording(!isRecording);
  };

  const [webcamStream, setWebcamStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [webcamRecorder, setWebcamRecorder] = useState(null);
  const [screenRecorder, setScreenRecorder] = useState(null);

  const [webcamChunks, setWebcamChunks] = useState([]);
  const [screenChunks, setScreenChunks] = useState([]);

  useEffect(() => {
    if (isRecording) {
      // Create a media stream with webcam video and audio
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setWebcamStream(stream);
          const webcamRecorder = new MediaRecorder(stream);
          setWebcamRecorder(webcamRecorder);
          webcamRecorder.start();
  
          webcamRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              setWebcamChunks((prevChunks) => [...prevChunks, event.data]);
            }
          };
        })
        .catch((error) => {
          console.error('Error accessing webcam:', error);
        });

      // Create a media stream with screen capture
      navigator.mediaDevices.getDisplayMedia({ video: true })
        .then((stream) => {
          setScreenStream(stream);
          const screenRecorder = new MediaRecorder(stream);
          setScreenRecorder(screenRecorder);
          screenRecorder.start();
  
          screenRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              setScreenChunks((prevChunks) => [...prevChunks, event.data]);
            }
          };
        })
        .catch((error) => {
          console.error('Error accessing screen:', error);
        });
    } else {
      if (webcamRecorder) {
        webcamRecorder.stop();
        webcamStream.getTracks().forEach((track) => track.stop());
        const webcamBlob = new Blob(webcamChunks, { type: 'video/webm' });
        
        sendWebcamRecordingToServer(webcamBlob, 'webcam-video.webm');
      }

      if (screenRecorder) {
        screenRecorder.stop();
        screenStream.getTracks().forEach((track) => track.stop());
        const screenBlob = new Blob(screenChunks, { type: 'video/webm' });

        sendScreenRecordingToServer(screenBlob, 'screen-video.webm');
      }

      // Clear recorded chunks
      setWebcamChunks([]);
      setScreenChunks([]);
    }
  }, [isRecording]);

  const sendWebcamRecordingToServer = (blob, fileName) => {
    const formData = new FormData();
    formData.append('webcamVideo', blob, fileName);

    
    fetch('/upload-webcam', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (response.ok) {
          console.log(`${fileName} uploaded successfully`);
        } else {
          console.error(`${fileName} upload failed`);
        }
      })
      .catch(error => {
        console.error(`Error sending ${fileName}:`, error);
      });
  };
  const sendScreenRecordingToServer = (blob, fileName) => {
    const formData = new FormData();
    formData.append('screenVideo', blob, fileName);

    
    fetch('/upload-screen', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (response.ok) {
          console.log(`${fileName} uploaded successfully`);
        } else {
          console.error(`${fileName} upload failed`);
        }
      })
      .catch(error => {
        console.error(`Error sending ${fileName}:`, error);
      });
  };
 
  return (
    <div className="homePage">
      <div className="homePage-left">
        <h3>Screen and Webcam Recorder</h3>
        {isWebCam ? <Webcam audio={true} ref={setWebcamRef} /> : <FontAwesomeIcon icon={faUser} />}
        
      </div>
      <div className="homePage-right">
        {isWebCam? '' : <div className="noWebcamfoung">
          <span>*No Webcam or Audio input found on this device</span>
        </div>}
        
        <div className='record-btn-container'>
          {isRecording ? <button onClick={handleRecording} className='record-btn btn2'>
            Stop Recording
          </button>  : <button onClick={handleRecording} className='record-btn btn1' disabled={!isWebCam}>
            Start Recording
          </button>}
          
          
        </div>
      </div>
    </div>
  )
}

export default HomePage