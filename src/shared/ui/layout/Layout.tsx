import { Layout } from 'antd'
import { PropsWithChildren } from 'react'

const { Content } = Layout

export function MainLayout(props: PropsWithChildren) {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f2f6fa' }}>
      <Content
        style={{
          display: 'flex',
          minHeight: '100vh',
          padding: 24,
        }}
      >
        {props.children}
      </Content>
    </Layout>
  )
}
