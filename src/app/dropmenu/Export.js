import React, { Component } from 'react'



let anchorTagData = ''
export default  class Export extends Component {
    constructor(props){
        super(props);
        this.state={
            data:this.props.exportData,
            clicked:false,
            anchorTagData:""
        }
        
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.clicked == true && this.state.data != nextProps.data){
      
            console.log('in export component', this.state.data);
            
            anchorTagData = 'data:text/plain;charset=utf-8,' +  
            encodeURIComponent(JSON.stringify(nextProps.data));
            this.setState({
                data: nextProps.data,
                clicked:false,
                anchorTagData:{data:anchorTagData}
            }, ()=>{
                this.exportClick.click();
            })
           
        }

    }
    render() {
      
        return (
            <div>
                <a  ref={exportClick => this.exportClick = exportClick} 
                style={{display:"none"}} href={this.state.anchorTagData.data} id="my_tag" download="sample.txt"></a> 
            </div>
        )
    }
}


