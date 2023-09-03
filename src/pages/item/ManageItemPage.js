import React from 'react';
import { useEffect, useState } from "react";
import './ManageItemPage.css';

export default function ManageItemPage() {
  const [itemCode, setItemCode] = useState('');
  const [description, setDescription] = useState('');
  const [unitPrice, setPrice] = useState('');
  const [qtyOnHand, setQTY] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    getAllItems();
  }, []);
  
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

  const saveItem = () => {
    const item = {
      itemCode: itemCode,
      description: description,
      qtyOnHand: qtyOnHand,
      unitPrice: unitPrice
    };

    const http = new XMLHttpRequest();
    http.open('POST', 'http://localhost:8080/pos/item');
    http.setRequestHeader('content-type', 'application/json');
    http.send(JSON.stringify(item));
    http.onreadystatechange = () => {
      if (http.readyState === 4) {
        http.status == 200 ? reset() : alert(http.responseText);
      }
    }
  };

  const updateItem = () => {
    if (itemCode) {
      const item = {
        itemCode: itemCode,
        description: description,
        qtyOnHand: qtyOnHand,
        unitPrice: unitPrice
      };

      const http = new XMLHttpRequest();
      http.open('PUT', 'http://localhost:8080/pos/item');
      http.setRequestHeader('content-type', 'application/json');
      http.send(JSON.stringify(item));
      http.onreadystatechange = () => {
        if (http.readyState === 4) {
          http.status == 200 ? reset() : alert(http.responseText);
        }
      }
    } else {
      alert('Item not selected..!');
    }
  };

  const deleteItem = () => {
    if (itemCode) {
      const http = new XMLHttpRequest();
      http.open('DELETE', 'http://localhost:8080/pos/item?itemCode=' + itemCode);
      http.setRequestHeader('content-type', 'application/json');
      http.send();
      http.onreadystatechange = () => {
        if (http.readyState === 4) {
          http.status == 200 ? reset() : alert(http.responseText);
        }
      }
    } else {
      alert('Item not selected..!');
    }
  };

  const reset = () => {
    getAllItems();
    setItemCode('');
    setDescription('');
    setPrice('');
    setQTY('');
  };

  const tableClick = (item) => {
    setItemCode(item.itemCode);
    setDescription(item.description);
    setPrice(item.unitPrice);
    setQTY(item.qtyOnHand);
  };

  return (
    <div>
      <div className='container item-cont'>
        <div className='row'>
          <h5 style={{ margin: "25px", fontWeight: "bold" }} className='mb-4'>Items</h5>
          <hr></hr>
        </div>
        <div className='row justify-content-around'>
          <div className='col-lg-4'>
            <div className="mb-3">
              <label className="form-label">Item Code</label>
              <input type="text" value={itemCode} onChange={(e) => { setItemCode(e.target.value) }} placeholder="I001" className="form-control"></input>
            </div>
            <div className="mb-3">
              <label className="form-label">Item Description</label>
              <input type="text" value={description} onChange={(e) => { setDescription(e.target.value) }} placeholder="Keerisamba 5kg" className="form-control"></input>
            </div>
            <div className="mb-3">
              <label className="form-label">Item Price</label>
              <input type="text" value={unitPrice} onChange={(e) => { setPrice(e.target.value) }} placeholder="525.00" className="form-control"></input>
            </div>
            <div className="mb-3">
              <label className="form-label">Item Quantity</label>
              <input type="number" value={qtyOnHand} onChange={(e) => { setQTY(e.target.value) }} placeholder="2" className="form-control"></input>
            </div>
            <div className='action-btn'>
              <button onClick={saveItem} type="button" className="btn btn-primary" >Save</button>
              <button onClick={updateItem} type="button" className="btn btn-warning" >Update</button>
              <button onClick={deleteItem} type="button" className="btn btn-danger" >Delete</button>
              <button onClick={reset} type="button" className="btn btn-danger" >Reset</button>
            </div>
          </div>
          <div className='col-lg-7'>
            <table className="table">
              <thead>
                <tr className='text-center'>
                  <th scope="col">Item Code</th>
                  <th scope="col">Description</th>
                  <th scope="col">Unit Price</th>
                  <th scope="col">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {
                  items.map((item, index) => {
                    return (
                      <tr
                        key={index}
                        onClick={() => { tableClick(item) }}
                      >
                        <td className='text-center'>{item.itemCode}</td>
                        <td className='text-center'>{item.description}</td>
                        <td className='text-center'>{item.unitPrice}</td>
                        <td className='text-center'>{item.qtyOnHand}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
