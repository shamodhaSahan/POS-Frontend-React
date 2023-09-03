import React from 'react';
import { useEffect, useState } from "react";
import './ManageCustomerPage.css';

export default function ManageCustomerPage() {
    const [id, setId] = useState('');
    const [nic, setNic] = useState('');
    const [name, setName] = useState('');
    const [salary, setSalary] = useState('');
    const [address, setAddress] = useState('');
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        getAllCustomers();
    }, []);

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

    const saveCustomers = () => {
        const customer = {
            id: id,
            nic: nic,
            name: name,
            salary: salary,
            address: address
        };

        const http = new XMLHttpRequest();
        http.open('POST', 'http://localhost:8080/pos/customer');
        http.setRequestHeader('content-type', 'application/json');
        http.send(JSON.stringify(customer));
        http.onreadystatechange = () => {
            if (http.readyState === 4) {
                http.status == 200 ? reset() : alert(http.responseText);
            }
        }
    };

    const updateCustomers = () => {
        if (id) {
            const customer = {
                id: id,
                nic: nic,
                name: name,
                salary: salary,
                address: address
            };

            const http = new XMLHttpRequest();
            http.open('PUT', 'http://localhost:8080/pos/customer');
            http.setRequestHeader('content-type', 'application/json');
            http.send(JSON.stringify(customer));
            http.onreadystatechange = () => {
                if (http.readyState === 4) {
                    http.status == 200 ? reset() : alert(http.responseText);
                }
            }
        } else {
            alert('Customer not selected..!');
        }
    };

    const deleteCustomers = () => {
        if (id) {
            const http = new XMLHttpRequest();
            http.open('DELETE', 'http://localhost:8080/pos/customer?id=' + id);
            http.send();
            http.onreadystatechange = () => {
                if (http.readyState === 4) {
                    http.status == 200 ? reset() : alert(http.responseText);
                }
            }
        } else {
            alert('Customer not selected..!');
        }
    };

    const reset = () => {
        getAllCustomers();
        setId('');
        setNic('');
        setName('');
        setSalary('');
        setAddress('');
    };

    const tableClick = (customer) => {
        setId(customer.id);
        setNic(customer.nic);
        setName(customer.name);
        setSalary(customer.salary);
        setAddress(customer.address);
    };

    return (
        <div>
            <div className='container customer-cont' style={{ widows: "100%" }}>
                <div className='row'>
                    <h5 style={{ margin: "25px", fontWeight: "bold" }} className='mb-4'>Customers</h5>
                    <hr></hr>
                </div>
                <div className='row justify-content-around'>
                    <div className='col-lg-4'>
                        <div className="mb-3">
                            <label className="form-label">Customer ID</label>
                            <input type="text" value={id} onChange={(e) => { setId(e.target.value) }} placeholder="C001" className="form-control"></input>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">NIC</label>
                            <input type="text" value={nic} onChange={(e) => { setNic(e.target.value) }} placeholder="200127103989" className="form-control"></input>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input type="text" value={name} onChange={(e) => { setName(e.target.value) }} placeholder="Shamodha" className="form-control"></input>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Salary</label>
                            <input type="number" value={salary} onChange={(e) => { setSalary(e.target.value) }} placeholder="100000.00" className="form-control"></input>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Address</label>
                            <input type="text" value={address} onChange={(e) => { setAddress(e.target.value) }} placeholder="Kurunegala" className="form-control"></input>
                        </div>
                        <div className='action-btn'>
                            <button onClick={saveCustomers} type="button" className="btn btn-primary" >Save</button>
                            <button onClick={updateCustomers} type="button" className="btn btn-warning" >Update</button>
                            <button onClick={deleteCustomers} type="button" className="btn btn-danger" >Delete</button>
                            <button onClick={reset} type="button" className="btn btn-danger" >Reset</button>
                        </div>
                    </div>
                    <div className='col-lg-7'>
                        <table className="table">
                            <thead>
                                <tr className='text-center'>
                                    <th scope="col">Customer ID</th>
                                    <th scope="col">NIC</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Salary</th>
                                    <th scope="col">Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    customers.map((customer, index) => {
                                        return (
                                            <tr
                                                key={index}
                                                onClick={() => { tableClick(customer) }}
                                            >
                                                <td className='text-center'>{customer.id}</td>
                                                <td className='text-center'>{customer.nic}</td>
                                                <td className='text-center'>{customer.name}</td>
                                                <td className='text-center'>{customer.salary}</td>
                                                <td className='text-center'>{customer.address}</td>
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
