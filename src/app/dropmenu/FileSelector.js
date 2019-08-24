import React, { Component } from 'react'


export default class FileSelector extends Component {

    constructor(props)
    {
        super(props);
        this.state={
            opened: false
        }
        this.handleChange = this.handleChange.bind(this);
    }
    componentWillReceiveProps(nextProps){
       
        if(this.state.opened != nextProps.opened){
            this.setState({
                opened: nextProps.opened
            })
            this.fileInput.click()
        }
    }
   

    handleChange(event) {
        if(!event.target.files.length) return false;
        var reader = new FileReader();
        let data = ''
        let that = this;
        reader.onload = function(event) {
            data += event.target.result
        }
        reader.onloadend = function(event) {
            if (event.target.readyState == FileReader.DONE) {
                console.log("finished",data);
                that.props.sendDataToParent(JSON.parse(data))
                that.setState({
                    opened: false
                })
            }   
        }
        reader.readAsText(event.target.files[0]);
       // console.log("READER FINISHED",reader.readAsText(event.target.files[0]));
    }

    render ()
    {
        console.log("file input called");
        return <div>
            <input  ref={fileInput => this.fileInput = fileInput}
             style={{display:"none"}}  type="file"  onChange={ (e) => this.handleChange(e) } />
        </div>;
    }
}