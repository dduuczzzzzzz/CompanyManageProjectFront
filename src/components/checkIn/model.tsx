import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'
import { useEffect, useState } from 'react'
import { MnistData } from './data.js'
import { showAccuracy, showConfusion, getModel, train } from './script'

const Model = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const showExamples = async (data: any) => {
    // Create a container in the visor
    const surface = tfvis
      .visor()
      .surface({ name: 'Input Data Examples', tab: 'Input Data' })

    // Get the examples
    const examples = data.nextTestBatch(20)
    const numExamples = examples.xs.shape[0]

    // Create a canvas element to render each example
    for (let i = 0; i < numExamples; i++) {
      const imageTensor = tf.tidy(() => {
        // Reshape the image to 28x28 px
        return examples.xs
          .slice([i, 0], [1, examples.xs.shape[1]])
          .reshape([28, 28, 1])
      })

      const canvas = document.createElement('canvas')
      const myModel = document.getElementById('my_model')
      canvas.width = 28
      canvas.height = 28
      // canvas.style = 'margin: 4px;'
      await tf.browser.toPixels(imageTensor, canvas)
      surface.drawArea.appendChild(canvas)

      imageTensor.dispose()
    }
  }

  const run = async () => {
    setIsLoading(true)
    const data = new MnistData()
    console.log('Loading data')
    await data.load()
    await showExamples(data)
    const model = getModel()
    tfvis.show.modelSummary({ name: 'Model Architecture', tab: 'Model' }, model)

    console.log('Training data')

    await train(model, data)
    await showAccuracy(model, data)
    await showConfusion(model, data)
    const modelJSON = model.toJSON()
    const modelBlob = new Blob([JSON.stringify(modelJSON)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(modelBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'my-model.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setIsLoading(false)
  }
  const [model, setModel] = useState<tf.LayersModel | null>(null)
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadLayersModel('.src/model/my-model.json')
        setModel(loadedModel)
        console.log('Model: ', loadedModel)
      } catch (error) {
        console.error('Error loading model:', error)
      }
    }

    loadModel()
  }, [])

  useEffect(() => {
    if (model) {
      // Example inference
      const input = tf.tensor2d([[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]])
      const output = model.predict(input) as tf.Tensor
      setResult(output)
    }
  }, [model])

  return <>{result ? <p>Loading...</p> : <div>result</div>}</>
}

export default Model
