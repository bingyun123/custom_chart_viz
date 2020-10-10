# Custom Chart Viz
Custom Chart Viz is built upon Apache ECharts library. It allows you to build a chart by custom option

### Installation and Build
splunkbase:   https://splunkbase.splunk.com/app/5261/

#### Adjustment code needs to be install
```
export SPLUNK_HOME
cd $SPLUNK_HOME/etc/apps/custom_chart_viz/appserver/static/visualizations/custom_chart_viz
npm install
npm run build
splunk restart
```


### Usage
Sample data can be found in the custom_chart_viz/lookups folder, add those data into Splunk and try following visualizations.


#### Custom
    * SPL
        ```
        source="spc.csv" 
        | table no,UCL,LCL,Center,Data,"Out of Limits","Run of 7"
        ```
    * Data Type -> Custom
    * Option -> copy echarts options,e.g.:
        ```
         {  
            xAxis: {
                type: 'category',
                boundaryGap: false
            }, 
            yAxis: {
                type: 'value',
                scale: true,
                axisLine: { show: false }
            },
            series: [{ 
                    type: 'line'
                },
                { 
                    type: 'bar'
                },
                { 
                    type: 'scatter'
                },
                { 
                    type: 'bar' 
                },
                { 
                    type: 'scatter' 
                },
                {
                    type: 'scatter' 
                }
            ]
        }   
        ```
    * xAxis Data Index Binding -> Data index corresponding to the x-axis ,e.g.: 1
    * Series Data Index Binding -> Data index corresponding to the series , e.g.:1,2,3,4,5
![](https://raw.githubusercontent.com/bingyun123/splunk_spc_echarts/master/_screenshot/2.png)
![](https://raw.githubusercontent.com/bingyun123/splunk_spc_echarts/master/_screenshot/3.png)



#### XBar R - X
   * SPL
        ```
        source="spc.csv" 
        | table no,UCL,LCL,Center,Data,"Out of Limits","Run of 7"
        ```
![](https://raw.githubusercontent.com/bingyun123/splunk_spc_echarts/master/_screenshot/1.png)
![](https://raw.githubusercontent.com/bingyun123/splunk_spc_echarts/master/_screenshot/xbar_r_x.png)

