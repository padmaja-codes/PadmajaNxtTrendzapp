import {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from './context/CartContext'

import './App.css'

class App extends Component {
  state = {
    cartList: [],
  }

  addCartItem = product => {
    const {cartList} = this.state

    const existedItem = cartList.find(each => each.id === product.id)

    if (existedItem !== undefined) {
      this.setState(prevState => ({
        cartList: prevState.cartList.map(each =>
          each.id === product.id
            ? {...each, quantity: each.quantity + (product.quantity || 1)}
            : each,
        ),
      }))
    } else {
      const newProduct = {...product, quantity: product.quantity || 1}
      this.setState(prevState => ({
        cartList: [...prevState.cartList, newProduct],
      }))
    }
  }

  removeAllCartItems = () => {
    this.setState({cartList: []})
  }

  removeCartItem = id => {
    const {cartList} = this.state
    const updatedList = cartList.filter(each => each.id !== id)
    this.setState({cartList: updatedList})
  }

  incrementCartItemQuantity = id => {
    this.setState(prevState => ({
      cartList: prevState.cartList.map(each =>
        each.id === id ? {...each, quantity: each.quantity + 1} : each,
      ),
    }))
  }

  decrementCartItemQuantity = id => {
    const {cartList} = this.state

    const item = cartList.find(each => each.id === id)

    if (item.quantity === 1) {
      const updatedList = cartList.filter(each => each.id !== id)
      this.setState({cartList: updatedList})
    } else {
      this.setState(prevState => ({
        cartList: prevState.cartList.map(each =>
          each.id === id ? {...each, quantity: each.quantity - 1} : each,
        ),
      }))
    }
  }

  render() {
    const {cartList} = this.state

    return (
      <CartContext.Provider
        value={{
          cartList,
          addCartItem: this.addCartItem,
          removeCartItem: this.removeCartItem,
          removeAllCartItems: this.removeAllCartItems,
          incrementCartItemQuantity: this.incrementCartItemQuantity,
          decrementCartItemQuantity: this.decrementCartItemQuantity,
        }}
      >
        <Switch>
          <Route exact path="/login" component={LoginForm} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/products" component={Products} />
          <ProtectedRoute
            exact
            path="/products/:id"
            component={ProductItemDetails}
          />
          <ProtectedRoute exact path="/cart" component={Cart} />
          <Route path="/not-found" component={NotFound} />
          <Redirect to="not-found" />
        </Switch>
      </CartContext.Provider>
    )
  }
}

export default App
