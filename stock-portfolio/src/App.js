import React from 'react'
import PortfolioContainer from './Components/PortfolioContainer'
import {Layout} from 'antd'
const {Header, Content} = Layout

const App = () => {
    return(
        <div >
            <Layout style={{height: "100%", width:"100%"}}>
                <Header id="main-header">
                    <h1 id="main-header-text">SPMS</h1>
                </Header>
                <Content id="main-content">
                    <PortfolioContainer></PortfolioContainer>
                </Content>
            </Layout>
        </div>
    )
}

export default App