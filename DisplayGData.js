import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import alasql from 'alasql'; // Import alasql

const BarChartComponent = () => {
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://sheets.googleapis.com/v4/spreadsheets/1dBDgXQRbJYZQTPfNbU1qovM5s6QG_g4XJ_9z4hEB2n0/values/Sheet1!A1:F16?key=AIzaSyBp1JCXECERdbxhx3YeqpFQAd8mM1NLdpk'
        );
        const json = await response.json();
        console.log('Google Sheets API Response:', json);

        if (json.values && json.values.length > 0) {
          const rows = json.values.slice(1); // Skip header row

          // Convert data into objects so that alasql can query it
          const headers = json.values[0]; // First row as headers
          const formattedData = rows.map(row => {
            const obj = {};
            headers.forEach((header, index) => {
              // Convert "Count" to a number if it's not already
              if (header === 'Count') {
                obj[header] = parseFloat(row[index]); // Ensure Count is a number
              } else {
                obj[header] = row[index];
              }
            });
            return obj;
          });

          // Use alasql to select Timeslot and Count, no grouping here
          const sqlQuery = `
            SELECT Timeslot, Count
            FROM ?
          `;
          const rawData = alasql(sqlQuery, [formattedData]);

          // Group data manually by Timeslot and calculate average Count
          const groupedData = rawData.reduce((acc, row) => {
            if (!acc[row.Timeslot]) {
              acc[row.Timeslot] = { Timeslot: row.Timeslot, Counts: [] };
            }
            acc[row.Timeslot].Counts.push(row.Count);
            return acc;
          }, {});

          // Calculate averages for each Timeslot
          const result = Object.values(groupedData).map(group => {
            const total = group.Counts.reduce((sum, count) => sum + count, 0);
            const avg = total / group.Counts.length;
            return { Timeslot: group.Timeslot, AvgCount: avg };
          });

          console.log('Averaged Data:', result);

          // Extract labels and data for BarChart
          const labels = result.map(row => row['Timeslot']); // Extract Timeslot for labels
          const data = result.map(row => parseFloat(row['AvgCount'])); // Extract AvgCount for data

          setLabels(labels);
          setData(data);
        } else {
          console.warn("No 'values' field in the response or empty range");
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <View>
      {data.length > 0 ? (
        <BarChart
          data={{
            labels: labels,
            datasets: [{ data: data }],
          }}
          width={Dimensions.get('window').width - 16} // from react-native
          height={220}
          yAxisLabel=""
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForLabels: {
              fontSize: 10, // Adjust the font size here
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      ) : (
        <Text>Loading chart data...</Text>
      )}
    </View>
  );
};

export default BarChartComponent;
