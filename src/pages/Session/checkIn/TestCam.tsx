const TestCam = () => {
  const STATUS = document.getElementById('status')
  const VIDEO = document.getElementById('webcam') as any
  const ENABLE_CAM_BUTTON = document.getElementById('enableCam')
  const RESET_BUTTON = document.getElementById('reset')
  const TRAIN_BUTTON = document.getElementById('train')
  const MOBILE_NET_INPUT_WIDTH = 224
  const MOBILE_NET_INPUT_HEIGHT = 224
  const STOP_DATA_GATHER = -1
  const CLASS_NAMES: any[] = []
  let mobilenet: any = undefined
  let gatherDataState = STOP_DATA_GATHER
  let videoPlaying = false
  let trainingDataInputs: any[] = []
  let trainingDataOutputs: any[] = []
  let examplesCount: any[] = []
  let predict = false

  ENABLE_CAM_BUTTON && ENABLE_CAM_BUTTON.addEventListener('click', enableCam)

  function hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
  }

  function enableCam() {
    // TODO: Fill this out later in the codelab!
    if (hasGetUserMedia()) {
      // getUsermedia parameters.
      const constraints = {
        video: true,
        width: 640,
        height: 480,
      }

      // Activate the webcam stream.
      navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        if (VIDEO) {
          VIDEO.srcObject = stream
          VIDEO.addEventListener('loadeddata', function () {
            videoPlaying = true
            // ENABLE_CAM_BUTTON.classList.add('removed')
          })
        }
      })
    } else {
      console.warn('getUserMedia() is not supported by your browser')
    }
  }

  return (
    <>
      <video id="webcam" autoPlay muted></video>

      <button id="enableCam" onClick={enableCam}>
        Enable Webcam
      </button>
      <button className="dataCollector" data-1hot="0" data-name="Class 1">
        Gather Data
      </button>
    </>
  )
}

export default TestCam
