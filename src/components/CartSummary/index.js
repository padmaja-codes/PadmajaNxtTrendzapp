import {useState} from 'react'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'
import CartContext from '../../context/CartContext'
import './index.css'

const paymentMethods = [
  {id: 'CARD', label: 'Card', disabled: true},
  {id: 'NET_BANKING', label: 'Net Banking', disabled: true},
  {id: 'UPI', label: 'UPI', disabled: true},
  {id: 'WALLET', label: 'Wallet', disabled: true},
  {id: 'CASH_ON_DELIVERY', label: 'Cash on Delivery', disabled: false},
]

const CartSummary = () => {
  const [selectedPayment, setSelectedPayment] = useState('')
  const [orderPlaced, setOrderPlaced] = useState(false)

  const isCOD = selectedPayment === 'CASH_ON_DELIVERY'

  const onConfirmOrder = () => {
    if (isCOD) {
      setOrderPlaced(true)
    }
  }

  const onPopupClose = () => {
    setSelectedPayment('')
    setOrderPlaced(false)
  }

  return (
    <CartContext.Consumer>
      {value => {
        const {cartList} = value

        let total = 0
        cartList.forEach(item => {
          total += item.price * item.quantity
        })

        return (
          <div className="cart-summary-container">
            <h1 className="order-total-title">
              Order Total: <span className="total-amount">Rs {total}/-</span>
            </h1>
            <p className="total-items">{cartList.length} items in cart</p>

            <Popup
              trigger={
                <button type="button" className="checkout-button">
                  Checkout
                </button>
              }
              modal
              lockScroll
              closeOnDocumentClick={false}
              closeOnEscape
              onClose={onPopupClose}
              contentStyle={{
                borderRadius: '16px',
                padding: '0',
                border: 'none',
                width: '90%',
                maxWidth: '460px',
              }}
              overlayStyle={{
                background: 'rgba(0, 0, 0, 0.6)',
              }}
            >
              {close => (
                <div className="popup-content-wrapper">
                  {orderPlaced ? (
                    <div className="success-container">
                      <div className="success-icon">✓</div>
                      <h2 className="success-title">Order Placed!</h2>
                      <p className="success-message">
                        Your order has been placed successfully
                      </p>
                      <button
                        type="button"
                        className="close-success-button"
                        onClick={close}
                      >
                        Continue Shopping
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="popup-header">
                        <h2 className="popup-title">Complete Your Order</h2>
                        <button
                          type="button"
                          className="popup-close-btn"
                          onClick={close}
                          aria-label="Close"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="order-summary-box">
                        <h3 className="summary-heading">Order Summary</h3>
                        <div className="summary-row">
                          <span className="summary-label">Total Items</span>
                          <span className="summary-value">
                            {cartList.length}
                          </span>
                        </div>
                        <div className="summary-row">
                          <span className="summary-label">Total Amount</span>
                          <span className="summary-value total-highlight">
                            Rs {total}/-
                          </span>
                        </div>
                      </div>

                      <div className="payment-section">
                        <h3 className="payment-heading">
                          Select Payment Method
                        </h3>
                        <ul className="payment-list">
                          {paymentMethods.map(method => (
                            <li
                              key={method.id}
                              className={`payment-item ${
                                selectedPayment === method.id
                                  ? 'payment-item-selected'
                                  : ''
                              }`}
                            >
                              <label
                                className={`payment-label ${
                                  method.disabled ? 'disabled-label' : ''
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="payment"
                                  value={method.id}
                                  disabled={method.disabled}
                                  onChange={() => setSelectedPayment(method.id)}
                                  className="payment-radio"
                                />
                                <span className="payment-text">
                                  {method.label}
                                </span>
                                {method.disabled && (
                                  <span className="unavailable-badge">
                                    Unavailable
                                  </span>
                                )}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        type="button"
                        className={`confirm-button ${
                          !isCOD ? 'confirm-disabled' : ''
                        }`}
                        onClick={onConfirmOrder}
                        disabled={!isCOD}
                      >
                        Confirm Order
                      </button>

                      {selectedPayment !== '' && !isCOD && (
                        <p className="helper-text">
                          Only Cash on Delivery is available right now
                        </p>
                      )}
                      {selectedPayment === '' && (
                        <p className="helper-text">
                          Please select a payment method to continue
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
            </Popup>
          </div>
        )
      }}
    </CartContext.Consumer>
  )
}

export default CartSummary
