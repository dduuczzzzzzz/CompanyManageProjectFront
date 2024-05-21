import Sidebar from '../sidebar'
import { Layout, theme } from 'antd'
import { Content } from 'antd/es/layout/layout'
import React from 'react'
import CustomHeader from '../header'
import { CollapsedProvider } from '../../../libs/contexts/CollapsedContext'

interface Props {
  children?: React.ReactNode
}

const MainLayout = ({ children }: Props) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  return (
    <CollapsedProvider>
      <div id="main-layout">
        <Layout>
          <Sidebar />
          <Layout>
            <CustomHeader colorBgContainer={colorBgContainer}></CustomHeader>
            <Content
              style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 600,
                background: colorBgContainer,
              }}
            >
              {children}
            </Content>
          </Layout>
        </Layout>
      </div>
    </CollapsedProvider>
  )
}

export default MainLayout
