/*
 * Visualization source
 */
define([
        'jquery',
        'underscore',
        'api/SplunkVisualizationBase',
        'api/SplunkVisualizationUtils',
        // Add required assets to this list
        'echarts'
    ],
    function(
        $,
        _,
        SplunkVisualizationBase,
        vizUtils,
        echarts
    ) {

        // Extend from SplunkVisualizationBase
        return SplunkVisualizationBase.extend({

            initialize: function() {
                SplunkVisualizationBase.prototype.initialize.apply(this, arguments);
                this.$el = $(this.el);

                // this.$el.append('<h3>This is a custom visualization stand in.</h3>');
                // this.$el.append('<p>Edit your custom visualization app to render something here.</p>');

                // Initialization logic goes here
            },

            // Optionally implement to format data returned from search. 
            // The returned object will be passed to updateView as 'data'
            formatData: function(data) {

                // Format data  
                return data;
            },

            // Implement updateView to render a visualization.
            //  'data' will be the data object returned from formatData or from the search
            //  'config' will be the configuration property object
            updateView: function(data, config) {

                if (!data || !data.rows || data.rows.length < 1) {
                    return;
                }

                console.log(data);
                console.log(JSON.stringify(data));

                var configDataType = config[this.getPropertyNamespaceInfo().propertyNamespace +"dataType"]; 
                
                var myChart = echarts.init(this.el);
                var option={};

                if(configDataType=="XBar_R-X"){
                   option = this._buildXBarRXOption(data, config);
                }else if(configDataType=="Custom"){
                   option = this._buildCustomOption(data, config);  
                } 
 
                myChart.setOption(option);
                

            },

            // Search data params
            getInitialDataParams: function() {
                return ({
                    outputMode: SplunkVisualizationBase.ROW_MAJOR_OUTPUT_MODE,
                    count: 10000
                });
            },

            // Override to respond to re-sizing events
            reflow: function() {},

            _buildCustomOption:function(data, config){
                var configOption = config[this.getPropertyNamespaceInfo().propertyNamespace +"option"]; 
                var configXAxisDataIndexBinding = config[this.getPropertyNamespaceInfo().propertyNamespace +"xAxisDataIndexBinding"]; 
                var configSeriesDataIndexBinding = config[this.getPropertyNamespaceInfo().propertyNamespace +"seriesDataIndexBinding"]; 

                var option = {};
                eval("option ="+configOption);

                var xAxisDataIndex,seriesDataIndex=[];
                
                xAxisDataIndex = Number(configXAxisDataIndexBinding); 
                var seriesDataIndexSplit = configSeriesDataIndexBinding.split(","); 
                for(var i=0;i<seriesDataIndexSplit.length;i++){
                    seriesDataIndex[i] = Number(seriesDataIndexSplit[i]);
                } 
                 
                option.xAxis.data = [];
                for(var i=0;i<seriesDataIndex.length;i++){ 
                    option.series[i].data = []; 
                    if(!option.series[i].name){
                        option.series[i].name = data.fields[seriesDataIndex[i]].name;
                    }
                    
                } 
                for(var i=0;i<data.rows.length;i++){
                    option.xAxis.data.push(data.rows[i][xAxisDataIndex]);
                    for(var j=0;j<seriesDataIndex.length;j++){ 
                        option.series[j].data.push(data.rows[i][seriesDataIndex[j]]); 
                    } 
                }

                return option; 
            },

            _buildXBarRXOption:function(data, config){
                var option = { 
                        legend: {
                            y: 'bottom'
                        },
                        grid: {
                            left: '1%',
                            right: '1%',
                            bottom: '5%',
                            containLabel: true
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross'
                            },
                            formatter: function(params) {
                                var res = params[0].name;
                                for (var i = 0; i < params.length; i++) {
                                    tdata = "-";
                                    if (params[i].seriesType == 'scatter') {
                                        if (params[i].data) {
                                            tdata = 'True';
                                        } else {
                                            tdata = '-';
                                        }
                                    } else {
                                        tdata = Number(params[i].data).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                                    }
                                    res += '<br>' + params[i].marker + params[i].seriesName + '：' + tdata;
                                }
                                return res;
                            }
                        },
                        toolbox: {
                            feature: {
                                saveAsImage: {}
                            }
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false
                        },
                        yAxis: {
                            type: 'value',
                            scale: true,
                            axisLine: { show: false }
                        },
                        color: ['#008000', '#008000', '#99CC00', '#0D4483', 'red', 'yellow'],
                        series: [{
                                name: 'UCL',
                                type: 'line',
                                showSymbol: false,
                                lineStyle: {
                                    type: 'dotted',
                                    opacity: 0.7
                                },
                                symbol: 'none' 
                            },
                            {
                                name: 'LCL',
                                type: 'line',
                                showSymbol: false,
                                lineStyle: {
                                    type: 'dotted',
                                    opacity: 0.7
                                },
                                symbol: 'none' 
                            },
                            {
                                name: 'Center',
                                type: 'line',
                                showSymbol: false,
                                lineStyle: {
                                    type: 'dotted',
                                    opacity: 0.7
                                },
                                symbol: 'none' 
                            },
                            {
                                name: 'Data',
                                type: 'line',
                                symbol: 'circle' 
                            },
                            {
                                name: 'Out of Limits',
                                type: 'scatter',
                                symbolSize: 15,
                                z: 7 
                            },
                            {
                                name: 'Run of 7',
                                type: 'scatter',
                                symbolSize: 15,
                                valueType: 'Boolean',
                                z: 6 
                            }
                        ]
                };

                var configXAxisDataIndexBinding = config[this.getPropertyNamespaceInfo().propertyNamespace +"xAxisDataIndexBinding"]; 
                var configSeriesDataIndexBinding = config[this.getPropertyNamespaceInfo().propertyNamespace +"seriesDataIndexBinding"]; 
                var xAxisDataIndex=0,seriesDataIndex=[1,2,3,4,5,6];
                if(configXAxisDataIndexBinding){
                    xAxisDataIndex = Number(configXAxisDataIndexBinding);
                }
                if(configSeriesDataIndexBinding){
                    var seriesDataIndexSplit = configSeriesDataIndexBinding.split(",");
                    if(seriesDataIndexSplit.length==seriesDataIndex.length){
                        for(var i=0;i<seriesDataIndexSplit.length;i++){
                            seriesDataIndex[i] = Number(seriesDataIndexSplit[i]);
                        }
                    }
                }
                option.xAxis.data = [];
                for(var i=0;i<seriesDataIndex.length;i++){ 
                    option.series[i].data = []; 
                    if(!option.series[i].name){
                        option.series[i].name = data.fields[seriesDataIndex[i]].name;
                    }
                } 
                for(var i=0;i<data.rows.length;i++){
                    option.xAxis.data.push(data.rows[i][xAxisDataIndex]);
                    for(var j=0;j<seriesDataIndex.length;j++){ 
                        option.series[j].data.push(data.rows[i][seriesDataIndex[j]]); 
                    } 
                }

                return option; 
            }
        });
    });