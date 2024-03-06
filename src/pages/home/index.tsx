import MainLayout from '../../components/layouts/main'
import { Button, Spin } from 'antd'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '../../services/request/base'
import axios from 'axios'

const HomePage = () => {
  return (
    <MainLayout>
      <div className="text-center">
        <div>HomePage</div>
        <strong>👀 </strong> <strong>✨ </strong> <strong>🍴 </strong>
      </div>
      <Button type="primary">Primary Button</Button>
    </MainLayout>
  )
}

export default HomePage
