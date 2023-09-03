import React from 'react';
import { useState, useEffect } from 'react';
import './ManageOrderPage.css';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ManageOrdersPage() {

  const [orderId, setOrderId] = useState('');
  const [date, setDate] = useState('');
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);

  const [customer, setCustomer] = useState({
    id: '',
    nic: '',
    name: '',
    salary: '',
    address: '',
  });
  const [item, setItem] = useState({
    itemCode: '',
    description: '',
    unitPrice: '',
    qtyOnHand: '',
  });


  const [itemQty, setItemQty] = useState('');
  const [cartItems, setCartItems] = useState([]);

  const [netTotal, setNetTotal] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [cash, setCash] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    reset();
  }, []);

  useEffect(() => {
    setSubTotal(parseFloat((netTotal - (netTotal * discount / 100)).toFixed(2)));
    setBalance(!cash ? "" : (parseFloat((cash - subTotal))).toFixed(2));
  }, [netTotal, subTotal, discount, cash]);

  const getNewOrderId = () => {
    const http = new XMLHttpRequest();
    http.open('GET', 'http://localhost:8080/pos/order/newOrderId');
    http.setRequestHeader('content-type', 'application/json');
    http.send();
    http.onreadystatechange = () => {
      if (http.readyState === 4) {
        http.status == 200 ? setOrderId(http.responseText) : setOrderId('O001');
      }
    }

  };

  const getDate = () => {
    const curr = new Date();
    curr.setDate(curr.getDate())
    setDate(curr.toISOString().substring(0, 10))
  };


  const getAllCustomers = () => {
    const http = new XMLHttpRequest();
    http.open('GET', 'http://localhost:8080/pos/customer', true);
    http.send();
    http.onreadystatechange = () => {
      if (http.readyState === 4 && http.status === 200) {
        setCustomers(JSON.parse(http.responseText));
      }
    }
  };

  const handleCustomerIdChange = (event) => {
    let currId = event.target.value;
    setCustomer(customers.find(customer => customer.id === currId) || {
      id: '',
      nic: '',
      name: '',
      salary: '',
      address: '',
    });
  };

  const getAllItems = () => {
    const http = new XMLHttpRequest();
    http.open('GET', 'http://localhost:8080/pos/item', true);
    http.send();
    http.onreadystatechange = () => {
      if (http.readyState === 4 && http.status === 200) {
        setItems(JSON.parse(http.responseText));
      }
    }
  };

  const handleItemCodeChange = (event) => {
    let currItemCode = event.target.value;
    setItem(items.find(item => item.itemCode === currItemCode) || {
      itemCode: '',
      description: '',
      unitPrice: '',
      qtyOnHand: '',
    })
  };

  const addItemToCart = () => {
    if (!item.itemCode) {
      alert("Item not selected..!");
      return;
    }
    if (!itemQty) {
      alert("Please enter quantity..!");
      return;
    }
    if (itemQty <= 0) {
      alert("Invalid quantity");
      return;
    }
    if (itemQty > item.qtyOnHand) {
      alert("Quantity is out of stock");
      return;
    }
    let index = cartItems.findIndex(currItem => currItem.itemCode === item.itemCode);
    let selectedItem = items.find(currItem => currItem.itemCode === item.itemCode);

    let total = parseFloat((itemQty * item.unitPrice).toFixed(2));
    setNetTotal(prevNetTotal => parseFloat((prevNetTotal + total).toFixed(2)));

    if (index !== -1) {
      let cartItem = cartItems[index];
      cartItem.qty = parseInt(cartItem.qty) + parseInt(itemQty);
      cartItem.total = parseFloat(cartItem.total) + parseFloat(total);
      updateCartItem(cartItem, index);
    } else {
      let cartItem = {
        itemCode: item.itemCode,
        description: item.description,
        unitPrice: item.unitPrice,
        qty: itemQty,
        total: total
      }
      setCartItems(prevCartItems => [...prevCartItems, cartItem]);
    }
    selectedItem.qtyOnHand -= itemQty;
    setItemQty("");
  };

  const updateCartItem = (cartItem, index) => {
    const updatedItems = [...cartItems];
    updatedItems[index] = cartItem;
    setCartItems(updatedItems);
  };

  const removeTableRow = (itemToRemove) => {
    let selectedItem = items.find(currItem => currItem.itemCode === itemToRemove.itemCode);
    selectedItem.qtyOnHand += parseInt(itemToRemove.qty);
    setCartItems(prevCartItems => prevCartItems.filter(item => item.itemCode !== itemToRemove.itemCode));
    setNetTotal(prevNetTotal => parseFloat((prevNetTotal - itemToRemove.total).toFixed(2)));
  };

  const placeOrder = () => {
    if (!customer.id) {
      alert("Customer not selected..!");
      return;
    }
    if (cartItems.length === 0) {
      alert("No items in the cart..!");
      return;
    }

    const orderDetails = cartItems.map((cartItem) => ({
      orderId: orderId,
      itemCode: cartItem.itemCode,
      qty: cartItem.qty,
      unitPrice: cartItem.unitPrice,
    }));

    let order = {
      orderId: orderId,
      date: date,
      customerId: customer.id,
      orderDetailsList: orderDetails
    }

    const http = new XMLHttpRequest();
    http.open('POST', 'http://localhost:8080/pos/order', true);
    http.setRequestHeader('Content-Type', 'application/json');
    http.send(JSON.stringify(order));

    http.onreadystatechange = () => {
      if (http.readyState === 4) {
        if (http.status == 200) {
          alert('Order placed successfully..!');
          reset()
        } else {
          alert('Failed to place order. Please try again.');
        }
      }
    };
  };

  const reset = () => {
    getNewOrderId();
    getDate();
    setCustomer({
      id: '',
      nic: '',
      name: '',
      salary: '',
      address: '',
    });
    setItem({
      itemCode: '',
      description: '',
      unitPrice: '',
      qtyOnHand: '',
    });
    getAllCustomers();
    getAllItems();
    setItemQty('');
    setNetTotal(0);
    setCash('');
    setDiscount('');
    setCartItems([])
  };

  return (
    <div>
      <div className="container-fluid order-cont">
        <div className='row'>
          <h5 style={{ margin: "25px", fontWeight: "bold" }} className='mb-4'>Place Order</h5>
          <hr></hr>
        </div>
        <div className="row justify-content-around">
          <div className="col-lg-4 order-box">
            <div className="col-lg-12 text-center">
              <h6>Invoice Details</h6>
            </div>
            <div className="col-lg-12">
              <form className="row g-3">
                <div className="col-lg-6">
                  <label className="form-label">Order ID :</label>
                  <input readOnly value={orderId} type="text" className="form-control"></input>
                </div>
                <div className="col-lg-6">
                  <label className="form-label">Date :</label>
                  <input type="date" value={date} onChange={(e) => { setDate(e.target.value) }} className="form-control" id="txtOrderDate"></input>
                </div>
                <div className="col-lg-6">
                  <label className="form-label">Customer ID:</label>
                  <select value={customer.id} onChange={handleCustomerIdChange} className="form-select">
                    <option value="">Select a customer Id</option>
                    {
                      customers.map((customer, index) => {
                        return (
                          <option key={index} value={customer.id}>
                            {customer.id}
                          </option>
                        )
                      })
                    }
                  </select>
                </div>
                <div className="col-lg-6">
                  <label className="form-label">Customer NIC :</label>
                  <input readOnly type="text" value={customer.nic} className="form-control"></input>
                </div>
                <div className="col-lg-6">
                  <label className="form-label">Name :</label>
                  <input readOnly type="text" value={customer.name} className="form-control"></input>
                </div>
                <div className="col-lg-6">
                  <label className="form-label">Salary :</label>
                  <input readOnly type="number" value={customer.salary} className="form-control"></input>
                </div>
                <div className="col-12">
                  <label className="form-label">Address :</label>
                  <input readOnly type="text" value={customer.address} className="form-control"></input>
                </div>
              </form>
            </div>
          </div>
          <div className="col-lg-4 order-box">
            <div className="col-lg-12 text-center">
              <h6>Item Select</h6>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <form className="row g-3 ">
                  <div className="col-lg-6">
                    <label className="form-label">Item Code :</label>
                    <select value={item.itemCode} onChange={handleItemCodeChange} className="form-select">
                      <option value="">Select a Item code</option>
                      {
                        items.map((item, index) => {
                          return (
                            <option key={index} value={item.itemCode}>
                              {item.itemCode}
                            </option>
                          )
                        })
                      }
                    </select>
                  </div>
                  <div className="col-lg-6">
                    <label className="form-label">Description :</label>
                    <input readOnly type="text" value={item.description} className="form-control"></input>
                  </div>
                  <div className="col-lg-6">
                    <label className="form-label">Unit Price :</label>
                    <input readOnly type="number" value={item.unitPrice} className="form-control"></input>
                  </div>
                  <div className="col-lg-6">
                    <label className="form-label">Qty On Hand :</label>
                    <input readOnly type="number" value={item.qtyOnHand} className="form-control"></input>
                  </div>
                  <div className="col-lg-12">
                    <label className="form-label">Order Quantity :</label>
                    <input type="number" value={itemQty} onChange={(e) => { setItemQty(e.target.value) }} className="form-control"></input>
                  </div>
                  <div className="col-auto me-auto"></div>
                  <div className="col-auto">
                    <button type="button" onClick={addItemToCart} className="justify-content-end btn btn-primary">Add to cart</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-lg-3 order-box">
            <form className="row g-3 summery">
              <div className="col-lg-12" style={{ color: "#3498db" }}>
                Total :
                <label>{netTotal}</label>
                Rs/=
              </div>
              <div className="col-lg-12" style={{ color: "#2ecc71" }}>
                SubTotal :
                <label>{subTotal}</label>
                Rs/=
              </div>
              <div className="col-lg-6">
                <label className="form-label">Cash :</label>
                <input type="number" value={cash} onChange={(e) => setCash(e.target.value)} className="form-control" placeholder="5000"></input>
              </div>
              <div className="col-lg-6">
                <label className="form-label">Discount : (%)</label>
                <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className="form-control" placeholder="10"></input>
              </div>
              <div className="col-lg-12">
                <label className="form-label">Balance :</label>
                <input readOnly type="number" value={balance} onChange={(e) => setBalance(e.target.value)} className="form-control" placeholder="10"></input>
              </div>
              <div className="col-lg-12 text-center">
                <button type="button" style={{ marginBottom: "20px" }} onClick={placeOrder} className="btn btn-success">Purchase</button>
              </div>
            </form>
          </div>
        </div>
        <div className="col-lg-12">
          <table className="table">
            <thead className="table-dark">
              <tr>
                <th className="col-3">Item Code</th>
                <th className="col-3">Description</th>
                <th className="col-2">Unit Price</th>
                <th className="col-2">Quantity</th>
                <th className="col-2">Total</th>
                <th className="col-2">Remove</th>
              </tr>
            </thead>
            <tbody>
              {
                cartItems.map((cartItem, index) => {
                  return (
                    <tr
                      key={index}

                      style={{ cursor: 'pointer' }}
                    >
                      <td>{cartItem.itemCode}</td>
                      <td>{cartItem.description}</td>
                      <td>{cartItem.unitPrice}</td>
                      <td>{cartItem.qty}</td>
                      <td>{cartItem.total}</td>
                      <td>
                        <DeleteIcon
                          onClick={() => { removeTableRow(cartItem) }}
                          style={{
                            color: "#c0392b",
                            fontSize: "20px"
                          }}
                        />
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
