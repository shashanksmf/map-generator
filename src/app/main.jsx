import React from 'react';
import ReactDOM from 'react-dom';

import {Splitter } from '@progress/kendo-react-layout'
import '@progress/kendo-react-intl'
import '@progress/kendo-react-dropdowns'
import 'react-router-dom'
import Dropmenu from './dropmenu/Dropmenu';

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
            ]
        };
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
                            <Dropmenu />
                        </div>
                        <Splitter
                            panes={this.state.nestedPanes}
                            orientation={'vertical'}
                            onLayoutChange={this.onNestedLayoutChange}

                        >
                            <div className="pane-content">
                                <Headerbar children="element details"/>
                            </div>
                            <div className="pane-content">
                                <Headerbar children="log"/>
                            </div>
                        </Splitter>
                        <div className="pane-content">
                            <Headerbar children="advanced"/>
                            
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

