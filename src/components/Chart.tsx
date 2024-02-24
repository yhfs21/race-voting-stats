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

type ResultStat ={
  voted_at: Date;
  purchase: number;
  gain: number;
  return: number;
  accumulated_purchase: number;
  accumulated_gain: number;
  accumulated_return: number;
}

interface State {
  resultStats: ResultStat[];
}

class Chart extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      resultStats: []
    };
  }
  
  componentDidMount() {
    this.fetchResults();
  }

  async fetchResults() {
    axios.get('/api/results')
    .then(response => {
      const results: Result[] = response.data;
      const resultStats: ResultStat[] = [];

      for (let i = 0; i < results.length; i++) {
        let accumulated_purchase = 0;
        let accumulated_gain = 0;
        for (let j = 0; j <= i; j++) {
            accumulated_purchase += results[j].purchase;
            accumulated_gain += results[j].gain;
        }
        resultStats.push({
          voted_at: results[i].voted_at,
          purchase: results[i].purchase,
          gain: results[i].gain,
          return: results[i].gain / results[i].purchase * 100,
          accumulated_purchase,
          accumulated_gain,
          accumulated_return: accumulated_gain / accumulated_purchase * 100,
        });
      }
      this.setState({ resultStats });
    })
    .catch(error => {
      console.error('Error fetching results data:', error);
    });
  }
  
  render() {
    return (
      <div className={"flex flex-wrap"}>
        <div>
          <p>Per Day</p>
          <ComposedChart
            width={700}
            height={540}
            data={this.state.resultStats}
            margin={{
              top: 5,
              right: 5,
              left: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="voted_at" angle={90} height={240} tickMargin={120}/>
            <YAxis
              yAxisId={1}
              label={{ value: "purchase, gain", angle: -90, dx: -30 }}
            />
            <YAxis
              yAxisId={2}
              orientation="right"
              domain={[0, ]}
              label={{ value: "return", angle: -90, dx: 30 }}
            />          
            <Bar type="monotone" dataKey="purchase" yAxisId={1} barSize={10} fill="#8884d8" />
            <Bar type="monotone" dataKey="gain" yAxisId={1} barSize={10} fill="#3ba2f6" />
            <Line type="monotone" dataKey="return" yAxisId={2} stroke="#ff0092" />
            <Legend verticalAlign='top' height={40}/>
            <Tooltip />
          </ComposedChart>
        </div>
        <div>
          <p>Accumulated</p>
          <ComposedChart
            width={700}
            height={540}
            data={this.state.resultStats}
            margin={{
              top: 5,
              right: 5,
              left: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="voted_at" angle={90} height={240} tickMargin={120}/>
            <YAxis
              yAxisId={1}
              label={{ value: "purchase, gain", angle: -90, dx: -30 }}
            />
            <YAxis
              yAxisId={2}
              orientation="right"
              domain={[0, ]}
              label={{ value: "return", angle: -90, dx: 30 }}
            />          
            <Bar type="monotone" dataKey="accumulated_purchase" yAxisId={1} barSize={10} fill="#8884d8" />
            <Bar type="monotone" dataKey="accumulated_gain" yAxisId={1} barSize={10} fill="#3ba2f6" />
            <Line type="monotone" dataKey="accumulated_return" yAxisId={2} stroke="#ff0092" />
            <Legend verticalAlign='top' height={40}/>
            <Tooltip />
          </ComposedChart>
        </div>
      </div>
    );  
  }
};

export default Chart;