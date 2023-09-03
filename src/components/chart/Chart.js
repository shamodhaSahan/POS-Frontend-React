import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import './Chart.css'

export default function Chart() {
    const theme = useTheme();
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchData = () => {
            const currentDate = new Date();
            const dates = [];
            for (let i = 9; i >= 0; i--) {
                const date = new Date(currentDate);
                date.setDate(currentDate.getDate() - i);
                dates.push(date.toISOString().substring(0, 10));
            }
            const http = new XMLHttpRequest();
            http.open('GET', 'http://localhost:8080/pos/order', true);
            http.send();

            http.onreadystatechange = () => {
                if (http.readyState === 4) {
                    if (http.status === 200) {
                        const processedData = [];
                        const orders = JSON.parse(http.responseText);
                        dates.forEach((date) => {
                            let count = 0;
                            orders.forEach((order) => {
                                const orderDate = order.date[0] + "-" + ((order.date[1] < 10) ? "0" : "") + order.date[1] + "-" + order.date[2];
                                if (orderDate === date) {
                                    count++;
                                }
                            })
                            processedData.push({
                                xValue: date,
                                yValue: count,
                            })
                        });
                        setChartData(processedData);
                    }
                }
            };

        };
        fetchData();
    }, []);

    return (
        <ResponsiveContainer width="100%" height={200}>
            <LineChart
                data={chartData}
                margin={{
                    top: 16,
                    right: 16,
                    bottom: 0,
                    left: 24,
                }}
            >
                <XAxis
                    dataKey="xValue"
                    stroke={theme.palette.text.secondary}
                    style={{ ...theme.typography.body2 }}
                />
                <YAxis
                    stroke={theme.palette.text.secondary}
                    style={{ ...theme.typography.body2 }}
                >
                    <Label
                        angle={270}
                        position="left"
                        style={{
                            textAnchor: 'middle',
                            fill: "#fff",
                            ...theme.typography.body1,
                        }}
                    >
                        Sales ($)
                    </Label>
                </YAxis>
                <Line
                    isAnimationActive={false}
                    type="monotone"
                    dataKey="yValue"
                    stroke="white"
                    dot={false}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
