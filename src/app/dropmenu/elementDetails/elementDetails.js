
import React from 'react';
import './style.css';
export default class ElementDetails extends React.Component {
    state = {
        disabled: false,
        currentValue:0
      };
      changeValue = Event => {
        this.setState({ currentValue: Event.target.value });
        this.props.getSliderValue()
      };
      
    render() {
        const { disabled } = this.state;
       
        return(
            <div className="element-details-wrapper">
                <div className="details-header">
                    <div className="text-block flex">
                        <div className="text-left flex-1">ID Monitor</div>
                        <div className="text-right flex-0">{this.props.elemId || ''}</div>
                    </div>
                    <div className="text-block flex">
                        <div className="text-left flex-1">Nome em ferramenta origem</div>
                        <div className="text-right flex-0">{this.props.nodeId || ""}</div>
                    </div>
                </div>       
                <div className="details-body">
                    <div className="headline"><b >ATRIBUTOS DE PROPAGAÇÃO</b></div>    
                    <div>
                    <div className="text-block flex">
                        <div className="text-left flex-1">Criticidade</div>
                        <div className="text-right flex-1"><input type="range" min="1" max="100" 
                        onChange={this.changeValue} value={this.state.currentValue}
                        className="slider" id="myRange" /></div>
                    </div>
                    <div className="text-block flex">
                        <div className="text-left flex-1">Criticidade</div>
                        <div className="text-right flex-1">
                            <select>
                                <option value="Selecione uma...">Selecione uma...</option>
                                <option value="Fixa">Fixa</option>
                                <option value="mercedes">Melhor</option>
                                <option value="audi">Pior</option>
                            </select>
                        </div>
                    </div>
                      
                    </div>
                </div>
            </div>
        )
    }
}