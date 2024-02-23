import {
  CartesianGrid,
  Legend,
  Line,
  Bar,
  ComposedChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Result } from '@prisma/client'
import React from 'react';
import axios from 'axios';

interface State {
  results: Result[];
}

class Chart extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      results: []
    };
  }
  
  componentDidMount() {
    this.fetchResults();
  }

  async fetchResults() {
    axios.get('/api/results')
    .then(response => {
      const results: Result[] = response.data;
      this.setState({ results });
    })
    .catch(error => {
      console.error('Error fetching results data:', error);
    });
  }
  
  render() {
    return (
      <div className="container">
        <ComposedChart
          width={700}
          height={300}
          data={this.state.results}
          margin={{
            top: 5,
            right: 5,
            left: 5,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="votedAt" />
          <YAxis
            yAxisId={1}
            label={{ value: "purchase, gain", angle: -90, dx: -30 }}
          />
          {/* <YAxis
            yAxisId={2}
            orientation="right"
            domain={[0, ]}
            label={{ value: "return", angle: -90, dx: 30 }}
          />           */}
          <Bar type="monotone" dataKey="purchase" yAxisId={1} barSize={10} fill="#8884d8" />
          <Bar type="monotone" dataKey="gain" yAxisId={1} barSize={10} fill="#3ba2f6" />
          {/* <Line type="monotone" dataKey="return" yAxisId={2} stroke="#ff0092" /> */}
          <Legend />
          <Tooltip />
        </ComposedChart>
      </div>
    );  
  }
};

export default Chart;