import * as tf from '@tensorflow/tfjs'
import { notification } from 'antd'
import { error } from 'console'
import { useEffect, useState } from 'react'
import Spinner from '../../../components/user/spin'
import { getUser } from '../../../libs/helpers/getLocalStorage'

const CheckInWebCam = () => {
  // get element
  const STATUS = document.getElementById('status')
  const VIDEO = document.getElementById('webcam') as any
  const ENABLE_CAM_BUTTON = document.getElementById('enableCam')
  const RESET_BUTTON = document.getElementById('reset')
  const TRAIN_BUTTON = document.getElementById('train')
  const MOBILE_NET_INPUT_WIDTH = 224
  const MOBILE_NET_INPUT_HEIGHT = 224
  const STOP_DATA_GATHER = -1
  const CLASS_NAMES: any[] = []
  for (let i = 0; i <= 100; i++) {
    CLASS_NAMES.push(i)
  }
  // init model
  const [mobilenet, setMobileNet] = useState<any>()
  const [savedModel, setSavedModel] = useState<any>()
  const [model, setModel] = useState<any>()
  const [loading, setLoading] = useState<boolean>(true)
  const user = getUser()
  // let mobilenet: any = undefined
  let gatherDataState: any = STOP_DATA_GATHER
  let videoPlaying = false
  let trainingDataInputs: any[] = []
  let trainingDataOutputs: any[] = []
  let examplesCount: any[] = []
  let predict = false

  ENABLE_CAM_BUTTON && ENABLE_CAM_BUTTON.addEventListener('click', enableCam)
  TRAIN_BUTTON && TRAIN_BUTTON.addEventListener('click', trainAndPredict)
  RESET_BUTTON && RESET_BUTTON.addEventListener('click', reset)

  console.log(VIDEO)
  if (VIDEO) {
    // setLoading(false)
    enableCam()
  }

  // check if has web media
  function hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
  }

  // enable web cam to collect data/ checkin
  function enableCam() {
    console.log('Start enable cam')
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

  // train and predict model
  async function trainAndPredict() {
    predict = false
    try {
      tf.util.shuffleCombo(trainingDataInputs, trainingDataOutputs)
      let outputsAsTensor = tf.tensor1d(trainingDataOutputs, 'int32')
      let oneHotOutputs = tf.oneHot(outputsAsTensor, CLASS_NAMES.length)
      let inputsAsTensor = tf.stack(trainingDataInputs)

      let results = await model.fit(inputsAsTensor, oneHotOutputs, {
        shuffle: true,
        batchSize: 5,
        epochs: 10,
        callbacks: { onEpochEnd: logProgress },
      })

      outputsAsTensor.dispose()
      oneHotOutputs.dispose()
      inputsAsTensor.dispose()
      predict = true
      // predictLoop()
      const saveResult = await model.save('localstorage://my-model-1')
    } catch (err) {
      console.log(err)
    }
  }

  async function saveModelToFile() {
    await model.save('downloads://my-model')
  }

  function logProgress(epoch: any, logs: any) {
    console.log('Data for epoch ' + epoch, logs)
  }

  function predictLoop() {
    tf.tidy(function () {
      if (VIDEO) {
        let videoFrameAsTensor: any = tf.browser.fromPixels(VIDEO).div(255)
        let resizedTensorFrame = tf.image.resizeBilinear(
          videoFrameAsTensor,
          [MOBILE_NET_INPUT_HEIGHT, MOBILE_NET_INPUT_WIDTH],
          true,
        )

        let imageFeatures: any = mobilenet.predict(
          resizedTensorFrame.expandDims(),
        )
        if (savedModel) {
          let prediction: any = savedModel.predict(imageFeatures) as tf.Tensor
          prediction = prediction.squeeze()
          console.log('Prediction: ', prediction)
          // let predictedClassIndex = tf.argMax(prediction, -1).dataSync()[0]
          // let predictedName = CLASS_NAMES[predictedClassIndex] // Assuming classNames is an array of class names
          // console.log('Predicted Name:', predictedName)
          let highestIndex = prediction.argMax().arraySync()
          console.log('Index: ', highestIndex)
          let predictionArray = prediction.arraySync()
          console.log(
            'Accurancy: ',
            Math.floor(predictionArray[highestIndex] * 100),
          )
          console.log('Predict user id: ', CLASS_NAMES[highestIndex])
          return
        }
        let prediction: any = model.predict(imageFeatures) as tf.Tensor
        prediction = prediction.squeeze()
        console.log('Prediction: ', prediction)
        // let predictedClassIndex = tf.argMax(prediction, -1).dataSync()[0]
        // let predictedName = CLASS_NAMES[predictedClassIndex] // Assuming classNames is an array of class names
        // console.log('Predicted Name:', predictedName)
        let highestIndex = prediction.argMax().arraySync()
        console.log('Index: ', highestIndex)
        let predictionArray = prediction.arraySync()
        console.log(
          'Accurancy: ',
          Math.floor(predictionArray[highestIndex] * 100),
        )
        console.log('Predict user id: ', CLASS_NAMES[highestIndex])
      }
    })

    // window.requestAnimationFrame(predictLoop)
  }

  /**
   * Purge data and start over. Note this does not dispose of the loaded
   * MobileNet model and MLP head tensors as you will need to reuse
   * them to train a new model.
   **/
  function reset() {
    predict = false
    examplesCount.length = 0
    for (let i = 0; i < trainingDataInputs.length; i++) {
      trainingDataInputs[i].dispose()
    }
    trainingDataInputs.length = 0
    trainingDataOutputs.length = 0
    // STATUS.innerText = 'No data collected'

    console.log('Tensors in memory: ' + tf.memory().numTensors)
  }

  let dataCollectorButtons = document.querySelectorAll('button.dataCollector')
  for (let i = 0; i < dataCollectorButtons.length; i++) {
    dataCollectorButtons[i].addEventListener('mousedown', gatherDataForClass)
    dataCollectorButtons[i].addEventListener('mouseup', gatherDataForClass)
    // Populate the human readable names for classes.
    // CLASS_NAMES.push(dataCollectorButtons[i].getAttribute('data-name'))
  }

  function gatherDataForClass() {
    // let classNumber = parseInt(this.getAttribute('data-1hot'))
    gatherDataState =
      gatherDataState === STOP_DATA_GATHER ? user.id : STOP_DATA_GATHER
    notification['info']({
      key: 'gatherData',
      duration: 5,
      message: 'Gathering data ...',
    })
    dataGatherLoop()
  }

  function dataGatherLoop() {
    if (videoPlaying && gatherDataState !== STOP_DATA_GATHER && mobilenet) {
      let imageFeatures = tf.tidy(function () {
        let videoFrameAsTensor = tf.browser.fromPixels(VIDEO)
        let resizedTensorFrame = tf.image.resizeBilinear(
          videoFrameAsTensor,
          [MOBILE_NET_INPUT_HEIGHT, MOBILE_NET_INPUT_WIDTH],
          true,
        )
        let normalizedTensorFrame = resizedTensorFrame.div(255)
        return mobilenet.predict(normalizedTensorFrame.expandDims()).squeeze()
      })
      console.log('IMage: ', imageFeatures)

      trainingDataInputs.push(imageFeatures)
      trainingDataOutputs.push(user.id)

      // Intialize array index element if currently undefined.
      if (examplesCount[gatherDataState] === undefined) {
        examplesCount[gatherDataState] = 0
      }
      examplesCount[gatherDataState]++
      if (examplesCount[gatherDataState] >= 10) {
        gatherDataState = STOP_DATA_GATHER
        return
      }
      // STATUS.innerText = ''
      // for (let n = 0; n < CLASS_NAMES.length; n++) {
      //   STATUS.innerText +=
      //     CLASS_NAMES[n] + ' data count: ' + examplesCount[n] + '. '
      // }
      window.requestAnimationFrame(dataGatherLoop)
    }
  }

  /**
   * Loads the MobileNet model and warms it up so ready for use.
   **/
  async function loadMobileNetFeatureModel() {
    console.log(JSON.stringify(await tf.io.listModels()))

    try {
      const savedModel = await tf.loadLayersModel('localstorage://my-model-1')
      if (savedModel) {
        setSavedModel(savedModel)
      } else {
        setSavedModel(undefined)
      }
    } catch (err) {
      console.log('Error loading model from local storage:', err)
    }
    // setMobileNet(savedModel)
    // setLoading(true)
    const URL =
      'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1'

    const mobilenetModel = await tf.loadGraphModel(URL, { fromTFHub: true })
    console.log('Mobile Net load')
    setMobileNet(mobilenetModel)
    setLoading(false)
    // STATUS.innerText = 'MobileNet v3 loaded successfully!'

    // tf.tidy(function () {
    //   let answer = mobilenet.predict(
    //     tf.zeros([1, MOBILE_NET_INPUT_HEIGHT, MOBILE_NET_INPUT_WIDTH, 3]),
    //   )
    //   console.log(answer.shape)
    // })
  }

  useEffect(() => {
    loadMobileNetFeatureModel()
    // setLoading(true)
  }, [])

  useEffect(() => {
    if (savedModel) {
      console.log('Save model sum: ')
      savedModel.summary()

      // Compile the model with the defined optimizer and specify a loss function to use.
      savedModel.compile({
        // Adam changes the learning rate over time which is useful.
        optimizer: 'adam',
        // Use the correct loss function. If 2 classes of data, must use binaryCrossentropy.
        // Else categoricalCrossentropy is used if more than 2 classes.
        loss: 'categoricalCrossentropy',
        // As this is a classification problem you can record accuracy in the logs too!
        metrics: ['accuracy'],
      })
      setModel(savedModel)
      return
    }
    let model = tf.sequential()
    model.add(
      tf.layers.dense({ inputShape: [1024], units: 128, activation: 'relu' }),
    )
    model.add(
      tf.layers.dense({ units: CLASS_NAMES.length, activation: 'softmax' }),
    )

    model.summary()

    // Compile the model with the defined optimizer and specify a loss function to use.
    model.compile({
      // Adam changes the learning rate over time which is useful.
      optimizer: 'adam',
      // Use the correct loss function. If 2 classes of data, must use binaryCrossentropy.
      // Else categoricalCrossentropy is used if more than 2 classes.
      loss: 'categoricalCrossentropy',
      // As this is a classification problem you can record accuracy in the logs too!
      metrics: ['accuracy'],
    })
    setModel(model)
  }, [savedModel])

  useEffect(() => {
    // Warm up the model by passing zeros through it once.
    if (mobilenet) {
      tf.tidy(function () {
        let answer = mobilenet.predict(
          tf.zeros([1, MOBILE_NET_INPUT_HEIGHT, MOBILE_NET_INPUT_WIDTH, 3]),
        )
        console.log(answer.shape)
      })
    }
  }, [mobilenet])

  // Call the function immediately to start loading.

  return (
    <>
      <div className="flex justify-center items-center w-full mt-2 mb-4">
        <video id="webcam" autoPlay muted></video>
      </div>

      <div>
        {/* <button id="enableCam" onClick={enableCam}>
          Enable Webcam
        </button> */}
        <button className="dataCollector" data-1hot="0" data-name="Class 1">
          Gather Data
        </button>
        <button id="train">Train &amp; Predict!</button>
        <button id="predict" onClick={predictLoop}>
          Predict!
        </button>
        <button id="reset" onClick={reset}>
          Reset
        </button>
        <button id="save-file" onClick={saveModelToFile}>
          Save Model to FILE
        </button>
      </div>
      {loading && <Spinner />}
    </>
  )
}

export default CheckInWebCam
