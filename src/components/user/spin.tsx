import { Spin } from 'antd'

const Spinner = () => {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-300 opacity-50 flex items-center justify-center">
        <Spin size="large"></Spin>
      </div>
    </>
  )
}

export default Spinner
