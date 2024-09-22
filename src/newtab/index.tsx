import Home from "@newtab/pages/Home"
import { persistor, store } from "@newtab/store"
import React from "react"
import { Provider } from "react-redux"

import { PersistGate } from "@plasmohq/redux-persist/integration/react"

import "./index.css"

const IndexPage: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Home />
      </PersistGate>
    </Provider>
  )
}

export default IndexPage
