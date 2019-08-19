import React from 'react';
import ReactDOM from 'react-dom';

import {Splitter } from '@progress/kendo-react-layout'
import '@progress/kendo-react-intl'
import '@progress/kendo-react-dropdowns'
import 'react-router-dom'
import Dropmenu from './dropmenu/Dropmenu';
import ElementDetails from './dropmenu/elementDetails/elementDetails';
import Monitoring from './dropmenu/Monitoring/Monitoring';
import './style.css';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            panes: [
                { size: '30%', min: '20px', collapsible: true },
                {},
                { size: '30%', min: '20px', collapsible: true }
            ],
            nestedPanes: [
                { size: '40%' },
                { },
                { size: '30%', resizable: false }
            ],
            nodeId:null,
            logs:[],
            elemId:''
        };

        this.selectedServices = this.selectedServices.bind(this)
    }

    onLayoutChange = (updatedState) => {

        this.setState({
            panes: updatedState
        });
    }

    onNestedLayoutChange = (updatedState) => {
        this.setState({
            nestedPanes: updatedState
        });
    }

    selectedServices = id => {
        const elemId = Math.floor(Math.random(0,100) * 1000);
        this.state.logs.push(`Action: update. Item id: ${elemId}`);
        this.setState({ nodeId: id, logs: this.state.logs, elemId: elemId   })
    } 

    render() {
        return (
            <div className="all-area">
                
                    <Splitter
                        panes={this.state.panes}
                        onLayoutChange={this.onLayoutChange}
                        style={{height: 750}}
                    >
                        <div className="pane-content">
                            <Headerbar children="map generator"/>
                            <Dropmenu selectedServices={this.selectedServices} />
                        </div>
                        <Splitter
                            panes={this.state.nestedPanes}
                            orientation={'vertical'}
                            onLayoutChange={this.onNestedLayoutChange}

                        >
                            <div className="pane-content">
                                <Headerbar children="element details"/>
                                <ElementDetails nodeId={this.state.nodeId} elemId={this.state.elemId}></ElementDetails>
                            </div>
                            <div className="pane-content logs">
                                <Headerbar children="log"/>
                                <div>
                                    {this.state.logs.map(item => <div>{item}</div>)}
                                </div>
                            </div>
                        </Splitter>
                        <div className="pane-content">
                            <Headerbar children="advanced"/>
                            <Monitoring/>
                        </div>
                    </Splitter>

                    
                    
                
            </div>
        );
    }
}

let Headerbar = function(props) {
  
    
    
    return(
      <div className="headerstyle">
          {props.children}
      </div>
    )
 
}
ReactDOM.render(
    <App/>,
    document.querySelector('my-app')
);

