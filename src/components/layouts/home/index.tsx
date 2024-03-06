interface Props {
  children?: React.ReactNode
}

const HomeLayout = ({ children }: Props) => {
  return <div id="main-layout">{children}</div>
}

export default HomeLayout
